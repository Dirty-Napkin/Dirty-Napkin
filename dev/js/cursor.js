// Hide cursor universally at lg breakpoints or larger
document.addEventListener("DOMContentLoaded", function () {
    
    // Responsive cursor setup - creates custom cursor at lg breakpoints or larger
    function setupCursor() {
        const lgBreakpoint = window.matchMedia("(min-width: 1024px)");
        let cursor = null;
        let mousemoveHandler = null;
        let hoverDelegationAttached = false;
        let interactiveFrames = [];
        let frameRecoveryHandler = null;
        let activeFrame = null;

        /**
         * Creates the custom cursor element and sets up mouse tracking
         */
        function createCursor() {
            // Create the custom cursor element
            cursor = document.createElement("div");
            cursor.classList.add("cursors");
            document.body.appendChild(cursor);
            
            // Update cursor position on mouse move
            mousemoveHandler = function (e) {
                if (cursor) {
                    cursor.style.left = e.clientX + "px";
                    cursor.style.top = e.clientY + "px";
                }
            };
            document.addEventListener("mousemove", mousemoveHandler);
            
            // Initialize hover interaction handlers
            setupHoverInteractions();
            setupInteractiveFrames();
        }

        /**
         * Removes the cursor element and cleans up event listeners
         */
        function removeCursor() {
            // Remove cursor element
            if (cursor) {
                cursor.remove();
                cursor = null;
            }
            
            // Remove event listener
            if (mousemoveHandler) {
                document.removeEventListener("mousemove", mousemoveHandler);
                mousemoveHandler = null;
            }
            
            teardownInteractiveFrames();
        }

        /**
         * Cross-origin iframes (Vimeo's player) swallow all mouse events, so the
         * custom cursor freezes at the edge as soon as the pointer moves inside one.
         * The pointer position can't be read from another origin, so instead hide the
         * custom cursor over any iframe that accepts pointer events and let the
         * player's own cursor take over for its controls.
         */
        function hideCursorForFrame(e) {
            if (!cursor) return;
            activeFrame = e.currentTarget;
            cursor.style.opacity = "0";
        }

        function showCursorForFrame(e) {
            if (!cursor) return;
            activeFrame = null;
            // Reposition before revealing so it doesn't flash at a stale spot
            if (e) {
                cursor.style.left = e.clientX + "px";
                cursor.style.top = e.clientY + "px";
            }
            cursor.style.opacity = "";
        }

        function setupInteractiveFrames() {
            if (interactiveFrames.length) return;

            document.querySelectorAll("iframe").forEach(function (frame) {
                // Only frames that actually capture the pointer steal the cursor
                if (getComputedStyle(frame).pointerEvents === "none") return;

                frame.addEventListener("mouseenter", hideCursorForFrame);
                frame.addEventListener("mouseleave", showCursorForFrame);
                interactiveFrames.push(frame);
            });

            if (!interactiveFrames.length || frameRecoveryHandler) return;

            // Safety net for fast exits where mouseleave never fires: a mousemove
            // outside the frame's box means the pointer is back in our document
            frameRecoveryHandler = function (e) {
                if (!activeFrame) return;

                const rect = activeFrame.getBoundingClientRect();
                const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                               e.clientY >= rect.top && e.clientY <= rect.bottom;

                if (!inside) showCursorForFrame(e);
            };
            document.addEventListener("mousemove", frameRecoveryHandler);
        }

        function teardownInteractiveFrames() {
            interactiveFrames.forEach(function (frame) {
                frame.removeEventListener("mouseenter", hideCursorForFrame);
                frame.removeEventListener("mouseleave", showCursorForFrame);
            });
            interactiveFrames = [];
            activeFrame = null;

            if (frameRecoveryHandler) {
                document.removeEventListener("mousemove", frameRecoveryHandler);
                frameRecoveryHandler = null;
            }
        }

        /**
         * Sets up hover interaction handlers for links and buttons
         * Uses event delegation to handle dynamically added elements
         */
        function setupHoverInteractions() {
            // Prevent duplicate event listeners
            if (hoverDelegationAttached || !cursor) return;
            
            /**
             * Removes all hover state classes from the cursor
             */
            function clearCursorClasses() {
                if (!cursor) return;
                cursor.classList.remove('hover-one', 'hover-two', 'hover-button', 'hover-link-nav');
            }

            /**
             * Handles mouseover events on interactive elements
             */
            function handleMouseOver(e) {
                // Graceful fallback: exit if cursor doesn't exist
                if (!cursor) return;

                // Detect if hovered element is a link or button
                const target = e.target.closest('a, button');
                
                // Graceful fallback: exit if no valid target found
                if (!target || !document.body.contains(target)) {
                    clearCursorClasses();
                    return;
                }

                // Remove previous classes before applying new ones
                clearCursorClasses();

                // Check for hover-style classes on target or its parents
                const hoverStyleOneElement = target.closest('.hover-style-one');
                const hoverStyleTwoElement = target.closest('.hover-style-two');

                // Handle hover-style-one: measure element and set CSS custom properties
                if (hoverStyleOneElement) {
                    const rect = hoverStyleOneElement.getBoundingClientRect();
                    cursor.style.setProperty('--link-width', `${rect.width + 10}px`);
                    cursor.style.setProperty('--link-height', `${rect.height + 10}px`);
                    
                    // Check if link is inside nav element for special styling
                    const isInNav = target.closest('nav') !== null;
                    cursor.classList.add(isInNav ? 'hover-link-nav' : 'hover-one');
                }
                // Handle hover-style-two: add hover-two class
                else if (hoverStyleTwoElement) {
                    cursor.classList.add('hover-two');
                }
            }

            /**
             * Handles mouseout events to clear cursor classes
             */
            function handleMouseOut(e) {
                // Graceful fallback: exit if cursor doesn't exist
                if (!cursor) return;

                const fromEl = e.target.closest('a, button');
                const toEl = e.relatedTarget?.closest('a, button');
                
                // If moving within the same element, don't clear classes
                if (fromEl && toEl && fromEl === toEl) return;

                // Clear classes when leaving an interactive element
                if (fromEl) {
                    clearCursorClasses();
                }
            }

            // Attach event listeners using event delegation
            document.addEventListener('mouseover', handleMouseOver);
            document.addEventListener('mouseout', handleMouseOut);
            
            hoverDelegationAttached = true;
        }

        /**
         * Toggles cursor visibility based on breakpoint
         */
        function toggleCursor() {
            if (lgBreakpoint.matches) {
                // Hide default cursor and create custom cursor
                document.documentElement.classList.add('cursor-hidden');
                if (!cursor) {
                    createCursor();
                }
            } else {
                // Restore normal cursor behavior and remove custom cursor
                document.documentElement.classList.remove('cursor-hidden');
                removeCursor();
                hoverDelegationAttached = false;
            }
        }

        // Listen for screen size changes
        lgBreakpoint.addEventListener('change', toggleCursor);

        // Run once on load
        toggleCursor();
    }

    // Initialize cursor
    setupCursor();
});
