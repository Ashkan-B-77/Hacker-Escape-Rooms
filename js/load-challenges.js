import { openBooking } from './booking.js';

// Creates a card for a challenge, using the same HTML structure and classes
// as the cards in index.html, so the existing CSS is applied.
function createCard(challenge) {
    const item = document.createElement('li');
    item.className = 'challenges__item';

    const card = document.createElement('article');
    card.className = 'room-card';

    const image = document.createElement('img');
    image.className = 'room-card__image';
    image.src = challenge.image;
    image.alt = '';

    const body = document.createElement('div');
    body.className = 'room-card__body';

    const title = document.createElement('h3');
    title.className = 'room-card__title';
    if (challenge.type === 'onsite') {
        title.textContent = `${challenge.title} (on-site)`;
    } else {
        title.textContent = challenge.title;
    }

    const meta = document.createElement('div');
    meta.className = 'room-card__meta';

    // Five stars. There are only full and empty star images,
    // so the rating is rounded to the nearest whole number (4.5 becomes 5).
    const rating = document.createElement('span');
    rating.className = 'room-card__rating';
    rating.setAttribute('role', 'img');
    rating.setAttribute('aria-label', `Rated ${challenge.rating} out of 5`);
    const fullStars = Math.round(challenge.rating);
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('img');
        star.className = 'room-card__star';
        star.alt = '';
        if (i <= fullStars) {
            star.src = './images/star_full.svg';
        } else {
            star.src = './images/star_empty.svg';
        }
        rating.append(star);
    }

    const participants = document.createElement('span');
    participants.className = 'room-card__participants';
    participants.textContent = `${challenge.minParticipants}-${challenge.maxParticipants} participants`;
    if (challenge.type === 'online') {
        participants.textContent += ' (networked)';
    }

    meta.append(rating, participants);

    const text = document.createElement('p');
    text.className = 'room-card__text';
    text.textContent = challenge.description;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button--primary button--small';
    button.dataset.challengeId = challenge.id;
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', () => openBooking(challenge, button));
    if (challenge.type === 'online') {
        button.textContent = 'Take challenge online';
    } else {
        button.textContent = 'Book this room';
    }

    body.append(title, meta, text, button);
    card.append(image, body);
    item.append(card);
    return item;
}

// Fetches the challenges and shows them on the right page
async function loadChallenges() {
    const response = await fetch('https://lernia-sjj-assignments.vercel.app/api/challenges');
    const data = await response.json();

    // The page with all challenges (our-challenges.html)
    const allContainer = document.querySelector('#all-challenges');
    if (allContainer) {
        data.challenges.forEach((challenge) => {
            allContainer.append(createCard(challenge));
        });
    }

    // The start page with the top 3 (index.html)
    const topContainer = document.querySelector('#top-challenges');
    if (topContainer) {
        const topThree = [...data.challenges]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);

        topThree.forEach((challenge) => {
            topContainer.append(createCard(challenge));
        });
    }
}

loadChallenges();
