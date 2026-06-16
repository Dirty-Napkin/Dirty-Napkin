// Lazy-load project page Vimeo background videos.
// Only inject iframe src when a video is near the viewport so mobile browsers
// aren't asked to autoplay a dozen players at once. background=1 handles mute +
// autoplay natively once the iframe loads — no Vimeo API play() needed.

(function () {
    if (!document.querySelector('.project-page')) return;

    var DEBUG = /[?&]videoDebug=1(?:&|$)/.test(location.search);
    var PRELOAD_MARGIN = '100% 0px 100% 0px';

    var containers = document.querySelectorAll('.project-page .vimeo-video');
    if (!containers.length) return;

    function log() {
        if (!DEBUG) return;
        var args = ['[project-videos]'].concat([].slice.call(arguments));
        console.log.apply(console, args);
    }

    function setStatus(container, status) {
        if (!DEBUG) return;
        container.setAttribute('data-video-status', status);
    }

    function loadVideo(container) {
        var iframe = container.querySelector('iframe');
        if (!iframe) return;

        var src = iframe.getAttribute('data-src');
        if (!src || iframe.src) return;

        log('load', container.id || src);
        setStatus(container, 'loading');
        iframe.src = src;

        iframe.addEventListener('load', function onLoad() {
            iframe.removeEventListener('load', onLoad);
            setStatus(container, 'loaded');
            log('loaded', container.id || src);
        });
    }

    function unloadVideo(container) {
        var iframe = container.querySelector('iframe');
        if (!iframe || !iframe.src) return;

        log('unload', container.id || iframe.getAttribute('data-src'));
        iframe.removeAttribute('src');
        setStatus(container, 'pending');
    }

    containers.forEach(function (container) {
        var iframe = container.querySelector('iframe');
        if (!iframe) return;

        var src = iframe.getAttribute('src');
        if (src) {
            iframe.setAttribute('data-src', src);
            iframe.removeAttribute('src');
        }

        setStatus(container, 'pending');
    });

    var observer = new IntersectionObserver(function (records) {
        records.forEach(function (record) {
            if (record.isIntersecting) {
                loadVideo(record.target);
            } else {
                unloadVideo(record.target);
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
            '.vimeo-video[data-video-status="loaded"]::after { background: rgba(0, 128, 0, 0.85); }',
            '.vimeo-video[data-video-status="loading"]::after { background: rgba(200, 128, 0, 0.85); }'
        ].join('');
        document.head.appendChild(style);
        log('debug mode on —', containers.length, 'videos tracked');
    }
})();
