// Only run script if #about-page is present
if (document.querySelector('#about-page')) {
    /*-----------------
    About Page Background Image Positioning
    -----------------*/
    function positionAboutBgImages() {
        const storyGrid = document.querySelector('.story-grid');
        const bgImgs = document.querySelectorAll('.about-bg-img');
        if (!storyGrid || !bgImgs.length) return;

        const aboutPage = document.getElementById('about-page');
        let top = storyGrid.offsetTop;
        if (aboutPage && storyGrid.offsetParent !== aboutPage) {
            const storyRect = storyGrid.getBoundingClientRect();
            const aboutRect = aboutPage.getBoundingClientRect();
            top = storyRect.top - aboutRect.top + aboutPage.scrollTop;
        }
        top = top - 100; // Move 100px above the top of story-grid

        bgImgs.forEach(img => {
            img.style.top = `${top}px`;
        });
    }

    function updateAboutPageBgPositioning() {
        positionAboutBgImages();
    }

    function observeStoryGridPosition() {
        const storyGrid = document.querySelector('.story-grid');
        if (!storyGrid) return;
        updateAboutPageBgPositioning();
        const ro = new ResizeObserver(() => {
            updateAboutPageBgPositioning();
        });
        ro.observe(storyGrid);
        const main = document.querySelector('main');
        if (main) ro.observe(main);
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
        const aboutPage = document.getElementById('about-page');
        if (!aboutPage) return null;
        if (aboutPage.classList.contains('cyan-background')) {
            return document.querySelector('.about-bg-cyan');
        }
        if (aboutPage.classList.contains('black-background')) {
            return document.querySelector('.about-bg-black');
        }
        if (aboutPage.classList.contains('white-background')) {
            return null;
        }
        // Default: no class or other class
        return document.querySelector('.about-bg-white');
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
        let mappedVar = detectedVar ? COLOR_MAP[detectedVar] : null;
        // Special case for black
        if (dominantHex === '#000000') {
            const imgClass = img.classList;
            if (imgClass.contains('about-bg-black')) {
                mappedVar = '--magenta';
            } else if (imgClass.contains('about-bg-white')) {
                mappedVar = '--white';
            }
        }
        const finalColor = mappedVar || detectedVar || dominantHex;
        callback(finalColor);
    }

    // Pre-calculate colors for all background states
    function precalculateAllColors() {
        const backgroundStates = [
            { class: 'default', img: '.about-bg-white' },
            { class: 'cyan-background', img: '.about-bg-cyan' },
            { class: 'black-background', img: '.about-bg-black' },
            { class: 'white-background', img: null } // No image for white background
        ];

        backgroundStates.forEach(state => {
            if (state.img === null) {
                // White background: all squares get --key color
                document.querySelectorAll('.square.color-change').forEach(square => {
                    const squareId = square.id;
                    colorCache[state.class][squareId] = 'var(--key)';
                });
                return;
            }

            const img = document.querySelector(state.img);
            if (!img || !img.complete) return;

            const imgRect = img.getBoundingClientRect();
            const imgNaturalWidth = img.naturalWidth;
            const imgNaturalHeight = img.naturalHeight;

            document.querySelectorAll('.square.color-change').forEach(square => {
                const squareId = square.id;
                const squareRect = square.getBoundingClientRect();
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
                }, square);
            });
        });
    }

    // Apply cached colors instantly
    function applyCachedColors(backgroundClass) {
        const cacheKey = backgroundClass || 'default';
        const colors = colorCache[cacheKey];
        
        if (!colors) return;

        document.querySelectorAll('.square.color-change').forEach(square => {
            const squareId = square.id;
            const cachedColor = colors[squareId];
            if (cachedColor) {
                square.style.backgroundColor = cachedColor;
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
        document.querySelectorAll('.square.color-change').forEach(square => {
            const squareRect = square.getBoundingClientRect();
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
                    square.style.backgroundColor = `var(${color})`;
                } else {
                    square.style.backgroundColor = color;
                }
            }, square);
        });
    }

    function updateAboutPageSquares() {
        updateAboutPageBgPositioning();
        updateSquaresWithImageColors();
    }

    window.addEventListener('load', function () {
        setTimeout(() => {
            observeStoryGridPosition();
            // Pre-calculate all colors first
            precalculateAllColors();
            // Then apply current state
            const aboutPage = document.getElementById('about-page');
            const currentClass = Array.from(aboutPage.classList).find(cls => 
                ['cyan-background', 'black-background', 'white-background'].includes(cls)
            );
            applyCachedColors(currentClass);
        }, 10);
    });
    function onResizeAbout() {
        setTimeout(() => {
            updateAboutPageSquares();
        }, 50);
    }
    let resizeTimeoutAbout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeoutAbout);
        resizeTimeoutAbout = setTimeout(onResizeAbout, 200);
    });

    // Watch for background image changes on #about-page
    const aboutPage = document.getElementById('about-page');
    if (aboutPage) {
        let lastClass = aboutPage.className;
        const observer = new MutationObserver(() => {
            if (aboutPage.className !== lastClass) {
                lastClass = aboutPage.className;
                // Find the new background class
                const newClass = Array.from(aboutPage.classList).find(cls => 
                    ['cyan-background', 'black-background', 'white-background'].includes(cls)
                );
                // Apply cached colors instantly (no delay!)
                applyCachedColors(newClass);
            }
        });
        observer.observe(aboutPage, { attributes: true, attributeFilter: ['class'] });
    }

    // Debug function to get color mapping output for a given square id
    window.debugSquareColor = function(squareId) {
        const square = document.getElementById('about-square-' + squareId);
        if (!square) {
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
        const squareRect = square.getBoundingClientRect();
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
                square,
                dominantHex,
                detectedVar,
                mappedVar,
                finalColor
            });
        }, square);
    };
}