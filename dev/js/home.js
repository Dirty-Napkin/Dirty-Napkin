/* ===== HOME PAGE JAVASCRIPT ===== */

// Media query for large screens
const lgQuery = window.matchMedia('(min-width: 1080px)');

// ===== CONSTANTS AND CONFIGURATION =====

// Custom positions for brand hover effects
const BRAND_CUSTOM_POSITIONS = {
    'the-window': [7, 8, 14, 15, 17, 19, 18],
    'lemonade-stand': [8, 11, 14, 17, 19, 12],
    'those-eyes': [7, 11, 12, 19, 22, 18],
    'branded-moments': [13, 14, 15, 16, 20],
    'american-scripture-project': [8, 10, 14, 19, 20, 18]
};

// ===== HELPER FUNCTIONS =====

// Generic scroll animation helper
function setupScrollAnimation({ element, saveInitialFn, updateFn }) {
    let initialDistanceFromBottom = null;
    
    function saveInitialDistance() {
        initialDistanceFromBottom = saveInitialFn();
    }
    
    function updateAnimation() {
        if (initialDistanceFromBottom === null) {
            saveInitialDistance();
            if (initialDistanceFromBottom === null) return;
        }
        updateFn(initialDistanceFromBottom);
    }
    
    // Save initial distance on load
    saveInitialDistance();
    
    // Return the update function for registration
    return updateAnimation;
}

// Consolidated scroll event listener
const scrollHandlers = new Set();
function addScrollHandler(handler) {
    scrollHandlers.add(handler);
}

// Single scroll listener that calls all registered handlers
window.addEventListener('scroll', () => {
    scrollHandlers.forEach(handler => handler());
}, { passive: true });

// Helper to create position indicator DOM elements
function createPositionIndicator(pos, imageWidth) {
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
    return indicator;
}

// Helper to move elements back to center
function moveElementsToCenter(elements) {
    elements.forEach(element => {
        element.style.transform = 'translate(0, 0)';
        element.style.opacity = '0';
    });
}

// ===== HERO TEXT CLIP FUNCTIONS =====

// Unified hero text clip function
function setupHeroTextClip(options) {
    const { heroSelector, ketchupSelector, cloneStyles, clipDirection } = options;
    
    const mainHeroText = document.querySelector(heroSelector);
    if (!mainHeroText) return;
    
    // Clone and modify the main text
    const clone = mainHeroText.cloneNode(true);
    clone.classList.add('clone');
    Object.assign(clone.style, cloneStyles);
    mainHeroText.parentNode.insertBefore(clone, mainHeroText.nextSibling);

    const ketchup = document.querySelector(ketchupSelector);
    const mainTextOnly = document.querySelector(`${heroSelector}:not(.clone)`);

    function updateHeroTextClip() {
        if (!ketchup || !mainTextOnly) return;

        const ketchupRect = ketchup.getBoundingClientRect();
        const textRect = mainHeroText.getBoundingClientRect();

        let top = ketchupRect.top - textRect.top;
        let bottom = textRect.bottom - ketchupRect.bottom;
        let left = 0, right = 0;
        
        if (clipDirection === "both") {
            left = ketchupRect.left - textRect.left;
            right = textRect.right - ketchupRect.right;
        }

        top = Math.max(0, Math.round(top));
        bottom = Math.max(0, Math.round(bottom));
        left = Math.max(0, Math.round(left));
        right = Math.max(0, Math.round(right));
        
        const clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;

        mainTextOnly.style.clipPath = clipPath;
        mainTextOnly.style.webkitClipPath = clipPath;
    }

    // Run once initially
    updateHeroTextClip();
    // Add to scroll handlers
    addScrollHandler(updateHeroTextClip);
}

// ===== BRAND SCROLL FUNCTIONS =====

// Unified brand scroll function
function setupBrandScroll({ translateMax }) {
    const letters = document.querySelector('.brand-letters');
    const brandImages = document.querySelector('.brands-content');
    const brandParent = document.querySelector('.brands-container');

    if (!letters || !brandParent) return;

    // Set initial transform
    letters.style.transform = 'translateY(0vh)';

    const updateAnimation = setupScrollAnimation({
        element: letters,
        saveInitialFn: () => {
            const brandRect = brandParent.getBoundingClientRect();
            if (brandRect.top <= 0) {
                const imagesRect = brandImages.getBoundingClientRect();
                return imagesRect.bottom;
            }
            return null;
        },
        updateFn: (initialDistanceFromBottom) => {
            const imagesRect = brandImages.getBoundingClientRect();
            const distanceFromBottom = imagesRect.bottom;
            const progress = Math.min(Math.max((initialDistanceFromBottom - distanceFromBottom) / initialDistanceFromBottom, 0), 1);
            const translateY = translateMax * progress;
            letters.style.transform = `translateY(${translateY}vh)`;
        }
    });

    addScrollHandler(updateAnimation);
}

