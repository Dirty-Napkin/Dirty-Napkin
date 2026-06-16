// Lazy-load project page Vimeo background videos.
// Load when within 1 viewport, unload when outside that zone.
// Mobile: cap at 3 loaded iframes to stay within Safari memory limits.

(function () {
    if (!document.querySelector('.project-page')) return;

    var DEBUG = /[?&]videoDebug=1(?:&|$)/.test(location.search);
    var PRELOAD_MARGIN = '100% 0px 100% 0px';
    var MOBILE_MAX_LOADED = 3;
    var MAX_PLAYER_RETRIES = 50;
    var RETRY_DELAY_MS = 250;
    var IFRAME_READY_FALLBACK_MS = 1500;
    var mdQuery = window.matchMedia('(min-width: 768px)');

    var containers = document.querySelectorAll('.project-page .vimeo-video');
    if (!containers.length) return;

    var entries = [];

    function isMobile() {
        return !mdQuery.matches;
    }

    function log() {
        if (!DEBUG) return;
        var args = ['[project-videos]'].concat([].slice.call(arguments));
        console.log.apply(console, args);
    }

    function setStatus(container, status) {
        if (!DEBUG) return;
        container.setAttribute('data-video-status', status);
    }

    function findEntry(container) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].container === container) return entries[i];
        }
        return null;
    }

    function getLoadedEntries() {
        return entries.filter(function (entry) {
            return !!entry.iframe.src;
        });
    }

    function wait(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    function resetPlayerState(entry) {
        entry.player = null;
        entry.playerReady = false;
        entry.initPromise = null;
        entry.iframeReady = false;
        entry.iframeReadyPromise = null;
        entry.loadedAt = null;
    }

    function pickEvictionCandidate(excludeEntry) {
        var loaded = getLoadedEntries().filter(function (entry) {
            return entry !== excludeEntry;
        });
        if (!loaded.length) return null;

        var inactive = loaded.filter(function (entry) {
            return !entry.shouldPlay;
        });
        var pool = inactive.length ? inactive : loaded;

        pool.sort(function (a, b) {
            return (a.loadedAt || 0) - (b.loadedAt || 0);
        });

        return pool[0];
    }

    function enforceMobileLoadCap(excludeEntry) {
        if (!isMobile()) return;

        while (getLoadedEntries().length >= MOBILE_MAX_LOADED) {
            var victim = pickEvictionCandidate(excludeEntry);
            if (!victim) break;
            unloadVideo(victim.container, 'mobile-cap');
        }
    }

    function waitForIframe(entry) {
        if (entry.iframeReady) {
            return Promise.resolve();
        }
        if (entry.iframeReadyPromise) {
            return entry.iframeReadyPromise;
        }

        entry.iframeReadyPromise = new Promise(function (resolve) {
            var settled = false;

            function finish() {
                if (settled) return;
                settled = true;
                entry.iframeReady = true;
                resolve();
            }

            entry.iframe.addEventListener('load', finish, { once: true });
            setTimeout(finish, IFRAME_READY_FALLBACK_MS);
        });

        return entry.iframeReadyPromise;
    }

    function ensurePlayer(entry, attempt) {
        if (entry.playerReady) {
            return Promise.resolve(entry.player);
        }
        if (entry.initPromise) {
            return entry.initPromise;
        }

        attempt = attempt || 0;

        entry.initPromise = new Promise(function (resolve, reject) {
            function tryInit(retryCount) {
                if (typeof Vimeo === 'undefined' || !Vimeo.Player) {
                    if (retryCount >= MAX_PLAYER_RETRIES) {
                        entry.initPromise = null;
                        reject(new Error('Vimeo API not loaded'));
                        return;
                    }
                    wait(RETRY_DELAY_MS).then(function () {
                        tryInit(retryCount + 1);
                    });
                    return;
                }

                if (!entry.iframe.src) {
                    entry.initPromise = null;
                    reject(new Error('iframe has no src'));
                    return;
                }

                new Vimeo.Player(entry.iframe).ready().then(function (player) {
                    entry.player = player;
                    entry.playerReady = true;
                    return player.setMuted(true).then(function () {
                        return player;
                    });
                }).then(resolve).catch(function (err) {
                    entry.initPromise = null;
                    entry.player = null;
                    entry.playerReady = false;

                    if (retryCount >= MAX_PLAYER_RETRIES) {
                        reject(err);
                        return;
                    }

                    wait(RETRY_DELAY_MS).then(function () {
                        ensurePlayer(entry, retryCount + 1).then(resolve).catch(reject);
                    });
                });
            }

            tryInit(attempt);
        });

        return entry.initPromise;
    }

    function syncPlayback(container) {
        var entry = findEntry(container);
        if (!entry || !entry.iframe.src) return;

        waitForIframe(entry).then(function () {
            return ensurePlayer(entry);
        }).then(function (player) {
            if (entry.shouldPlay) {
                return player.play().then(function () {
                    setStatus(container, 'playing');
                    log('play', container.id);
                }).catch(function (err) {
                    setStatus(container, 'native-autoplay');
                    log('play failed, using background autoplay', container.id, err);
                });
            }

            return player.pause().then(function () {
                setStatus(container, 'paused');
                log('pause', container.id);
            }).catch(function () {
                setStatus(container, 'paused');
            });
        }).catch(function (err) {
            if (entry.shouldPlay) {
                setStatus(container, 'native-autoplay');
                log('player init failed, using background autoplay', container.id, err);
                return;
            }

            setStatus(container, 'init-failed');
            log('player init failed', container.id, err);
        });
    }

    function unloadVideo(container, reason) {
        var entry = findEntry(container);
        if (!entry || !entry.iframe.src) {
            entry && setStatus(container, 'pending');
            return;
        }

        entry.shouldPlay = false;

        function finishUnload() {
            resetPlayerState(entry);
            entry.iframe.removeAttribute('src');
            setStatus(container, 'pending');
            log('unload', container.id, reason || 'off-screen');
        }

        if (entry.playerReady && entry.player) {
            entry.player.pause().catch(function () {}).then(finishUnload);
            return;
        }

        finishUnload();
    }

    function playVideo(container) {
        var entry = findEntry(container);
        if (!entry) return;

        entry.shouldPlay = true;

        var src = entry.iframe.getAttribute('data-src');
        if (!entry.iframe.src && src) {
            enforceMobileLoadCap(entry);
            setStatus(container, 'loading');
            log('load', container.id || src);
            entry.iframeReady = false;
            entry.iframeReadyPromise = null;
            entry.loadedAt = Date.now();
            entry.iframe.src = src;
        }

        if (entry.iframe.src) {
            syncPlayback(container);
        }
    }

    containers.forEach(function (container) {
        var iframe = container.querySelector('iframe');
        if (!iframe) return;

        var src = iframe.getAttribute('src');
        if (src) {
            iframe.setAttribute('data-src', src);
            iframe.removeAttribute('src');
        }

        entries.push({
            container: container,
            iframe: iframe,
            player: null,
            playerReady: false,
            initPromise: null,
            iframeReady: false,
            iframeReadyPromise: null,
            loadedAt: null,
            shouldPlay: false
        });

        setStatus(container, 'pending');
    });

    var observer = new IntersectionObserver(function (records) {
        records.forEach(function (record) {
            if (record.isIntersecting) {
                playVideo(record.target);
            } else {
                unloadVideo(record.target, 'off-screen');
            }
        });
    }, {
        root: null,
        rootMargin: PRELOAD_MARGIN,
        threshold: 0
    });

    containers.forEach(function (container) {
        observer.observe(container);
    });

    if (DEBUG) {
        var style = document.createElement('style');
        style.textContent = [
            '.vimeo-video[data-video-status]::after {',
            '  content: attr(data-video-status);',
            '  position: absolute;',
            '  top: 8px;',
            '  left: 8px;',
            '  z-index: 2;',
            '  padding: 4px 8px;',
            '  background: rgba(0, 0, 0, 0.75);',
            '  color: #fff;',
            '  font: 11px/1.2 monospace;',
            '  pointer-events: none;',
            '}',
            '.vimeo-video[data-video-status="playing"]::after,',
            '.vimeo-video[data-video-status="native-autoplay"]::after { background: rgba(0, 128, 0, 0.85); }',
            '.vimeo-video[data-video-status="loading"]::after { background: rgba(200, 128, 0, 0.85); }',
            '.vimeo-video[data-video-status="paused"]::after { background: rgba(80, 80, 80, 0.85); }',
            '.vimeo-video[data-video-status="play-failed"]::after,',
            '.vimeo-video[data-video-status="init-failed"]::after { background: rgba(160, 0, 0, 0.85); }'
        ].join('');
        document.head.appendChild(style);
        log('debug mode on —', containers.length, 'videos tracked', isMobile() ? '(mobile cap: ' + MOBILE_MAX_LOADED + ')' : '(desktop, no cap)');
    }
})();
