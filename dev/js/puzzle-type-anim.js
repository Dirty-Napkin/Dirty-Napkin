/*-----------------/
Puzzle Grid Builder

- Add the class "puzzle-type" to any text you want this grid effect applied to
- Animation classes:
  - "puzzle-auto": plays animation twice on page load
  - "puzzle-hover": triggers animation on mouse enter/leave
  - If both classes are used together hover will activate 1 second after load animation completes

Grid dimensions are automatically calculated:
- Default: width = text length, height = 3
- If text length > 10: width = 10, height = 4

Vertical alignment (default layout only):
- data-vertical-align="top": Align text to top of grid
- data-vertical-align="middle": Align text to middle of grid (default)
- data-vertical-align="bottom": Align text to bottom of grid

/-----------------*/

// On load, trigger the master function and any custom adjustments
document.addEventListener("DOMContentLoaded", () => {
    const puzzleTypeElements = document.querySelectorAll(".puzzle-type");
    puzzleTypeElements.forEach((element) => {
        setupCustomLayouts(element);
        setupPuzzleTypeAnimation(element);
    });
    
    // Remove puzzle animations from nav on small screens
    removeNavPuzzle();
    
    // Rebuild grid on all resizes to recalculate scaling when font size changes
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize events to avoid excessive rebuilds
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            puzzleTypeElements.forEach((element) => {
                // Remove old hover animation listeners before rebuilding
                if (element.dataset.hoverAnimationSetup === 'true') {
                    removeGridHoverAnimation(element);
                }
                setupCustomLayouts(element);
                setupPuzzleTypeAnimation(element);
            });
            // Remove puzzle animations from nav on small screens after resize
            removeNavPuzzle();
        }, 500); // 500ms debounce delay
    });
});



/*---Set the custom layout for longer Project page titles---*/
    /**
     * @param {HTMLElement} element - The puzzle-type element 
    */
