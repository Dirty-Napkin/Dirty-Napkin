
// For the ketchup image
document.addEventListener("scroll", () => {
    const ketchupHero = document.querySelector(".ketchup-hero");
    // const ketchupWrapper = document.querySelector(".ketchup-wrapper");

    window.addEventListener("scroll", () => {
        let scrollPosition = window.scrollY;
        // let size = scrollPosition * 0.1;
        ketchupHero.style.marginTop = `calc(90vh - ${scrollPosition * .9}px)`;
        let widthPercentage = Math.min(100, 60 + scrollPosition * 0.1);
        ketchupHero.style.width = `${widthPercentage}vw`;

    })

})

//For the paralax type
document.addEventListener("scroll", () => {
    const container = document.querySelector(".brands-paragraphs");
    const paragraphs = container.querySelectorAll('div');
    const letters = container.querySelectorAll('span');
    const brands = document.querySelector('.brands-content');
    
    const scrolled = window.scrollY;
    const vh = window.innerHeight;

    
     // Adjust this value to control the initial offset

    paragraphs.forEach((paragraph, index) => {
      // Optionally, you can vary the speed a little based on index
      let speed = -0.2; // First one slower, next faster, etc.
  
      let initialOffset = .45 * vh + (index * 150);

      paragraph.style.transform = `translateY(${initialOffset + scrolled * speed}px)`;
    });

    letters.forEach((letter) => {
        // Optionally, you can vary the speed a little based on index
        let speed = 0.4;
    
        let initialOffset = -.7 * vh;
  
        letter.style.transform = `translateY(${initialOffset + scrolled * speed}px)`;
    });
    
    let speed = 0.3; // First one slower, next faster, etc.
  
    const containerHeight = container.offsetHeight;
    let initialOffset = 0.35 * containerHeight;
    brands.style.transform = `translateY(${initialOffset + scrolled * speed}px)`;

  });

// For the black background
const collabs = document.querySelector(".home-container");
const colorTrigger = document.querySelector(".color-trigger");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            collabs.classList.add("black-background");
        } else {
            collabs.classList.remove("black-background");
        }
    });
}, {
    threshold: .1 // <-- move options here, second parameter!
});

observer.observe(colorTrigger);
