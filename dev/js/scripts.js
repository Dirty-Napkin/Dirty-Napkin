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