function setupCustomLayouts(element) {
    const text = element.textContent.trim();
    
    // American Scripture Project custom layout
    // Text: "American\nScripture Project" (24 chars: 8 + newline + 9 + space + 7)
    // Manually define position for each character
    if (text.includes('American') && text.includes('Scripture')) {
        // Check for small screen breakpoint (below 430px)
        const mdBreakpoint = window.matchMedia("(min-width: 768px")
        const isMedScreen = !mdBreakpoint.matches;
        
        if (isMedScreen) {
            // Small screen layout: Each word on its own line
            // Grid: 10 columns x 4 rows (0-9 cols, 0-3 rows, row 3 is bottom)
            element.customLayout = [
                // "American" - Row 3 (bottom row)
                {letterIndex: 0, row: 1, col: 0},   // A
                {letterIndex: 1, row: 1, col: 1},   // m
                {letterIndex: 2, row: 1, col: 2},   // e
                {letterIndex: 3, row: 1, col: 3},   // r
                {letterIndex: 4, row: 1, col: 4},   // i
                {letterIndex: 5, row: 1, col: 5},   // c
                {letterIndex: 6, row: 1, col: 6},   // a
                {letterIndex: 7, row: 1, col: 7},   // n
                {letterIndex: 8, row: 1, col: 8},   // (space)
                // "Scripture" - Row 2 (second line)
                {letterIndex: 9, row: 2, col: 0},    // S
                {letterIndex: 10, row: 2, col: 1},   // c
                {letterIndex: 11, row: 2, col: 2},   // r
                {letterIndex: 12, row: 2, col: 3},   // i
                {letterIndex: 13, row: 2, col: 4},   // p
                {letterIndex: 14, row: 2, col: 5},   // t
                {letterIndex: 15, row: 2, col: 6},   // u
                {letterIndex: 16, row: 2, col: 7},   // r
                {letterIndex: 17, row: 2, col: 8},   // e
                {letterIndex: 18, row: 2, col: 9},   // (space)
                // "Project" - Row 1 (third line)
                {letterIndex: 19, row: 3, col: 0},   // P
                {letterIndex: 20, row: 3, col: 1},   // r
                {letterIndex: 21, row: 3, col: 2},   // o
                {letterIndex: 22, row: 3, col: 3},   // j
                {letterIndex: 23, row: 3, col: 4},   // e
                {letterIndex: 24, row: 3, col: 5},   // c
                {letterIndex: 25, row: 3, col: 6},   // t
            ];
        } else {
            // Default layout: Desktop/tablet
            // Grid: 10 columns x 4 rows (0-9 cols, 0-3 rows, row 3 is bottom)
            element.customLayout = [
                // "American" - Row 3 (first line, bottom row)
                {letterIndex: 0, row: 2, col: 0},   // A
                {letterIndex: 1, row: 2, col: 1},   // m
                {letterIndex: 2, row: 2, col: 2},   // e
                {letterIndex: 3, row: 2, col: 3},   // r
                {letterIndex: 4, row: 2, col: 4},   // i
                {letterIndex: 5, row: 2, col: 5},   // c
                {letterIndex: 6, row: 2, col: 6},   // a
                {letterIndex: 7, row: 2, col: 7},   // n
                {letterIndex: 8, row: 2, col: 8},   // (space)
                // "Scripture" - Row 2 (second line)
                {letterIndex: 9, row: 3, col: 0},    // S
                {letterIndex: 10, row: 3, col: 1},   // c
                {letterIndex: 11, row: 3, col: 2},   // r
                {letterIndex: 12, row: 3, col: 3},   // i
                {letterIndex: 13, row: 3, col: 4},   // p
                {letterIndex: 14, row: 3, col: 5},   // t
                {letterIndex: 15, row: 3, col: 6},   // u
                {letterIndex: 16, row: 3, col: 7},   // r
                {letterIndex: 17, row: 3, col: 8},   // e
                {letterIndex: 18, row: 3, col: 9},   // (space)
                // "Project" - Row 1 (third line)
                {letterIndex: 19, row: 3, col: 10},   // P
                {letterIndex: 20, row: 3, col: 11},   // r
                {letterIndex: 21, row: 3, col: 12},   // o
                {letterIndex: 22, row: 3, col: 13},   // j
                {letterIndex: 23, row: 3, col: 14},   // e
                {letterIndex: 24, row: 3, col: 15},   // c
                {letterIndex: 25, row: 3, col: 16},   // t
            ];
        }
    }

    if (text.includes('Lemonade')) {
        // Check for small screen breakpoint (below 768px)
        const smBreakpoint = window.matchMedia("(min-width: 430px)");
        const isSmallScreen = !smBreakpoint.matches;
        
        if (isSmallScreen) {
            // Small screen layout: Each word on its own line
            // Grid: 17 columns x 4 rows (0-16 cols, 0-3 rows, row 3 is bottom)
            element.customLayout = [
                // "The" - Row 3 (bottom row)
                {letterIndex: 0, row: 1, col: 0},   // T
                {letterIndex: 1, row: 1, col: 1},   // h
                {letterIndex: 2, row: 1, col: 2},   // e
                {letterIndex: 3, row: 1, col: 3},   // (space)
                // "Lemonade" - Row 2 (second line)
                {letterIndex: 4, row: 2, col: 0},   // L
                {letterIndex: 5, row: 2, col: 1},   // e
                {letterIndex: 6, row: 2, col: 2},   // m
                {letterIndex: 7, row: 2, col: 3},   // o
                {letterIndex: 8, row: 2, col: 4},   // n
                {letterIndex: 9, row: 2, col: 5},   // a
                {letterIndex: 10, row: 2, col: 6},  // d
                {letterIndex: 11, row: 2, col: 7},  // e
                {letterIndex: 12, row: 2, col: 8},  // (space)
                // "Stand" - Row 1 (third line)
                {letterIndex: 13, row: 3, col: 0},  // S
                {letterIndex: 14, row: 3, col: 1}, // t
                {letterIndex: 15, row: 3, col: 2}, // a
                {letterIndex: 16, row: 3, col: 3}, // n
                {letterIndex: 17, row: 3, col: 4}, // d
            ];
        } else {
            // Default layout: Desktop/tablet
            // Grid: 17 columns x 4 rows (0-16 cols, 0-3 rows, row 3 is bottom)
            element.customLayout = [
                // "the" - Row 2 (second line)
                {letterIndex: 0, row: 2, col: 0},   // T
                {letterIndex: 1, row: 2, col: 1},   // h
                {letterIndex: 2, row: 2, col: 2},   // e
                {letterIndex: 3, row: 2, col: 3},   // (space)
                // "Lemonade Stand" - Row 3 (bottom)
                {letterIndex: 4, row: 3, col: 0},   // L
                {letterIndex: 5, row: 3, col: 1},   // e
                {letterIndex: 6, row: 3, col: 2},   // m
                {letterIndex: 7, row: 3, col: 3},   // o
                {letterIndex: 8, row: 3, col: 4},   // n
                {letterIndex: 9, row: 3, col: 5},   // a
                {letterIndex: 10, row: 3, col: 6},  // d
                {letterIndex: 11, row: 3, col: 7},  // e
                {letterIndex: 12, row: 3, col: 8},  // (space)
                {letterIndex: 13, row: 3, col: 9},  // S
                {letterIndex: 14, row: 3, col: 10}, // t
                {letterIndex: 15, row: 3, col: 11}, // a
                {letterIndex: 16, row: 3, col: 12}, // n
                {letterIndex: 17, row: 3, col: 13}, // d
            ];
        }
    }
}