// ===== MOBILE FUNCTIONS =====

// Scrolling behavior for mobile hero section
function mobileHeroScroll() {
    const pParent = document.querySelector('.p-parent');
    const ketchupParent = document.querySelector('.ketchup-parent');

    if (!pParent || !ketchupParent) return;

    // Set initial transform
    pParent.style.transform = 'translateY(0vh)';

    const triggerLocation = 20;
    const calcTriggerLocation = window.innerHeight * (triggerLocation / 100);

    const updateAnimation = setupScrollAnimation({
        element: pParent,
        saveInitialFn: () => {
            const ketchupRect = ketchupParent.getBoundingClientRect();
            return calcTriggerLocation - ketchupRect.bottom;
        },
        updateFn: (initialDistanceFromBottom) => {
            const ketchupRect = ketchupParent.getBoundingClientRect();
            const distanceFromBottom = calcTriggerLocation - ketchupRect.bottom;
            const progress = Math.min(Math.max(1 - (distanceFromBottom / initialDistanceFromBottom), 0), 1);
            const translateY = -60 * progress;
            pParent.style.transform = `translateY(${translateY}vh)`;
        }
    });

    addScrollHandler(updateAnimation);
}

// Scrolling behavior for mobile testimonial section
function mobileTestimonialScroll() {
    const yellowParent = document.querySelector('.yellow-ketchup-section');
    const ketchup = document.querySelector('.mobile-yellow-ketchup-img');

    if (!yellowParent || !ketchup) return;

    let initialDistance = null;

    function onScroll() {
        const rect = yellowParent.getBoundingClientRect();
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

    addScrollHandler(onScroll);
}

// ===== DESKTOP FUNCTIONS =====

// Scrolling behavior for desktop hero text
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
    
    // Set initial transform
    const initialTranslateY = 62;
    pParent.style.transform = `translateY(${initialTranslateY}vh)`;

    const triggerLocation = 10;
    const calcTriggerLocation = window.innerHeight * (triggerLocation / 100);

    const updateAnimation = setupScrollAnimation({
        element: pParent,
        saveInitialFn: () => {
            const ketchupRect = ketchupParent.getBoundingClientRect();
            return calcTriggerLocation - ketchupRect.bottom;
        },
        updateFn: (initialDistanceFromBottom) => {
            const ketchupRect = ketchupParent.getBoundingClientRect();
            const distanceFromBottom = calcTriggerLocation - ketchupRect.bottom;
            const progress = Math.min(Math.max(1 - (distanceFromBottom / initialDistanceFromBottom), 0), 1);
            const translateY = initialTranslateY + -165 * progress;
            pParent.style.transform = `translateY(${translateY}vh)`;
        }
    });

    addScrollHandler(updateAnimation);
}

// Scale up ketchup on scroll for desktop
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
    const maxScrollDistance = 60 * window.innerHeight / 100;
    const scaleXMax = 100 / 60;
    const scaleYMax = 120 / 72;

    function updateKetchupScale() {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / maxScrollDistance, 1);

        const scaleX = 1 + (scaleXMax - 1) * progress;
        const scaleY = 1 + (scaleYMax - 1) * progress;

        ketchupParent.style.transform = `translateX(-50%) scaleX(${scaleX}) scaleY(${scaleY})`;
    }

    // Initial call
    updateKetchupScale();
    addScrollHandler(updateKetchupScale);
}

// Masking out hero type with scroll for desktop
function lgHeroTextMask() {
    const textBoxes = document.querySelectorAll('.hero-section-lg .p-child h2');
    const blackText = document.querySelector('.hero-section-lg .p-child.clone');

    if (!textBoxes.length) return;

    const startPoints = [22, 22, 32, 32];

    function updateTextBoxClipPath() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        textBoxes.forEach((textBox, i) => {
            const startPointPercent = startPoints[i] !== undefined ? startPoints[i] : startPoints[0];
            const stickyClipY = (startPointPercent / 100) * viewportHeight;

            const textBoxRect = textBox.getBoundingClientRect();
            const textBoxTop = scrollY + textBoxRect.top;

            let insetTop = Math.max(0, scrollY + stickyClipY - textBoxTop);

            textBox.style.clipPath = `inset(${insetTop}px 0 0 0)`;
            textBox.style.webkitClipPath = `inset(${insetTop}px 0 0 0)`;
        });

        if (blackText) {
            if (scrollY >= (window.innerHeight || document.documentElement.clientHeight)) {
                blackText.style.opacity = "0";
            } else {
                blackText.style.opacity = "";
            }
        }
    }

    updateTextBoxClipPath();
    addScrollHandler(updateTextBoxClipPath);
    window.addEventListener('resize', updateTextBoxClipPath);
}

