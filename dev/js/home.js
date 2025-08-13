// Only run script if .home-container is present

const lgQuery = window.matchMedia('(min-width: 1080px)');

// function handleLgChange(e) {
//   if (e.matches) {
//     // The screen is at least 1080px wide (large)
//     console.log('Large screen!');
//     // Place your "lg" JavaScript here


//     //--------------MAIN FUNCTION HERE-------------------
//     if (document.querySelector('.home-container')) {
    
//         // Helper to get the offsetTop of an element relative to the document
//         function getOffsetTop(elem) {
//             let offsetTop = 0;
//             while (elem) {
//                 offsetTop += elem.offsetTop;
//                 elem = elem.offsetParent;
//             }
//             return offsetTop;
//         }
    
//         // Helper function for scroll-based transform logic
//         function applyScrollTransform({ element, container, maxTranslateY }) {
//             const scrollY = window.scrollY || window.pageYOffset;
//             const containerTop = getOffsetTop(container);
//             const containerHeight = container.offsetHeight;
//             const elemHeight = element.offsetHeight;
    
//             const stickyStart = containerTop;
//             const stickyEnd = containerTop + containerHeight - elemHeight;
    
//             if (scrollY >= stickyStart && scrollY <= stickyEnd) {
//                 const progress = (scrollY - stickyStart) / (stickyEnd - stickyStart);
//                 const clamped = Math.max(0, Math.min(1, progress));
//                 const translateY = clamped * maxTranslateY;
//                 element.style.transform = `translateY(${translateY}px)`;
//             } else if (scrollY < stickyStart) {
//                 element.style.transform = `translateY(0px)`;
//             } else {
//                 element.style.transform = `translateY(${maxTranslateY}px)`;
//             }
//         }
    
//         // Helper function to generate grid positions
//         function generateGridPositions(movement, imageWidth) {
//             const positions = [];
//             let labelCount = 1;
//             for (let y = -2; y <= 2; y++) {
//                 for (let x = -2; x <= 2; x++) {
//                     positions.push({
//                         x: x * movement,
//                         y: y * movement,
//                         label: `${labelCount++}`
//                     });
//                 }
//             }
//             return positions;
//         }
        
//         //--------------Duplicate hero text in black-------------------
//         document.addEventListener('DOMContentLoaded', () => {
//             const fourRepeatType = document.querySelector('.four-repeat-type');
//             const homeContainer = document.querySelector('.home-container');
//             const clone = fourRepeatType.cloneNode(true);
    
//             // Add the .clone class to the cloned element
//             clone.classList.add('clone');
    
//             // // Style the clone
//             clone.style.position = 'absolute';
//             clone.style.width = '100%';
//             clone.style.zIndex = '-2';
    
//             // Insert the clone inside ketchup-wrapper
//             homeContainer.appendChild(clone);
//         });
    
//         //--------------Ketchup scaling animation-------------------
//         const ketchupHero = document.querySelector('.ketchup-hero');
//         const ketchupWrapper = document.querySelector('.ketchup-wrapper');
//         if (ketchupHero && ketchupWrapper) {
//           // Ensure ketchupHero is sticky
//           ketchupHero.style.position = 'sticky';
    
//           // Parameters for scaling and top position
//           const endScale = 1.0;
//           const startScale = 0.60;
//           const endPoint = 0.35; // as a % of the total distance for scaling
//           const maxTop = 60; // vh, starting top value
//           const minTop = 0;  // vh, ending top value
//           const topEndPoint = 0.35; // as a % of the total distance for top value
    
//           // How far (in px) to move ketchup upwards after endPoint is reached
//           const postEndTranslateY = -300; // adjust as needed
    
//           // How far (in px) to move ketchup DOWN after sticky ends (opposite direction)
//           const afterStickyTranslateY = 100; // adjust as needed
    
//           // Helper to get progress (0 to 1) based on scroll relative to ketchupWrapper height
//           function getProgress() {
//             const wrapperHeight = ketchupWrapper.offsetHeight;
//             const scrollY = window.scrollY;
//             // Use the height of the ketchupWrapper as the scrollable distance
//             return Math.min(scrollY / wrapperHeight, 1);
//           }
    
//           // Helper to get scroll progress after endPoint (0 to 1)
//           function getPostEndProgress() {
//             const wrapperHeight = ketchupWrapper.offsetHeight;
//             const scrollY = window.scrollY;
//             // The scroll at which endPoint is reached
//             const endScroll = endPoint * wrapperHeight;
//             // The scroll at which postEndTranslateY is fully applied (let's use 1.0 progress == wrapperHeight)
//             const postEndRange = wrapperHeight - endScroll;
//             if (scrollY <= endScroll) return 0;
//             if (postEndRange <= 0) return 1;
//             return Math.min((scrollY - endScroll) / postEndRange, 1);
//           }
    
//           // Helper to get the sticky boundaries for ketchupHero inside ketchupWrapper
//           function getStickyBounds() {
//             // Find the offsetTop of the wrapper and the ketchupHero
//             const getOffsetTop = (elem) => {
//               let offsetTop = 0;
//               while (elem) {
//                 offsetTop += elem.offsetTop;
//                 elem = elem.offsetParent;
//               }
//               return offsetTop;
//             };
//             const wrapperTop = getOffsetTop(ketchupWrapper);
//             const wrapperHeight = ketchupWrapper.offsetHeight;
//             const heroHeight = ketchupHero.offsetHeight;
//             const stickyStart = wrapperTop;
//             const stickyEnd = wrapperTop + wrapperHeight - heroHeight;
//             return { stickyStart, stickyEnd };
//           }
    
//           // Set top and scale based on scroll, and move ketchup up after endPoint,
//           // then after sticky ends, move ketchup in the opposite direction (down)
//           function updateKetchupHero() {
//             const progress = getProgress();
    
