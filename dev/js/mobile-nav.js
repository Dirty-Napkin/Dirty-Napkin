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
        
        // Set initial states
        menuSquares.forEach((square) => {
            square.style.transform = 'scale(0)';
            square.style.transition = 'transform 0.5s cubic-bezier(0,.78,.43,1)';
        });
        
        // Animate opacity quickly
        requestAnimationFrame(() => {
            menuLinks.style.transition = 'opacity 0.1s ease';
            menuLinks.style.opacity = '1';
            mobileMenuSquares.style.opacity = '1';
            
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

         // Reverse square animations - scale down simultaneously
         menuSquares.forEach((square) => {
            square.style.transition = 'transform 0.5s cubic-bezier(.8,0,1,.8)';
            square.style.transform = 'scale(0)';
        });
        
        // Fade out menu links immediately (faster than squares)
        //Transition defined at begining of file
        setTimeout(() => {
            menuLinks.style.transition = 'opacity 1s ease';
            menuLinks.style.opacity = '0';
            
            // Hide menu links after fade transition
            setTimeout(() => {
                menuLinks.style.display = 'none';
            }, 201); // Match opacity transition duration
        }, 300);       
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
});

