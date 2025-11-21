const data = [
    {
        currentPage: "the-window",
        nextPage: "lemonade-stand",
        nextText: "The Lemonade Stand",
        nextImg: "assets/company-pages/h3_lemonade-stand-thumbnail.jpg"
    },
    {
        currentPage: "lemonade-stand",
        nextPage: "those-eyes",
        nextText: "Those Eyes",
        nextImg: "assets/company-pages/h4_those-eyes-thumbnail.jpg"
    },
    {
        currentPage: "those-eyes",
        nextPage: "american-scripture-project",
        nextText: "American Scripture Project",
        nextImg: "assets/company-pages/h6_asp-thumbnail.jpg"
    },
    {
        currentPage: "american-scripture-project",
        nextPage: "the-window",
        nextText: "The Window",
        nextImg: "assets/company-pages/h2_the-window-thumbnail.jpg"
    }
];

// Update the next project content
function updateNextProject() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const nextProject = data.find(item => item.currentPage === currentPage);

    if (!nextProject) {
        $('.next-project').hide();
        return;
    }
    
    const $nextProject = $('.next-project');
    $nextProject.find('a').attr('href', `${nextProject.nextPage}.html`);
    $nextProject.find('h2').html(nextProject.nextText.split(' ').join('<br>'));
    
    const $projectImg = $('.next-project-img');
    $projectImg.attr('id', nextProject.nextPage);
    $projectImg.attr('src', nextProject.nextImg);
}

// Initialize on project pages
$(document).ready(() => {
    if ($('body').hasClass('project-page')) {
        updateNextProject();
    }
});