/*-----------------/
Puzzle type animations

- Add the class "puzzle-type" to any text you want this effect applied to
- Add the class "puzzle-hover" if you want the effect to apply on hover (for nav)
- Add the class "puzzle-auto" if you want the effect to play on load (for page titles)

/-----------------*/

$(document).ready(() => {
    const CONSTANTS = {
        SPACING_FACTOR: 0.75,
        SMALL_SCREEN_BREAKPOINT: 768,
        XL_BREAKPOINT: 1280,
        MAX_LINES: 4,
        MAX_CHARS_PER_LINE: 10,
        MIN_CELL_SIZE: 20,
        CONTAINER_MARGIN: 48,
        ANIMATION_DELAYS: [1, 1000, 2000, 3000],
        TRANSITION_DURATION: '0.3s ease'
    };

    const $window = $(window);
    const $textElements = $('.puzzle-type');

    $textElements.each(function () {
        const $element = $(this);

        // Function to create rows for project titles
        function projectTitleRows(originalText) {
            const isSmallScreen = $window.width() < CONSTANTS.SMALL_SCREEN_BREAKPOINT;
            if (isSmallScreen) {
                // Small screens: up to 4 lines, 10 chars max per line
                const words = originalText.split(' ');
                let lines = [];
                let currentLine = '';

                $.each(words, (i, word) => {
                    if (currentLine.length === 0) {
                        currentLine = word;
                    } else if ((currentLine.length + 1 + word.length) <= CONSTANTS.MAX_CHARS_PER_LINE) {
                        currentLine += ' ' + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                });

                if (currentLine.length > 0) {
                    lines.push(currentLine);
                }

                // Pad to max lines
                while (lines.length < CONSTANTS.MAX_LINES) {
                    lines.unshift('');
                }

                return { rows: lines, extraTopRow: true };
            } else {
                // Large screens: special logic
                const words = originalText.split(' ');

                if (originalText.length <= CONSTANTS.MAX_CHARS_PER_LINE) {
                    // All on bottom line
                    return { rows: ["", "", "", originalText], extraTopRow: true };
                } else {
                    // Try all possible splits, pick the one where line1 <= 10 chars, line2 is the rest, and line2 is longer if possible
                    let bestSplit = { line1: '', line2: '', diff: Infinity };

                    for (let i = 1; i < words.length; i++) {
                        const part1 = words.slice(0, i).join(' ');
                        const part2 = words.slice(i).join(' ');

                        if (part1.length <= CONSTANTS.MAX_CHARS_PER_LINE) {
                            const diff = part2.length - part1.length;
                            // For 3+ words, prefer bottom line longer
                            if (words.length >= 3 && diff < 0) continue;
                            if (diff < bestSplit.diff) {
                                bestSplit = { line1: part1, line2: part2, diff };
                            }
                        }
                    }

                    if (bestSplit.line1) {
                        return { rows: ["", "", bestSplit.line1, bestSplit.line2], extraTopRow: true };
                    } else {
                        // Fallback: just split at first word
                        return { 
                            rows: ["", "", words[0], words.slice(1).join(' ')], 
                            extraTopRow: true 
                        };
                    }
                }
            }
        }

        // Function to wrap each letter in a span
        function wrapLetters($element) {
            // Store the original text before any manipulation
            let originalText = $element.data('originalText');
            if (!originalText) {
                originalText = $element.text();
                $element.data('originalText', originalText);
            }

            // Clear existing content
            $element.empty();

            // Defensive check: ensure element is valid
            if (!$element.length) {
                console.warn('puzzle-type: element is not valid', $element);
                return;
            }

            // Word wrapping logic - only for project titles
            let rows = [];
            let extraTopRow = false;

            if ($element.hasClass("project-title")) {
                const result = projectTitleRows(originalText);
                rows = result.rows;
                extraTopRow = result.extraTopRow;
            } else {
                // For non-project titles, just use the original text as one row
                rows = [originalText];
            }

            // Defensive check: ensure rows is not empty
            if (!rows || rows.length === 0) {
                console.warn('puzzle-type: rows is empty for element', $element, rows);
                return;
            }

            // Set up container with jQuery
            $element.css({
                position: 'relative',
                display: 'inline-block',
                margin: '12px 0 0 0',
                padding: '0'
            });

            // Calculate cell dimensions
            const fontSize = parseFloat($element.css('fontSize'));
            let cellSize = fontSize * CONSTANTS.SPACING_FACTOR;
            let numRows;

            if ($element.hasClass("project-title")) {
                numRows = Math.max(CONSTANTS.MAX_LINES, rows.length);
                if (extraTopRow) numRows += 1; // Add extra row at the top for project titles
            } else {
                numRows = Math.max(3, rows.length); // Use 3 rows for non-project titles
            }

            // Responsive grid sizing for project titles
            if ($element.hasClass("project-title")) {
                if ($window.width() < CONSTANTS.SMALL_SCREEN_BREAKPOINT) {
                    // On smaller screens, calculate cell size to fit 10 characters
                    const containerWidth = $window.width() - CONSTANTS.CONTAINER_MARGIN;
                    const calculatedCellSize = containerWidth / CONSTANTS.MAX_CHARS_PER_LINE;
                    // Use the calculated cell size, but ensure it's not too small
                    cellSize = Math.max(calculatedCellSize, CONSTANTS.MIN_CELL_SIZE);  // Minimum 20px cell size
                } else {
                    // On larger screens, ensure we don't exceed the container width
                    const $titleFrame = $element.closest('.title-frame');
                    if ($titleFrame.length) {
                        const frameWidth = $titleFrame.width();
                        const maxCellSize = frameWidth / CONSTANTS.MAX_CHARS_PER_LINE;
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

            $.each(rows, (rowIndex, row) => {
                // Calculate offset based on element type
                let offsetRow;
                if ($element.hasClass("project-title")) {
                    // Project titles: bottom-aligned
                    offsetRow = CONSTANTS.MAX_LINES - rows.length;
                } else {
                    // Non-project titles: center-aligned
                    offsetRow = Math.floor((4 - rows.length) / 2);
                }

                // Convert string row to array of characters
                const chars = row.split('');
                $.each(chars, (charIndex, char) => {
                    const $span = $('<span>', {
                        text: char,
                        css: {
                            display: 'block',
                            position: 'absolute',
                            transition: CONSTANTS.TRANSITION_DURATION,
                            margin: '0',
                            padding: '0',
                            lineHeight: '1'
                        },
                        'data-span-number': spanIndex,
                        'data-initial-col': charIndex,
                        'data-row-index': rowIndex,
                        'data-char-index': charIndex
                    });

                    // Calculate resting row position
                    const restingRow = offsetRow + rowIndex;

                    // Temporarily append to measure height
                    $element.append($span);
                    if (measuredCellSize === null) {
                        measuredCellSize = $span.outerHeight();
                    }
                    $span.detach();

                    const initialX = charIndex * cellSize;
                    const initialY = (measuredCellSize || cellSize) * restingRow;

                    $span.css({
                        left: `${initialX}px`,
                        top: `${initialY}px`
                    }).data({
                        initialX: initialX,
                        initialY: initialY,
                        initialRow: restingRow
                    });

                    $element.append($span);
                    spanIndex++;
                });
            });

            // Calculate container dimensions
            const maxRowLength = Math.max.apply(null, $.map(rows, row => row.length));

            if ($element.hasClass("project-title") && $window.width() < CONSTANTS.SMALL_SCREEN_BREAKPOINT) {
                // On small screens, always use height for 4 rows
                const containerWidth = $window.width() - CONSTANTS.CONTAINER_MARGIN;
                $element.css({
                    width: `${containerWidth}px`,
                    height: `${(CONSTANTS.MAX_LINES + 0.5) * cellSize}px`
                });
            } else if ($element.hasClass("project-title")) {
                // On larger screens (md breakpoint and up), use the maximum of:
                // 1. The width of the resting position spans (actual rightmost span's offset)
                // 2. The width of 10 characters (10 * cellSize)
                const $spans = $element.find('span');
                let maxRight = 0;

                $spans.each(function () {
                    const $span = $(this);
                    const initialX = parseFloat($span.data('initialX')) || 0;
                    const rightEdge = initialX + $span.outerWidth();
                    maxRight = Math.max(maxRight, rightEdge);
                });

                const tenCharWidth = CONSTANTS.MAX_CHARS_PER_LINE * cellSize;
                const calculatedWidth = Math.max(maxRight, tenCharWidth);
                const $titleFrame = $element.closest('.title-frame');

                if ($titleFrame.length) {
                    const frameWidth = $titleFrame.width();
                    $element.css('width', `${Math.min(calculatedWidth, frameWidth)}px`);
                } else {
                    $element.css('width', `${calculatedWidth}px`);
                }

                $element.css('height', `${(numRows + 0.5) * cellSize}px`);
            } else {
                $element.css({
                    width: `${maxRowLength * cellSize}px`,  // Use actual text width for all elements
                    height: `${(numRows + 0.5) * cellSize}px`
                });
            }

            // Position tagline for XL breakpoint based on bottom row character count
            if ($element.hasClass("project-title")) {
                const $tagline = $element.parent().find('h5');
                if ($tagline.length) {
                    // Remove previous resize listener if it exists
                    $window.off('resize.tagline');

                    // Responsive positioning function
                    const positionTagline = () => {
                        if ($window.width() >= CONSTANTS.XL_BREAKPOINT) {
                            const bottomRowCharCount = rows[rows.length - 1].length;

                            if (bottomRowCharCount <= CONSTANTS.MAX_CHARS_PER_LINE) {
                                $tagline.css({
                                    position: '',
                                    left: '',
                                    top: '',
                                    marginLeft: '0',
                                    alignSelf: 'end',
                                    justifySelf: 'start'
                                });
                            } else {
                                const $hero = $element.closest('.title-frame');
                                if ($hero.length) $hero.css('position', 'relative');

                                const $spans = $element.find('span');
                                let charCount = 0;
                                let $targetSpan = null;

                                $spans.each(function () {
                                    const $span = $(this);
                                    if (parseInt($span.data('initialRow')) === 3) {
                                        if (charCount === CONSTANTS.MAX_CHARS_PER_LINE) {
                                            $targetSpan = $span;
                                            return false; // break
                                        }
                                        charCount++;
                                    }
                                });

                                const $thirdRowSpan = $spans.filter(function () {
                                    return parseInt($(this).data('initialRow')) === 2;
                                }).first();

                                if ($targetSpan.length && $thirdRowSpan.length) {
                                    const projectTitleOffset = $element.offset().top;
                                    const thirdRowTop = $thirdRowSpan.offset().top;
                                    const capHeightNudge = $thirdRowSpan.outerHeight() * 0.15;

                                    $tagline.css({
                                        position: 'absolute',
                                        left: `${$targetSpan.offset().left}px`,
                                        top: `${projectTitleOffset + thirdRowTop + capHeightNudge}px`
                                    });
                                } else {
                                    $tagline.css({
                                        position: '',
                                        left: '',
                                        top: ''
                                    });
                                }
                            }
                        } else {
                            // Reset tagline to static/default for non-XL
                            $tagline.css({
                                position: '',
                                left: '',
                                top: '',
                                marginLeft: '',
                                alignSelf: '',
                                justifySelf: ''
                            });
                        }
                    };

                    $window.on('resize.tagline', positionTagline);
                    positionTagline(); // Call immediately
                }
            }

            // Hover animation event listeners
            if ($element.hasClass("puzzle-hover")) {
                $element.off('mouseenter.puzzle mouseleave.puzzle')
                    .on('mouseenter.puzzle', () => {
                        randomizeLetters($element, cellSize, measuredCellSize);
                    })
                    .on('mouseleave.puzzle', () => {
                        const $letterSpans = $element.find('span');
                        $letterSpans.each(function () {
                            const $span = $(this);
                            $span.css({
                                left: `${$span.data('initialX')}px`,
                                top: `${$span.data('initialY')}px`
                            });
                        });
                    });
            }

            // Final height adjustment
            if (measuredCellSize) {
                if ($element.hasClass("project-title")) {
                    $element.css('height', `${CONSTANTS.MAX_LINES * measuredCellSize}px`);
                } else {
                    $element.css('height', `${3 * measuredCellSize}px`);
                }
            }

            // Add random puzzle on load for puzzle-auto elements
            if ($element.hasClass("puzzle-auto")) {
                $.each(CONSTANTS.ANIMATION_DELAYS, (index, delay) => {
                    setTimeout(() => {
                        if (index < CONSTANTS.ANIMATION_DELAYS.length - 1) {
                            randomizeLetters($element, cellSize, measuredCellSize);
                        } else {
                            // Final reset to original positions
                            const $letterSpans = $element.find('span');
                            $letterSpans.each(function () {
                                const $span = $(this);
                                $span.css({
                                    left: `${$span.data('initialX')}px`,
                                    top: `${$span.data('initialY')}px`
                                });
                            });
                        }
                    }, delay);
                });
            }
        }

        // Function to randomize letter positions
        function randomizeLetters($element, cellSize, measuredCellSize) {
            if (!measuredCellSize || measuredCellSize <= 0) return;

            const $letterSpans = $element.find('span');
            let maxCols, maxRows;

            if ($element.hasClass("project-title")) {
                maxCols = CONSTANTS.MAX_CHARS_PER_LINE;
                maxRows = CONSTANTS.MAX_LINES;
            } else {
                const maxRowLength = Math.max.apply(null, $.map($letterSpans, function () {
                    return parseInt($(this).data('initialCol')) + 1;
                }));
                maxCols = maxRowLength;
                maxRows = 3;
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
                    x: col * cellSize,
                    y: row * measuredCellSize
                };
            }

            let occupiedPositions = [];
            let positions = [];

            for (let i = 0; i < $letterSpans.length; i++) {
                const newPos = getRandomPosition(occupiedPositions);
                occupiedPositions.push(newPos);
                positions.push(newPos);
            }

            positions.sort((a, b) => a.row - b.row || a.col - b.col);

            $letterSpans.each((index, span) => {
                const $span = $(span);
                const pixelPos = getPixelPosition(positions[index].col, positions[index].row);
                $span.css({
                    left: `${pixelPos.x}px`,
                    top: `${pixelPos.y}px`
                });
            });
        }

        // Initialize the element
        wrapLetters($element);

        // Add window resize listener with debouncing to re-wrap letters when font size changes
        $window.off('resize.puzzle').on('resize.puzzle', $.debounce(100, () => {
            wrapLetters($element);
        }));
    });
});

// Simple debounce utility if not already available
if (!$.debounce) {
    $.debounce = function (wait, func) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
}

// console.log("Puzzle Type Loaded");