/*---Create custom layout based on "setupCustomLayouts" ---*/
    /**
     * Gets custom layout positions for text letters
     * Can be overridden by setting element.dataset.customLayoutFunction or element.customLayoutFunction
     * @param {HTMLElement} element - The element containing the text
     * @param {string} originalText - The original text content
     * @param {number} gridWidth - The grid width (typically 10 when text > 10 chars)
     * @param {number} gridHeight - The grid height (typically 4 when text > 10 chars)
     * @returns {Array|null} Array of {letterIndex, row, col} objects, or null to use default layout
     */
function getCustomLayout(element, originalText, gridWidth, gridHeight) {
    // Option 1: Check for direct layout array assignment
    if (element.customLayout && Array.isArray(element.customLayout)) {
        const layout = element.customLayout;
        if (layout.length === originalText.length) {
            const validLayout = layout.every(pos => 
                pos.hasOwnProperty('letterIndex') &&
                pos.hasOwnProperty('row') &&
                pos.hasOwnProperty('col') &&
                pos.row >= 0 && pos.row < gridHeight &&
                pos.col >= 0 && pos.col < gridWidth
            );
            if (validLayout) {
                return layout;
            } else {
                console.warn('puzzle-type: Custom layout array contains invalid positions');
            }
        } else {
            console.warn('puzzle-type: Custom layout array length must match text length');
        }
    }
    
    // Option 2: Check for JSON layout in data attribute
    if (element.dataset.customLayout) {
        try {
            const layout = JSON.parse(element.dataset.customLayout);
            if (Array.isArray(layout) && layout.length === originalText.length) {
                const validLayout = layout.every(pos => 
                    pos.hasOwnProperty('letterIndex') &&
                    pos.hasOwnProperty('row') &&
                    pos.hasOwnProperty('col') &&
                    pos.row >= 0 && pos.row < gridHeight &&
                    pos.col >= 0 && pos.col < gridWidth
                );
                if (validLayout) {
                    return layout;
                } else {
                    console.warn('puzzle-type: Custom layout JSON contains invalid positions');
                }
            } else {
                console.warn('puzzle-type: Custom layout JSON must be an array with length matching text length');
            }
        } catch (error) {
            console.warn('puzzle-type: Error parsing custom layout JSON', error);
        }
    }
    
    // Option 3: Check for custom layout function
    let customLayoutFn = null;
    
    // Check for function name in data attribute
    if (element.dataset.customLayoutFunction) {
        const fnName = element.dataset.customLayoutFunction;
        if (typeof window[fnName] === 'function') {
            customLayoutFn = window[fnName];
        }
    }
    
    // Check for direct function reference
    if (element.customLayoutFunction && typeof element.customLayoutFunction === 'function') {
        customLayoutFn = element.customLayoutFunction;
    }
    
    // If custom layout function exists, call it
    if (customLayoutFn) {
        try {
            const layout = customLayoutFn(originalText, gridWidth, gridHeight);
            if (Array.isArray(layout) && layout.length === originalText.length) {
                // Validate layout positions
                const validLayout = layout.every(pos => 
                    pos.hasOwnProperty('letterIndex') &&
                    pos.hasOwnProperty('row') &&
                    pos.hasOwnProperty('col') &&
                    pos.row >= 0 && pos.row < gridHeight &&
                    pos.col >= 0 && pos.col < gridWidth
                );
                if (validLayout) {
                    return layout;
                } else {
                    console.warn('puzzle-type: Custom layout function returned invalid positions');
                }
            } else {
                console.warn('puzzle-type: Custom layout function must return an array with length matching text length');
            }
        } catch (error) {
            console.warn('puzzle-type: Error executing custom layout function', error);
        }
    }
    
    return null; // Use default layout
}

/*---Create the base layer grid ---*/
    /**
     * @param {HTMLElement} element - The element containing the text
     * @param {Array|null} customLayout - Optional custom layout positions [{letterIndex, row, col}, ...]
     */
