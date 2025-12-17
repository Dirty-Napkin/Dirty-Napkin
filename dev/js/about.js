/*-----------------
Services Section Video Synchronization
Plays all three Vimeo videos in the services section simultaneously
after a 1.5-second delay from page load
-----------------*/
function playServicesVideos() {
    // Only run if on the about page
    if (!document.querySelector('#about-page')) {
        return;
    }

    // Select all Vimeo iframes in the services section
    const servicesSection = document.querySelector('.services');
    if (!servicesSection) {
        return;
    }

    const iframes = servicesSection.querySelectorAll('iframe[src*="player.vimeo.com"]');
    
    if (iframes.length === 0) {
        return;
    }

    // Wait for Vimeo Player API to be available and iframes to load
    function initVimeoPlayers(retryCount = 0) {
        // Check if Vimeo API is loaded
        if (typeof Vimeo === 'undefined' || !Vimeo.Player) {
            // Retry up to 50 times (5 seconds max)
            if (retryCount < 50) {
                setTimeout(() => initVimeoPlayers(retryCount + 1), 100);
            } else {
                console.error('Vimeo Player API failed to load');
            }
            return;
        }

        const players = [];
        let playersReady = 0;
        const totalPlayers = iframes.length;
        let hasStarted = false;
        
        // Create player instances for each iframe
        iframes.forEach((iframe, index) => {
            try {
                const player = new Vimeo.Player(iframe);
                players.push(player);
                
                // Wait for player to be ready
                player.ready().then(() => {
                    // Pause the video (in case it autoplayed)
                    player.pause().catch(() => {
                        // Ignore pause errors (video might already be paused)
                    });
                    
                    // Reset to beginning
                    player.setCurrentTime(0).catch(() => {
                        // Ignore setCurrentTime errors
                    });
                    
                    playersReady++;
                    
                    // Once all players are ready, wait 1.5 seconds then play all simultaneously
                    if (playersReady === totalPlayers && !hasStarted) {
                        hasStarted = true;
                        setTimeout(() => {
                            // Play all videos simultaneously
                            const playPromises = players.map((p, idx) => {
                                return p.play().then(() => {
                                    console.log(`Video ${idx + 1} started playing`);
                                }).catch(error => {
                                    console.warn(`Vimeo video ${idx + 1} play failed:`, error);
                                });
                            });
                            
                            Promise.all(playPromises).then(() => {
                                console.log('All videos started playing');
                            });
                        }, 1500);
                    }
                }).catch(error => {
                    console.warn('Vimeo player ready failed:', error);
                });
            } catch (error) {
                console.warn('Failed to create Vimeo player:', error);
            }
        });
    }

    // Wait for window load to ensure iframes are loaded, then initialize
    if (document.readyState === 'complete') {
        // Page already loaded, start after a short delay
        setTimeout(() => initVimeoPlayers(), 1000);
    } else {
        // Wait for page to fully load
        window.addEventListener('load', () => {
            setTimeout(() => initVimeoPlayers(), 1000);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', playServicesVideos);
} else {
    // DOM is already ready
    playServicesVideos();
}
