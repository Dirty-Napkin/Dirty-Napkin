// Only run script if .home-container is present
if (document.querySelector('#about-page')) {
    /*-----------------
    About Page Background Image Positioning
    -----------------*/
    function positionBackgroundImage() {
        const aboutPage = document.querySelector('#about-page');
        const storyGrid = document.querySelector('.story-grid');
        if (!aboutPage || !storyGrid) return;
        const storyGridRect = storyGrid.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const storyGridTop = storyGridRect.top + scrollY;
        aboutPage.style.backgroundPosition = `center ${storyGridTop}px`;
    }

    function observeStoryGridPosition() {
        const storyGrid = document.querySelector('.story-grid');
        if (!storyGrid) return;

        // Call once initially
        positionBackgroundImage();

        // Observe for any size/position changes
        const ro = new ResizeObserver(() => {
            positionBackgroundImage();
        });

        ro.observe(storyGrid);

        // Optionally, observe the parent/main container as well if header spacing or other layout changes affect it
        const main = document.querySelector('main');
        if (main) ro.observe(main);
    }
    // Call this after window.onload
    window.addEventListener('load', function () {
        setTimeout(() => {
            observeStoryGridPosition();
        }, 10);
    });
    // Debounced resize listener for positionBackgroundImage only
    function onResizeAbout() {
        // Only update background image position
        setTimeout(() => {
            positionBackgroundImage();
        }, 50);
    }

    let resizeTimeoutAbout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeoutAbout);
        resizeTimeoutAbout = setTimeout(onResizeAbout, 200);
    });
}