function buildTextGrid(element, customLayout = null) {
    // Store original text
    let originalText = element.dataset.originalText;
    if (!originalText) {
        originalText = element.textContent.trim();
        element.dataset.originalText = originalText;
    }

    // Clear existing content
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    // Defensive check
    if (!(element instanceof Element)) {
        console.warn('puzzle-type: element is not a valid Element', element);
        return;
    }

    if (!originalText || originalText.length === 0) {
        console.warn('puzzle-type: element has no text content', element);
        return;
    }

    // Set up container
    element.style.position = 'relative';
    element.style.display = 'inline-block';
    element.style.padding = '0';
    element.style.margin = '0';

    // Get customizable grid dimensions (in number of cells, not pixels)
    const gridWidth = parseInt(element.dataset.gridWidth) || originalText.length;
    const gridHeight = parseInt(element.dataset.gridHeight) || 3;

    // Step 1: Measure span size without borders
    const measureSpan = document.createElement('span');
    measureSpan.textContent = originalText[0] || 'M'; // Use first letter or 'M' as fallback
    measureSpan.style.display = 'inline-block';
    measureSpan.style.position = 'absolute';
    measureSpan.style.visibility = 'hidden';
    measureSpan.style.margin = '0';
    measureSpan.style.padding = '0';
    measureSpan.style.lineHeight = '1';
    measureSpan.style.whiteSpace = 'nowrap';
    
    element.appendChild(measureSpan);
    let cellWidth = measureSpan.offsetWidth;
    let cellHeight = measureSpan.offsetHeight;
    element.removeChild(measureSpan);

    // Fallback if measurement failed
    if (cellWidth === 0 || cellHeight === 0) {
        const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
        const computedStyle = window.getComputedStyle(element);
        const letterSpacing = parseFloat(computedStyle.letterSpacing) || 0;
        cellWidth = fontSize + letterSpacing;
        cellHeight = fontSize * 1.2; // Approximate line height
    }
    
    // Calculate grid spacing relative to text size
    // gridSpacing is a multiplier of cellWidth (default 0.75 = 75% of cell width)
    // Can be customized via data-grid-spacing attribute (e.g., "0.5" for 50%, "1" for 100%)
    const gridSpacingMultiplier = parseFloat(element.dataset.gridSpacing) || 0.35;
    const gridSpacing = cellWidth * gridSpacingMultiplier;

    // Step 2: Create the full grid with borders
    // If custom layout is provided, create a map for quick lookup
    let customLayoutMap = null;
    if (customLayout && Array.isArray(customLayout)) {
        customLayoutMap = new Map();
        customLayout.forEach(pos => {
            const key = `${pos.row},${pos.col}`;
            customLayoutMap.set(key, pos.letterIndex);
        });
    }
    
    // Calculate default layout (vertical alignment can be customized via data-vertical-align)
    // Options: "top", "middle", "bottom" (default: "middle")
    const verticalAlign = element.dataset.verticalAlign || 'middle';
    const textRowsNeeded = Math.ceil(originalText.length / gridWidth);
    let startRow;
    
    switch (verticalAlign) {
        case 'top':
            startRow = 0;
            break;
        case 'bottom':
            startRow = Math.max(0, gridHeight - textRowsNeeded);
            break;
        case 'middle':
        default:
            // Center vertically: start in the middle row(s)
            startRow = Math.floor((gridHeight - textRowsNeeded) / 2);
            startRow = Math.max(0, startRow);
            break;
    }
    
    for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
            // Calculate which letter (if any) should be in this cell
            let letterIndex = -1;
            
            if (customLayoutMap) {
                // Use custom layout
                const key = `${row},${col}`;
                const mappedIndex = customLayoutMap.get(key);
                if (mappedIndex !== undefined && mappedIndex >= 0 && mappedIndex < originalText.length) {
                    letterIndex = mappedIndex;
                }
            } else {
                // Use default layout (vertically aligned based on data-vertical-align, left-to-right, wrapping)
                const relativeRow = row - startRow;
                if (relativeRow >= 0 && relativeRow < textRowsNeeded) {
                    const letterPosition = relativeRow * gridWidth + col;
                    if (letterPosition < originalText.length) {
                        letterIndex = letterPosition;
                    }
                }
            }
            
            const cell = document.createElement('span');
            cell.style.display = 'block';
            cell.style.position = 'absolute';
            cell.style.width = `${cellWidth}px`;
            cell.style.height = `${cellHeight}px`;
            const initialLeft = col * (cellWidth + gridSpacing);
            const initialTop = row * (cellHeight + gridSpacing);
            cell.style.left = `${initialLeft}px`;
            cell.style.top = `${initialTop}px`;
            cell.style.margin = '0';
            cell.style.padding = '0';
            // cell.style.border = '1px solid black';
            cell.style.boxSizing = 'border-box';
            cell.style.lineHeight = `${cellHeight}px`;
            cell.style.textAlign = 'center';
            cell.style.overflow = 'hidden';
            cell.style.whiteSpace = 'nowrap';
            cell.style.transition = 'left 0.3s ease, top 0.3s ease';
            
            // Store original position for hover animation
            cell.dataset.originalLeft = initialLeft;
            cell.dataset.originalTop = initialTop;
            
            // Add letter if it exists
            if (letterIndex >= 0 && letterIndex < originalText.length) {
                cell.textContent = originalText[letterIndex];
            }
            
            // Store grid position data
            cell.dataset.gridCol = col;
            cell.dataset.gridRow = row;
            cell.dataset.letterIndex = letterIndex;
            
            element.appendChild(cell);
        }
    }

    // Set container dimensions based on grid size (including spacing)
    const totalWidth = (gridWidth * cellWidth) + ((gridWidth - 1) * gridSpacing);
    const totalHeight = (gridHeight * cellHeight) + ((gridHeight - 1) * gridSpacing);
    element.style.width = `${totalWidth}px`;
    element.style.height = `${totalHeight}px`;
    
    // Store grid dimensions in data attributes for hover animation
    element.dataset.gridWidth = gridWidth;
    element.dataset.gridHeight = gridHeight;
    element.dataset.cellWidth = cellWidth;
    element.dataset.cellHeight = cellHeight;
    // Store gridSpacing as a multiplier (relative to cellWidth) for recalculation
    element.dataset.gridSpacing = gridSpacingMultiplier;
}

