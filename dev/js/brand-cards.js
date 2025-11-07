// Function to create a card component using jQuery
function createCard(imageUrl, title, description, cardLink, id) {
    // Create the main card container
    const $card = $('<a>', {
        class: 'brand-card',
        href: cardLink,
        id: id
    });

    // Create the image container
    const $imageContainer = $('<div>', {
        class: 'card__image-container'
    });

    // Create and set up the image
    const $image = $('<img>', {
        class: 'card__image',
        src: imageUrl,
        alt: title
    });

    // Create the content container
    const $content = $('<div>', {
        class: 'card__content'
    });

    // Create and set up the title
    const $titleElement = $('<h3>', {
        class: 'card__title',
        text: title
    });

    // Create and set up the description
    const $descriptionElement = $('<p>', {
        class: 'card__description',
        text: description
    });

    // Assemble the card using jQuery chaining
    $content.append($titleElement, $descriptionElement);
    $imageContainer.append($image);
    $card.append($imageContainer, $content);

    return $card;
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
$(document).ready(() => {
    // Check if we're on the brands page by looking for the brand-card-grid container
    const $gridContainer = $('.brand-card-grid');
    if ($gridContainer.length) {
        // console.log("Brands page detected - creating cards...");
        
        // Create and append all cards using jQuery
        $.each(cardsData, (index, cardData) => {
            const $card = createCard(
                cardData.imageUrl,
                cardData.title,
                cardData.description,
                cardData.cardLink,
                cardData.id
            );
            $gridContainer.append($card);
        });
    }
});