// Create grid layout for CTA container on desktop
function lgCtaGrid() {
    const ctaContainer = document.querySelector('.CTA-container');
    const originalH2 = ctaContainer ? ctaContainer.querySelector('h2') : null;

    if (!ctaContainer || !originalH2) return;

    const existingGridH2s = ctaContainer.querySelectorAll('h2');
    if (existingGridH2s.length >= 4) return;

    for (let i = 0; i < 3; i++) {
        const clone = originalH2.cloneNode(true);
        ctaContainer.appendChild(clone);
    }
}

// Helper function to generate grid positions for brand hover effects
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

// Hover effect for brand images on desktop
function lgBrandHover() {
    const brandItems = document.querySelectorAll('.brand-item');

    brandItems.forEach(item => {
        const mainImage = item.querySelector('img:not(.more-info)');
        const moreInfoImages = item.querySelectorAll('.more-info');
        const textDivs = item.querySelectorAll('div:not(.position-indicators)');

        if (!mainImage) return;

        const imageWidth = mainImage.offsetWidth;
        const movement = imageWidth + 28;
        const gridPositions = generateGridPositions(movement, imageWidth);

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
            const indicator = createPositionIndicator(pos, imageWidth);
            positionIndicators.appendChild(indicator);
        });

        const brandName = mainImage.className;
        const customPositions = BRAND_CUSTOM_POSITIONS[brandName];

        if (!customPositions) {
            console.warn('No custom positions found for brand:', brandName);
            return;
        }

        // Position more-info images
        moreInfoImages.forEach((img, index) => {
            img.style.transform = 'translate(0, 0)';
            img.style.opacity = '0';
        });

        // Position text divs
        textDivs.forEach((div, index) => {
            div.style.transform = 'translate(0, 0)';
            div.style.opacity = '0';
        });

        // Add hover effect
        let showIndicators = false;

        mainImage.addEventListener('mouseenter', () => {
            if (showIndicators) {
                const indicators = positionIndicators.querySelectorAll('.position-indicator');
                indicators.forEach(indicator => {
                    indicator.style.opacity = '1';
                });
            }

            // Move images
            moreInfoImages.forEach((img, index) => {
                const targetPosition = customPositions[index];
                const pos = gridPositions.find(p => p.label === targetPosition.toString());
                img.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                img.style.opacity = '1';
            });

            // Move text divs
            textDivs.forEach((div, index) => {
                const targetPosition = customPositions[customPositions.length - 1];
                const pos = gridPositions.find(p => p.label === targetPosition.toString());
                div.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                div.style.opacity = '1';
            });
        });

        mainImage.addEventListener('mouseleave', () => {
            if (showIndicators) {
                const indicators = positionIndicators.querySelectorAll('.position-indicator');
                indicators.forEach(indicator => {
                    indicator.style.opacity = '0';
                });
            }

            moveElementsToCenter([...moreInfoImages, ...textDivs]);
        });
    });
}

// Desktop testimonial scroll function
function lgTestimonialScroll() {
    const yellowSection = document.querySelector('.yellow-ketchup-section');
    if (yellowSection) {
        let animationStarted = false;
        let initialBottom = null;
        
        function updateTestimonial() {
            const rect = yellowSection.getBoundingClientRect();
            const yellowTop = rect.top;
            const yellowBottom = rect.bottom;
            const ketchup = document.querySelector('.mobile-yellow-ketchup-img');
            
            if (yellowTop <= 0 && !animationStarted) {
                initialBottom = yellowBottom;
                animationStarted = true;
            }
            
            if (yellowTop > 0) {
                animationStarted = false;
                initialBottom = null;
                ketchup.style.transform = 'translateY(0em)';
                return;
            }
            
            if (animationStarted && initialBottom !== null) {
                const screenHeight = window.innerHeight || document.documentElement.clientHeight;
                const screenLocation = 100;
                const distanceMoved = Math.min(initialBottom - (screenHeight * screenLocation/100), initialBottom - yellowBottom);
                const translateY = Math.max(0, distanceMoved * 0.03);
                
                ketchup.style.transform = `translateY(${-translateY}em)`;
            }
        }
        
        addScrollHandler(updateTestimonial);
    }
}

