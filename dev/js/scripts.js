//--------------Multi-Trigger Background Animation-------------------
function createMultiTriggerBackgroundAnimation(triggerConfigs) {
    if (!Array.isArray(triggerConfigs) || triggerConfigs.length === 0) {
        console.error('triggerConfigs must be a non-empty array');
        return;
    }

    // For each config, create a separate observer with its own rootMargin
    triggerConfigs.forEach(config => {
        if (!config.trigger || !config.target || !config.className || typeof config.offsetPercent !== 'number') {
            console.error('Invalid config:', config);
            return;
        }

        const triggerElement = document.querySelector(config.trigger);
        const targetElement = document.querySelector(config.target);
        if (!triggerElement || !targetElement) return;

        // Calculate rootMargin: negative value moves the bottom threshold up
        const offsetPx = (config.offsetPercent / 100) * window.innerHeight;
        let rootMargin = `0px 0px -${offsetPx}px 0px`;

        // If offsetPx is 0, don't add negative margin
        if (offsetPx === 0) rootMargin = '0px';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove all other classes for this target
                    triggerConfigs.forEach(otherConfig => {
                        if (otherConfig.target === config.target && otherConfig.className !== config.className) {
                            targetElement.classList.remove(otherConfig.className);
                        }
                    });
                    targetElement.classList.add(config.className);
                } else {
                    targetElement.classList.remove(config.className);
                }
            });
        }, { root: null, rootMargin });

        observer.observe(triggerElement);
    });
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
    },
    {
        trigger: '.adam-collab',
        target: '.home-container', 
        className: 'black-background',
        offsetPercent: 0
    }
];

// Initialize the multi-trigger system
const backgroundObserver = createMultiTriggerBackgroundAnimation(backgroundTriggers);

/*-----------------
About Page Background Image Positioning
-----------------*/
function positionBackgroundImage() {
    const aboutPage = document.querySelector('#about-page');
    const storyGrid = document.querySelector('.story-grid');
    
    if (!aboutPage || !storyGrid) return;
    
    // Get the position of .story-grid relative to the viewport
    const storyGridRect = storyGrid.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Calculate the absolute position of .story-grid
    const storyGridTop = storyGridRect.top + scrollY - 0;
    
    // Set the background position to align with .story-grid
    aboutPage.style.backgroundPosition = `center ${storyGridTop}px`;
}

// Initialize background positioning
document.addEventListener('DOMContentLoaded', positionBackgroundImage);
window.addEventListener('resize', positionBackgroundImage);

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

document.addEventListener("DOMContentLoaded", function () {
    // Small delay to ensure CSS is applied
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