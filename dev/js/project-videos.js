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
    var DEBUG_POLL_MS = 800;
    var STALL_CHECK_MS = 700;
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
        entry.eventsBound = false;
        entry.lastTime = null;
        entry.lastTimeAt = null;
    }

    function refreshDebugStatus(entry) {
        if (!DEBUG) return;

        var container = entry.container;

        if (!entry.iframe.src) {
            setStatus(container, 'pending');
            return;
        }

        if (!entry.playerReady || !entry.player) {
            var loadingFor = entry.loadedAt ? Date.now() - entry.loadedAt : 0;
            if (loadingFor > 8000) {
                setStatus(container, 'no-api');
            } else {
                setStatus(container, 'loading');
            }
            return;
        }

        Promise.all([
            entry.player.getPaused(),
            entry.player.getCurrentTime()
        ]).then(function (values) {
            var paused = values[0];
            var time = values[1];
            var now = Date.now();
            var stalled = false;

            if (
                entry.lastTime !== null &&
                entry.lastTimeAt !== null &&
                now - entry.lastTimeAt >= STALL_CHECK_MS &&
                Math.abs(time - entry.lastTime) < 0.05
            ) {
                stalled = true;
            }

            if (!paused) {
                entry.lastTime = time;
                entry.lastTimeAt = now;
            }

            if (entry.shouldPlay) {
                if (paused) {
                    setStatus(container, 'frozen');
                } else if (stalled) {
                    setStatus(container, 'stalled');
                } else {
                    setStatus(container, 'playing');
                }
                return;
            }

            if (paused) {
                setStatus(container, 'paused');
            } else if (stalled) {
                setStatus(container, 'stalled');
            } else {
                setStatus(container, 'playing-unintended');
            }
        }).catch(function () {
            setStatus(container, 'unknown');
        });
    }

    function bindPlayerDebugEvents(entry) {
        if (!DEBUG || entry.eventsBound || !entry.player) return;

        entry.eventsBound = true;
        ['play', 'pause', 'ended', 'bufferstart', 'bufferend', 'loaded'].forEach(function (eventName) {
            entry.player.on(eventName, function () {
                refreshDebugStatus(entry);
            });
        });
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
                    bindPlayerDebugEvents(entry);
                    return player.setMuted(true).then(function () {
                        return player;
                    });
                }).then(resolve).catch(function (err) {
                    entry.initPromise = null;
                    entry.player = null;
                    entry.playerReady = false;
                    entry.eventsBound = false;

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

        refreshDebugStatus(entry);

        waitForIframe(entry).then(function () {
            return ensurePlayer(entry);
        }).then(function (player) {
            var action = entry.shouldPlay
                ? player.play().catch(function (err) {
                    log('play failed', container.id, err);
                })
                : player.pause().catch(function (err) {
                    log('pause failed', container.id, err);
                });

            return action.then(function () {
                return wait(300);
            }).then(function () {
                refreshDebugStatus(entry);
            });
        }).catch(function (err) {
            log('player init failed', container.id, err);
            refreshDebugStatus(entry);
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
            log('load', container.id || src);
            entry.iframeReady = false;
            entry.iframeReadyPromise = null;
            entry.lastTime = null;
            entry.lastTimeAt = null;
            entry.loadedAt = Date.now();
            entry.iframe.src = src;
            refreshDebugStatus(entry);
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
            eventsBound: false,
            lastTime: null,
            lastTimeAt: null,
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
            '.vimeo-video[data-video-status="playing"]::after { background: rgba(0, 128, 0, 0.85); }',
            '.vimeo-video[data-video-status="loading"]::after { background: rgba(200, 128, 0, 0.85); }',
            '.vimeo-video[data-video-status="paused"]::after,',
            '.vimeo-video[data-video-status="pending"]::after { background: rgba(80, 80, 80, 0.85); }',
            '.vimeo-video[data-video-status="frozen"]::after,',
            '.vimeo-video[data-video-status="stalled"]::after,',
            '.vimeo-video[data-video-status="no-api"]::after,',
            '.vimeo-video[data-video-status="unknown"]::after,',
            '.vimeo-video[data-video-status="playing-unintended"]::after { background: rgba(160, 0, 0, 0.85); }'
        ].join('');
        document.head.appendChild(style);

        setInterval(function () {
            entries.forEach(refreshDebugStatus);
        }, DEBUG_POLL_MS);

        log('debug mode on —', containers.length, 'videos tracked', isMobile() ? '(mobile cap: ' + MOBILE_MAX_LOADED + ')' : '(desktop, no cap)');
    }
})();
