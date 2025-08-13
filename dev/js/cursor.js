document.addEventListener("DOMContentLoaded", function () {
    // Responsive cursor setup - only runs at lg breakpoints or larger
    function setupResponsiveCursor() {
        const breakpoints = {
            sm: window.matchMedia("(min-width: 430px)"),
            md: window.matchMedia("(min-width: 768px)"),
            lg: window.matchMedia("(min-width: 1024px)"),
            xl: window.matchMedia("(min-width: 1280px)")
        };

        let cursor = null;

        function applyCursorJS() {
            // Remove existing cursor if it exists
            if (cursor) {
                cursor.remove();
                cursor = null;
            }

            // Only create cursor for lg breakpoints and larger
            if (breakpoints.lg.matches) {
                
                // Create the custom cursor element
                cursor = document.createElement("div");
                cursor.classList.add("cursors");
                document.body.appendChild(cursor);
                
                // Hide the default cursor for the entire document
                document.documentElement.style.cursor = "none";
                document.body.style.cursor = "none";
                // This line removes the default cursor from all elements on the page
                document.querySelectorAll("*").forEach(el => el.style.cursor = "none");

                // Update cursor position
                document.addEventListener("mousemove", function (e) {
                    cursor.style.left = e.clientX + "px";
                    cursor.style.top = e.clientY + "px";
                });
                
                // Detect hover over button and change cursor size
                document.querySelectorAll("button, a").forEach(element => {
                    element.addEventListener("mouseenter", function () {
                        if (element.tagName.toLowerCase() === 'button') {
                            cursor.classList.add("hover-button");
                        } else if (element.tagName.toLowerCase() === 'a') {
                            // Set CSS custom properties for link dimensions
                            const rect = element.getBoundingClientRect();
                            cursor.style.setProperty('--link-width', `${rect.width + 10}px`);
                            cursor.style.setProperty('--link-height', `${rect.height + 10}px`);
                            cursor.classList.add("hover-link");
                        }
                    });
                    
                    element.addEventListener("mouseleave", function () {
                        cursor.classList.remove("hover-button");
                        cursor.classList.remove("hover-link");
                    });
                });
            } else {
                console.log('Cursor disabled - below LG breakpoint');
                // Restore default cursor behavior for smaller screens
                document.documentElement.style.cursor = "auto";
                document.body.style.cursor = "auto";
                document.querySelectorAll("*").forEach(el => el.style.cursor = "auto");
            }
        }

        // Listen for screen size changes
        Object.values(breakpoints).forEach(mq => {
            mq.addEventListener('change', applyCursorJS);
        });

        // Run once on load
        applyCursorJS();
    }

    // Initialize responsive cursor
    setupResponsiveCursor();
});