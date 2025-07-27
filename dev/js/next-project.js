const data = [
    {
        "current-page": "the-window",
        "next-page": "lemonade-stand",
        "next-text": "The Lemonade Stand",
        "next-img": "assets/company-pages/h3_lemonade-stand-thumbnail.jpg"
    },
    {
        "current-page": "lemonade-stand",
        "next-page": "those-eyes",
        "next-text": "Those Eyes",
        "next-img": "assets/company-pages/h4_those-eyes-thumbnail.jpg"
    },
    {
        "current-page": "those-eyes",
        "next-page": "american-scripture-project",
        "next-text": "American Scripture Project",
        "next-img": "assets/company-pages/h6_asp-thumbnail.jpg"
    },
    {
        "current-page": "american-scripture-project",
        "next-page": "the-window",
        "next-text": "The Window",
        "next-img": "assets/company-pages/h2_the-window-thumbnail.jpg"
    }
];

// Function to get current page name from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    const pageName = filename.replace('.html', '');
    
    return pageName;
}

// Function to find next project data
function getNextProjectData(currentPage) {
    return data.find(item => item['current-page'] === currentPage);
}

// Function to update the next project content
function updateNextProject() {
    const currentPage = getCurrentPage();
    const nextProjectData = getNextProjectData(currentPage);

    // Cache jQuery objects for better performance
    const $nextProject = $('.next-project');
    const $nextProjectLink = $nextProject.find('a');
    const $projectTitle = $nextProject.find('h2');
    const $projectImg = $('.next-project-img');

    if (!nextProjectData) {
        // Hide the next project section if no data found
        if ($nextProject.length) {
            $nextProject.css('display', 'none');
        }
        return;
    }
    
    // Update the link href
    if ($nextProjectLink.length) {
        $nextProjectLink.attr('href', `${nextProjectData['next-page']}.html`);
    }
    
    // Update the project title
    if ($projectTitle.length) {
        // Split the text by spaces and add <br> between each word
        const words = nextProjectData['next-text'].split(' ');
        $projectTitle.html(words.join('<br>'));
    }
    
    // Update the image
    if ($projectImg.length) {
        // Update the ID to match the next project
        $projectImg.attr('id', nextProjectData['next-page']);
        
        // Update the background image
        $projectImg.css('backgroundImage', `url("${nextProjectData['next-img']}")`);
    }
}

// Check if the current page is a project page and initialize
$(document).ready(() => {
    if ($('body').hasClass('project-page')) {
        updateNextProject();
    }
});