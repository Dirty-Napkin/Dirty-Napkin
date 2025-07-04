/*-----------------/
Puzzle type animations

- Add the class "puzzle-type" to any text you want this effect applied to
- Add the class "puzzle-hover" if you want the effect to apply on hover (for nav)
- Add the class "puzzle-auto" if you want the effect to play on load (for page titles)

/-----------------*/

document.addEventListener("DOMContentLoaded", () => {
    const textElements = document.querySelectorAll(".puzzle-type")
    

    textElements.forEach((textElement) => {
    // Here is where to adjust the spacing of the grid, if you want the tracking to be more or less

    /* --------------------------------------------------------------------------------
    
    Here I need to fix the spacing Factor so that it can scale proportionally based on screen size in addition to the font size scaling.

    It works well on page load, but if you scale the browswer while you're using it, the spacing does not change. Maybe this is an issue we don't worry about fixing?

    -----------------------------------------------------------------------------------*/
    
        const spacingFactor = .75;
        const spacingTranslate = 13;

        // Function to wrap each letter in a span
        function wrapLetters(element) {
            // Store the original text before any manipulation
            let originalText = element.dataset.originalText;
            if (!originalText) {
                originalText = element.textContent;
                element.dataset.originalText = originalText;
            }
            
            // Remove all child spans (reset) but preserve the original text
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            
            // Word wrapping logic - only for project titles
            let rows = [];
            let extraTopRow = false;
            if (element.classList.contains("project-title")) {
                const charCount = originalText.length;
                
                if (charCount <= 10) {
                    // Single line on row 4 (bottom row)
                    rows = [originalText];
                } else {
                    // Split into two lines - words on row 3 and row 4
                    const words = originalText.split(' ');
                    
                    if (words.length === 1) {
                        // Single word longer than 10 chars - split it
                        const midPoint = Math.ceil(originalText.length / 2);
                        rows = [
                            originalText.substring(0, midPoint),
                            originalText.substring(midPoint)
                        ];
                    } else {
                        // Multiple words - find the best split point
                        let firstLine = '';
                        let secondLine = '';
                        
                        // Try to balance the lines by putting more words on the bottom
                        const totalWords = words.length;
                        const wordsForFirstLine = Math.floor(totalWords / 2);
                        
                        firstLine = words.slice(0, wordsForFirstLine).join(' ');
                        secondLine = words.slice(wordsForFirstLine).join(' ');
                        
                        // If first line is longer, swap them to put longer section on bottom
                        if (firstLine.length > secondLine.length) {
                            [firstLine, secondLine] = [secondLine, firstLine];
                        }
                        
                        rows = [firstLine, secondLine];
                    }
                }
                extraTopRow = true;
            } else {
                // For non-project titles, just use the original text as one row
                rows = [originalText];
            }
            
            // Set up container
            element.style.position = 'relative';
            element.style.display = 'inline-block';
            element.style.margin = `12px 0 0 0`;
            element.style.padding = '0';
            
            // Calculate cell dimensions
            const fontSize = window.getComputedStyle(element).fontSize;
            const cellSize = parseFloat(fontSize) * spacingFactor;
            let numRows = Math.max(3, rows.length);
            if (extraTopRow) numRows += 1; // Add extra row at the top for project titles
            
            // Create spans for each character
            let spanIndex = 0;
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                const row = rows[rowIndex];
                for (let charIndex = 0; charIndex < row.length; charIndex++) {
                    const span = document.createElement('span');
                    span.textContent = row[charIndex];
                    span.style.display = 'block';
                    span.style.position = 'absolute';
                    span.style.transition = 'all 0.3s ease';
                    span.style.margin = '0';
                    span.style.padding = '0';
                    span.dataset.spanNumber = spanIndex;
                    
                    // Resting position: bottom rows, with longer titles using multiple rows
                    // For project titles: row 3 and row 4 (bottom two rows)
                    let restingRow;
                    if (element.classList.contains("project-title")) {
                        if (rows.length === 1) {
                            // Single line - all on row 4 (bottom row)
                            restingRow = 3; // 0-indexed, so row 4 is index 3
                        } else {
                            // Two lines - first line on row 3, second line on row 4
                            restingRow = rowIndex === 0 ? 2 : 3; // row 3 = index 2, row 4 = index 3
                        }
                    } else {
                        // For non-project titles, use the original logic
                        restingRow = Math.max(0, numRows - rows.length + rowIndex);
                    }
                    
                    const initialX = charIndex * cellSize;
                    const initialY = cellSize * restingRow;
                    
                    span.style.left = `${initialX}px`;
                    span.style.top = `${initialY}px`;
                    span.dataset.initialX = initialX;
                    span.dataset.initialY = initialY;
                    span.dataset.initialCol = charIndex;
                    span.dataset.initialRow = restingRow;
                    span.dataset.rowIndex = rowIndex;
                    span.dataset.charIndex = charIndex;
                    
                    element.appendChild(span);
                    spanIndex++;
                }
            }
            
            // Calculate container dimensions
            const maxRowLength = Math.max(...rows.map(row => row.length));
            element.style.width = `${maxRowLength * cellSize}px`; // Use actual text width for all elements
            element.style.height = `${(numRows + 0.5) * cellSize}px`; // Add extra space for bottom letters

            // Position tagline for XL breakpoint based on bottom row character count
            if (element.classList.contains("project-title")) {
                const tagline = element.parentElement.querySelector('h5');
                if (tagline) {
                    // Remove previous resize listener if it exists
                    if (tagline.taglineResizeListener) {
                        window.removeEventListener('resize', tagline.taglineResizeListener);
                    }
                    // Responsive positioning function
                    const positionTagline = () => {
                        if (window.innerWidth >= 1200) {
                            const bottomRowCharCount = rows[rows.length - 1].length;
                            if (bottomRowCharCount <= 10) {
                                tagline.style.position = '';
                                tagline.style.left = '';
                                tagline.style.top = '';
                                tagline.style.marginLeft = '0';
                                tagline.style.alignSelf = 'end';
                                tagline.style.justifySelf = 'start';
                            } else {
                                const hero = element.closest('.title-frame');
                                if (hero) hero.style.position = 'relative';
                                const spans = Array.from(element.querySelectorAll('span'));
                                let charCount = 0;
                                let targetSpan = null;
                                for (let span of spans) {
                                    if (parseInt(span.dataset.initialRow) === 3) {
                                        if (charCount === 10) {
                                            targetSpan = span;
                                            break;
                                        }
                                        charCount++;
                                    }
                                }
                                let thirdRowSpan = spans.find(span => parseInt(span.dataset.initialRow) === 2);
                                if (targetSpan && thirdRowSpan) {
                                    const projectTitle = element;
                                    const titleFrame = projectTitle.closest('.title-frame');
                                    const projectTitleOffset = projectTitle.offsetTop;
                                    const thirdRowTop = thirdRowSpan.offsetTop;
                                    const capHeightNudge = thirdRowSpan.offsetHeight * 0.15;
                                    tagline.style.position = 'absolute';
                                    tagline.style.left = `${targetSpan.offsetLeft}px`;
                                    tagline.style.top = `${projectTitleOffset + thirdRowTop + capHeightNudge}px`;
                                } else {
                                    tagline.style.position = '';
                                    tagline.style.left = '';
                                    tagline.style.top = '';
                                }
                            }
                        } else {
                            // Reset tagline to static/default for non-XL
                            tagline.style.position = '';
                            tagline.style.left = '';
                            tagline.style.top = '';
                            tagline.style.marginLeft = '';
                            tagline.style.alignSelf = '';
                            tagline.style.justifySelf = '';
                        }
                    };
                    tagline.taglineResizeListener = positionTagline;
                    window.addEventListener('resize', positionTagline);
                    // Call immediately
                    positionTagline();
                }
            }

            // --- Hover animation event listeners ---
            if (element.classList.contains("puzzle-hover")) {
                // Remove previous listeners by setting to null
                element.onmouseenter = null;
                element.onmouseleave = null;
                element.addEventListener("mouseenter", () => {
                    randomizeLetters(element, numRows, cellSize);
                });
                element.addEventListener("mouseleave", () => {
                    const letterSpans = element.querySelectorAll('span');
                    letterSpans.forEach((span, idx) => {
                        span.style.left = `${span.dataset.initialX}px`;
                        span.style.top = `${span.dataset.initialY}px`;
                    });
                });
            }
        }

        // Function to randomize letter positions
        function randomizeLetters(element, numRows, cellSize) {
            const letterSpans = element.querySelectorAll('span');
            
            // Use different grid sizes based on element type
            let maxCols, maxRows;
            const maxRowLength = Math.max(...Array.from(letterSpans).map(span => 
                parseInt(span.dataset.initialCol) + 1
            ));
            if (element.classList.contains("project-title")) {
                maxCols = Math.min(10, maxRowLength); // Limit to 10 columns for animation
            } else {
                maxCols = maxRowLength;
            }
            maxRows = numRows;
            
            // Helper functions
            function isPositionOccupied(col, row, occupiedPositions) {
                return occupiedPositions.some(pos => pos.col === col && pos.row === row);
            }
            
            function getRandomPosition(occupiedPositions) {
                let col, row;
                do {
                    col = Math.floor(Math.random() * maxCols);
                    row = Math.floor(Math.random() * maxRows);
                } while (isPositionOccupied(col, row, occupiedPositions));
                return { col, row };
            }
            
            function getPixelPosition(col, row) {
                return {
                    x: col * cellSize,
                    y: row * cellSize
                };
            }
            
            // Randomize
            const occupiedPositions = [];
            const positions = [];
            
            for(let i = 0; i < letterSpans.length; i++) {
                const newPos = getRandomPosition(occupiedPositions);
                occupiedPositions.push(newPos);
                positions.push(newPos);
            }
            
            // Sort positions left to right to maintain word order
            positions.sort((a, b) => a.row - b.row || a.col - b.col);
            
            // Apply positions
            letterSpans.forEach((span, index) => {
                const pixelPos = getPixelPosition(positions[index].col, positions[index].row);
                span.style.left = `${pixelPos.x}px`;
                span.style.top = `${pixelPos.y}px`;
            });
        }

        // Wrap all letters in spans
        wrapLetters(textElement);
        
        // Get all letter spans for initial setup
        const letterSpans = textElement.querySelectorAll('span');
        const numColumns = letterSpans.length;
        const cellSize = parseFloat(window.getComputedStyle(letterSpans[0]).fontSize) * spacingFactor;

        // Add random puzzle on load for puzzle-auto elements
        if (textElement.classList.contains("puzzle-auto")) {
            // Calculate the actual number of rows for this element
            let actualNumRows = Math.max(3, textElement.querySelectorAll('span').length > 0 ? 
                Math.max(...Array.from(textElement.querySelectorAll('span')).map(span => 
                    parseInt(span.dataset.initialRow) + 1
                )) : 3);
            
            setTimeout(() => {
                randomizeLetters(textElement, actualNumRows, cellSize);
            }, 1); 

            setTimeout(() => {
                randomizeLetters(textElement, actualNumRows, cellSize);
            }, 1000);

            setTimeout(() => {
                randomizeLetters(textElement, actualNumRows, cellSize);
            }, 2000);

            setTimeout(() => {
                letterSpans.forEach(span => {
                    span.style.left = `${span.dataset.initialX}px`;
                    span.style.top = `${span.dataset.initialY}px`;
                });
            }, 3000);
        }

        // Add window resize listener to re-wrap letters when font size changes
        window.addEventListener('resize', () => {
            clearTimeout(textElement.resizeTimeout);
            textElement.resizeTimeout = setTimeout(() => {
                wrapLetters(textElement);
            }, 100);
        });

    })

})

console.log("Puzzle Type Loaded");