/*---Create the animation (weird name, oops)---*/
    /**
     * Creates animation functions to randomly rearrange letters in the grid
     * @param {HTMLElement} element - The grid container element (must have grid built first)
     * @returns {Object|null} Object with animate(), restore() functions and grid dimensions, or null if grid not found
     * @returns {Function} returns.animate - Function to randomize letter positions
     * @returns {Function} returns.restore - Function to restore original positions
     * @returns {Object} returns.gridDimensions - Grid dimension values {gridWidth, gridHeight, cellWidth, cellHeight, gridSpacing}
     */
function addGridHoverAnimation(element) {
    // Read grid dimensions from data attributes
    // Use animation grid width if available (for constrained animations), otherwise use build width
    const gridWidth = parseInt(element.dataset.animationGridWidth) || parseInt(element.dataset.gridWidth);
    const gridHeight = parseInt(element.dataset.gridHeight);
    const cellWidth = parseFloat(element.dataset.cellWidth);
    const cellHeight = parseFloat(element.dataset.cellHeight);
    // gridSpacing is stored as a multiplier, recalculate from cellWidth
    const gridSpacingMultiplier = parseFloat(element.dataset.gridSpacing) || 0.75;
    const gridSpacing = cellWidth * gridSpacingMultiplier;
    
    // Validate that grid data exists
    if (!gridWidth || !gridHeight || !cellWidth || !cellHeight) {
        console.warn('puzzle-type animation: Grid dimensions not found. Make sure buildTextGrid was called first.');
        return null;
    }
    
    // Store grid dimensions to return
    const gridDimensions = {
        gridWidth,
        gridHeight,
        cellWidth,
        cellHeight,
        gridSpacing: gridSpacing
    };
    
    // Get all cells that contain letters
    const letterCells = Array.from(element.querySelectorAll('span')).filter(cell => {
        return cell.dataset.letterIndex !== undefined && parseInt(cell.dataset.letterIndex) >= 0;
    });
    
    if (letterCells.length === 0) return null;
    
    // Function to get random grid position
    function getRandomGridPosition(occupiedPositions) {
        let col, row;
        do {
            col = Math.floor(Math.random() * gridWidth);
            row = Math.floor(Math.random() * gridHeight);
        } while (occupiedPositions.some(pos => pos.col === col && pos.row === row));
        return { col, row };
    }
    
    // Function to randomize letter positions
    function randomizeLetterPositions() {
        const occupiedPositions = [];
        const positions = [];
        
        // Get random positions for each letter
        for (let i = 0; i < letterCells.length; i++) {
            const randomPos = getRandomGridPosition(occupiedPositions);
            occupiedPositions.push(randomPos);
            positions.push(randomPos);
        }
        
        // Sort positions from top-left to bottom-right (by row, then by column)
        positions.sort((a, b) => {
            if (a.row !== b.row) {
                return a.row - b.row; // Sort by row first
            }
            return a.col - b.col; // Then by column
        });
        
        // Apply sorted positions to letters in their original order
        letterCells.forEach((cell, index) => {
            const pos = positions[index];
            const newLeft = pos.col * (cellWidth + gridSpacing);
            const newTop = pos.row * (cellHeight + gridSpacing);
            cell.style.left = `${newLeft}px`;
            cell.style.top = `${newTop}px`;
        });
    }
    
    // Function to restore original positions
    function restoreOriginalPositions() {
        letterCells.forEach(cell => {
            const originalLeft = parseFloat(cell.dataset.originalLeft);
            const originalTop = parseFloat(cell.dataset.originalTop);
            cell.style.left = `${originalLeft}px`;
            cell.style.top = `${originalTop}px`;
        });
    }
    
    // Return animation functions and grid dimensions for manual control
    return {
        animate: randomizeLetterPositions,
        restore: restoreOriginalPositions,
        gridDimensions: gridDimensions
    };
}

