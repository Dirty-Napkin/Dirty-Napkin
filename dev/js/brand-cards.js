// Function to create a card component
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
        imageUrl: 'assets/test/Those Eyes image.jpg',
        title: 'Those Eyes',
        description: 'Prepare to be psychologically thrilled',
        cardLink: 'google.com'
    },
    {
        imageUrl: 'assets/test/Those Eyes image.jpg', 
        title: 'The Lemonade Stand',
        description: 'Prepare to be psychologically thrilled',
        cardLink: 'google.com'
    },
    {
        imageUrl: 'assets/test/Those Eyes image.jpg',
        title: 'The Window', 
        description: 'Prepare to be psychologically thrilled',
        cardLink: 'google.com'
    },
    {
        imageUrl: 'assets/test/Those Eyes image.jpg',
        title: 'American Scripture Project',
        description: 'Prepare to be psychologically thrilled',
        cardLink: 'google.com'
    },
    {
        imageUrl: 'assets/test/Those Eyes image.jpg',
        title: 'American Scripture Project',
        description: 'Prepare to be psychologically thrilled',
        cardLink: 'google.com'
    },
    {
        imageUrl: 'assets/test/Those Eyes image.jpg',
        title: 'American Scripture Project',
        description: 'Prepare to be psychologically thrilled',
        cardLink: 'google.com'
    }
];

console.log("ready to populate cards!");


// Create and append all cards when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.brand-card-grid');
    if (gridContainer) {
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
});


