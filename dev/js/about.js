// Only run script if #about-page is present
if (document.querySelector('#about-page')) {
    // Cache frequently used jQuery objects
    const $aboutPage = $('#about-page');
    const $storyGrid = $('.story-grid');
    const $bgImgs = $('.about-bg-img');
    const $squares = $('.square.color-change');
    const $main = $('main');
    
    // Cache background image selectors
    const $bgWhite = $('.about-bg-white');
    const $bgCyan = $('.about-bg-cyan');
    const $bgBlack = $('.about-bg-black');
    
    // Background class constants
    const BACKGROUND_CLASSES = ['cyan-background', 'black-background', 'white-background'];
    
    /*-----------------
    About Page Background Image Positioning
    -----------------*/
    function positionAboutBgImages() {
        if (!$storyGrid.length || !$bgImgs.length) return;

        let top = $storyGrid[0].offsetTop;
        if ($aboutPage.length && $storyGrid[0].offsetParent !== $aboutPage[0]) {
            const storyRect = $storyGrid[0].getBoundingClientRect();
            const aboutRect = $aboutPage[0].getBoundingClientRect();
            top = storyRect.top - aboutRect.top + $aboutPage[0].scrollTop;
        }
        top = top - 100; // Move 100px above the top of story-grid

        $bgImgs.css('top', `${top}px`);
    }

    function updateAboutPageBgPositioning() {
        positionAboutBgImages();
    }

    function observeStoryGridPosition() {
        if (!$storyGrid.length) return;
        
        updateAboutPageBgPositioning();
        const ro = new ResizeObserver(() => {
            updateAboutPageBgPositioning();
        });
        ro.observe($storyGrid[0]);
        if ($main.length) ro.observe($main[0]);
    }

    /*-----------------
    Square Color Calculation
    -----------------*/
    // 1. Parse color variables from _variables.scss
    const HEX_TO_VAR = {
        '#ffffff': '--white',
        '#000000': '--key',
        '#3083dc': '--cyan',
        '#ea008a': '--magenta',
        '#ffed12': '--yellow',
        '#8ec1ae': '--green'
    };

    // Utility to ensure all keys and values in HEX_TO_VAR are lowercase
    // Why is this necessary I don't understand
    function normalizeHexToVar(map) {
        const out = {};
        for (const k in map) {
            const key = k.toLowerCase();
            const val = typeof map[k] === 'string' && map[k].startsWith('#') ? map[k].toLowerCase() : map[k];
            out[key] = val;
        }
        return out;
    }
    const HEX_TO_VAR_NORM = normalizeHexToVar(HEX_TO_VAR);

    // 2. User's color mapping (variable name to variable name)
    const COLOR_MAP = {
        '--white': '--key',
        '--key': '--magenta',
        '--magenta': '--key',
        '--cyan': '--green',
        '--green': '--cyan'
    };

    // 3. Color cache for all background states
    const colorCache = {
        'default': {}, // white background
        'cyan-background': {}, // green ketchup
        'black-background': {}, // magenta ketchup
        'white-background': {} // black ketchup
    };

    function rgbToHex(r, g, b) {
        return (
            '#' +
            [r, g, b]
                .map(x => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                })
                .join('')
        ).toLowerCase();
    }

    function getCurrentBgImage() {
        if (!$aboutPage.length) return null;
        
        if ($aboutPage.hasClass('cyan-background')) {
            return $bgCyan[0];
        }
        if ($aboutPage.hasClass('black-background')) {
            return $bgBlack[0];
        }
        if ($aboutPage.hasClass('white-background')) {
            return null;
        }
        // Default: no class or other class
        return $bgWhite[0];
    }

    // Dominant color calculation with mapping
    function getRegionDominantColor(img, region, callback, square) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = region.width;
        canvas.height = region.height;
        ctx.drawImage(
            img,
            region.x, region.y, region.width, region.height, // source
            0, 0, region.width, region.height                // destination
        );
        const data = ctx.getImageData(0, 0, region.width, region.height).data;
        const colorCounts = {};
        let maxCount = 0;
        let dominantHex = '#000000';
        
        // Optimize: process every 4th pixel for better performance on large regions
        const step = region.width * region.height > 10000 ? 8 : 4;
        for (let i = 0; i < data.length; i += step) {
            let r = data[i], g = data[i + 1], b = data[i + 2];
            let hex = rgbToHex(r, g, b).toLowerCase();
            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            if (colorCounts[hex] > maxCount) {
                maxCount = colorCounts[hex];
                dominantHex = hex;
            }
        }
        
        const detectedVar = HEX_TO_VAR_NORM[dominantHex];
        let mappedVar = detectedVar ? COLOR_MAP[detectedVar] : null;
        
        // Special case for black
        if (dominantHex === '#000000') {
            const $img = $(img);
            if ($img.hasClass('about-bg-black')) {
                mappedVar = '--magenta';
            } else if ($img.hasClass('about-bg-white')) {
                mappedVar = '--white';
            }
        }
        
        const finalColor = mappedVar || detectedVar || dominantHex;
        callback(finalColor);
    }

    // Pre-calculate colors for all background states
    function precalculateAllColors() {
        const backgroundStates = [
            { class: 'default', img: $bgWhite },
            { class: 'cyan-background', img: $bgCyan },
            { class: 'black-background', img: $bgBlack },
            { class: 'white-background', img: null } // No image for white background
        ];

        backgroundStates.forEach(state => {
            if (state.img === null) {
                // White background: all squares get --key color
                $squares.each(function() {
                    const squareId = this.id;
                    colorCache[state.class][squareId] = 'var(--key)';
                });
                return;
            }

            const img = state.img[0];
            if (!img || !img.complete) return;

            const imgRect = img.getBoundingClientRect();
            const imgNaturalWidth = img.naturalWidth;
            const imgNaturalHeight = img.naturalHeight;

            $squares.each(function() {
                const squareId = this.id;
                const squareRect = this.getBoundingClientRect();
                const relLeft = squareRect.left - imgRect.left;
                const relTop = squareRect.top - imgRect.top;
                const scaleX = imgNaturalWidth / imgRect.width;
                const scaleY = imgNaturalHeight / imgRect.height;
                const region = {
                    x: Math.max(0, Math.round(relLeft * scaleX)),
                    y: Math.max(0, Math.round(relTop * scaleY)),
                    width: Math.max(1, Math.round(squareRect.width * scaleX)),
                    height: Math.max(1, Math.round(squareRect.height * scaleY))
                };

                getRegionDominantColor(img, region, color => {
                    if (typeof color === 'string' && color.startsWith('--')) {
                        colorCache[state.class][squareId] = `var(${color})`;
                    } else {
                        colorCache[state.class][squareId] = color;
                    }
                }, this);
            });
        });
    }

    // Apply cached colors instantly
    function applyCachedColors(backgroundClass) {
        const cacheKey = backgroundClass || 'default';
        const colors = colorCache[cacheKey];
        
        if (!colors) return;

        $squares.each(function() {
            const squareId = this.id;
            const cachedColor = colors[squareId];
            if (cachedColor) {
                $(this).css('backgroundColor', cachedColor);
            }
        });
    }

    function updateSquaresWithImageColors() {
        const img = getCurrentBgImage();
        if (!img || !img.complete) {
            // No visible image: do nothing
            return;
        }
        const imgRect = img.getBoundingClientRect();
        const imgNaturalWidth = img.naturalWidth;
        const imgNaturalHeight = img.naturalHeight;
        
        $squares.each(function() {
            const squareRect = this.getBoundingClientRect();
            const relLeft = squareRect.left - imgRect.left;
            const relTop = squareRect.top - imgRect.top;
            const scaleX = imgNaturalWidth / imgRect.width;
            const scaleY = imgNaturalHeight / imgRect.height;
            const region = {
                x: Math.max(0, Math.round(relLeft * scaleX)),
                y: Math.max(0, Math.round(relTop * scaleY)),
                width: Math.max(1, Math.round(squareRect.width * scaleX)),
                height: Math.max(1, Math.round(squareRect.height * scaleY))
            };
            getRegionDominantColor(img, region, color => {
                if (typeof color === 'string' && color.startsWith('--')) {
                    $(this).css('backgroundColor', `var(${color})`);
                } else {
                    $(this).css('backgroundColor', color);
                }
            }, this);
        });
    }

    function updateAboutPageSquares() {
        updateAboutPageBgPositioning();
        updateSquaresWithImageColors();
    }

    // Optimized initialization with jQuery ready
    $(function() {
        setTimeout(() => {
            observeStoryGridPosition();
            // Pre-calculate all colors first
            precalculateAllColors();
            // Then apply current state
            const currentClass = BACKGROUND_CLASSES.find(cls => $aboutPage.hasClass(cls));
            applyCachedColors(currentClass);
        }, 10);
    });

    // Optimized resize handling with jQuery throttling
    function onResizeAbout() {
        setTimeout(() => {
            updateAboutPageSquares();
        }, 50);
    }
    
    let resizeTimeoutAbout;
    $(window).on('resize', function() {
        clearTimeout(resizeTimeoutAbout);
        resizeTimeoutAbout = setTimeout(onResizeAbout, 200);
    });

    // Watch for background image changes on #about-page
    if ($aboutPage.length) {
        let lastClass = $aboutPage[0].className;
        const observer = new MutationObserver(() => {
            if ($aboutPage[0].className !== lastClass) {
                lastClass = $aboutPage[0].className;
                // Find the new background class
                const newClass = BACKGROUND_CLASSES.find(cls => $aboutPage.hasClass(cls));
                // Apply cached colors instantly (no delay!)
                applyCachedColors(newClass);
            }
        });
        observer.observe($aboutPage[0], { attributes: true, attributeFilter: ['class'] });
    }

    // Debug function to get color mapping output for a given square id
    window.debugSquareColor = function(squareId) {
        const $square = $('#about-square-' + squareId);
        if (!$square.length) {
            console.log('No square found with id:', squareId);
            return;
        }
        
        const img = getCurrentBgImage();
        if (!img || !img.complete) {
            console.log('No visible image or image not loaded.');
            return;
        }
        
        const imgRect = img.getBoundingClientRect();
        const imgNaturalWidth = img.naturalWidth;
        const imgNaturalHeight = img.naturalHeight;
        const squareRect = $square[0].getBoundingClientRect();
        const relLeft = squareRect.left - imgRect.left;
        const relTop = squareRect.top - imgRect.top;
        const scaleX = imgNaturalWidth / imgRect.width;
        const scaleY = imgNaturalHeight / imgRect.height;
        const region = {
            x: Math.max(0, Math.round(relLeft * scaleX)),
            y: Math.max(0, Math.round(relTop * scaleY)),
            width: Math.max(1, Math.round(squareRect.width * scaleX)),
            height: Math.max(1, Math.round(squareRect.height * scaleY))
        };
        
        getRegionDominantColor(img, region, function(color) {
            // For debugging, rerun the dominant color logic here to get all the details
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = region.width;
            canvas.height = region.height;
            ctx.drawImage(
                img,
                region.x, region.y, region.width, region.height,
                0, 0, region.width, region.height
            );
            const data = ctx.getImageData(0, 0, region.width, region.height).data;
            const colorCounts = {};
            let maxCount = 0;
            let dominantHex = '#000000';
            for (let i = 0; i < data.length; i += 4) {
                let r = data[i], g = data[i + 1], b = data[i + 2];
                let hex = rgbToHex(r, g, b).toLowerCase();
                colorCounts[hex] = (colorCounts[hex] || 0) + 1;
                if (colorCounts[hex] > maxCount) {
                    maxCount = colorCounts[hex];
                    dominantHex = hex;
                }
            }
            const detectedVar = HEX_TO_VAR_NORM[dominantHex];
            const mappedVar = detectedVar ? COLOR_MAP[detectedVar] : null;
            const finalColor = mappedVar || detectedVar || dominantHex;
            console.log('DebugSquareColor:', {
                square: $square[0],
                dominantHex,
                detectedVar,
                mappedVar,
                finalColor
            });
        }, $square[0]);
    };
}