//             // Top position interpolation with its own endpoint
//             const clampedTopProgress = Math.min(progress, topEndPoint);
//             const topVH = maxTop - (maxTop - minTop) * (clampedTopProgress / topEndPoint);
//             ketchupHero.style.top = `${topVH}vh`;
    
//             // Scale interpolation
//             const clampedScaleProgress = Math.min(progress, endPoint);
//             const scale = startScale + (endScale - startScale) * (clampedScaleProgress / endPoint);
    
//             // Calculate scroll position and sticky bounds
//             const scrollY = window.scrollY;
//             const { stickyStart, stickyEnd } = getStickyBounds();
    
//             // Calculate the translateY value up to the end of sticky
//             let translateY = 0;
//             if (progress <= endPoint) {
//               // Before endPoint: only scale
//               ketchupHero.style.transform = `scale(${scale})`;
//             } else if (scrollY < stickyEnd) {
//               // After endPoint, but still sticky: move up
//               const postEndProgress = getPostEndProgress();
//               translateY = postEndTranslateY * postEndProgress;
//               ketchupHero.style.transform = `scale(${endScale}) translateY(${translateY}px)`;
//             } else {
//               // After sticky ends: move in the opposite direction (down)
//               // First, get the translateY at the end of sticky (i.e., at stickyEnd)
//               // This is the last value from the previous phase
//               const wrapperHeight = ketchupWrapper.offsetHeight;
//               const endScroll = endPoint * wrapperHeight;
//               const postEndRange = wrapperHeight - endScroll;
//               let translateYAtStickyEnd = 0;
//               if (postEndRange > 0) {
//                 translateYAtStickyEnd = postEndTranslateY * ((stickyEnd - endScroll) / postEndRange);
//                 // Clamp to postEndTranslateY if over
//                 if (translateYAtStickyEnd < postEndTranslateY) translateYAtStickyEnd = postEndTranslateY;
//                 if (translateYAtStickyEnd > 0) translateYAtStickyEnd = 0;
//               }
    
//               // Now, as the user scrolls past stickyEnd, move in the opposite direction
//               // We'll use a fixed range (e.g., 1x ketchupHero height) for the "after" animation
//               const afterRange = ketchupHero.offsetHeight * 1.2; // how much scroll triggers the full after effect
//               const afterProgress = Math.min(
//                 Math.max((scrollY - stickyEnd) / afterRange, 0),
//                 1
//               );
//               // Move from translateYAtStickyEnd to translateYAtStickyEnd + afterStickyTranslateY
//               translateY = translateYAtStickyEnd + afterStickyTranslateY * afterProgress;
//               ketchupHero.style.transform = `scale(${endScale}) translateY(${translateY}px)`;
//             }
//           }
    
//           updateKetchupHero();
//           window.addEventListener('scroll', updateKetchupHero);
//           window.addEventListener('resize', updateKetchupHero);
//         }
    
//         //--------------Masking out hero type with scroll-------------------
//         const textBoxes = document.querySelectorAll('.width-box:not(.CTA-container .width-box) h2');
//         if (textBoxes && ketchupWrapper && ketchupHero) {
//             // Custom start points for each text box (as a percentage of viewport height: 0 = top, 100 = bottom)
//             // e.g. 47 means 47% down the viewport
//             const startPoints = [32, 32, 22, 22];
    
//             function updateTextBoxClipPath() {
//                 const scrollY = window.scrollY;
//                 const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
//                 textBoxes.forEach((textBox, i) => {
//                     // Use the custom startPoint for this text box, or fallback to the first if not enough values
//                     const startPointPercent = startPoints[i] !== undefined ? startPoints[i] : startPoints[0];
//                     // The Y position in the viewport where the clip should "stick"
//                     const stickyClipY = (startPointPercent / 100) * viewportHeight;
    
//                     // Get the top of the textBox in the document
//                     const textBoxRect = textBox.getBoundingClientRect();
//                     const textBoxTop = scrollY + textBoxRect.top;
    
//                     // The distance from the stickyClipY (in viewport) to the top of the textBox (in document)
//                     // As you scroll, the clip path should appear to stay at stickyClipY in the viewport
//                     let insetTop = Math.max(0, scrollY + stickyClipY - textBoxTop);
    
//                     textBox.style.clipPath = `inset(${insetTop}px 0 0 0)`;
//                 });
//             }
    
//             // Set initial state
//             updateTextBoxClipPath();
//             window.addEventListener('scroll', updateTextBoxClipPath);
//             window.addEventListener('resize', updateTextBoxClipPath);
//         }
    
//         //--------------Clip white hero type to ketchup hero-------------------
//         function updateRepeatTypeClip() {
//             // Select the reference and target elements
//             const ketchupHero = document.querySelector('.ketchup-hero');
//             const repeatType = document.querySelector('.four-repeat-type');
//             if (!ketchupHero || !repeatType) return; // Exit if either is missing
    
//             // Get bounding rect of .ketchup-hero relative to viewport
//             const heroRect = ketchupHero.getBoundingClientRect();
//             const repeatRect = repeatType.getBoundingClientRect();
    
//             // Calculate the top and bottom relative to the .four-repeat-type container
//             // This ensures the mask aligns visually with ketchup-hero inside the repeatType context
//             let top = heroRect.top - repeatRect.top;
//             let bottom = repeatRect.bottom - heroRect.bottom;
    
//             // Clamp to 0 if negative (shouldn't be, but for safety)
//             top = Math.max(0, Math.round(top));
//             bottom = Math.max(0, Math.round(bottom));
    
//             // X values (left/right) are already correct, but let's also use relative to repeatType for robustness
//             let left = heroRect.left - repeatRect.left;
//             let right = repeatRect.right - heroRect.right;
    
//             left = Math.max(0, Math.round(left));
//             right = Math.max(0, Math.round(right));
    
//             // --- Y OFFSET CORRECTION ---
//             // The Y value is still about 10px off. The most robust way to solve this is to account for any
//             // margin, border, or scroll offset that may be affecting the position.
//             // We'll use getComputedStyle to check for margin/border, and also check for scroll offset.
    
