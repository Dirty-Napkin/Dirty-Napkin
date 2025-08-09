/*-----------------
Mobile Menu Animation
-----------------*/

$(document).ready(() => {
    const $menuButton = $('#mobile-menu-button');
    let isMenuOpen = false;
    let squares = [];
    
    // Create squares container
    const $squaresContainer = $('<div>')
        .addClass('mobile-nav-squares-overlay')
        .insertAfter('header');
    
    // Get existing nav elements
    const $navContainer = $('nav .nav-container'); // Nav container
    const $navItems = $navContainer.find('.nav-item'); // Mobile nav items
    
    // Helper: apply/remove mobile line breaks (<br>) in link text
    function updateMobileLineBreaks(isMobile) {
        $navItems.find('a').each(function() {
            const $link = $(this);
            const original = $link.data('originalText');
            // Ensure we cache original plain text once
            if (!original) {
                $link.data('originalText', $link.text());
            }
            const cached = $link.data('originalText');
            if (isMobile) {
                // Replace spaces with <br> for mobile
                const withBreaks = cached.replace(/\s+/g, '<br>');
                $link.html(withBreaks);
            } else {
                // Restore original text for desktop
                if (cached) {
                    $link.text(cached);
                }
            }
        });
    }

    // Function to measure and apply widths when menu is actually visible
    function measureAndApplyWidths(keepActive = false) {
        if ($(window).width() < 900) {
            // Temporarily make nav items visible for measurement but hidden
            $navContainer.addClass('active').css('visibility', 'hidden');

            $navItems.each(function() {
                const $navItem = $(this);
                const $link = $navItem.find('a');
                
                // Check if wrapper is already created
                if ($navItem.find('.mobile-nav-item-wrapper').length > 0) {
                    return;
                }
                
                // Create wrapper
                const $wrapper = $('<div>').addClass('mobile-nav-item-wrapper');
                $link.wrap($wrapper);
                
                // Temporarily disable animation and set to measurement states
                const originalLetterSpacing = $link.css('letter-spacing');

                // Measure base width at 0em (no tracking)
                $link.css({ 'animation': 'none', 'letter-spacing': '0' });
                $link[0].offsetHeight;
                const baseWidth = $link[0].getBoundingClientRect().width;

                // Measure final (0.3em)
                $link.css('letter-spacing', '0.3em');
                $link[0].offsetHeight;
                const finalWidth = $link[0].getBoundingClientRect().width;

                // Measure max (0.4em)
                $link.css('letter-spacing', '0.4em');
                $link[0].offsetHeight;
                const maxWidth = $link[0].getBoundingClientRect().width;

                // Compute spacing deltas using actual font size and character gaps
                const fontSizePx = parseFloat(window.getComputedStyle($link[0]).fontSize);
                const gaps = Math.max(0, $link.text().trim().length - 1);
                const space03 = 0.3 * fontSizePx;
                const space04 = 0.4 * fontSizePx;

                // Expected widths without any trailing artifacts
                const expectedFinal = baseWidth + gaps * space03;
                const expectedMax = baseWidth + gaps * space04;

                // Trailing spacing (browser/layout artifacts at the end)
                const trailing03 = Math.max(0, finalWidth - expectedFinal);
                const trailing04 = Math.max(0, maxWidth - expectedMax);

                // Final glyph width (at 0.3em) and max content width (at 0.4em), both without trailing
                const finalGlyphWidth = Math.max(0, finalWidth - trailing03);
                const linkWidth = Math.max(0, maxWidth - trailing04);

                // Apply styles back to link (no positional shift)
                $link.css({
                    'animation': '',
                    'letter-spacing': originalLetterSpacing,
                    'text-align': 'center',
                    'display': 'inline-block',
                    'width': linkWidth + 'px'
                });

                // Wrapper stays right-aligned sized to final glyph width
                $wrapper.css({
                    'position': 'relative',
                    'display': 'flex',
                    'justify-content': 'flex-end',
                    'width': finalGlyphWidth + 'px'
                });
            });
            
            // Restore original state, but keep active class if requested
            if (!keepActive) {
                $navContainer.removeClass('active').css('visibility', '');
            } else {
                $navContainer.css('visibility', 'visible');
            }
        }
    }
    
    // Remove puzzle classes from mobile nav links only on mobile devices
    if ($(window).width() < 900) {
        $navItems.find('a').removeClass('puzzle-type puzzle-hover').attr('data-no-puzzle', 'true');
        
        // Remove any existing puzzle spans that might have been created
        $navItems.find('a span').remove();
        
        // Restore original text for mobile nav items (then apply mobile breaks)
        $navItems.find('a').each(function() {
            const $link = $(this);
            if (!$link.data('originalText')) {
                $link.data('originalText', $link.text());
            }
        });
        
        // Apply mobile line breaks
        updateMobileLineBreaks(true);
        
        // Create wrappers for mobile
        measureAndApplyWidths();
    }
    
    // Configuration for mobile only (hidden at md breakpoint)
    // const squareSize = $(window).width() / 3; // Always 3 columns
    // const gridCols = 3;
    
    // Calculate rows needed to fill screen height
    // const gridRows = Math.ceil($(window).height() / squareSize);
    
    // Generate squares based on screen size
    function generateSquares() {
        // Recalculate square size and rows based on current screen size
        const squareSize = $(window).width() / 3; // Always 3 columns
        const gridCols = 3;
        const gridRows = Math.ceil($(window).height() / squareSize);
        
        const totalSquares = gridCols * gridRows;
        
        // Clear existing squares
        $squaresContainer.empty();
        squares = [];
        
        // Create squares
        for (let i = 0; i < totalSquares; i++) {
            const row = Math.floor(i / gridCols);
            const col = i % gridCols;
            
            const leftPos = col * squareSize;
            const topPos = row * squareSize;
            
            const $square = $('<div>')
                .addClass('menu-square')
                .attr('data-index', i)
                .css({
                    width: squareSize + 'px',
                    height: squareSize + 'px',
                    left: leftPos + 'px',
                    top: topPos + 'px'
                });
            
            $squaresContainer.append($square);
            squares.push($square);
        }
        
        // If menu is open, animate the new squares in
        if (isMenuOpen) {
            squares.forEach((square) => {
                square.addClass('animate-in');
            });
        }
    }
    
    // Initialize squares on load
    generateSquares();
    
    // Regenerate squares on resize
    $(window).on('resize', function() {
        console.log('Resize detected, menu open:', isMenuOpen);
        
        // Handle puzzle classes and wrappers based on screen size
        if ($(window).width() >= 900) {
            // Desktop: restore puzzle classes and remove wrappers
            $navItems.find('a').addClass('puzzle-type puzzle-hover').removeAttr('data-no-puzzle');
            
            // Remove wrappers if they exist
            $navItems.find('.mobile-nav-item-wrapper').each(function() {
                const $wrapper = $(this);
                const $link = $wrapper.find('a');
                $link.unwrap();
            });
            
            // Restore desktop text (remove mobile line breaks)
            updateMobileLineBreaks(false);
        } else {
            // Mobile: remove puzzle classes and ensure wrappers exist
            $navItems.find('a').removeClass('puzzle-type puzzle-hover').attr('data-no-puzzle', 'true');
            $navItems.find('a span').remove();
            
            // Apply mobile line breaks again (in case of resize)
            updateMobileLineBreaks(true);
            
            // Recalculate wrappers if menu is open
            if (isMenuOpen) {
                measureAndApplyWidths();
            }
        }
        
        if (!isMenuOpen) {
            // Only regenerate squares if menu is closed
            generateSquares();
        } else {
            // If menu is open, update existing squares and add/remove as needed
            console.log('Updating existing squares size/position');
            const squareSize = $(window).width() / 3;
            const gridCols = 3;
            const gridRows = Math.ceil($(window).height() / squareSize);
            const totalSquares = gridCols * gridRows;
            
            // Add more squares if needed
            while (squares.length < totalSquares) {
                const i = squares.length;
                const row = Math.floor(i / gridCols);
                const col = i % gridCols;
                
                const leftPos = col * squareSize;
                const topPos = row * squareSize;
                
                const $square = $('<div>')
                    .addClass('menu-square')
                    .attr('data-index', i)
                    .css({
                        width: squareSize + 'px',
                        height: squareSize + 'px',
                        left: leftPos + 'px',
                        top: topPos + 'px',
                        transform: 'scale(1)',
                        opacity: '1'
                    });
                
                $squaresContainer.append($square);
                squares.push($square);
            }
            
            // Remove excess squares if needed
            while (squares.length > totalSquares) {
                const removedSquare = squares.pop();
                removedSquare.remove();
            }
            
            // Update all squares size/position
            squares.forEach((square, i) => {
                const row = Math.floor(i / gridCols);
                const col = i % gridCols;
                
                const leftPos = col * squareSize;
                const topPos = row * squareSize;
                
                square.css({
                    width: squareSize + 'px',
                    height: squareSize + 'px',
                    left: leftPos + 'px',
                    top: topPos + 'px'
                });
            });
        }
    });
    
    // Menu button click handler
    $menuButton.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isMenuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    const $dnLogo = $('#mobile-logo');
    
    // Open menu animation
    function openMenu() {
        isMenuOpen = true;
        
        // Show squares container
        $squaresContainer.addClass('active');
        
        // Animate all squares in simultaneously from center
        squares.forEach((square) => {
            square.addClass('animate-in');
        });
        
        // Update header and show menu items immediately
        $menuButton.text('close').addClass('menu-active');
        $dnLogo.attr('src', 'assets/logo_white_trans.svg');
        
        $navContainer.addClass('active');
        $navContainer.css('visibility', 'visible'); // Show nav container
        
        // Measure and apply widths on first open
        setTimeout(() => {
            measureAndApplyWidths(true); // Keep active class when called from openMenu
        }, 10); // Small delay to ensure menu is fully rendered
    }
    
    // Close menu animation
    function closeMenu() {
        isMenuOpen = false;
        
        // Add closing animation to menu items
        $navItems.addClass('closing');
        
        // Hide mobile menu overlay and reset header immediately
        $menuButton.text('menu').removeClass('menu-active');
        $dnLogo.attr('src', 'assets/logo.svg');
        
        // Animate all squares out simultaneously
        squares.forEach((square) => {
            square.removeClass('animate-in').addClass('animate-out');
        });
        
        // Wait for menu items to animate out before hiding them
        setTimeout(() => {
            $navContainer.removeClass('active'); // Hide nav container
            // Remove closing animation class
            $navItems.removeClass('closing');
        }, 400); // Match the menuItemGrowOut duration
        
        // Hide squares container after animation
        setTimeout(() => {
            $squaresContainer.removeClass('active');
            squares.forEach(square => {
                square.removeClass('animate-out');
            });
        }, 600);
    }
    
    // Close menu on escape key
    $(document).on('keydown', function(e) {
        if (isMenuOpen && e.key === 'Escape') {
            closeMenu();
        }
    });
}); 