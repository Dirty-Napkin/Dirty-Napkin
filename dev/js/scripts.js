/*-----------------
Multi-Trigger Background Animation (Throttled Scroll)
-----------------*/
function throttle(fn, wait) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}

function createMultiTriggerBackgroundAnimation(triggerConfigs) {
    // Only run if at least one target is present in the DOM
    const shouldRun = triggerConfigs.some(cfg => document.querySelector(cfg.target));
    if (!shouldRun) return;

    // Get all unique targets
    const uniqueTargets = Array.from(new Set(triggerConfigs.map(cfg => cfg.target)));

    function handleSectionBackgrounds() {
        // If at the very top of the page, remove all background classes and return
        if (window.scrollY === 0) {
            uniqueTargets.forEach(targetSelector => {
                const targetElement = document.querySelector(targetSelector);
                if (!targetElement) return;
                const triggers = triggerConfigs.filter(cfg => cfg.target === targetSelector);
                triggers.forEach(cfg => targetElement.classList.remove(cfg.className));
            });
            return;
        }
        // For each target, determine which trigger is currently active
        uniqueTargets.forEach(targetSelector => {
            const targetElement = document.querySelector(targetSelector);
            if (!targetElement) return;

            // Find all triggers for this target
            const triggers = triggerConfigs.filter(cfg => cfg.target === targetSelector);

            // Find all triggers whose threshold has been crossed and are at least partially visible
            const eligibleTriggers = triggers
                .map(cfg => {
                    const triggerElement = document.querySelector(cfg.trigger);
                    if (!triggerElement) return null;
                    const rect = triggerElement.getBoundingClientRect();
                    const offsetPx = (cfg.offsetPercent / 100) * window.innerHeight;
                    const threshold = window.innerHeight - offsetPx;
                    const thresholdCrossed = rect.top < threshold;
                    const stillVisible = rect.bottom > 0;
                    return {
                        cfg,
                        thresholdCrossed,
                        stillVisible
                    };
                })
                .filter(item => item && item.thresholdCrossed && item.stillVisible);

            // Pick the last eligible trigger (deepest in the page)
            let activeConfig = null;
            if (eligibleTriggers.length > 0) {
                activeConfig = eligibleTriggers[eligibleTriggers.length - 1].cfg;
            }

            // Remove all possible classes for this target
            triggers.forEach(cfg => targetElement.classList.remove(cfg.className));
            // Add the active class if found
            if (activeConfig) {
                targetElement.classList.add(activeConfig.className);
            }
        });
    }

    // Throttle the handler
    const throttledHandler = throttle(handleSectionBackgrounds, 50);
    window.addEventListener('scroll', throttledHandler);
    window.addEventListener('resize', throttledHandler);
    // Initial run (deferred to ensure layout is complete)
    setTimeout(handleSectionBackgrounds, 0);
}

const backgroundTriggers = [
    {
        trigger: '.story-grid',
        target: '#about-page', 
        className: 'cyan-background',
        offsetPercent: 25
    },
    {
        trigger: '.what-we-do',
        target: '#about-page', 
        className: 'black-background',
        offsetPercent: 50
    },
    {
        trigger: '.bios-conc',
        target: '#about-page', 
        className: 'white-background',
        offsetPercent: 40
    }/*,
    {
        trigger: '.adam-collab',
        target: '.home-container', 
        className: 'black-background',
        offsetPercent: 0
    }*/
];

// Initialize the multi-trigger system
const backgroundObserver = createMultiTriggerBackgroundAnimation(backgroundTriggers);

/*-----------------
Repeated text effect

add the class .repeated-container and .repeated-text to the container and text respectively
also add one of the below screen size breakpoint classes to the container
see https://codepen.io/lpb0001/pen/oggwYgg for an example
-----------------*/
function repeatedText() {
    const breakpoints = {
        "breakpoint-sm": 430,
        "breakpoint-md": 768,
        "breakpoint-lg": 1024,
        "breakpoint-xl": 1280,
        "breakpoint-xxl": 1440
    };

    $(".repeated-container").each(function () {
        const $container = $(this);
        const $original = $container.find(".repeated-text").first();

        // Determine this container's breakpoint
        let breakpoint = 0;
        for (const cls in breakpoints) {
            if ($container.hasClass(cls)) {
                breakpoint = breakpoints[cls];
                break;
            }
        }

        // Apply logic based on container-specific breakpoint
        if (window.innerWidth >= breakpoint) {
            // Remove all clones except the first original
            $container.find(".repeated-text").not($original).remove();

            // Actually clone
            for (let i = 0; i < 3; i++) {
                $original.clone().appendTo($container);
            }

            //Set grid styles
            $container.css({
                display: "grid",
                gridTemplateColumns: "1fr 1fr"
            });

        } else {
            // Clean up for smaller screens
            $container.find(".repeated-text").not($original).remove();
            $container.css("grid-template-columns", "1fr");
        }
    });
}

// Initial run
repeatedText();

/*-----------------
Header spacing
-----------------*/

function headerSpacing() {
    // Don't run on the home page
    if (document.querySelector('.home-container')) {
        return 0;
    }

    const header = document.querySelector("header");
    const main = document.querySelector("main");
    if (!header || !main) {
        console.warn("Header or main element not found");
        return 0;
    }

    const headerHeight = header.getBoundingClientRect().height;
    main.style.paddingTop = headerHeight + "px";
    return headerHeight;
}

// Call this after window.onload
window.addEventListener('load', function () {
    setTimeout(() => {
        headerSpacing();
    }, 10);
});

/*-----------------
Debounced resize listener
-----------------*/
function onResize() {
    repeatedText(); 
    // Small delay to ensure layout is stable after resize
    setTimeout(() => {
        headerSpacing();
    }, 50);
}

let resizeTimeout;
window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(onResize, 200);
});