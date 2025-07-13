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

    if (!nextProjectData) {
        // Hide the next project section if no data found
        const nextProjectElement = document.querySelector('.next-project');
        if (nextProjectElement) {
            nextProjectElement.style.display = 'none';
        }
        return;
    }
    
    // Update the link href
    const nextProjectLink = document.querySelector('.next-project a');
    if (nextProjectLink) {
        nextProjectLink.href = `${nextProjectData['next-page']}.html`;
    }
    
    // Update the project title
    const projectTitle = document.querySelector('.next-project h2');
    if (projectTitle) {
        // Split the text by spaces and add <br> between each word
        const words = nextProjectData['next-text'].split(' ');
        projectTitle.innerHTML = words.join('<br>');
    }
    
    // Update the image
    const projectImg = document.querySelector('.next-project-img');
    if (projectImg) {
        // Update the ID to match the next project
        projectImg.id = nextProjectData['next-page'];
        
        // Update the background image
        projectImg.style.backgroundImage = `url("${nextProjectData['next-img']}")`;
    }
}

// Check if the current page is a project page
if (document.querySelector('body').classList.contains('project-page')) {
    // Run the update function when the DOM is loaded
    document.addEventListener('DOMContentLoaded', updateNextProject);

    // Also run on page load for cases where DOMContentLoaded might have already fired
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateNextProject);
    } else {
        updateNextProject();
    }
}