//             // 1. Account for scroll offset of the container (if any)
//             // (If .four-repeat-type is not scrollable, this will be 0)
//             const repeatTypeScrollTop = repeatType.scrollTop || 0;
    
//             // 2. Account for border and padding of .four-repeat-type
//             const repeatTypeStyle = window.getComputedStyle(repeatType);
//             const borderTop = parseFloat(repeatTypeStyle.borderTopWidth) || 0;
//             const paddingTop = parseFloat(repeatTypeStyle.paddingTop) || 0;
    
//             // 3. Account for margin of .ketchup-hero (if any)
//             const heroStyle = window.getComputedStyle(ketchupHero);
//             const heroMarginTop = parseFloat(heroStyle.marginTop) || 0;
    
//             // 4. Add up all corrections
//             // If the mask is too low, we need to subtract from 'top'
//             // If the mask is too high, we need to add to 'top'
//             // Empirically, the issue is usually due to border/padding/margin or subpixel rounding.
//             // We'll also allow a manual fudge factor for fine-tuning.
//             const manualFudge = 0; // Try -10px to correct the 10px offset
    
//             // Final top and bottom with all corrections
//             const finalTop = Math.max(
//                 0,
//                 top - repeatTypeScrollTop - borderTop - paddingTop + heroMarginTop + manualFudge
//             );
//             // For bottom, we want to keep the same fudge as before, but you can adjust if needed
//             const fudgeBottom = 0;
//             const finalBottom = Math.max(0, bottom + fudgeBottom);
    
//             // Build the clip-path string
//             const clipPath = `inset(${finalTop}px ${right}px ${finalBottom}px ${left}px)`;
    
//             // Apply the clip-path to the target element
//             repeatType.style.clipPath = clipPath;
//             repeatType.style.webkitClipPath = clipPath; // For Safari support
//         }
    
//         // Run once on DOMContentLoaded, and on scroll/resize
//         document.addEventListener('DOMContentLoaded', updateRepeatTypeClip);
//         window.addEventListener('resize', updateRepeatTypeClip);
//         window.addEventListener('scroll', updateRepeatTypeClip);
      
    
//         //--------------Brand hover effect-------------------
//         document.addEventListener('DOMContentLoaded', () => {
//             const brandItems = document.querySelectorAll('.brand-item');
    
//             brandItems.forEach(item => {
//                 const mainImage = item.querySelector('img:not(.more-info)');
//                 const moreInfoImages = item.querySelectorAll('.more-info');
    
//                 // Calculate movement based on image width plus gap
//                 const imageWidth = mainImage.offsetWidth;
//                 const movement = imageWidth + 28; // 28px is 1.75rem gap
    
//                 // Calculate grid positions based on the image width and gap
//                 const gridPositions = generateGridPositions(movement, imageWidth);
    
//                 // Position indicators
//                 // Create container for position indicators
//                 const positionIndicators = document.createElement('div');
//                 positionIndicators.className = 'position-indicators';
//                 positionIndicators.style.cssText = `
//                     position: absolute;
//                     top: 0;
//                     left: 0;
//                     width: 100%;
//                     height: 100%;
//                     pointer-events: none;
//                     z-index: 1;
//                 `;
//                 item.appendChild(positionIndicators);
    
//                 // Create position indicators
//                 gridPositions.forEach(pos => {
//                     const indicator = document.createElement('div');
//                     indicator.className = 'position-indicator';
//                     indicator.style.cssText = `
//                         position: absolute;
//                         top: 50%;
//                         left: 50%;
//                         width: ${imageWidth}px;
//                         height: ${imageWidth}px;
//                         background-color: rgba(128, 128, 128, 0.2);
//                         border: 1px solid rgba(128, 128, 128, 0.4);
//                         transform: translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px);
//                         opacity: 0;
//                         transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
//                         display: flex;
//                         align-items: center;
//                         justify-content: center;
//                     `;
    
//                     // Create text box for the label
//                     const textBox = document.createElement('div');
//                     textBox.style.cssText = `
//                         padding: 4px 8px;
//                         color: black;
//                         font-size: 24px;
//                         font-weight: bold;
//                         font-family: monospace;
//                         display: inline-block;
//                         text-align: center;
//                         min-width: 1.5em;
//                         letter-spacing: -1px;
//                     `;
//                     textBox.textContent = pos.label;
    
//                     indicator.appendChild(textBox);
//                     positionIndicators.appendChild(indicator);
//                 });
//                 //
    
    
//                 // Position each more-info image
//                 // Get the brand name from the first image's class
//                 const brandName = item.querySelector('img:not(.more-info)').className;
    
//                 // Define custom positions for each brand's more-info images
//                 const customPositions = {
//                     'the-window': [7, 8, 14, 15, 17, 19],      // Example: first image goes to position 7, second to 8, etc.
//                     'lemonade-stand': [8, 11, 14, 17, 19],
//                     'those-eyes': [7, 11, 12, 19, 22],
//                     'branded-moments': [13, 14, 15, 16],
//                     'american-scripture-project': [8, 10, 14, 19, 20]
//                 };
    
//                 moreInfoImages.forEach((img, index) => {
//                     // Get the target position number for this image
//                     const targetPosition = customPositions[brandName][index];
//                     // Find the corresponding grid position
//                     const pos = gridPositions.find(p => p.label === targetPosition.toString());
    
//                     // Start at center (behind main image)
//                     img.style.transform = 'translate(0, 0)';
//                     img.style.opacity = '0';
//                     img.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
//                 });
    
//                 // Add hover effect
//                 let showIndicators = false; //Set to false to hide indicators    
    
//                 item.querySelector('img:not(.more-info)').addEventListener('mouseenter', () => {
//                     // Show position indicators only if enabled
//                     if (showIndicators) {
//                         const indicators = positionIndicators.querySelectorAll('.position-indicator');
//                         indicators.forEach(indicator => {
//                             indicator.style.opacity = '1';
//                         });
//                     }
    
