// Only run script if .home-container is present
if (document.querySelector('.home-container')) {
    
    
    // //Duplicate row-holder div with red text
    // document.addEventListener('DOMContentLoaded', () => {
    //     const fourRepeatType = document.querySelector('.four-repeat-type');
    //     const homeContainer = document.querySelector('.home-container');
    //     const clone = fourRepeatType.cloneNode(true);

    //     // // Style the clone
    //     clone.style.position = 'absolute';
    //     clone.style.width = '100%';
    //     clone.style.color = 'red';
    //     clone.style.zIndex = '2';

    //     // Insert the clone inside ketchup-wrapper
    //     homeContainer.appendChild(clone);
    // });



    const ketchupHero = document.querySelector('.ketchup-hero');
    const ketchupWrapper = document.querySelector('.ketchup-wrapper');

    //this function controls the ketchup scaling animation
    if (ketchupHero && ketchupWrapper) {
      // Ensure ketchupHero is sticky
      ketchupHero.style.position = 'sticky';

      // Parameters for scaling and top position
      const endScale = 1.0;
      const startScale = 0.60;
      const endPoint = .35; // as a % of the total distance for scaling
      const maxTop = 60; // vh, starting top value
      const minTop = 0;  // vh, ending top value
      const topEndPoint = 0.35; // as a % of the total distance for top value

      //------------DO NOT TOUCH BELOW THIS LINE - I don't know what it does but it works --------------------------------------------------------------

      // Helper to get progress (0 to 1) based on scroll relative to ketchupWrapper height
      function getProgress() {
        const wrapperHeight = ketchupWrapper.offsetHeight;
        const scrollY = window.scrollY;
        // Use the height of the ketchupWrapper as the scrollable distance
        return Math.min(scrollY / wrapperHeight, 1);
      }

      // Set top and scale based on scroll
      function updateKetchupHero() {
        const progress = getProgress();

        // Top position interpolation with its own endpoint
        const clampedTopProgress = Math.min(progress, topEndPoint);
        const topVH = maxTop - (maxTop - minTop) * (clampedTopProgress / topEndPoint);
        ketchupHero.style.top = `${topVH}vh`;

        // Scale interpolation
        const clampedScaleProgress = Math.min(progress, endPoint);
        const scale = startScale + (endScale - startScale) * (clampedScaleProgress / endPoint);
        ketchupHero.style.transform = `scale(${scale})`;
      }

      updateKetchupHero();
      window.addEventListener('scroll', updateKetchupHero);
    }

    //mask function
    // Select only .width-box elements that are NOT inside .CTA-container
    const textBoxes = document.querySelectorAll('.width-box:not(.CTA-container .width-box) h2');

    if (textBoxes && ketchupWrapper && ketchupHero) {
        // Start point: progress before this = no mask, after this = mask grows
        const startPoint = 0.65;
        
        function updateTextBoxClipPath() {
            const scrollY = window.scrollY;
            const wrapperHeight = ketchupWrapper.offsetHeight;
            
            // Calculate the scroll position where the mask should start
            const startScrollPosition = startPoint * wrapperHeight;
            
            let insetTop;
            if (scrollY < startScrollPosition) {
                // Before start point, no mask
                insetTop = 0;
            } else {
                // After start point, insetTop increases 1:1 with scroll position
                // Calculate how much we've scrolled past the start point
                const scrollPastStart = scrollY - startScrollPosition;
                insetTop = scrollPastStart;
            }

            // textBox is just the name of the parameter in the forEach callback below.
            // It refers to each individual element in the textBoxes NodeList.
            textBoxes.forEach(function(textBox) {
                textBox.style.clipPath = `inset(${insetTop}px 0 0 0)`;
            });
        }

        // Set initial state
        updateTextBoxClipPath();
        window.addEventListener('scroll', () => {
            updateTextBoxClipPath();
        });
    
    }
   
    

    // For the black background
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
    //End of black background


    // For the brand hover effect
    document.addEventListener('DOMContentLoaded', () => {
        const brandItems = document.querySelectorAll('.brand-item');

        brandItems.forEach(item => {
            const mainImage = item.querySelector('img:not(.more-info)');
            const moreInfoImages = item.querySelectorAll('.more-info');

            // Calculate movement based on image width plus gap
            const imageWidth = mainImage.offsetWidth;
            const movement = imageWidth + 28; // 28px is 1.75rem gap

            // Calculate grid positions based on the image width and gap
            const gridPositions = [
                // Outer ring (16 positions)
                { x: -(2 * movement), y: -(2 * movement), label: '1' },  // far top left
                { x: -movement, y: -(2 * movement), label: '2' },      // top left outer
                { x: 0, y: -(2 * movement), label: '3' },              // top center outer
                { x: movement, y: -(2 * movement), label: '4' },       // top right outer
                { x: (2 * movement), y: -(2 * movement), label: '5' },   // far top right
                { x: -(2 * movement), y: -movement, label: '6' },      // left top outer
                { x: -movement, y: -movement, label: '7' },          // top left
                { x: 0, y: -movement, label: '8' },                  // top center
                { x: movement, y: -movement, label: '9' },           // top right
                { x: (2 * movement), y: -movement, label: '10' },      // right top outer
                { x: -(2 * movement), y: 0, label: '11' },             // left center outer
                { x: -movement, y: 0, label: '12' },                 // left center
                { x: movement, y: 0, label: '14' },                  // right center
                { x: (2 * movement), y: 0, label: '15' },              // right center outer
                { x: -(2 * movement), y: movement, label: '16' },      // left bottom outer
                { x: -movement, y: movement, label: '17' },          // bottom left
                { x: 0, y: movement, label: '18' },                  // bottom center
                { x: movement, y: movement, label: '19' },           // bottom right
                { x: (2 * movement), y: movement, label: '20' },       // right bottom outer
                { x: -(2 * movement), y: (2 * movement), label: '21' },  // far bottom left
                { x: -movement, y: (2 * movement), label: '22' },      // bottom left outer
                { x: 0, y: (2 * movement), label: '23' },              // bottom center outer
                { x: movement, y: (2 * movement), label: '24' },       // bottom right outer
                { x: (2 * movement), y: (2 * movement), label: '25' },   // far bottom right
                { x: 0, y: 0, label: '25' }                          // center (original position)
            ];

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
}
