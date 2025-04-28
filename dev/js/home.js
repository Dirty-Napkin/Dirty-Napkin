
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