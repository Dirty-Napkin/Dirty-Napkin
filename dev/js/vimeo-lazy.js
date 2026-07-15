/*-----------------
Vimeo Lazy Load / Unload

Solves mobile Safari's simultaneous video decoder limit by only
activating iframes near the viewport. Poster image (via CSS --poster)
shows while iframe is inactive.
-----------------*/
(function () {
    const MARGIN = '500px';

    const iframes = document.querySelectorAll('.vimeo-video iframe[data-src]');
    if (!iframes.length) return;

    function getLabel(iframe) {
        return iframe.title || iframe.closest('.vimeo-video')?.id || 'unknown';
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            var iframe = entry.target;
            var label = getLabel(iframe);

            if (entry.isIntersecting) {
                if (!iframe.dataset.active) {
                    iframe.src = iframe.dataset.src;
                    iframe.dataset.active = '1';
                    console.log('[vimeo] LOAD: ' + label);
                }
            } else {
                if (iframe.dataset.active) {
                    iframe.removeAttribute('src');
                    delete iframe.dataset.active;
                    console.log('[vimeo] UNLOAD: ' + label);
                }
            }
        });
    }, { rootMargin: MARGIN });

    iframes.forEach(function (iframe) {
        observer.observe(iframe);
    });
})();
