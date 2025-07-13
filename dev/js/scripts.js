//--------------Multi-Trigger Background Animation-------------------
function createMultiTriggerBackgroundAnimation(triggerConfigs) {
    // Validate input
    if (!Array.isArray(triggerConfigs) || triggerConfigs.length === 0) {
        console.error('triggerConfigs must be a non-empty array');
        return;
    }

    // Validate each config object
    triggerConfigs.forEach((config, index) => {
        if (!config.trigger || !config.target || !config.className) {
            console.error(`Invalid config at index ${index}:`, config);
            return;
        }
    });

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Find the matching config for this entry
            const config = triggerConfigs.find(c => 
                document.querySelector(c.trigger) === entry.target
            );
            
            if (!config) return;

            // Get the target element
            const targetElement = document.querySelector(config.target);
            if (!targetElement) {
                console.warn(`Target element not found: ${config.target}`);
                return;
            }

            // Toggle the class based on intersection
            if (entry.isIntersecting) {
                // Remove all other classes from this target before adding the new one
                triggerConfigs.forEach(otherConfig => {
                    if (otherConfig.target === config.target && otherConfig.className !== config.className) {
                        targetElement.classList.remove(otherConfig.className);
                    }
                });
                
                targetElement.classList.add(config.className);
                console.log(`Added ${config.className} to ${config.target} (triggered by ${config.trigger})`);
            } else {
                targetElement.classList.remove(config.className);
                console.log(`Removed ${config.className} from ${config.target} (triggered by ${config.trigger})`);
            }
        });
    });

    // Observe all trigger elements
    triggerConfigs.forEach(config => {
        const triggerElement = document.querySelector(config.trigger);
        if (triggerElement) {
            observer.observe(triggerElement);
            console.log(`Now observing: ${config.trigger}`);
        } else {
            console.warn(`Trigger element not found: ${config.trigger}`);
        }
    });

    return observer; // Return observer in case you need to disconnect it later
}

// Example usage:
const backgroundTriggers = [
    {
        trigger: '.story-grid',
        target: '#about-page', 
        className: 'cyan-background'
    },
    {
        trigger: '.what-we-do',
        target: '#about-page', 
        className: 'black-background'
    },
    {
        trigger: '.bios-conc',
        target: '#about-page', 
        className: 'white-background'
    }
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