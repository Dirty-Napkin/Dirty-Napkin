/*-----------------
Services Section Video Synchronization
Plays all three videos in the services section simultaneously
after a 2-second delay from page load
-----------------*/
function playServicesVideos() {
    // Only run if on the about page
    if (!document.querySelector('#about-page')) {
        return;
    }

    // Select all videos in the services section
    const servicesSection = document.querySelector('.services');
    if (!servicesSection) {
        return;
    }

    const videos = servicesSection.querySelectorAll('video');
    
    if (videos.length === 0) {
        return;
    }

    // Pause all videos initially to ensure they start together
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });

    // Wait 2 seconds after page load, then play all videos simultaneously
    setTimeout(() => {
        videos.forEach(video => {
            video.play().catch(error => {
                console.warn('Video play failed:', error);
            });
        });
    }, 1500);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', playServicesVideos);
} else {
    // DOM is already ready
    playServicesVideos();
}
