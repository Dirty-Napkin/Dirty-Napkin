// Only run script if .home-container is present

const lgQuery = window.matchMedia('(min-width: 1080px)');

function handleLgChange(e) {
  if (e.matches) {
    // The screen is at least 1080px wide (large)
    console.log('Large screen!');
    // Place your "lg" JavaScript here


    //--------------MAIN FUNCTION HERE-------------------
    if (document.querySelector('.home-container')) {
    
        // Helper to get the offsetTop of an element relative to the document
        function getOffsetTop(elem) {
            let offsetTop = 0;
            while (elem) {
                offsetTop += elem.offsetTop;
                elem = elem.offsetParent;
            }
            return offsetTop;
        }
    
        // Helper function for scroll-based transform logic
        function applyScrollTransform({ element, container, maxTranslateY }) {
            const scrollY = window.scrollY || window.pageYOffset;
            const containerTop = getOffsetTop(container);
            const containerHeight = container.offsetHeight;
            const elemHeight = element.offsetHeight;
    
            const stickyStart = containerTop;
            const stickyEnd = containerTop + containerHeight - elemHeight;
    
            if (scrollY >= stickyStart && scrollY <= stickyEnd) {
                const progress = (scrollY - stickyStart) / (stickyEnd - stickyStart);
                const clamped = Math.max(0, Math.min(1, progress));
                const translateY = clamped * maxTranslateY;
                element.style.transform = `translateY(${translateY}px)`;
            } else if (scrollY < stickyStart) {
                element.style.transform = `translateY(0px)`;
            } else {
                element.style.transform = `translateY(${maxTranslateY}px)`;
            }
        }
    
        // Helper function to generate grid positions
        function generateGridPositions(movement, imageWidth) {
            const positions = [];
            let labelCount = 1;
            for (let y = -2; y <= 2; y++) {
                for (let x = -2; x <= 2; x++) {
                    positions.push({
                        x: x * movement,
                        y: y * movement,
                        label: `${labelCount++}`
                    });
                }
            }
            return positions;
        }
        
        //--------------Duplicate hero text in black-------------------
        document.addEventListener('DOMContentLoaded', () => {
            const fourRepeatType = document.querySelector('.four-repeat-type');
            const homeContainer = document.querySelector('.home-container');
            const clone = fourRepeatType.cloneNode(true);
    
            // Add the .clone class to the cloned element
            clone.classList.add('clone');
    
            // // Style the clone
            clone.style.position = 'absolute';
            clone.style.width = '100%';
            clone.style.zIndex = '-2';
    
            // Insert the clone inside ketchup-wrapper
            homeContainer.appendChild(clone);
        });
    
        //--------------Ketchup scaling animation-------------------
        const ketchupHero = document.querySelector('.ketchup-hero');
        const ketchupWrapper = document.querySelector('.ketchup-wrapper');
        if (ketchupHero && ketchupWrapper) {
          // Ensure ketchupHero is sticky
          ketchupHero.style.position = 'sticky';
    
          // Parameters for scaling and top position
          const endScale = 1.0;
          const startScale = 0.60;
          const endPoint = 0.35; // as a % of the total distance for scaling
          const maxTop = 60; // vh, starting top value
          const minTop = 0;  // vh, ending top value
          const topEndPoint = 0.35; // as a % of the total distance for top value
    
          // How far (in px) to move ketchup upwards after endPoint is reached
          const postEndTranslateY = -300; // adjust as needed
    
          // How far (in px) to move ketchup DOWN after sticky ends (opposite direction)
          const afterStickyTranslateY = 100; // adjust as needed
    
          // Helper to get progress (0 to 1) based on scroll relative to ketchupWrapper height
          function getProgress() {
            const wrapperHeight = ketchupWrapper.offsetHeight;
            const scrollY = window.scrollY;
            // Use the height of the ketchupWrapper as the scrollable distance
            return Math.min(scrollY / wrapperHeight, 1);
          }
    
          // Helper to get scroll progress after endPoint (0 to 1)
          function getPostEndProgress() {
            const wrapperHeight = ketchupWrapper.offsetHeight;
            const scrollY = window.scrollY;
            // The scroll at which endPoint is reached
            const endScroll = endPoint * wrapperHeight;
            // The scroll at which postEndTranslateY is fully applied (let's use 1.0 progress == wrapperHeight)
            const postEndRange = wrapperHeight - endScroll;
            if (scrollY <= endScroll) return 0;
            if (postEndRange <= 0) return 1;
            return Math.min((scrollY - endScroll) / postEndRange, 1);
          }
    
          // Helper to get the sticky boundaries for ketchupHero inside ketchupWrapper
          function getStickyBounds() {
            // Find the offsetTop of the wrapper and the ketchupHero
            const getOffsetTop = (elem) => {
              let offsetTop = 0;
              while (elem) {
                offsetTop += elem.offsetTop;
                elem = elem.offsetParent;
              }
              return offsetTop;
            };
            const wrapperTop = getOffsetTop(ketchupWrapper);
            const wrapperHeight = ketchupWrapper.offsetHeight;
            const heroHeight = ketchupHero.offsetHeight;
            const stickyStart = wrapperTop;
            const stickyEnd = wrapperTop + wrapperHeight - heroHeight;
            return { stickyStart, stickyEnd };
          }
    
          // Set top and scale based on scroll, and move ketchup up after endPoint,
          // then after sticky ends, move ketchup in the opposite direction (down)
          function updateKetchupHero() {
            const progress = getProgress();
    
            // Top position interpolation with its own endpoint
            const clampedTopProgress = Math.min(progress, topEndPoint);
            const topVH = maxTop - (maxTop - minTop) * (clampedTopProgress / topEndPoint);
            ketchupHero.style.top = `${topVH}vh`;
    
            // Scale interpolation
            const clampedScaleProgress = Math.min(progress, endPoint);
            const scale = startScale + (endScale - startScale) * (clampedScaleProgress / endPoint);
    
            // Calculate scroll position and sticky bounds
            const scrollY = window.scrollY;
            const { stickyStart, stickyEnd } = getStickyBounds();
    
            // Calculate the translateY value up to the end of sticky
            let translateY = 0;
            if (progress <= endPoint) {
              // Before endPoint: only scale
              ketchupHero.style.transform = `scale(${scale})`;
            } else if (scrollY < stickyEnd) {
              // After endPoint, but still sticky: move up
              const postEndProgress = getPostEndProgress();
              translateY = postEndTranslateY * postEndProgress;
              ketchupHero.style.transform = `scale(${endScale}) translateY(${translateY}px)`;
            } else {
              // After sticky ends: move in the opposite direction (down)
              // First, get the translateY at the end of sticky (i.e., at stickyEnd)
              // This is the last value from the previous phase
              const wrapperHeight = ketchupWrapper.offsetHeight;
              const endScroll = endPoint * wrapperHeight;
              const postEndRange = wrapperHeight - endScroll;
              let translateYAtStickyEnd = 0;
              if (postEndRange > 0) {
                translateYAtStickyEnd = postEndTranslateY * ((stickyEnd - endScroll) / postEndRange);
                // Clamp to postEndTranslateY if over
                if (translateYAtStickyEnd < postEndTranslateY) translateYAtStickyEnd = postEndTranslateY;
                if (translateYAtStickyEnd > 0) translateYAtStickyEnd = 0;
              }
    
              // Now, as the user scrolls past stickyEnd, move in the opposite direction
              // We'll use a fixed range (e.g., 1x ketchupHero height) for the "after" animation
              const afterRange = ketchupHero.offsetHeight * 1.2; // how much scroll triggers the full after effect
              const afterProgress = Math.min(
                Math.max((scrollY - stickyEnd) / afterRange, 0),
                1
              );
              // Move from translateYAtStickyEnd to translateYAtStickyEnd + afterStickyTranslateY
              translateY = translateYAtStickyEnd + afterStickyTranslateY * afterProgress;
              ketchupHero.style.transform = `scale(${endScale}) translateY(${translateY}px)`;
            }
          }
    
          updateKetchupHero();
          window.addEventListener('scroll', updateKetchupHero);
          window.addEventListener('resize', updateKetchupHero);
        }
    
        //--------------Masking out hero type with scroll-------------------
        const textBoxes = document.querySelectorAll('.width-box:not(.CTA-container .width-box) h2');
        if (textBoxes && ketchupWrapper && ketchupHero) {
            // Custom start points for each text box (as a percentage of viewport height: 0 = top, 100 = bottom)
            // e.g. 47 means 47% down the viewport
            const startPoints = [32, 32, 22, 22];
    
            function updateTextBoxClipPath() {
                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
                textBoxes.forEach((textBox, i) => {
                    // Use the custom startPoint for this text box, or fallback to the first if not enough values
                    const startPointPercent = startPoints[i] !== undefined ? startPoints[i] : startPoints[0];
                    // The Y position in the viewport where the clip should "stick"
                    const stickyClipY = (startPointPercent / 100) * viewportHeight;
    
                    // Get the top of the textBox in the document
                    const textBoxRect = textBox.getBoundingClientRect();
                    const textBoxTop = scrollY + textBoxRect.top;
    
                    // The distance from the stickyClipY (in viewport) to the top of the textBox (in document)
                    // As you scroll, the clip path should appear to stay at stickyClipY in the viewport
                    let insetTop = Math.max(0, scrollY + stickyClipY - textBoxTop);
    
                    textBox.style.clipPath = `inset(${insetTop}px 0 0 0)`;
                });
            }
    
            // Set initial state
            updateTextBoxClipPath();
            window.addEventListener('scroll', updateTextBoxClipPath);
            window.addEventListener('resize', updateTextBoxClipPath);
        }
    
        //--------------Clip white hero type to ketchup hero-------------------
        function updateRepeatTypeClip() {
            // Select the reference and target elements
            const ketchupHero = document.querySelector('.ketchup-hero');
            const repeatType = document.querySelector('.four-repeat-type');
            if (!ketchupHero || !repeatType) return; // Exit if either is missing
    
            // Get bounding rect of .ketchup-hero relative to viewport
            const heroRect = ketchupHero.getBoundingClientRect();
            const repeatRect = repeatType.getBoundingClientRect();
    
            // Calculate the top and bottom relative to the .four-repeat-type container
            // This ensures the mask aligns visually with ketchup-hero inside the repeatType context
            let top = heroRect.top - repeatRect.top;
            let bottom = repeatRect.bottom - heroRect.bottom;
    
            // Clamp to 0 if negative (shouldn't be, but for safety)
            top = Math.max(0, Math.round(top));
            bottom = Math.max(0, Math.round(bottom));
    
            // X values (left/right) are already correct, but let's also use relative to repeatType for robustness
            let left = heroRect.left - repeatRect.left;
            let right = repeatRect.right - heroRect.right;
    
            left = Math.max(0, Math.round(left));
            right = Math.max(0, Math.round(right));
    
            // --- Y OFFSET CORRECTION ---
            // The Y value is still about 10px off. The most robust way to solve this is to account for any
            // margin, border, or scroll offset that may be affecting the position.
            // We'll use getComputedStyle to check for margin/border, and also check for scroll offset.
    
            // 1. Account for scroll offset of the container (if any)
            // (If .four-repeat-type is not scrollable, this will be 0)
            const repeatTypeScrollTop = repeatType.scrollTop || 0;
    
            // 2. Account for border and padding of .four-repeat-type
            const repeatTypeStyle = window.getComputedStyle(repeatType);
            const borderTop = parseFloat(repeatTypeStyle.borderTopWidth) || 0;
            const paddingTop = parseFloat(repeatTypeStyle.paddingTop) || 0;
    
            // 3. Account for margin of .ketchup-hero (if any)
            const heroStyle = window.getComputedStyle(ketchupHero);
            const heroMarginTop = parseFloat(heroStyle.marginTop) || 0;
    
            // 4. Add up all corrections
            // If the mask is too low, we need to subtract from 'top'
            // If the mask is too high, we need to add to 'top'
            // Empirically, the issue is usually due to border/padding/margin or subpixel rounding.
            // We'll also allow a manual fudge factor for fine-tuning.
            const manualFudge = 0; // Try -10px to correct the 10px offset
    
            // Final top and bottom with all corrections
            const finalTop = Math.max(
                0,
                top - repeatTypeScrollTop - borderTop - paddingTop + heroMarginTop + manualFudge
            );
            // For bottom, we want to keep the same fudge as before, but you can adjust if needed
            const fudgeBottom = 0;
            const finalBottom = Math.max(0, bottom + fudgeBottom);
    
            // Build the clip-path string
            const clipPath = `inset(${finalTop}px ${right}px ${finalBottom}px ${left}px)`;
    
            // Apply the clip-path to the target element
            repeatType.style.clipPath = clipPath;
            repeatType.style.webkitClipPath = clipPath; // For Safari support
        }
    
        // Run once on DOMContentLoaded, and on scroll/resize
        document.addEventListener('DOMContentLoaded', updateRepeatTypeClip);
        window.addEventListener('resize', updateRepeatTypeClip);
        window.addEventListener('scroll', updateRepeatTypeClip);
      
    
        //--------------Brand hover effect-------------------
        document.addEventListener('DOMContentLoaded', () => {
            const brandItems = document.querySelectorAll('.brand-item');
    
            brandItems.forEach(item => {
                const mainImage = item.querySelector('img:not(.more-info)');
                const moreInfoImages = item.querySelectorAll('.more-info');
    
                // Calculate movement based on image width plus gap
                const imageWidth = mainImage.offsetWidth;
                const movement = imageWidth + 28; // 28px is 1.75rem gap
    
                // Calculate grid positions based on the image width and gap
                const gridPositions = generateGridPositions(movement, imageWidth);
    
                // Position indicators
                // Create container for position indicators
                const positionIndicators = document.createElement('div');
                positionIndicators.className = 'position-indicators';
                positionIndicators.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                `;
                item.appendChild(positionIndicators);
    
                // Create position indicators
                gridPositions.forEach(pos => {
                    const indicator = document.createElement('div');
                    indicator.className = 'position-indicator';
                    indicator.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: ${imageWidth}px;
                        height: ${imageWidth}px;
                        background-color: rgba(128, 128, 128, 0.2);
                        border: 1px solid rgba(128, 128, 128, 0.4);
                        transform: translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px);
                        opacity: 0;
                        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;
    
                    // Create text box for the label
                    const textBox = document.createElement('div');
                    textBox.style.cssText = `
                        padding: 4px 8px;
                        color: black;
                        font-size: 24px;
                        font-weight: bold;
                        font-family: monospace;
                        display: inline-block;
                        text-align: center;
                        min-width: 1.5em;
                        letter-spacing: -1px;
                    `;
                    textBox.textContent = pos.label;
    
                    indicator.appendChild(textBox);
                    positionIndicators.appendChild(indicator);
                });
                //
    
    
                // Position each more-info image
                // Get the brand name from the first image's class
                const brandName = item.querySelector('img:not(.more-info)').className;
    
                // Define custom positions for each brand's more-info images
                const customPositions = {
                    'the-window': [7, 8, 14, 15, 17, 19],      // Example: first image goes to position 7, second to 8, etc.
                    'lemonade-stand': [8, 11, 14, 17, 19],
                    'those-eyes': [7, 11, 12, 19, 22],
                    'branded-moments': [13, 14, 15, 16],
                    'american-scripture-project': [8, 10, 14, 19, 20]
                };
    
                moreInfoImages.forEach((img, index) => {
                    // Get the target position number for this image
                    const targetPosition = customPositions[brandName][index];
                    // Find the corresponding grid position
                    const pos = gridPositions.find(p => p.label === targetPosition.toString());
    
                    // Start at center (behind main image)
                    img.style.transform = 'translate(0, 0)';
                    img.style.opacity = '0';
                    img.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                });
    
                // Add hover effect
                let showIndicators = false; //Set to false to hide indicators    
    
                item.querySelector('img:not(.more-info)').addEventListener('mouseenter', () => {
                    // Show position indicators only if enabled
                    if (showIndicators) {
                        const indicators = positionIndicators.querySelectorAll('.position-indicator');
                        indicators.forEach(indicator => {
                            indicator.style.opacity = '1';
                        });
                    }
    
                    // Move images
                    moreInfoImages.forEach((img, index) => {
                        const targetPosition = customPositions[brandName][index];
                        const pos = gridPositions.find(p => p.label === targetPosition.toString());
    
                        img.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                        img.style.opacity = '1';
                    });
                });
    
                // On hover out
                item.querySelector('img:not(.more-info)').addEventListener('mouseleave', () => {
                    // Hide position indicators only if enabled
                    if (showIndicators) {
                        const indicators = positionIndicators.querySelectorAll('.position-indicator');
                        indicators.forEach(indicator => {
                            indicator.style.opacity = '0';
                        });
                    }
    
                    // Move images back
                    moreInfoImages.forEach(img => {
                        img.style.transform = 'translate(0, 0)';
                        img.style.opacity = '0';
                    });
                });
                //
            });
        });
    
        //--------------Yellow Ketchup Section-------------------
        (function() {
            // Select the yellow ketchup section and image
            const yellowSection = document.querySelector('.yellow-ketchup-section');
            const yellowKetchupImg = yellowSection ? yellowSection.querySelector('img') : null;
    
            // Editable variable: how far up (in px) the yellow ketchup image should move at max
            const maxTranslateY = -400; // Adjust as needed for effect
    
            function updateYellowKetchupPosition() {
                if (!yellowSection || !yellowKetchupImg) return;
    
                applyScrollTransform({
                    element: yellowKetchupImg,
                    container: yellowSection,
                    maxTranslateY: maxTranslateY
                });
            }
    
            // Initial set
            updateYellowKetchupPosition();
            window.addEventListener('scroll', updateYellowKetchupPosition);
            window.addEventListener('resize', updateYellowKetchupPosition);
        })();
        
        //--------------Testimonial scroll animation-------------------
        (function() {
            // Editable variable: how far down (in px) the testimonial should move at start
            const testimonialStartOffset = 500; // Change this value for more/less movement
    
            const yellowSection = document.querySelector('.yellow-ketchup-section');
            const testimonial = document.querySelector('.testimonial');
            if (!yellowSection || !testimonial) return;
    
    
    
            function animateTestimonial() {
                const scrollY = window.scrollY || window.pageYOffset;
                const sectionTop = getOffsetTop(yellowSection);
                const sectionBottom = sectionTop + yellowSection.offsetHeight;
    
                // When does yellow-ketchup-section first enter the viewport?
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                const sectionEnters = sectionTop - viewportHeight;
                const sectionHitsTop = sectionTop;
    
                if (scrollY < sectionEnters) {
                    // Before yellow-ketchup-section enters, reset testimonial
                    testimonial.style.transform = `translateY(0px)`;
                } else if (scrollY >= sectionEnters && scrollY < sectionHitsTop) {
                    // Animate from offset to 0 as yellow-ketchup-section moves from entering to top
                    const progress = (scrollY - sectionEnters) / (sectionHitsTop - sectionEnters);
                    const clamped = Math.max(0, Math.min(1, progress));
                    const translateY = testimonialStartOffset * (1 - clamped);
                    testimonial.style.transform = `translateY(${translateY}px)`;
    
                } else {
                    // When yellow-ketchup-section hits the top, testimonial at 0
                    testimonial.style.transform = `translateY(0px)`;
    
                }
            }
    
            // Initial set
            animateTestimonial();
            window.addEventListener('scroll', animateTestimonial);
            window.addEventListener('resize', animateTestimonial);
        })();
    
        //--------------masking out CTA text on scroll-------------------
        const ctaTextBoxes = document.querySelectorAll('.CTA-container .width-box h2');
        if (ctaTextBoxes && ketchupWrapper && ketchupHero) {
            // Define start points as percentages of viewport height (0 = top, 100 = bottom)
            // e.g. 60 means 60% down the viewport
            const ctaStartPoints = [45, 45, 100, 100];
    
            function updateCtaTextBoxClipPath() {
                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
                ctaTextBoxes.forEach((textBox, i) => {
                    // Use the custom startPoint for this text box, or fallback to the first if not enough values
                    const startPointPercent = ctaStartPoints[i] !== undefined ? ctaStartPoints[i] : ctaStartPoints[0];
                    // Calculate the Y position in the document where the clip should "stick"
                    const stickyClipY = scrollY + (startPointPercent / 100) * viewportHeight;
    
                    // Get the top of the textBox in the document
                    const textBoxRect = textBox.getBoundingClientRect();
                    const textBoxTop = scrollY + textBoxRect.top;
                    const textBoxHeight = textBox.offsetHeight;
    
                    // The distance from the stickyClipY to the top of the textBox
                    // If stickyClipY is above the textBox, insetBottom = textBoxHeight (fully masked)
                    // If stickyClipY is below the bottom of the textBox, insetBottom = 0 (fully revealed)
                    // Otherwise, insetBottom = textBoxTop + textBoxHeight - stickyClipY
                    let insetBottom = textBoxTop + textBoxHeight - stickyClipY;
                    insetBottom = Math.max(0, Math.min(textBoxHeight, insetBottom));
    
                    textBox.style.clipPath = `inset(0 0 ${insetBottom}px 0)`;
                });
            }
    
            // Set initial state
            updateCtaTextBoxClipPath();
            window.addEventListener('scroll', updateCtaTextBoxClipPath);
            window.addEventListener('resize', updateCtaTextBoxClipPath);
        }
    
        //--------------Black Background anim-------------------
        const collabs = document.querySelector(".home-container");
        const colorTrigger = document.querySelector(".adam-collab");
    
        console.log('Color trigger element:', colorTrigger); // Debug log
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                console.log('Intersection detected:', entry.isIntersecting); // Debug log
                if (entry.isIntersecting) {
                    collabs.classList.add("black-background");
                } else {
                    collabs.classList.remove("black-background");
                }
            });
        });
    
        observer.observe(colorTrigger);
        
    }
    
  } else {
    // The screen is less than 1080px wide (not large)
    console.log('Small screen!');
    // Place your "not lg" JavaScript here
  }
}

lgQuery.addEventListener('change', handleLgChange);
handleLgChange(lgQuery);



// --------------Create white hero text for mobile------------------- //
document.addEventListener('DOMContentLoaded', () => {
    const mainHeroText = document.querySelector('.main-hero-text');
    const rowHolder = document.querySelector('.row-holder');
    const firstRowDiv = rowHolder ? rowHolder.querySelector('div') : null;
    const clone = mainHeroText.cloneNode(true);

    // Add the .clone class to the cloned element
    clone.classList.add('clone');

    // // Style the clone
    clone.style.position = 'absolute';
    clone.style.width = '100%';
    // clone.style.zIndex = '-2';
    clone.style.top = '0';
    clone.style.margin = '0';

    // Insert the clone inside ketchup-wrapper
    firstRowDiv.appendChild(clone);

    console.log('clone created!');
});




