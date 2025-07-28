// document.addEventListener("DOMContentLoaded", function () {
//     // Create the custom cursor element
//     let cursor = document.createElement("div");
//     cursor.classList.add("cursors");
//     document.body.appendChild(cursor);
    
//     // Hide the default cursor for the entire document - I don't think this is needed, we do this with css
//     document.documentElement.style.cursor = "none";
//     document.body.style.cursor = "none";
//     // This line removes the default cursor from all elements on the page
//         document.querySelectorAll("*").forEach(el => el.style.cursor = "none");

    
//     // Update cursor position
//     document.addEventListener("mousemove", function (e) {
//         cursor.style.left = e.clientX + "px";
//         cursor.style.top = e.clientY + "px";
//     });
    
//     // Detect hover over button and change cursor size
//     document.querySelectorAll("button, a").forEach(element => {
//         element.addEventListener("mouseenter", function () {
//             if (element.tagName.toLowerCase() === 'button') {
//                 cursor.classList.add("hover-button");
//             } else if (element.tagName.toLowerCase() === 'a') {
//                 // Set CSS custom properties for link dimensions
//                 const rect = element.getBoundingClientRect();
//                 cursor.style.setProperty('--link-width', `${rect.width + 10}px`);
//                 cursor.style.setProperty('--link-height', `${rect.height + 10}px`);
//                 cursor.classList.add("hover-link");
//             }
//         });
        
//         element.addEventListener("mouseleave", function () {
//             cursor.classList.remove("hover-button");
//             cursor.classList.remove("hover-link");
//         });
//     });
// });