/*---Remove hover animation listeners---*/
    /**
     * Removes hover animation event listeners from an element
     * @param {HTMLElement} element - The grid container element
     */
function removeGridHoverAnimation(element) {
    // Check if animation functions are stored on the element
    if (element._puzzleAnimation) {
        const animation = element._puzzleAnimation;
        // Remove event listeners
        element.removeEventListener('mouseenter', animation.animate);
        element.removeEventListener('mouseleave', animation.restore);
        // Clear stored animation
        delete element._puzzleAnimation;
    }
    // Reset the setup flag
    element.dataset.hoverAnimationSetup = 'false';
}

/*---Play the animation on hover---*/
    /**
     * Sets up hover triggers for grid animation
     * @param {HTMLElement} element - The grid container element (must have grid built first)
     */
function setupGridHoverAnimation(element) {
    // Remove any existing hover animation first
    removeGridHoverAnimation(element);
    
    // Get the animation functions
    const animation = addGridHoverAnimation(element);
    
    if (!animation) {
        console.warn('setupGridHoverAnimation: Could not initialize animation');
        return;
    }
    
    // Store animation functions on element for cleanup
    element._puzzleAnimation = animation;
    
    // Set up hover triggers
    element.addEventListener('mouseenter', animation.animate);
    element.addEventListener('mouseleave', animation.restore);
    
    // Mark as set up to prevent duplicate listeners
    element.dataset.hoverAnimationSetup = 'true';
}

/*---Playthe animation on load---*/
function setupGridLoadAnimation(element) {
    // Get the animation functions
    const animation = addGridHoverAnimation(element);
    
    if (!animation) {   
        console.warn('setupGridLoadAnimation: Could not initialize animation');
        return;
    }
    
    // Trigger on page load with a delay to ensure DOM is ready
    const animationDuration = 0.3; // Match CSS transition duration (0.3s)
    const pauseDuration = 700; // 500ms pause between actions
    
    setTimeout(() => {
        if (animation && animation.animate) {
            // First animation
            animation.animate();
            
            // Second animation after first completes + pause
            setTimeout(() => {
                animation.animate();
                
                // Restore after second animation completes + pause
                setTimeout(() => {
                    if (animation && animation.restore) {
                        animation.restore();
                    }
                }, animationDuration + pauseDuration);
            }, animationDuration + pauseDuration);
        } else {
            console.warn('setupGridLoadAnimation: Animation function not available');
        }
    }, 500);
}

