document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('nav button.mobile-only');
    const menuLinks = document.querySelector('.menu-links');
    const mobileMenuSquares = document.querySelector('.mobile-menu-squares');
    const menuSquares = document.querySelectorAll('.menu-square');
    const header = document.querySelector('header');
    
    let isOpen = false;
    
    if (!menuButton || !menuLinks || !mobileMenuSquares || !header) {
        return; // Exit if elements don't exist
    }
    
    // Set initial transform styles for squares
    menuSquares.forEach((square) => {
        square.style.transformOrigin = 'center center';
        square.style.transform = 'scale(0)';
    });
    
    // Add menu-closed class by default
    header.classList.add('menu-closed');
    
    function openMenu() {
        isOpen = true;
        
        // Remove mix-blend-mode class
        header.classList.remove('menu-closed');
        
        // Change button text
        menuButton.textContent = 'close';
        
        // Show containers
        menuLinks.style.display = 'flex';
        mobileMenuSquares.style.display = 'grid';
        
        // Force reflow to ensure display change is applied
        void menuLinks.offsetHeight;
        void mobileMenuSquares.offsetHeight;
        
        // Reset letter spacing animation state for re-triggering
        const linkElements = menuLinks.querySelectorAll('a');
        linkElements.forEach(link => {
            link.style.transition = '';
            link.style.letterSpacing = '';
        });
        
        // Force reflow after reset to ensure styles are cleared
        void linkElements[0]?.offsetHeight;
        
        // Set initial states
        menuSquares.forEach((square) => {
            square.style.transform = 'scale(0)';
            square.style.transition = 'transform 0.5s cubic-bezier(0,.78,.43,1)';
        });
        
        // Animate opacity quickly
        requestAnimationFrame(() => {
            menuLinks.style.transition = 'opacity 0.5s ease';
            menuLinks.style.opacity = '1';
            mobileMenuSquares.style.opacity = '1';
            
            // Letter spacing animation on menu links
            linkElements.forEach(link => {
                link.style.letterSpacing = '1rem';
            });
            
            // Return letter spacing to default after 100ms
            setTimeout(() => {
                linkElements.forEach(link => {
                    link.style.transition = 'letter-spacing 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6)';
                    link.style.letterSpacing = 'inherit';
                });
            }, 1);
            
            // Animate all squares simultaneously
            requestAnimationFrame(() => {
                menuSquares.forEach((square) => {
                    square.style.transform = 'scale(1)';
                });
            });
        });
    }
    
    function closeMenu() {
        isOpen = false;
        
        // Change button text
        menuButton.textContent = 'menu';

        // Letter spacing animation on menu links (close)
        const linkElements = menuLinks.querySelectorAll('a');
        linkElements.forEach(link => {
            link.style.transition = 'letter-spacing 0.65s cubic-bezier(.7,-0.87,1,.99)';
            link.style.letterSpacing = '-3rem';
        });

         // Reverse square animations - scale down simultaneously
         menuSquares.forEach((square) => {
            square.style.transition = 'transform 0.5s cubic-bezier(.8,0,1,.8)';
            square.style.transform = 'scale(0)';
        });
        
        // Fade out menu links immediately (faster than squares)
        //Transition defined at begining of file
        setTimeout(() => {
            menuLinks.style.transition = 'opacity 0.5s ease';
            menuLinks.style.opacity = '0';
            
            // Hide menu links after fade transition
            setTimeout(() => {
                menuLinks.style.display = 'none';
            }, 201); // Match opacity transition duration
        }, 200);       
            // Hide after opacity transition
            setTimeout(() => {
                mobileMenuSquares.style.display = 'none';

                
                // Restore mix-blend-mode class after animation completes
                header.classList.add('menu-closed');
            }, 501); // Match transition duration

    }
    
    menuButton.addEventListener('click', function() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });


    // on resize between md and lg breakpoints (scaled up OR down) reload the page
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const windowWidth = window.innerWidth;
            const mdBreakpoint = 768;
            const lgBreakpoint = 1024;
            
            // Check if window width is between md and lg breakpoints
            if (windowWidth >= mdBreakpoint && windowWidth < lgBreakpoint) {
                // Reload the page when resizing within md-lg range
                window.location.reload();
            }
        }, 150); // Debounce resize events
    });
});



