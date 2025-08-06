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
        if (!isMenuOpen) {
            generateSquares();
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
        
        // Update header with delay
        setTimeout(() => {
            $menuButton.text('close').addClass('menu-active');
            $dnLogo.attr('src', 'assets/logo_white_trans.svg');
        }, 100);
    }
    
    // Close menu animation
    function closeMenu() {
        isMenuOpen = false;
        
        // Reset header with delay
        setTimeout(() => {
            $menuButton.text('menu').removeClass('menu-active');
            $dnLogo.attr('src', 'assets/logo.svg');
        }, 100);
        
        // Animate all squares out simultaneously
        squares.forEach((square) => {
            square.removeClass('animate-in').addClass('animate-out');
        });
        
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