//                     // Move images
//                     moreInfoImages.forEach((img, index) => {
//                         const targetPosition = customPositions[brandName][index];
//                         const pos = gridPositions.find(p => p.label === targetPosition.toString());
    
//                         img.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
//                         img.style.opacity = '1';
//                     });
//                 });
    
//                 // On hover out
//                 item.querySelector('img:not(.more-info)').addEventListener('mouseleave', () => {
//                     // Hide position indicators only if enabled
//                     if (showIndicators) {
//                         const indicators = positionIndicators.querySelectorAll('.position-indicator');
//                         indicators.forEach(indicator => {
//                             indicator.style.opacity = '0';
//                         });
//                     }
    
//                     // Move images back
//                     moreInfoImages.forEach(img => {
//                         img.style.transform = 'translate(0, 0)';
//                         img.style.opacity = '0';
//                     });
//                 });
//                 //
//             });
//         });
    
//         //--------------Yellow Ketchup Section-------------------
//         (function() {
//             // Select the yellow ketchup section and image
//             const yellowSection = document.querySelector('.yellow-ketchup-section');
//             const yellowKetchupImg = yellowSection ? yellowSection.querySelector('img') : null;
    
//             // Editable variable: how far up (in px) the yellow ketchup image should move at max
//             const maxTranslateY = -400; // Adjust as needed for effect
    
//             function updateYellowKetchupPosition() {
//                 if (!yellowSection || !yellowKetchupImg) return;
    
//                 applyScrollTransform({
//                     element: yellowKetchupImg,
//                     container: yellowSection,
//                     maxTranslateY: maxTranslateY
//                 });
//             }
    
//             // Initial set
//             updateYellowKetchupPosition();
//             window.addEventListener('scroll', updateYellowKetchupPosition);
//             window.addEventListener('resize', updateYellowKetchupPosition);
//         })();
        
//         //--------------Testimonial scroll animation-------------------
//         (function() {
//             // Editable variable: how far down (in px) the testimonial should move at start
//             const testimonialStartOffset = 500; // Change this value for more/less movement
    
//             const yellowSection = document.querySelector('.yellow-ketchup-section');
//             const testimonial = document.querySelector('.testimonial');
//             if (!yellowSection || !testimonial) return;
    
    
    
//             function animateTestimonial() {
//                 const scrollY = window.scrollY || window.pageYOffset;
//                 const sectionTop = getOffsetTop(yellowSection);
//                 const sectionBottom = sectionTop + yellowSection.offsetHeight;
    
//                 // When does yellow-ketchup-section first enter the viewport?
//                 const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
//                 const sectionEnters = sectionTop - viewportHeight;
//                 const sectionHitsTop = sectionTop;
    
//                 if (scrollY < sectionEnters) {
//                     // Before yellow-ketchup-section enters, reset testimonial
//                     testimonial.style.transform = `translateY(0px)`;
//                 } else if (scrollY >= sectionEnters && scrollY < sectionHitsTop) {
//                     // Animate from offset to 0 as yellow-ketchup-section moves from entering to top
//                     const progress = (scrollY - sectionEnters) / (sectionHitsTop - sectionEnters);
//                     const clamped = Math.max(0, Math.min(1, progress));
//                     const translateY = testimonialStartOffset * (1 - clamped);
//                     testimonial.style.transform = `translateY(${translateY}px)`;
    
//                 } else {
//                     // When yellow-ketchup-section hits the top, testimonial at 0
//                     testimonial.style.transform = `translateY(0px)`;
    
//                 }
//             }
    
//             // Initial set
//             animateTestimonial();
//             window.addEventListener('scroll', animateTestimonial);
//             window.addEventListener('resize', animateTestimonial);
//         })();
    
//         //--------------masking out CTA text on scroll-------------------
//         const ctaTextBoxes = document.querySelectorAll('.CTA-container .width-box h2');
//         if (ctaTextBoxes && ketchupWrapper && ketchupHero) {
//             // Define start points as percentages of viewport height (0 = top, 100 = bottom)
//             // e.g. 60 means 60% down the viewport
//             const ctaStartPoints = [45, 45, 100, 100];
    
//             function updateCtaTextBoxClipPath() {
//                 const scrollY = window.scrollY;
//                 const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
//                 ctaTextBoxes.forEach((textBox, i) => {
//                     // Use the custom startPoint for this text box, or fallback to the first if not enough values
//                     const startPointPercent = ctaStartPoints[i] !== undefined ? ctaStartPoints[i] : ctaStartPoints[0];
//                     // Calculate the Y position in the document where the clip should "stick"
//                     const stickyClipY = scrollY + (startPointPercent / 100) * viewportHeight;
    
//                     // Get the top of the textBox in the document
//                     const textBoxRect = textBox.getBoundingClientRect();
//                     const textBoxTop = scrollY + textBoxRect.top;
//                     const textBoxHeight = textBox.offsetHeight;
    
//                     // The distance from the stickyClipY to the top of the textBox
//                     // If stickyClipY is above the textBox, insetBottom = textBoxHeight (fully masked)
//                     // If stickyClipY is below the bottom of the textBox, insetBottom = 0 (fully revealed)
//                     // Otherwise, insetBottom = textBoxTop + textBoxHeight - stickyClipY
//                     let insetBottom = textBoxTop + textBoxHeight - stickyClipY;
//                     insetBottom = Math.max(0, Math.min(textBoxHeight, insetBottom));
    
//                     textBox.style.clipPath = `inset(0 0 ${insetBottom}px 0)`;
//                 });
//             }
    
//             // Set initial state
//             updateCtaTextBoxClipPath();
//             window.addEventListener('scroll', updateCtaTextBoxClipPath);
//             window.addEventListener('resize', updateCtaTextBoxClipPath);
//         }
    
