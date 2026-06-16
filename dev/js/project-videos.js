// Lazy-load project page Vimeo background videos.
// Inject iframe src only when near viewport, pause (don't unload) when off-screen.

(function () {
    if (!document.querySelector('.project-page')) return;

    var DEBUG = /[?&]videoDebug=1(?:&|$)/.test(location.search);
    var PRELOAD_MARGIN = '100% 0px 100% 0px';
    var MAX_PLAYER_RETRIES = 30;
    var RETRY_DELAY_MS = 200;

    var containers = document.querySelectorAll('.project-page .vimeo-video');
    if (!containers.length) return;

    var entries = [];

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

    function wait(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    function ensurePlayer(entry, attempt) {
        if (entry.playerReady) {
            return Promise.resolve(entry.player);
        }

        attempt = attempt || 0;

        if (typeof Vimeo === 'undefined' || !Vimeo.Player) {
            if (attempt >= MAX_PLAYER_RETRIES) {
                return Promise.reject(new Error('Vimeo API not loaded'));
            }
            return wait(RETRY_DELAY_MS).then(function () {
                return ensurePlayer(entry, attempt + 1);
            });
        }

        if (!entry.iframe.src) {
            return Promise.reject(new Error('iframe has no src'));
        }

        return new Vimeo.Player(entry.iframe).ready().then(function (player) {
            entry.player = player;
            entry.playerReady = true;
            return player.setMuted(true).then(function () {
                return player;
            });
        }).catch(function (err) {
            if (attempt >= MAX_PLAYER_RETRIES) {
                throw err;
            }
            return wait(RETRY_DELAY_MS).then(function () {
                return ensurePlayer(entry, attempt + 1);
            });
        });
    }

    function syncPlayback(container) {
        var entry = findEntry(container);
        if (!entry || !entry.iframe.src) return;

        ensurePlayer(entry).then(function (player) {
            if (entry.shouldPlay) {
                return player.play().then(function () {
                    setStatus(container, 'playing');
                    log('play', container.id);
                }).catch(function (err) {
                    setStatus(container, 'play-failed');
                    log('play failed', container.id, err);
                });
            }

            return player.pause().then(function () {
                setStatus(container, 'paused');
                log('pause', container.id);
            }).catch(function () {
                setStatus(container, 'paused');
            });
        }).catch(function (err) {
            setStatus(container, 'init-failed');
            log('player init failed', container.id, err);
        });
    }

    function playVideo(container) {
        var entry = findEntry(container);
        if (!entry) return;

        entry.shouldPlay = true;

        var src = entry.iframe.getAttribute('data-src');
        if (!entry.iframe.src && src) {
            setStatus(container, 'loading');
            log('load', container.id || src);
            entry.iframe.src = src;
        }

        if (entry.iframe.src) {
            syncPlayback(container);
        }
    }

    function pauseVideo(container) {
        var entry = findEntry(container);
        if (!entry) return;

        entry.shouldPlay = false;

        if (!entry.iframe.src) {
            setStatus(container, 'pending');
            return;
        }

        if (!entry.playerReady) {
            setStatus(container, 'paused');
            return;
        }

        syncPlayback(container);
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
            shouldPlay: false
        });

        setStatus(container, 'pending');
    });

    var observer = new IntersectionObserver(function (records) {
        records.forEach(function (record) {
            if (record.isIntersecting) {
                playVideo(record.target);
            } else {
                pauseVideo(record.target);
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
            '.vimeo-video[data-video-status="paused"]::after { background: rgba(80, 80, 80, 0.85); }',
            '.vimeo-video[data-video-status="play-failed"]::after,',
            '.vimeo-video[data-video-status="init-failed"]::after { background: rgba(160, 0, 0, 0.85); }'
        ].join('');
        document.head.appendChild(style);
        log('debug mode on —', containers.length, 'videos tracked');
    }
})();
