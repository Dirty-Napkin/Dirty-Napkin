// Function to create a card component on the BRANDS page
function createCard(imageUrl, title, description, cardLink) {
    // Create the main card container
    const card = document.createElement('a');
    card.className = 'brand-card';
    card.href = cardLink;


    // Create the image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'card__image-container';

    // Create and set up the image
    const image = document.createElement('img');
    image.className = 'card__image';
    image.src = imageUrl;
    image.alt = title;
    imageContainer.appendChild(image);

    // Create the content container
    const content = document.createElement('div');
    content.className = 'card__content';

    // Create and set up the title
    const titleElement = document.createElement('h3');
    titleElement.className = 'card__title';
    titleElement.textContent = title;

    // Create and set up the description
    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'card__description';
    descriptionElement.textContent = description;

    // Assemble the card
    content.appendChild(titleElement);
    content.appendChild(descriptionElement);
    card.appendChild(imageContainer);
    card.appendChild(content);

    return card;
}

// Create multiple cards with different content
const cardsData = [
    {
        imageUrl: 'assets/brands-pg/b1_window-thumbnail.jpg',
        title: 'The Window',
        description: "Philly's new hole in the wall",
        cardLink: 'the-window.html'
    },
    {
        imageUrl: 'assets/company-pages/h3_lemonade-stand-thumbnail.jpg', 
        title: 'The Lemonade Stand',
        description: 'DIY performing arts gets juicy',
        cardLink: 'lemonade-stand.html'
    },
    {
        imageUrl: 'assets/company-pages/h4_those-eyes-thumbnail.jpg',
        title: 'Those Eyes', 
        description: 'Prepare to be psychologically thrilled',
        cardLink: 'those-eyes.html'
    },
    {
        imageUrl: 'assets/company-pages/h6_asp-thumbnail.jpg',
        title: 'American Scripture Project',
        description: 'Unity through shared experiences',
        cardLink: 'american-scripture-project.html'
    }
];


// Create and append all cards when DOM loads - ONLY on brands page
function initBrandCards() {
    // Check if we're on the brands page by looking for the brand-card-grid container
    const gridContainer = document.querySelector('.brand-card-grid');
    if (gridContainer) {
        console.log("Brands page detected - creating cards...");
        cardsData.forEach(cardData => {
            const card = createCard(
                cardData.imageUrl,
                cardData.title,
                cardData.description,
                cardData.cardLink
            );
            gridContainer.appendChild(card);
        });
    }
}

// Run immediately if DOM is already loaded, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrandCards);
} else {
    // DOM is already loaded
    initBrandCards();
}