//         //--------------Black Background anim-------------------
//         const collabs = document.querySelector(".home-container");
//         const colorTrigger = document.querySelector(".adam-collab");
    
//         console.log('Color trigger element:', colorTrigger); // Debug log
    
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 console.log('Intersection detected:', entry.isIntersecting); // Debug log
//                 if (entry.isIntersecting) {
//                     collabs.classList.add("black-background");
//                 } else {
//                     collabs.classList.remove("black-background");
//                 }
//             });
//         });
    
//         observer.observe(colorTrigger);
        
//     }
    
//   } else {
//     // The screen is less than 1080px wide (not large)
//     console.log('Small screen!');
//     // Place your "not lg" JavaScript here
//   }
// }

// lgQuery.addEventListener('change', handleLgChange);
// handleLgChange(lgQuery);



// --------------Create white hero text for MOBILE------------------- //
function whiteHeroText() {
    const mainHeroText = document.querySelector('.p-child');

    
    //clone and modify the main text
        const clone = mainHeroText.cloneNode(true);
        clone.classList.add('clone');
        clone.style.color = 'var(--black)';
        clone.style.zIndex = '-2';
        mainHeroText.parentNode.insertBefore(clone, mainHeroText.nextSibling);
    //

    const ketchup = document.querySelector('.ketchup-parent');
    const mainTextOnly = document.querySelector('.p-child:not(.clone)');
    

    function updateHeroTextClip() {
        if (!ketchup || !mainTextOnly) return;

        const ketchupRect = ketchup.getBoundingClientRect();
        const textRect = mainHeroText.getBoundingClientRect();

        let top = ketchupRect.top - textRect.top;
        let bottom = textRect.bottom - ketchupRect.bottom;
        top = Math.max(0, Math.round(top));
        bottom = Math.max(0, Math.round(bottom));
        
        const clipPath = `inset(${top}px 0px ${bottom}px 0px)`;

        mainTextOnly.style.clipPath = clipPath;
        mainTextOnly.style.webkitClipPath = clipPath; // For Safari support
    }

    // Run once initially
    updateHeroTextClip();
    // Add event listener to update on scroll
    window.addEventListener('scroll', updateHeroTextClip);
}

// --------------Scrolling behavior for MOBILE hero section------------------- //
function mobileHeroScroll() {
  const pParent = document.querySelector('.p-parent');
  const ketchupParent = document.querySelector('.ketchup-parent');

  if (!pParent || !ketchupParent) return;

  // Step 2: Set initial transform
  pParent.style.transform = 'translateY(0vh)';

  const triggerLocation = 20;
  const calcTriggerLocation = window.innerHeight * (triggerLocation / 100);
  // Function to save distanceFromBottom at initial load state
  let initialDistanceFromBottom = null;
  function saveInitialDistanceFromBottom() {
    const ketchupRect = ketchupParent.getBoundingClientRect();
    initialDistanceFromBottom = calcTriggerLocation - ketchupRect.bottom;
  }

  // Save initial distance on load
  saveInitialDistanceFromBottom();

  function updateScrollAnimation() {
    if (initialDistanceFromBottom === null) {
      saveInitialDistanceFromBottom();
      if (initialDistanceFromBottom === null) return;
    }
    const ketchupRect = ketchupParent.getBoundingClientRect();
    const distanceFromBottom = calcTriggerLocation - ketchupRect.bottom;

    const progress = Math.min(Math.max(1 - (distanceFromBottom / initialDistanceFromBottom), 0), 1);  // Calculate progress based on the difference from initial
    const translateY = -60 * progress; // Step 5: translateY up to -60vh
    pParent.style.transform = `translateY(${translateY}vh)`; // Step 6: Clamp so it never exceeds -60vh
  }

  window.addEventListener('scroll', updateScrollAnimation); // Attach scroll listener
}

// --------------Scrolling behavior for MOBILE testimonial section------------------- //
function mobileTestimonialScroll () {
    const yellowParent = document.querySelector('.yellow-ketchup-section');
    const ketchup = document.querySelector('.mobile-yellow-ketchup-img');

    if (!yellowParent || !ketchup) return;

    let initialDistance = null;

    function onScroll() {
        const rect = yellowParent.getBoundingClientRect();
        // When the top of yellowParent reaches the top of the viewport (or above)
        if (rect.top <= 0) {
           
            if (initialDistance === null) {
                initialDistance = window.innerHeight - yellowParent.getBoundingClientRect().bottom;
            }

            const distanceFromBottom = window.innerHeight - yellowParent.getBoundingClientRect().bottom;
            const progress = Math.min(Math.max(1 - (distanceFromBottom / initialDistance), 0), 1);
            const translateY = -40 * progress;
            ketchup.style.transform = `translateY(${translateY}vh)`;

        }
    }

    window.addEventListener('scroll', onScroll);
  
}

// --------------Mobile Brand Section------------------- //
function mobileBrandScroll() {
    const letters = document.querySelector('.brand-letters');
    const brandImages = document.querySelector('.brands-content');
    const brandParent = document.querySelector('.brands-container');

    if (!letters || !brandParent) return;

    // Step 2: Set initial transform
    letters.style.transform = 'translateY(0vh)';

    // Function to save distanceFromBottom at initial load state
    let initialDistanceFromBottom = null;
    function saveInitialDistanceFromBottom() {
        // Trigger when brandParent reaches the top of the screen
        const brandRect = brandParent.getBoundingClientRect();

        if (brandRect.top <= 0) {
            // Measure distance from top of viewport to bottom of brandImages
            const imagesRect = brandImages.getBoundingClientRect();
            initialDistanceFromBottom = imagesRect.bottom;
        }
    }

    // Save initial distance on load
    saveInitialDistanceFromBottom();

    function updateScrollAnimation() {
        if (initialDistanceFromBottom === null) {
            saveInitialDistanceFromBottom();
            console.log('initial distance from bottom is:', initialDistanceFromBottom);
            if (initialDistanceFromBottom === null) return;
        }
        
        const imagesRect = brandImages.getBoundingClientRect();
        const distanceFromBottom = imagesRect.bottom;
        console.log('distance from bottom is:', distanceFromBottom);

        // Calculate progress: 0 when images are at initial position, 1 when images reach top
        const progress = Math.min(Math.max((initialDistanceFromBottom - distanceFromBottom) / initialDistanceFromBottom, 0), 1);
        const translateY = -120 * progress; 
        letters.style.transform = `translateY(${translateY}vh)`; 
        console.log(translateY);
    }

    window.addEventListener('scroll', updateScrollAnimation); // Attach scroll listener
}
  
