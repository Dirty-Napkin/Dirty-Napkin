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
        let delegationAttached = false;

        function attachHoverDelegation() {
            if (delegationAttached) return;

            // Use event delegation so dynamically added elements are handled
            document.addEventListener('mouseover', function (e) {
                if (!cursor) return;
                const target = e.target.closest('a, button');
                if (!target || !document.body.contains(target)) return;

                if (target.tagName.toLowerCase() === 'button') {
                    cursor.classList.add('hover-button');
                } else if (target.tagName.toLowerCase() === 'a') {
                    const rect = target.getBoundingClientRect();
                    cursor.style.setProperty('--link-width', `${rect.width + 10}px`);
                    cursor.style.setProperty('--link-height', `${rect.height + 10}px`);
                    cursor.classList.add('hover-link');
                }
            });

            document.addEventListener('mouseout', function (e) {
                if (!cursor) return;
                const fromEl = e.target.closest('a, button');
                const toEl = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('a, button') : null;
                // If moving within the same anchor/button, ignore
                if (fromEl && toEl && fromEl === toEl) return;

                // On leaving any anchor/button, remove hover classes
                if (fromEl) {
                    cursor.classList.remove('hover-button');
                    cursor.classList.remove('hover-link');
                }
            });

            delegationAttached = true;
        }

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
                
                // Ensure delegation is attached (once)
                attachHoverDelegation();
            } else {
                console.log('Cursor disabled - below LG breakpoint');
                // Restore default cursor behavior for smaller screens
                document.documentElement.style.cursor = "auto";
                document.body.style.cursor = "auto";
                document.querySelectorAll("*").forEach(el => el.style.cursor = "auto");
            }
        }

        // Debounced initializer to ensure DOM mutations (like clones) have completed
        let applyTimeoutId = null;
        function scheduleApplyCursorJS() {
            if (applyTimeoutId) {
                clearTimeout(applyTimeoutId);
            }
            applyTimeoutId = setTimeout(() => {
                applyCursorJS();
                applyTimeoutId = null;
            }, 1000); // minimal delay to allow cloned elements to be added
        }

        // Listen for screen size changes
        Object.values(breakpoints).forEach(mq => {
            mq.addEventListener('change', applyCursorJS);
        });

        // Run once on load (debounced)
        scheduleApplyCursorJS();
    }

    // Initialize responsive cursor
    setupResponsiveCursor();
});