/*---Position the project description on project pages---*/
    /**
     * @param {HTMLElement} puzzleElement - The puzzle-type element
     * @param {Object} [gridDimensions] - Optional grid dimensions object from addGridHoverAnimation to avoid recalculation
     * @param {number} gridDimensions.gridWidth - Grid width
     * @param {number} gridDimensions.gridHeight - Grid height
     * @param {number} gridDimensions.cellWidth - Cell width
     * @param {number} gridDimensions.cellHeight - Cell height
     * @param {number} gridDimensions.gridSpacing - Grid spacing
     */
    function positionProjectDescription(puzzleElement, gridDimensions = null) {
        // Find the title-frame parent
        const titleFrame = puzzleElement.closest('.title-frame');
        if (!titleFrame) return;
        
        // Find the h5 element inside title-frame
        const h5 = titleFrame.querySelector('h5');
        if (!h5) return;
        
        // Get grid dimensions - use provided dimensions or read from dataset
        let cellWidth, cellHeight, gridSpacing, gridHeight;
        if (gridDimensions) {
            cellWidth = gridDimensions.cellWidth;
            cellHeight = gridDimensions.cellHeight;
            // gridSpacing in gridDimensions is already calculated in pixels
            gridSpacing = gridDimensions.gridSpacing;
            gridHeight = gridDimensions.gridHeight;
        } else {
            // Fallback: read from dataset and recalculate gridSpacing
            cellWidth = parseFloat(puzzleElement.dataset.cellWidth);
            cellHeight = parseFloat(puzzleElement.dataset.cellHeight);
            const gridSpacingMultiplier = parseFloat(puzzleElement.dataset.gridSpacing) || 0.3;
            gridSpacing = cellWidth * gridSpacingMultiplier;
            gridHeight = parseInt(puzzleElement.dataset.gridHeight) || 3;
        }
        
        if (!cellWidth || !cellHeight) {
            console.warn('positionProjectDescription: Grid dimensions not found');
            return;
        }
        
        // Always position on row 2 (second line)
        // Row 3 is bottom (first line), Row 2 is second line
        const targetRow = 2;
        
        // Calculate position
        // Column 11 = column index 10 (0-indexed, after the 10-column grid)
        const targetCol = 11;
        const leftPosition = targetCol * (cellWidth + gridSpacing);
        
        // Calculate bottom position for row 2
        // Row 2 (second line) = cellHeight + gridSpacing
        const bottomPosition = (gridHeight - 1 - targetRow) * (cellHeight + gridSpacing);
        
        // Set position
        h5.style.left = `${leftPosition}px`;
        h5.style.bottom = `${bottomPosition}px`;
    }

/*---Control which animations play. Based on the classes applied to each element---*/
    /**
     * @param {HTMLElement} element - The element with the puzzle-type class
     */
function setupPuzzleTypeAnimation(element) {
    // Get the original text to determine grid dimensions
    const originalText = element.textContent.trim();
    const textLength = originalText.length;
    
    // Set grid dimensions based on text length
    // Default: width = text length, height = 3
    // If text length > 10: width = 10, height = 4 (for animation)
    let gridWidth = textLength;
    let gridHeight = 3;
    
    if (textLength > 10) {
        gridWidth = 10;
        gridHeight = 4;
    }
    
    // Set data attributes for grid dimensions (used by animations)
    element.dataset.gridWidth = gridWidth;
    element.dataset.gridHeight = gridHeight;
    
    // Determine grid width for building the grid (default state)
    // If custom layout will be used, allow a larger default grid width for the static layout
    // Animation will still use gridWidth = 10, but default state can be wider
    let buildGridWidth = gridWidth;
    let customLayout = null;
    
    if (gridWidth === 10 && textLength > 10) {
        // Check for custom default grid width (for building the initial grid)
        // Default to 17 if not specified, or use data-default-grid-width attribute
        const defaultGridWidth = parseInt(element.dataset.defaultGridWidth) || 17;
        if (defaultGridWidth > gridWidth) {
            buildGridWidth = defaultGridWidth;
        }
        
        // Get custom layout using the build grid width for validation
        // You can define custom layout here in three ways:
        // 1. Direct assignment: element.customLayout = [{letterIndex: 0, row: 3, col: 0}, ...]
        // 2. Data attribute: data-custom-layout='[{"letterIndex":0,"row":3,"col":0},...]'
        // 3. Function: element.customLayoutFunction = function(text, width, height) { return [...]; }
        customLayout = getCustomLayout(element, originalText, buildGridWidth, gridHeight);
    }
    
    // Store both values: animation width and build width
    element.dataset.animationGridWidth = gridWidth; // For animations (10)
    element.dataset.buildGridWidth = buildGridWidth; // For building grid (17 or custom)
    
    // Temporarily override gridWidth in dataset for building
    element.dataset.gridWidth = buildGridWidth;
    
    // Build the grid first (required before setting up animations)
    buildTextGrid(element, customLayout);
    
    // Restore animation grid width for animation functions
    element.dataset.gridWidth = element.dataset.animationGridWidth;
    
    // Position project description if on a project page
    // Get grid dimensions from animation function to avoid recalculation
    if (element.closest('.project-page')) {
        const animation = addGridHoverAnimation(element);
        if (animation && animation.gridDimensions) {
            positionProjectDescription(element, animation.gridDimensions);
        } else {
            // Fallback to reading from dataset if animation not available
            positionProjectDescription(element);
        }
    }
    
    // Check for animation trigger classes
    // Look for load class: 'puzzle-auto'
    const hasLoadClass = element.classList.contains('puzzle-auto');
    // Look for hover class: 'puzzle-hover'
    const hasHoverClass = element.classList.contains('puzzle-hover');
    
    // Calculate load animation total duration
    // setupGridLoadAnimation plays animation twice with pauses:
    // - 500ms initial delay
    // - 0.3s first animation
    // - 700ms pause
    // - 0.3s second animation
    // - 700ms pause
    // - 0.3s restore
    // Total: 500 + 300 + 700 + 300 + 700 + 300 = 2800ms = 2.8s
    const loadAnimationTotalDuration = 500 + (0.3 * 1000) + 700 + (0.3 * 1000) + 700 + (0.3 * 1000);
    
    // Apply animation rules based on classes
    if (hasLoadClass) {
        // If it has load class, play load animation twice
        setupGridLoadAnimation(element);
        
        // If it also has hover class, delay hover setup until 1 second after load animation completes
        if (hasHoverClass) {
            const hoverDelay = loadAnimationTotalDuration + 1000; // 1 second after load completes
            setTimeout(() => {
                setupGridHoverAnimation(element);
            }, hoverDelay);
        }
    } else if (hasHoverClass) {
        // If only hover class (no load), set up hover immediately
        setupGridHoverAnimation(element);
    }
    // If neither class is present, no animation is set up (grid is built but static)
}

