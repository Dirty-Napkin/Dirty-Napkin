console.log("Hello World - Cursor.js is working!");

document.addEventListener("DOMContentLoaded", function () {
    // Create the custom cursor element
    let cursor = document.createElement("div");
    cursor.classList.add("cursors");
    document.body.appendChild(cursor);
    
    // Update cursor position
    document.addEventListener("mousemove", function (e) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });
    
    // Detect hover over button and change cursor size
    document.querySelectorAll("button, a").forEach(element => {
        element.addEventListener("mouseenter", function () {
            if (element.tagName.toLowerCase() === 'button') {
                cursor.classList.add("hover-button");
            } else if (element.tagName.toLowerCase() === 'a') {
                // Set CSS custom properties for link dimensions
                const rect = element.getBoundingClientRect();
                cursor.style.setProperty('--link-width', `${rect.width + 10}px`);
                cursor.style.setProperty('--link-height', `${rect.height + 10}px`);
                cursor.classList.add("hover-link");
            }
        });
        
        element.addEventListener("mouseleave", function () {
            cursor.classList.remove("hover-button");
            cursor.classList.remove("hover-link");
        });
    });
});