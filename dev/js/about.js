// Only run script if #about-page is present
if (document.querySelector('#about-page')) {
    /*-----------------
    About Page Background Image Positioning
    -----------------*/
    function positionAboutBgImages() {
        const storyGrid = document.querySelector('.story-grid');
        const bgImgs = document.querySelectorAll('.about-bg-img');
        if (!storyGrid || !bgImgs.length) return;

        const aboutPage = document.getElementById('about-page');
        let top = storyGrid.offsetTop;
        if (aboutPage && storyGrid.offsetParent !== aboutPage) {
            const storyRect = storyGrid.getBoundingClientRect();
            const aboutRect = aboutPage.getBoundingClientRect();
            top = storyRect.top - aboutRect.top + aboutPage.scrollTop;
        }
        top = top - 100; // Move 50px above the top of story-grid

        bgImgs.forEach(img => {
            img.style.top = `${top}px`;
        });
    }

    function observeStoryGridPosition() {
        const storyGrid = document.querySelector('.story-grid');
        if (!storyGrid) return;

        // Call once initially
        positionAboutBgImages();

        // Observe for any size/position changes
        const ro = new ResizeObserver(() => {
            positionAboutBgImages();
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
    // Debounced resize listener for positionAboutBgImages only
    function onResizeAbout() {
        setTimeout(() => {
            positionAboutBgImages();
        }, 50);
    }

    let resizeTimeoutAbout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeoutAbout);
        resizeTimeoutAbout = setTimeout(onResizeAbout, 200);
    });
}