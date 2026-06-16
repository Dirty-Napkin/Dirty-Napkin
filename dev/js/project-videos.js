// Lazy-play project page Vimeo background videos.
// Only videos near the viewport play, so mobile browsers don't choke on many
// simultaneous autoplaying iframes. rootMargin starts playback before a video
// scrolls fully into view to avoid any perceived lag.

(function () {
    if (typeof Vimeo === 'undefined') return;

    var iframes = document.querySelectorAll('.vimeo-video iframe');
    if (!iframes.length) return;

    // Start playback when a video is within one viewport height of being shown,
    // pause once it's a full viewport height past. Big margin = no scroll lag.
    var PRELOAD_MARGIN = '100% 0px 100% 0px';

    var entries = [];

    iframes.forEach(function (iframe) {
        var player = new Vimeo.Player(iframe);
        // background=1 autoplays on load; pause everything up front so only
        // on-screen videos run.
        player.ready().then(function () {
            player.setMuted(true);
            player.pause();
        });
        entries.push({ el: iframe, player: player, playing: false });
    });

    var observer = new IntersectionObserver(function (records) {
        records.forEach(function (record) {
            var entry = entries.find(function (e) { return e.el === record.target; });
            if (!entry) return;

            if (record.isIntersecting) {
                if (!entry.playing) {
                    entry.playing = true;
                    entry.player.play().catch(function () {});
                }
            } else if (entry.playing) {
                entry.playing = false;
                entry.player.pause().catch(function () {});
            }
        });
    }, {
        root: null,
        rootMargin: PRELOAD_MARGIN,
        threshold: 0
    });

    entries.forEach(function (entry) {
        observer.observe(entry.el);
    });
})();