// LG BREAKPOINT

// HERO--------------Scrolling behavior for LG hero text------------------- //
function lgHeroScroll() {
  const pParent = Array.from(document.querySelectorAll('.p-parent')).find(el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
  });

  const ketchupParent = Array.from(document.querySelectorAll('.ketchup-parent')).find(el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
  });

  if (!pParent || !ketchupParent) return;

  // Step 2: Set initial transform
  const initialTranslateY = 62;
  pParent.style.transform = `translateY(${initialTranslateY}vh)`;

  const triggerLocation = 10;
  const calcTriggerLocation = window.innerHeight * (triggerLocation / 100);
  // Function to save distanceFromBottom at initial load state
  let initialDistanceFromBottom = null;
  function saveInitialDistanceFromBottom() {
    const ketchupRect = ketchupParent.getBoundingClientRect();
    initialDistanceFromBottom = calcTriggerLocation - ketchupRect.bottom;
  }

  // Save initial distance on load
  saveInitialDistanceFromBottom();

  function updateScrollAnimation() {
    if (initialDistanceFromBottom === null) {
      saveInitialDistanceFromBottom();
      if (initialDistanceFromBottom === null) return;
    }
    const ketchupRect = ketchupParent.getBoundingClientRect();
    const distanceFromBottom = calcTriggerLocation - ketchupRect.bottom;
    const progress = Math.min(Math.max(1 - (distanceFromBottom / initialDistanceFromBottom), 0), 1);  // Calculate progress based on the difference from initial
    const translateY = initialTranslateY + -150 * progress; // Step 5: translateY up to -60vh
    pParent.style.transform = `translateY(${translateY}vh)`;

    
  }

  window.addEventListener('scroll', updateScrollAnimation); // Attach scroll listener
}

// HERO--------------Scale up ketchup on scroll for LG breakpoint------------------- //
function lgKetchupScale() {
    const ketchupParent = Array.from(document.querySelectorAll('.ketchup-parent')).find(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });

    if (!ketchupParent) return;

    // Set initial transform and CSS properties
    ketchupParent.style.transformOrigin = 'center center';
    ketchupParent.style.willChange = 'transform';
    ketchupParent.style.transform = 'translateX(-50%) scaleX(1) scaleY(1)';

    // Scaling parameters
    const maxScrollDistance = 60 * window.innerHeight / 100; // 195vh in pixels
    const scaleXMax = 100 / 60; // 1.6667
    const scaleYMax = 120 / 72; // 1.6667

    function updateKetchupScale() {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / maxScrollDistance, 1); // Clamp to 0-1

        // Calculate scales
        const scaleX = 1 + (scaleXMax - 1) * progress;
        const scaleY = 1 + (scaleYMax - 1) * progress;

        // Apply transform (combine translateX for centering with scaling)
        ketchupParent.style.transform = `translateX(-50%) scaleX(${scaleX}) scaleY(${scaleY})`;
    }

    // Initial call
    updateKetchupScale();

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', updateKetchupScale, { passive: true });
}

// HERO--------------Create black hero text for LG breakpoint------------------- //
function lgBlackHeroText() {
  const mainHeroText = document.querySelector('.hero-section-lg .p-child');

  if (!mainHeroText) return;
  
  // Clone and modify the main text
  const clone = mainHeroText.cloneNode(true);
  clone.classList.add('clone');
  mainHeroText.parentNode.insertBefore(clone, mainHeroText.nextSibling);

  const ketchup = document.querySelector('.hero-section-lg .ketchup-parent');
  const mainTextOnly = document.querySelector('.hero-section-lg .p-child:not(.clone)');
  

  function updateHeroTextClip() {
      if (!ketchup || !mainTextOnly) return;

      const ketchupRect = ketchup.getBoundingClientRect();
      const textRect = mainHeroText.getBoundingClientRect();

      let top = ketchupRect.top - textRect.top;
      let bottom = textRect.bottom - ketchupRect.bottom;
      let left = ketchupRect.left - textRect.left;
      let right = textRect.right - ketchupRect.right;

      top = Math.max(0, Math.round(top));
      bottom = Math.max(0, Math.round(bottom));
      left = Math.max(0, Math.round(left));
      right = Math.max(0, Math.round(right));
      
      const clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;

      mainTextOnly.style.clipPath = clipPath;
      mainTextOnly.style.webkitClipPath = clipPath; // For Safari support
  }

  // Run once initially
  updateHeroTextClip();
  // Add event listener to update on scroll
  window.addEventListener('scroll', updateHeroTextClip);
}

// HERO--------------Masking out hero type with scroll for LG breakpoint------------------- //
function lgHeroTextMask() {
    const textBoxes = document.querySelectorAll('.hero-section-lg .p-child h2');
    const blackText = document.querySelector('.hero-section-lg .p-child.clone');

    if (!textBoxes.length) return;

    // Custom start points for each text box (as a percentage of viewport height: 0 = top, 100 = bottom)
    // e.g. 47 means 47% down the viewport
    const startPoints = [22, 22, 32, 32];

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
            textBox.style.webkitClipPath = `inset(${insetTop}px 0 0 0)`; // For Safari support
        });

        // When scroll position is 1 full vh, the black text opacity turns to 0
        if (blackText) {
            if (scrollY >= (window.innerHeight || document.documentElement.clientHeight)) {
                blackText.style.opacity = "0";
            } else {
                blackText.style.opacity = "";
            }
        }
    }

    // Set initial state
    updateTextBoxClipPath();
    window.addEventListener('scroll', updateTextBoxClipPath);
    window.addEventListener('resize', updateTextBoxClipPath);
}

