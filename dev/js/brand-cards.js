// Function to create a card component
function createCard(imageUrl, title, description, cardLink, id) {
    // Create the main card container
    const card = document.createElement('a');
    card.className = 'brand-card';
    card.href = cardLink;
    card.id = id;


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
        imageUrl: 'https://placehold.co/1272x820.jpg',
        title: 'The Window',
        description: "Philly's new hole in the wall",
        cardLink: 'the-window.html',
        id: 'B1'
    },
    {
        imageUrl: 'https://placehold.co/1272x820.jpg', 
        title: 'The Lemonade Stand',
        description: 'DIY performing arts gets juicy',
        cardLink: 'lemonade-stand.html',
        id: 'B2'
    },
    {
        imageUrl: 'https://placehold.co/1272x820.jpg',
        title: 'Those Eyes', 
        description: 'Prepare to be psychologically thrilled',
        cardLink: 'those-eyes.html',
        id: 'B3'
    },
    {
        imageUrl: 'https://placehold.co/1272x820.jpg',
        title: 'American Scripture Project',
        description: 'Unity through shared experiences',
        cardLink: 'american-scripture-project.html',
        id: 'B4'
    }
];


// Create and append all cards when DOM loads - ONLY on brands page
document.addEventListener('DOMContentLoaded', () => {
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
                cardData.id
            );
            gridContainer.appendChild(card);
        });
    }
});


