console.log("Hello World - nav-type.js is working!");

document.addEventListener("DOMContentLoaded", () => {
    const textElement = document.querySelector(".centered-text")
    
    // Function to wrap each letter in a span
    function wrapLetters(element) {
        const text = element.textContent;
        element.textContent = '';
        
        // Set up container
        element.style.position = 'relative';
        element.style.display = 'inline-block';
        element.style.margin = '0';
        element.style.padding = '0';
        
        // Calculate cell dimensions
        const fontSize = window.getComputedStyle(element).fontSize;
        const cellSize = parseFloat(fontSize) * 1;
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.display = 'block';
            span.style.position = 'absolute';
            span.style.transition = 'all 0.4s ease';
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
    const cellSize = parseFloat(window.getComputedStyle(letterSpans[0]).fontSize) * 1;

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

    // Function to get random grid position while maintaining order
    function getRandomPosition(spanNumber, otherSpans) {
        // Get all possible positions
        const possiblePositions = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < numColumns; col++) {
                const positionNumber = col + (row * numColumns);
                possiblePositions.push({ row, col, positionNumber });
            }
        }

        // Get currently occupied positions
        const occupiedPositions = new Set();
        otherSpans.forEach(span => {
            const pos = getGridCoords(
                parseFloat(span.style.left),
                parseFloat(span.style.top)
            );
            occupiedPositions.add(`${pos.col},${pos.row}`);
        });

        // Get current position of this span
        const currentSpan = Array.from(letterSpans).find(span => 
            parseInt(span.dataset.spanNumber) === spanNumber
        );
        const currentPos = currentSpan ? getGridCoords(
            parseFloat(currentSpan.style.left),
            parseFloat(currentSpan.style.top)
        ) : null;

        // Filter positions based on neighbor constraints and occupation
        const validPositions = possiblePositions.filter(pos => {
            // Check if position is already occupied
            if (occupiedPositions.has(`${pos.col},${pos.row}`)) {
                return false;
            }

            // Check if this position would violate any neighbor constraints
            for (const otherSpan of otherSpans) {
                const otherNumber = parseInt(otherSpan.dataset.spanNumber);
                const otherPos = getGridCoords(
                    parseFloat(otherSpan.style.left),
                    parseFloat(otherSpan.style.top)
                );
                const otherPositionNumber = otherPos.col + (otherPos.row * numColumns);

                // If this is a previous span, our position must be >= its position
                if (otherNumber < spanNumber && pos.positionNumber < otherPositionNumber) {
                    return false;
                }
                // If this is a next span, our position must be <= its position
                if (otherNumber > spanNumber && pos.positionNumber > otherPositionNumber) {
                    return false;
                }
            }
            return true;
        });

        // If no valid positions, stay in current position
        if (validPositions.length === 0) {
            return null;
        }

        // Add bias for first and last letters and movement
        const weightedPositions = validPositions.map(pos => {
            let weight = 1; // Default weight
            
            // First letter prefers top-left corner
            if (spanNumber === 0 && pos.row === 0 && pos.col === 0) {
                weight = 5;
            }
            // Second letter prefers top row
            else if (spanNumber === 1 && pos.row === 0) {
                weight = 3;
            }
            
            // Last letter prefers bottom-right corner
            if (spanNumber === numColumns - 1 && pos.row === 2 && pos.col === numColumns - 1) {
                weight = 5;
            }
            // Second-to-last letter prefers bottom row
            if (spanNumber === numColumns - 2 && pos.row === 2) {
                weight = 3;
            }

            // Add movement bias - higher weight for positions further from current position
            if (currentPos) {
                const distance = Math.abs(pos.row - currentPos.row) + Math.abs(pos.col - currentPos.col);
                weight *= (1 + distance * 1.0);
            }
            
            return { ...pos, weight };
        });

        // Create weighted array for random selection
        const weightedArray = [];
        weightedPositions.forEach(pos => {
            for (let i = 0; i < pos.weight; i++) {
                weightedArray.push(pos);
            }
        });

        // Randomly select from weighted positions
        const randomIndex = Math.floor(Math.random() * weightedArray.length);
        const selectedPos = weightedArray[randomIndex];
        return { row: selectedPos.row, col: selectedPos.col };
    }

    textElement.addEventListener("mouseenter", () => {
        // Create array of all spans in order
        const orderedSpans = Array.from(letterSpans).sort((a, b) => {
            return parseInt(a.dataset.spanNumber) - parseInt(b.dataset.spanNumber);
        });

        // Move each span to a new position
        orderedSpans.forEach((span, index) => {
            const spanNumber = parseInt(span.dataset.spanNumber);
            
            // Get all other spans except this one
            const otherSpans = orderedSpans.filter(s => s !== span);
            
            // Get new position
            const newPos = getRandomPosition(spanNumber, otherSpans);
            
            if (newPos) {
                const pixelPos = getPixelPosition(newPos.col, newPos.row);
                span.style.left = `${pixelPos.x}px`;
                span.style.top = `${pixelPos.y}px`;
            }
        });
    });

    textElement.addEventListener("mouseleave", () => {
        // Return all letters to their original positions
        letterSpans.forEach(span => {
            span.style.left = `${span.dataset.initialX}px`;
            span.style.top = `${span.dataset.initialY}px`;
        });
    });
})