// CTA--------------Create grid layout for CTA container on LG breakpoint------------------- //
function lgCtaGrid() {
    const ctaContainer = document.querySelector('.CTA-container');
    const originalH2 = ctaContainer ? ctaContainer.querySelector('h2') : null;

    if (!ctaContainer || !originalH2) return;

    // Check if we already have the grid setup (to prevent duplicates)
    const existingGridH2s = ctaContainer.querySelectorAll('h2');
    if (existingGridH2s.length >= 4) return;

    // Clone the original h2 three more times to create four total
    for (let i = 0; i < 3; i++) {
        const clone = originalH2.cloneNode(true);
        ctaContainer.appendChild(clone);
    }
}

// HERO--------------Scale up ketchup on scroll for LG breakpoint------------------- //
function ketchupHeroScale () {
    const ketchupHero = document.querySelector('.ketchup-hero');
        const ketchupWrapper = document.querySelector('.ketchup-wrapper');
        if (ketchupHero && ketchupWrapper) {
    
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
}


// BRANDS--------------Scrolling behavior for desktop brands section------------------- //
function lgBrandScroll() {
  const letters = document.querySelector('.brand-letters');
  const brandImages = document.querySelector('.brands-content');
  const brandParent = document.querySelector('.brands-container');

  if (!letters || !brandParent) return;

  // Set initial transform
  letters.style.transform = 'translateY(0vh)';

  // Function to save distanceFromBottom at initial load state
  let initialDistanceFromBottom = null;
  function saveInitialDistanceFromBottom() {
      // Trigger when brandParent reaches the top of the screen
      const brandRect = brandParent.getBoundingClientRect();

      if (brandRect.top <= 0) {
          // Measure distance from top of viewport to bottom of brandImages
          const imagesRect = brandImages.getBoundingClientRect();
          initialDistanceFromBottom = imagesRect.bottom;
          // Log the total initial distance between the top of the screen and the bottom of brandImages
          console.log('Initial distance from top of screen to bottom of brandImages:', initialDistanceFromBottom);
      }
  }

  // Save initial distance on load
  saveInitialDistanceFromBottom();

  function updateScrollAnimation() {
      if (initialDistanceFromBottom === null) {
          saveInitialDistanceFromBottom();
          if (initialDistanceFromBottom === null) return;
      }
      
      const imagesRect = brandImages.getBoundingClientRect();
      const distanceFromBottom = imagesRect.bottom;
      console.log('Distance from top of screen to bottom of brandImages:', distanceFromBottom);
      // Calculate progress: 0 when images are at initial position, 1 when images reach top
      const progress = Math.min(Math.max((initialDistanceFromBottom - distanceFromBottom) / initialDistanceFromBottom, 0), 1);
      const translateY = -170 * progress; 
      letters.style.transform = `translateY(${translateY}vh)`; 
  }

  window.addEventListener('scroll', updateScrollAnimation); // Attach scroll listener
}

// BRANDS--------------Hover effect for brand images------------------- //
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

function lgBrandHover() {
    const brandItems = document.querySelectorAll('.brand-item');

    brandItems.forEach(item => {
        const mainImage = item.querySelector('img:not(.more-info)');
        const moreInfoImages = item.querySelectorAll('.more-info');
        const textDivs = item.querySelectorAll('div:not(.position-indicators)'); // Get text divs, excluding position indicators

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


        // Position each more-info image and text div
        // Get the brand name from the first image's class
        const brandName = item.querySelector('img:not(.more-info)').className;

        // Define custom positions for each brand's more-info images and text divs
        const customPositions = {
            'the-window': [7, 8, 14, 15, 17, 19, 18],      // Last position (13) is for the text div
            'lemonade-stand': [8, 11, 14, 17, 19, 12],     // Last position (16) is for the text div
            'those-eyes': [7, 11, 12, 19, 22, 18],         // Last position (18) is for the text div
            'branded-moments': [13, 14, 15, 16, 20],       // Last position (20) is for the text div
            'american-scripture-project': [8, 10, 14, 19, 20, 18] // Last position (21) is for the text div
        };

        // Position more-info images
        moreInfoImages.forEach((img, index) => {
            // Get the target position number for this image
            const targetPosition = customPositions[brandName][index];
            // Find the corresponding grid position
            const pos = gridPositions.find(p => p.label === targetPosition.toString());

            // Start at center (behind main image)
            img.style.transform = 'translate(0, 0)';
            img.style.opacity = '0';
        });

        // Position text divs
        textDivs.forEach((div, index) => {
            // Get the target position number for this text div (last position in the array)
            const targetPosition = customPositions[brandName][customPositions[brandName].length - 1];
            // Find the corresponding grid position
            const pos = gridPositions.find(p => p.label === targetPosition.toString());

            // Start at center (behind main image)
            div.style.transform = 'translate(0, 0)';
            div.style.opacity = '0';
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

            // Move text divs
            textDivs.forEach((div, index) => {
                const targetPosition = customPositions[brandName][customPositions[brandName].length - 1];
                const pos = gridPositions.find(p => p.label === targetPosition.toString());

                div.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                div.style.opacity = '1';
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

            // Move text divs back
            textDivs.forEach(div => {
                div.style.transform = 'translate(0, 0)';
                div.style.opacity = '0';
            });
        });
        //
    });
}
      

// YELLOW--------------Scrolling behavior for desktop testimonial section------------------- //
// function lgTestimonialScroll () {
//   const yellowParent = document.querySelector('.yellow-ketchup-section');
//   const ketchup = document.querySelector('.mobile-yellow-ketchup-img');

//   if (!yellowParent || !ketchup) return;

//   let initialDistance = null;

//   function onScroll() {
//       const rect = yellowParent.getBoundingClientRect();
//       // When the top of yellowParent reaches the top of the viewport (or above)
//       if (rect.top <= 0) {
         
//           if (initialDistance === null) {
//               initialDistance = window.innerHeight - yellowParent.getBoundingClientRect().bottom;
//           }

//           const distanceFromBottom = window.innerHeight - yellowParent.getBoundingClientRect().bottom;
//           const progress = Math.min(Math.max(1 - (distanceFromBottom / initialDistance), 0), 1);
//           const translateY = -40 * progress;
//           ketchup.style.transform = `translateY(${translateY}vh)`;

//       }
//   }

//   window.addEventListener('scroll', onScroll);

// }

// HOPEFULLY A SCROLL THAT FINALLY WORKS

function lgTestimonialScroll() {
  console.log("This is working:");
}

// CTA--------------Mask text in on scroll for desktop CTA section------------------- //
function lgCtaTextMask() {
  const textBoxes = document.querySelectorAll('.CTA-container h2');

  if (!textBoxes.length) return;

  // Custom start points for each text box (as a percentage of viewport height: 0 = top, 100 = bottom)
  // e.g. 47 means 47% down the viewport
  const startPoints = [65, 65, 90, 90];

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
          const textBoxHeight = textBox.offsetHeight;

          // The distance from the stickyClipY (in viewport) to the top of the textBox (in document)
          // As you scroll, the clip path should appear to stay at stickyClipY in the viewport
          let insetTop = Math.max(0, scrollY + stickyClipY - textBoxTop);
          
          // For masking IN, we want to reveal from top to bottom
          // So we start with the full height masked and reduce the insetTop as we scroll
          const revealProgress = Math.min(insetTop / textBoxHeight, 1);
          const insetBottom = textBoxHeight - (revealProgress * textBoxHeight);

          textBox.style.clipPath = `inset(0 0 ${insetBottom}px 0)`;
          textBox.style.webkitClipPath = `inset(0 0 ${insetBottom}px 0)`; // For Safari support
      });
  }

  // Set initial state
  updateTextBoxClipPath();
  window.addEventListener('scroll', updateTextBoxClipPath);
  window.addEventListener('resize', updateTextBoxClipPath);
}

