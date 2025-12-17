/*-----------------
Page Transition Animation
Fades out transition block on page load
Fades in transition block when navigating to another page
-----------------*/

function initPageTransition() {
    const transitionBlock = document.querySelector('.transition-block');
    const header = document.querySelector('header');
    
    if (!transitionBlock) {
        return; // Exit if transition block doesn't exist
    }

    // Ensure header is stable and rendered first
    if (header) {
        // Force header to be on its own layer to prevent jitter
        header.style.transform = 'translateZ(0)';
    }

    // Set initial state - visible on page load
    transitionBlock.style.opacity = '1';
    transitionBlock.style.pointerEvents = 'auto';

    // Check if we're on the home page
    const isHomePage = document.body.id === 'index' || document.querySelector('.home-container');

    // Set delay based on page (600ms for home page, 300ms for others)
    const fadeOutDelay = isHomePage ? 1400 : 300;

    // Helper to fade out the transition block
    function fadeOutTransition() {
        setTimeout(() => {
            transitionBlock.style.opacity = '0';
            transitionBlock.style.pointerEvents = 'none';
        }, fadeOutDelay);
    }

    // Fade out after page loads
    window.addEventListener('load', fadeOutTransition);

    // Also handle DOMContentLoaded for faster initial fade
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fadeOutTransition);
    } else {
        // DOM already loaded
        fadeOutTransition();
    }

    // Handle page show from bfcache (back/forward navigation)
    window.addEventListener('pageshow', (event) => {
        // Only re-run fade if page was restored from bfcache
        if (event.persisted) {
            // Ensure the block is visible first, then fade it out
            transitionBlock.style.opacity = '1';
            transitionBlock.style.pointerEvents = 'auto';
            fadeOutTransition();
        }
    });

    // Intercept all internal link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Skip if:
        // - No href
        // - External link (starts with http:// or https://)
        // - Anchor link (starts with #)
        // - Special protocols (mailto:, tel:, etc.)
        // - Link has target="_blank" or download attribute
        if (!href || 
            href.startsWith('http://') || 
            href.startsWith('https://') || 
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            link.hasAttribute('target') ||
            link.hasAttribute('download')) {
            return;
        }

        // Prevent default navigation
        e.preventDefault();

        // Fade in the transition block
        transitionBlock.style.opacity = '1';
        transitionBlock.style.pointerEvents = 'auto';

        // Navigate after fade-in animation completes
        setTimeout(() => {
            window.location.href = href;
        }, 300); // Match this with CSS transition duration
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransition);
} else {
    // DOM is already loaded
    initPageTransition();
}
