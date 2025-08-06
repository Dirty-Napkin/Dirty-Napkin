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
    const $navUl = $('nav .blank-list'); // Merged nav container
    const $navItems = $navUl.find('.mobile-nav-item'); // Mobile nav items
    
    // Remove puzzle classes from mobile nav links only on mobile devices
    if ($(window).width() < 900) {
        $navItems.find('a').removeClass('puzzle-type puzzle-hover').attr('data-no-puzzle', 'true');
        
        // Remove any existing puzzle spans that might have been created
        $navItems.find('a span').remove();
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
        
        // Handle puzzle classes based on screen size
        if ($(window).width() >= 900) {
            // Desktop: restore puzzle classes
            $navItems.find('a').addClass('puzzle-type puzzle-hover').removeAttr('data-no-puzzle');
        } else {
            // Mobile: remove puzzle classes
            $navItems.find('a').removeClass('puzzle-type puzzle-hover').attr('data-no-puzzle', 'true');
            $navItems.find('a span').remove();
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
        $navUl.addClass('active'); // Show nav container
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
            $navUl.removeClass('active'); // Hide nav container
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