// function smallSquare() {
//   // Set element height to the height of the document
//   const el = document.querySelector('.small-squares');
//   function resizeElement() {
//     el.style.height = document.documentElement.scrollHeight + 'px';
//   }
//   resizeElement();

//   function createSmallSquares() {
//     // Find or create the container for the squares
//     let container = document.querySelector('.small-squares');
//     if (!container) {
//       container = document.createElement('div');
//       container.className = 'small-squares';
//       document.body.appendChild(container);
//     }

//     // Remove any existing squares to avoid duplicates
//     container.innerHTML = '';

//     for (let i = 0; i < 20; i++) {
//       const square = document.createElement('div');
//       square.style.width = '1.2rem';
//       square.style.height = '1.2rem';
//       square.style.background = 'black';
//       // Randomly position within the container
//       square.style.zIndex = '10';
//       container.appendChild(square);
//     }
//   }

//   createSmallSquares();
// }


// window.addEventListener('resize', smallSquare);
// window.addEventListener('load', smallSquare);

// ------------- Master responsive function, runs everything! ------------- //
function setupResponsiveJS() {
    
    const breakpoints = {
      sm: window.matchMedia("(min-width: 430px)"),
      md: window.matchMedia("(min-width: 768px)"),
      lg: window.matchMedia("(min-width: 1024px)"),
      xl: window.matchMedia("(min-width: 1280px)")
    };
  
    function applyJS() {
        // Always reset scroll position
        window.scrollTo(0, 0);
        
        // Clear any existing event listeners to prevent duplicates
        window.removeEventListener('scroll', whiteHeroText);
        window.removeEventListener('scroll', mobileHeroScroll);
        window.removeEventListener('scroll', mobileTestimonialScroll);
        
        if (breakpoints.xl.matches) {
            // XL and above - Desktop behavior
            console.log('XL breakpoint active');
            // Add desktop-specific JS here
            ketchupHeroScale();
            lgHeroScroll();
            lgKetchupScale();
            lgBlackHeroText();
            lgHeroTextMask();
            lgCtaGrid(); // Added lgCtaGrid
            lgCtaTextMask(); // Added lgCtaTextMask
            lgBrandScroll();
            lgBrandHover(); // Added lgBrandHover
            lgTestimonialScroll();

            
        } else if (breakpoints.lg.matches) {
            // LG breakpoint - Desktop behavior
            console.log('LG breakpoint active');
            // Add desktop-specific JS here
            ketchupHeroScale();
            lgHeroScroll();
            lgKetchupScale();
            lgBlackHeroText();
            lgHeroTextMask();
            lgCtaGrid(); // Added lgCtaGrid
            lgCtaTextMask(); // Added lgCtaTextMask
            lgBrandScroll();
            lgBrandHover(); // Added lgBrandHover
            lgTestimonialScroll();

            
        } else if (breakpoints.md.matches) {
            // MD breakpoint - Tablet behavior
            console.log('MD breakpoint active');
            mobileHeroScroll();
            mobileTestimonialScroll();
            whiteHeroText();
            mobileBrandScroll();

        } else {
            // SM and below - Mobile behavior
            console.log('SM breakpoint active - Mobile');
            mobileHeroScroll();
            mobileTestimonialScroll();
            whiteHeroText();
        }
    }
  
    // Listen for screen size changes
    Object.values(breakpoints).forEach(mq => {
      mq.addEventListener('change', applyJS); // Fixed function name
    });
  
    // Run once on load
    applyJS();
}

window.addEventListener('DOMContentLoaded', function() {
    setupResponsiveJS();
});