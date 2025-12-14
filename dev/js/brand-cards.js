// Function to create a card component on the BRANDS page
function createCard(imageUrl, title, description, cardLink, mobileImageUrl = null) {
    // Create the main card container
    const card = document.createElement('a');
    card.className = 'brand-card hover-style-two';
    card.href = cardLink;


    // Create the image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'card__image-container';

    // Create and set up the desktop image (hidden on sm breakpoint if mobile image exists)
    const image = document.createElement('img');
    image.className = mobileImageUrl ? 'card__image card__image--desktop' : 'card__image';
    image.src = imageUrl;
    image.alt = title;
    imageContainer.appendChild(image);

    // Create and set up the mobile image (only shown on sm breakpoint if provided)
    if (mobileImageUrl) {
        const mobileImage = document.createElement('img');
        mobileImage.className = 'card__image card__image--mobile';
        mobileImage.src = mobileImageUrl;
        mobileImage.alt = title;
        imageContainer.appendChild(mobileImage);
    }

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
        imageUrl: 'assets/brands-pg/b1d_the-window-thumbnail.jpg',
        mobileImageUrl: 'assets/brands-pg/b1m_the-window-thumbnail.jpg',
        title: 'The Window',
        description: "Philly's new hole in the wall",
        cardLink: 'the-window.html'
    },
    {
        imageUrl: 'assets/brands-pg/b2d_lemonade-stand-thumbnail.jpg',
        mobileImageUrl: 'assets/brands-pg/b2m_lemonade-stand-thumbnail.jpg',
        title: 'The Lemonade Stand',
        description: 'DIY performing arts gets juicy',
        cardLink: 'lemonade-stand.html'
    },
    {
        imageUrl: 'assets/brands-pg/b3d_those-eyes-thumbnail.jpg',
        mobileImageUrl: 'assets/brands-pg/b3m_those-eyes-thumbnail.jpg',
        title: 'Those Eyes', 
        description: 'Prepare to be psychologically thrilled',
        cardLink: 'those-eyes.html'
    },
    {
        imageUrl: 'assets/brands-pg/b4-desktopASPthumbnail.png',
        mobileImageUrl: 'assets/brands-pg/b4-mobileASPthumbnail.png',
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
                cardData.cardLink,
                cardData.mobileImageUrl
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