// Mask text in on scroll for desktop CTA section
function lgCtaTextMask() {
    const textBoxes = document.querySelectorAll('.CTA-container h2');

    if (!textBoxes.length) return;

    const startPoints = [65, 65, 90, 90];

    function updateTextBoxClipPath() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        textBoxes.forEach((textBox, i) => {
            const startPointPercent = startPoints[i] !== undefined ? startPoints[i] : startPoints[0];
            const stickyClipY = (startPointPercent / 100) * viewportHeight;

            const textBoxRect = textBox.getBoundingClientRect();
            const textBoxTop = scrollY + textBoxRect.top;
            const textBoxHeight = textBox.offsetHeight;

            let insetTop = Math.max(0, scrollY + stickyClipY - textBoxTop);
            
            const revealProgress = Math.min(insetTop / textBoxHeight, 1);
            const insetBottom = textBoxHeight - (revealProgress * textBoxHeight);

            textBox.style.clipPath = `inset(0 0 ${insetBottom}px 0)`;
            textBox.style.webkitClipPath = `inset(0 0 ${insetBottom}px 0)`;
        });
    }

    updateTextBoxClipPath();
    addScrollHandler(updateTextBoxClipPath);
    window.addEventListener('resize', updateTextBoxClipPath);
}

function smallSquares() {
    const smallSquares = document.querySelector('.small-squares');
    if (!smallSquares) return;

    // Clear existing elements
    smallSquares.innerHTML = '';
    // Set container height to match document height
    smallSquares.style.height = document.documentElement.scrollHeight + 'px';

    // Create 15 black squares, each 1.2rem x 1.2rem
    for (let i = 0; i < 17; i++) {
        const square = document.createElement('div');
        square.style.width = '1.2rem';
        square.style.height = '1.2rem';
        square.style.background = 'black';
        square.style.gridRow = '';
        square.style.gridColumn = '';
        smallSquares.appendChild(square);
    }


}

// ===== LEGACY FUNCTIONS (KEPT FOR COMPATIBILITY) =====

