/*-----------------
Vimeo Lazy Load / Unload

Solves mobile Safari's simultaneous video decoder limit by only
activating iframes near the viewport. Poster image (via CSS --poster)
shows while iframe is inactive.
-----------------*/
(function () {
    const LOAD_MARGIN = '400px';
    const UNLOAD_MARGIN = '600px';

    const iframes = document.querySelectorAll('.vimeo-video iframe[data-src]');
    if (!iframes.length) return;

    const loadObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            const iframe = entry.target;
            if (entry.isIntersecting && !iframe.src) {
                iframe.src = iframe.dataset.src;
            }
        });
    }, { rootMargin: LOAD_MARGIN });

    const unloadObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            const iframe = entry.target;
            if (!entry.isIntersecting && iframe.src) {
                iframe.src = '';
            }
        });
    }, { rootMargin: UNLOAD_MARGIN });

    iframes.forEach(function (iframe) {
        loadObserver.observe(iframe);
        unloadObserver.observe(iframe);
    });
})();
