document.addEventListener('DOMContentLoaded', () => {
    const brandItems = document.querySelectorAll('.brands-content img');
    
    brandItems.forEach(item => {
        // Create container for the brand item
        const container = document.createElement('div');
        container.className = 'brand-item';
        item.parentNode.insertBefore(container, item);
        container.appendChild(item);

        // Create hover grid
        const hoverGrid = document.createElement('div');
        hoverGrid.className = 'hover-grid';
        container.appendChild(hoverGrid);

        // Create 5 hover images
        for (let i = 0; i < 5; i++) {
            const hoverImage = document.createElement('div');
            hoverImage.className = 'hover-image';
            hoverImage.style.backgroundImage = `url(${item.src})`;
            
            // Randomly position the hover image in the grid
            const randomRow = Math.floor(Math.random() * 3);
            const randomCol = Math.floor(Math.random() * 3);
            hoverImage.style.gridRow = `${randomRow + 1}`;
            hoverImage.style.gridColumn = `${randomCol + 1}`;
            
            // Add random rotation and slight position offset
            const rotation = (Math.random() - 0.5) * 20; // Random rotation between -10 and 10 degrees
            const offsetX = (Math.random() - 0.5) * 20; // Random X offset between -10 and 10 pixels
            const offsetY = (Math.random() - 0.5) * 20; // Random Y offset between -10 and 10 pixels
            
            hoverImage.style.transform = `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`;
            
            hoverGrid.appendChild(hoverImage);
        }
    });
}); 