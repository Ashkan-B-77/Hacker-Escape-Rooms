import {getDataFromApi, createCard} from './challenge-data.js';

// Fetches the challenges and shows them on the right page
async function loadChallenges() {
    const data = await getDataFromApi();

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