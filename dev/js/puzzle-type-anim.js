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
            
            // Defensive check: ensure element is a valid Element
            if (!(element instanceof Element)) {
                console.warn('puzzle-type: element is not a valid Element', element);
                return;
            }

            // Word wrapping logic - only for project titles
            let rows = [];
            let extraTopRow = false;
            if (element.classList.contains("project-title")) {
                const charCount = originalText.length;
                const isSmallScreen = window.innerWidth < 768;
                const maxLines = 4;
                if (isSmallScreen) {
                    // Small screens: up to 4 lines, 10 chars max per line
                    const maxLineLength = 10;
                    const words = originalText.split(' ');
                    let lines = [];
                    let currentLine = '';
                    for (let i = 0; i < words.length; i++) {
                        const word = words[i];
                        if (currentLine.length === 0) {
                            currentLine = word;
                        } else if ((currentLine.length + 1 + word.length) <= maxLineLength) {
                            currentLine += ' ' + word;
                        } else {
                            lines.push(currentLine);
                            currentLine = word;
                        }
                    }
                    if (currentLine.length > 0) {
                        lines.push(currentLine);
                    }
                    while (lines.length < maxLines) {
                        lines.unshift('');
                    }
                    rows = lines;
                } else {
                    // Large screens: special logic
                    const words = originalText.split(' ');
                    let line1 = '';
                    let line2 = '';
                    if (originalText.length <= 10) {
                        // All on bottom line
                        rows = ["", "", "", originalText];
                    } else {
                        // Try all possible splits, pick the one where line1 <= 10 chars, line2 is the rest, and line2 is longer if possible
                        let bestSplit = {line1: '', line2: '', diff: Infinity};
                        for (let i = 1; i < words.length; i++) {
                            let part1 = words.slice(0, i).join(' ');
                            let part2 = words.slice(i).join(' ');
                            if (part1.length <= 10) {
                                let diff = part2.length - part1.length;
                                // For 3+ words, prefer bottom line longer
                                if (words.length >= 3 && diff < 0) continue;
                                if (diff < bestSplit.diff) {
                                    bestSplit = {line1: part1, line2: part2, diff};
                                }
                            }
                        }
                        if (bestSplit.line1) {
                            line1 = bestSplit.line1;
                            line2 = bestSplit.line2;
                        } else {
                            // Fallback: just split at first word
                            line1 = words[0];
                            line2 = words.slice(1).join(' ');
                        }
                        rows = ["", "", line1, line2];
                    }
                    // Always pad to 4 lines (already done above)
                }
                extraTopRow = true;
                console.log('Final rows:', rows);
            } else {
                // For non-project titles, just use the original text as one row
                rows = [originalText];
            }
            
            // Defensive check: ensure rows is not empty
            if (!rows || rows.length === 0) {
                console.warn('puzzle-type: rows is empty for element', element, rows);
                return;
            }
            
            // Set up container
            element.style.position = 'relative';
            element.style.display = 'inline-block';
            element.style.margin = `12px 0 0 0`;
            element.style.padding = '0';
            
            // Debugging logs
            console.log('puzzle-type: element and rows before getComputedStyle', element, rows);

            // Calculate cell dimensions
            const fontSize = window.getComputedStyle(element).fontSize;
            let cellSize = parseFloat(fontSize) * spacingFactor;
            let numRows = Math.max(3, rows.length);
            if (extraTopRow) numRows += 1; // Add extra row at the top for project titles
            
            console.log('Initial cell size calculation:', { fontSize, cellSize, numRows });
            
            // Responsive grid sizing for project titles
            let maxCols = 10; // Default 10-character limit
            if (element.classList.contains("project-title")) {
                if (window.innerWidth < 768) {
                    // On smaller screens, calculate cell size to fit 10 characters in available width
                    const containerWidth = window.innerWidth - 48; // Full width minus margins
                    const calculatedCellSize = containerWidth / 10;
                    // Use the calculated cell size, but ensure it's not too small
                    cellSize = Math.max(calculatedCellSize, 20); // Minimum 20px cell size
                    console.log('Small screen cell size:', { containerWidth, calculatedCellSize, finalCellSize: cellSize });
                } else {
                    // On larger screens, ensure we don't exceed the container width
                    const titleFrame = element.closest('.title-frame');
                    if (titleFrame) {
                        const frameWidth = titleFrame.offsetWidth;
                        const maxCellSize = frameWidth / 10;
                        // Only shrink if absolutely necessary to fit
                        if (maxCellSize < cellSize) {
                            cellSize = maxCellSize;
                        }
                    }
                }
            }
            
            // Create spans for each character
            let spanIndex = 0;
            let measuredCellSize = null;
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                const row = rows[rowIndex];
                const offsetRow = 4 - rows.length;
                for (let charIndex = 0; charIndex < row.length; charIndex++) {
                    const span = document.createElement('span');
                    span.textContent = row[charIndex];
                    span.style.display = 'block';
                    span.style.position = 'absolute';
                    span.style.transition = 'all 0.3s ease';
                    span.style.margin = '0';
                    span.style.padding = '0';
                    span.style.lineHeight = '1';
                    span.dataset.spanNumber = spanIndex;
                    // Offset so text is always bottom-aligned
                    let restingRow = offsetRow + rowIndex;
                    // Temporarily append to measure height
                    element.appendChild(span);
                    if (measuredCellSize === null) {
                        measuredCellSize = span.offsetHeight;
                    }
                    element.removeChild(span);
                    const initialX = charIndex * cellSize;
                    const initialY = (measuredCellSize || cellSize) * restingRow;
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
            if (element.classList.contains("project-title") && window.innerWidth < 768) {
                // On small screens, always use height for 4 rows
                const containerWidth = window.innerWidth - 48; // Full width minus margins
                element.style.width = `${containerWidth}px`;
                element.style.height = `${(4 + 0.5) * cellSize}px`;
            } else if (element.classList.contains("project-title")) {
                // On larger screens, use calculated width but respect container constraints
                const titleFrame = element.closest('.title-frame');
                if (titleFrame) {
                    const frameWidth = titleFrame.offsetWidth;
                    const calculatedWidth = maxRowLength * cellSize;
                    element.style.width = `${Math.min(calculatedWidth, frameWidth)}px`;
                } else {
                    element.style.width = `${maxRowLength * cellSize}px`;
                }
                element.style.height = `${(numRows + 0.5) * cellSize}px`;
            } else {
                element.style.width = `${maxRowLength * cellSize}px`; // Use actual text width for all elements
                element.style.height = `${(numRows + 0.5) * cellSize}px`;
            }

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
                element.onmouseenter = null;
                element.onmouseleave = null;
                element.addEventListener("mouseenter", () => {
                    randomizeLetters(element, 4, cellSize);
                });
                element.addEventListener("mouseleave", () => {
                    const letterSpans = element.querySelectorAll('span');
                    letterSpans.forEach((span, idx) => {
                        span.style.left = `${span.dataset.initialX}px`;
                        span.style.top = `${span.dataset.initialY}px`;
                    });
                });
            }

            // After all spans are created:
            if (measuredCellSize) {
                element.style.height = `${4 * measuredCellSize}px`;
            }
        }

        // Function to randomize letter positions
        function randomizeLetters(element, numRows, measuredCellSize) {
            if (!measuredCellSize || measuredCellSize <= 0) return;
            const letterSpans = element.querySelectorAll('span');
            let maxCols, maxRows;
            if (element.classList.contains("project-title")) {
                maxCols = 10;
                maxRows = 4;
            } else {
                const maxRowLength = Math.max(...Array.from(letterSpans).map(span => 
                    parseInt(span.dataset.initialCol) + 1
                ));
                maxCols = maxRowLength;
                maxRows = numRows;
            }
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
                    x: col * measuredCellSize,
                    y: row * measuredCellSize
                };
            }
            const occupiedPositions = [];
            const positions = [];
            for(let i = 0; i < letterSpans.length; i++) {
                const newPos = getRandomPosition(occupiedPositions);
                occupiedPositions.push(newPos);
                positions.push(newPos);
            }
            positions.sort((a, b) => a.row - b.row || a.col - b.col);
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
            let actualNumRows = 4;
            setTimeout(() => {
                randomizeLetters(textElement, 4, cellSize);
            }, 1);
            setTimeout(() => {
                randomizeLetters(textElement, 4, cellSize);
            }, 1000);
            setTimeout(() => {
                randomizeLetters(textElement, 4, cellSize);
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
