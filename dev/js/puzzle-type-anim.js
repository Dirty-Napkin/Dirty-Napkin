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
            if (element.classList.contains("project-title")) {
                // Split into rows of max 14 characters for project titles
                const words = originalText.split(' ');
                let currentRow = '';
                
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    const testRow = currentRow + (currentRow ? ' ' : '') + word;
                    
                    if (testRow.length <= 14) {
                        currentRow = testRow;
                    } else {
                        if (currentRow) {
                            rows.push(currentRow);
                            currentRow = word;
                        } else {
                            // Single word longer than 14 chars - split it
                            rows.push(word.substring(0, 14));
                            currentRow = word.substring(14);
                        }
                    }
                }
                if (currentRow) {
                    rows.push(currentRow);
                }
            } else {
                // For non-project titles, just use the original text as one row
                rows = [originalText];
            }
            
            // Set up container
            element.style.position = 'relative';
            element.style.display = 'inline-block';
            element.style.margin = `12px 0 0 0`;
            element.style.padding = '0';
            element.style.transform = `translateY(-${spacingTranslate}%)`;
            
            // Calculate cell dimensions
            const fontSize = window.getComputedStyle(element).fontSize;
            const cellSize = parseFloat(fontSize) * spacingFactor;
            const numRows = Math.max(3, rows.length); // At least 3 rows for animation
            
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
                    const restingRow = Math.max(0, numRows - rows.length + rowIndex);
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
            if (element.classList.contains("project-title")) {
                element.style.width = `${14 * cellSize}px`; // Always 14 characters wide for project titles
            } else {
                element.style.width = `${maxRowLength * cellSize}px`; // Use actual text width for others
            }
            element.style.height = `${(numRows + 0.5) * cellSize}px`; // Add extra space for bottom letters

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
            if (element.classList.contains("project-title")) {
                // Always use 14 columns per row for project titles
                maxCols = 14;
                maxRows = numRows;
            } else {
                // Use actual text width for other elements
                const maxRowLength = Math.max(...Array.from(letterSpans).map(span => 
                    parseInt(span.dataset.initialCol) + 1
                ));
                maxCols = maxRowLength;
                maxRows = numRows;
            }
            
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
            setTimeout(() => {
                randomizeLetters(textElement, 3, cellSize);
            }, 1); 

            setTimeout(() => {
                randomizeLetters(textElement, 3, cellSize);
            }, 1000);

            setTimeout(() => {
                randomizeLetters(textElement, 3, cellSize);
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