// Legacy ketchup hero scale function
function ketchupHeroScale() {
    const ketchupHero = document.querySelector('.ketchup-hero');
    const ketchupWrapper = document.querySelector('.ketchup-wrapper');
    
    if (ketchupHero && ketchupWrapper) {
        const endScale = 1.0;
        const startScale = 0.60;
        const endPoint = 0.35;
        const maxTop = 60;
        const minTop = 0;
        const topEndPoint = 0.35;
        const postEndTranslateY = -300;
        const afterStickyTranslateY = 100;

        function getProgress() {
            const wrapperHeight = ketchupWrapper.offsetHeight;
            const scrollY = window.scrollY;
            return Math.min(scrollY / wrapperHeight, 1);
        }

        function getPostEndProgress() {
            const wrapperHeight = ketchupWrapper.offsetHeight;
            const scrollY = window.scrollY;
            const endScroll = endPoint * wrapperHeight;
            const postEndRange = wrapperHeight - endScroll;
            if (scrollY <= endScroll) return 0;
            if (postEndRange <= 0) return 1;
            return Math.min((scrollY - endScroll) / postEndRange, 1);
        }

        function getStickyBounds() {
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

        function updateKetchupHero() {
            const progress = getProgress();

            const clampedTopProgress = Math.min(progress, topEndPoint);
            const topVH = maxTop - (maxTop - minTop) * (clampedTopProgress / topEndPoint);
            ketchupHero.style.top = `${topVH}vh`;

            const clampedScaleProgress = Math.min(progress, endPoint);
            const scale = startScale + (endScale - startScale) * (clampedScaleProgress / endPoint);

            const scrollY = window.scrollY;
            const { stickyStart, stickyEnd } = getStickyBounds();

            let translateY = 0;
            if (progress <= endPoint) {
                ketchupHero.style.transform = `scale(${scale})`;
            } else if (scrollY < stickyEnd) {
                const postEndProgress = getPostEndProgress();
                translateY = postEndTranslateY * postEndProgress;
                ketchupHero.style.transform = `scale(${endScale}) translateY(${translateY}px)`;
            } else {
                const wrapperHeight = ketchupWrapper.offsetHeight;
                const endScroll = endPoint * wrapperHeight;
                const postEndRange = wrapperHeight - endScroll;
                let translateYAtStickyEnd = 0;
                if (postEndRange > 0) {
                    translateYAtStickyEnd = postEndTranslateY * ((stickyEnd - endScroll) / postEndRange);
                    if (translateYAtStickyEnd < postEndTranslateY) translateYAtStickyEnd = postEndTranslateY;
                    if (translateYAtStickyEnd > 0) translateYAtStickyEnd = 0;
                }

                const afterRange = ketchupHero.offsetHeight * 1.2;
                const afterProgress = Math.min(
                    Math.max((scrollY - stickyEnd) / afterRange, 0),
                    1
                );
                translateY = translateYAtStickyEnd + afterStickyTranslateY * afterProgress;
                ketchupHero.style.transform = `scale(${endScale}) translateY(${translateY}px)`;
            }
        }

        updateKetchupHero();
        addScrollHandler(updateKetchupHero);
        window.addEventListener('resize', updateKetchupHero);
    }

    //--------------Masking out hero type with scroll-------------------
    const textBoxes = document.querySelectorAll('.width-box:not(.CTA-container .width-box) h2');
    if (textBoxes && ketchupWrapper && ketchupHero) {
        // Custom start points for each text box (as a fraction of wrapper height)
        // Adjust these values as needed for your design
        const startPoints = [0.47, 0.47, 0.67, 0.67];

        function updateTextBoxClipPath() {
            const scrollY = window.scrollY;
            const wrapperHeight = ketchupWrapper.offsetHeight;

            textBoxes.forEach((textBox, i) => {
                // Use the custom startPoint for this text box, or fallback to the first if not enough values
                const startPoint = startPoints[i] !== undefined ? startPoints[i] : startPoints[0];
                const startScroll = startPoint * wrapperHeight;
                const insetTop = Math.max(0, scrollY - startScroll);
                textBox.style.clipPath = `inset(${insetTop}px 0 0 0)`;
            });
        }

        // Set initial state
        updateTextBoxClipPath();
        window.addEventListener('scroll', updateTextBoxClipPath);
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

    //--------------Brands large type movement-------------------
    (function() {
        const brandLetters = document.querySelector('.brand-letters');
        const brandsContainer = document.querySelector('.brands-container');
        if (!brandLetters || !brandsContainer) return;

        // Editable variable: how far up (in px) brand-letters should move at max
        const maxTranslateY = -1100; // Change this value for more/less movement

        function updateBrandLettersPosition() {
            applyScrollTransform({
                element: brandLetters,
                container: brandsContainer,
                maxTranslateY: maxTranslateY
            });
        }

        // Initial set
        updateBrandLettersPosition();
        window.addEventListener('scroll', updateBrandLettersPosition);
        window.addEventListener('resize', updateBrandLettersPosition);
    })();    

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
    //--------------Masking out hero type with scroll-------------------
    // Masking out CTA text on scroll (inset decreases from bottom as you scroll)
    const ctaTextBoxes = document.querySelectorAll('.CTA-container .width-box h2');
    if (ctaTextBoxes && ketchupWrapper && ketchupHero) {
        // Custom start points for each CTA text box (as a fraction of wrapper height)
        // Adjust these values as needed for your design
        const ctaStartPoints = [2.74, 2.74, 0, 0];

        function updateCtaTextBoxClipPath() {
            const scrollY = window.scrollY;
            const wrapperHeight = ketchupWrapper.offsetHeight;

            ctaTextBoxes.forEach((textBox, i) => {
                // Use the custom startPoint for this text box, or fallback to the first if not enough values
                const startPoint = ctaStartPoints[i] !== undefined ? ctaStartPoints[i] : ctaStartPoints[0];
                const startScroll = startPoint * wrapperHeight;
                // As scroll increases, insetBottom decreases from full height to 0
                const textBoxHeight = textBox.offsetHeight;
                let insetBottom = Math.max(0, textBoxHeight - Math.max(0, scrollY - startScroll));
                // Clamp to textBoxHeight so it never goes negative
                insetBottom = Math.min(textBoxHeight, insetBottom);
                textBox.style.clipPath = `inset(0 0 ${insetBottom}px 0)`;
            });
        }

        // Set initial state
        updateCtaTextBoxClipPath();
        window.addEventListener('scroll', updateCtaTextBoxClipPath);
    }
}