/*---Remove the puzzle animations on the mobile nav---*/
    /**
     * Removes puzzle-type animations from nav buttons on small screens
     * Restores original text and removes animation classes
     * Re-enables animations on larger screens
     */
function removeNavPuzzle() {
    const mdBreakpoint = window.matchMedia("(min-width: 768px)");
    const isMedScreen = !mdBreakpoint.matches;
    
    // Find all puzzle-type elements within nav menu
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const navPuzzleElements = nav.querySelectorAll('.puzzle-type');
    
    navPuzzleElements.forEach((element) => {
        if (isMedScreen) {
            // Remove hover animation if it exists
            if (element.dataset.hoverAnimationSetup === 'true') {
                removeGridHoverAnimation(element);
            }
            
            // Get original text - it should be stored in dataset, otherwise reconstruct from grid
            let originalText = element.dataset.originalText;
            
            if (!originalText) {
                // Try to reconstruct from grid cells if grid is already built
                const cells = element.querySelectorAll('span[data-letter-index]');
                if (cells.length > 0) {
                    // Reconstruct text from grid cells
                    const textArray = Array.from(cells)
                        .filter(cell => {
                            const idx = parseInt(cell.dataset.letterIndex);
                            return idx >= 0 && idx < 1000; // Valid index
                        })
                        .sort((a, b) => parseInt(a.dataset.letterIndex) - parseInt(b.dataset.letterIndex))
                        .map(cell => cell.textContent);
                    originalText = textArray.join('');
                    element.dataset.originalText = originalText;
                } else {
                    // Fallback to current text content
                    originalText = element.textContent.trim();
                    element.dataset.originalText = originalText;
                }
            }
            if (originalText) {
                // Clear the grid content
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                // Restore original text
                element.textContent = originalText;
            }
            
            // Remove animation classes (but keep puzzle-type class for potential re-enabling)
            element.classList.remove('puzzle-hover', 'puzzle-auto');
            
            // Reset styles that were applied by buildTextGrid
            element.style.position = '';
            element.style.display = '';
            element.style.width = '';
            element.style.height = '';
            element.style.padding = '';
            element.style.margin = '';
        } else {
            // On larger screens, restore animations if classes are present
            // Check if element has puzzle-hover or puzzle-auto classes but no animation setup
            const hasPuzzleHover = element.classList.contains('puzzle-hover');
            const hasPuzzleAuto = element.classList.contains('puzzle-auto');
            
            if ((hasPuzzleHover || hasPuzzleAuto) && element.dataset.hoverAnimationSetup !== 'true') {
                // Re-setup the puzzle animation
                setupCustomLayouts(element);
                setupPuzzleTypeAnimation(element);
            }
        }
    });
}

// Set up responsive removal of nav puzzle animations on breakpoint change
const smBreakpoint = window.matchMedia("(min-width: 430px)");
smBreakpoint.addEventListener('change', removeNavPuzzle);