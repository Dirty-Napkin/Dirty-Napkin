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
            const text = element.textContent;
            element.textContent = '';
            
            // Set up container
            element.style.position = 'relative';
            element.style.display = 'inline-block';
            element.style.margin = `0`;
            element.style.padding = '0';
            element.style.transform = `translateY(-${spacingTranslate}%)`;
            
            
            // Calculate cell dimensions
            const fontSize = window.getComputedStyle(element).fontSize;
            const cellSize = parseFloat(fontSize) * spacingFactor;
            
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.style.display = 'block';
                span.style.position = 'absolute';
                span.style.transition = 'all 0.3s ease';
                span.style.margin = '0';
                span.style.padding = '0';
                
                // Store span number
                span.dataset.spanNumber = i;
                
                // Initial position (middle row)
                const initialX = i * cellSize;
                const initialY = cellSize; // Middle row
                span.style.left = `${initialX}px`;
                span.style.top = `${initialY}px`;
                
                // Store initial position for reset
                span.dataset.initialX = initialX;
                span.dataset.initialY = initialY;
                span.dataset.initialCol = i;
                span.dataset.initialRow = 2;
                
                element.appendChild(span);
            }
            
            // Set container size
            element.style.width = `${text.length * cellSize}px`;
            element.style.height = `${3 * cellSize}px`;
        }

        // Wrap all letters in spans
        wrapLetters(textElement);
        
        // Get all letter spans
        const letterSpans = textElement.querySelectorAll('span');
        const numColumns = letterSpans.length;
        const cellSize = parseFloat(window.getComputedStyle(letterSpans[0]).fontSize) * spacingFactor;

        // Function to get grid coordinates from pixel position
        function getGridCoords(x, y) {
            return {
                col: Math.round(x / cellSize),
                row: Math.round(y / cellSize)
            };
        }

        // Function to get pixel position from grid coordinates
        function getPixelPosition(col, row) {
            return {
                x: col * cellSize,
                y: row * cellSize
            };
        }

        // Function to check if a position is occupied
        function isPositionOccupied(col, row, occupiedPositions) {
            return occupiedPositions.some(pos => pos.col === col && pos.row === row);
        }

        // Function to get random grid position
        function getRandomPosition(occupiedPositions) {
            let col, row;
            do {
                col = Math.floor(Math.random() * numColumns);
                row = Math.floor(Math.random() * 3); // 3 rows (0, 1, 2)
            } while (isPositionOccupied(col, row, occupiedPositions));
            return { col, row };
        }

        // Function to randomize letter positions
        function randomizeLetters() {
            const occupiedPositions = [];
            
            letterSpans.forEach(span => {
                const newPos = getRandomPosition(occupiedPositions);
                occupiedPositions.push(newPos);
                
                const pixelPos = getPixelPosition(newPos.col, newPos.row);
                span.style.left = `${pixelPos.x}px`;
                span.style.top = `${pixelPos.y}px`;
            });
        }

        // Function to log occupied positions
        function logOccupiedPositions() {
            const positions = [];
            letterSpans.forEach(span => {
                const x = parseFloat(span.style.left);
                const y = parseFloat(span.style.top);
                const gridCoords = getGridCoords(x, y);
                positions.push(gridCoords);
            });
            console.log('Current letter positions:', positions);
            return positions;
        }

        // Modified randomizeLetters to maintain letter order
        const originalRandomizeLetters = randomizeLetters;
        randomizeLetters = function() {
            // Get random positions first
            const occupiedPositions = [];
            const positions = [];
            
            // Generate all random positions first
            for(let i = 0; i < letterSpans.length; i++) {
                const newPos = getRandomPosition(occupiedPositions);
                occupiedPositions.push(newPos);
                positions.push(newPos);
            }

            // Sort positions left to right to maintain word order
            positions.sort((a, b) => a.row - b.row || a.col - b.col);

            // Apply positions in order to maintain readability
            letterSpans.forEach((span, index) => {
                const pixelPos = getPixelPosition(positions[index].col, positions[index].row);
                span.style.left = `${pixelPos.x}px`;
                span.style.top = `${pixelPos.y}px`;
            });

            return logOccupiedPositions();
        }

// Applying the effect in different situations (things like hover or page load)
        if (textElement.classList.contains("puzzle-hover")) {
            textElement.addEventListener("mouseenter", () => {
                randomizeLetters();
                
            });

            textElement.addEventListener("mouseleave", () => {
                letterSpans.forEach(span => {
                    span.style.left = `${span.dataset.initialX}px`;
                    span.style.top = `${span.dataset.initialY}px`;
                });
            })
        }

        // Add random puzzle on load 
        if (textElement.classList.contains("puzzle-auto")) {
            setTimeout(() => {
                randomizeLetters();
            }, 1); 

            setTimeout(() => {
            randomizeLetters();
            }, 1000);

            setTimeout(() => {
                randomizeLetters();
            }, 2000);

            setTimeout(() => {
                letterSpans.forEach(span => {
                    span.style.left = `${span.dataset.initialX}px`;
                    span.style.top = `${span.dataset.initialY}px`;
                });
            }, 3000);

            setTimeout(() => {
                textElement.addEventListener("mouseenter", () => {
                    randomizeLetters();
                    
                });
    
                textElement.addEventListener("mouseleave", () => {
                    letterSpans.forEach(span => {
                        span.style.left = `${span.dataset.initialX}px`;
                        span.style.top = `${span.dataset.initialY}px`;
                    });
                })

            }, 4000);
        }

    })
})

console.log("Puzzle Type Loaded");
