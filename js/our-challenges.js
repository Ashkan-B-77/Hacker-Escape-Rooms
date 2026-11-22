// ----------------------------------- Imports -------------------------------
import { getDataFromApi, createCard } from './challenge-data.js';

// ----------------------------------- DOM Elements -------------------------------
const filterSection = document.querySelector(".filter");
const filterCard = document.querySelector(".filter-card");
const filterButton = document.querySelector(".filter__button");
const closeButton = document.querySelector(".filter-card__close-button");
const onlineCheckbox = document.querySelector("input[value='online-challenges']");
const onsiteCheckbox = document.querySelector("input[value='onsite-challenges']");
const minRadioRatings = document.querySelectorAll("input[name='min-rating']");
const maxRadioRatings = document.querySelectorAll("input[name='max-rating']");

// ------------------------------------ listeners ------------------------------------

filterCard.classList.add("filter-card--closed");

filterButton.addEventListener("click", () => {
    filterCard.classList.remove("filter-card--closed");
    filterButton.remove();
});

closeButton.addEventListener("click", () => {
    filterCard.classList.add("filter-card--closed");
    filterSection.appendChild(filterButton);
});

onlineCheckbox.addEventListener('change', updateChallengeList);
onsiteCheckbox.addEventListener('change', updateChallengeList);

minRadioRatings.forEach((radio) => {
    radio.addEventListener('change', () => {
        updateStars(".filter-card__left-stars", radio.value);
        updateChallengeList();
    });
});

maxRadioRatings.forEach((radio) => {
    radio.addEventListener('change', () => {
        updateStars(".filter-card__right-stars", radio.value);
        updateChallengeList();
    });
});

// ----------------------------------- functions -------------------------------

function updateStars(groupElements, selectedRating) {
    const stars = document.querySelectorAll(`${groupElements} .filter-card__star`);

    stars.forEach((star, index) => {
        star.src = index < selectedRating ? "./images/star_full.svg" : "./images/star_empty.svg";
    });
}

async function filterChallenges() {
    const data = await getDataFromApi();
    const dataArr = [];

    const selectedMinRating = document.querySelector("input[name='min-rating']:checked");
    const selectedMaxRating = document.querySelector("input[name='max-rating']:checked");

    const minRating = selectedMinRating ? selectedMinRating.value : 0;
    const maxRating = selectedMaxRating ? selectedMaxRating.value : 5;

    data.challenges.forEach((challenge) => {
        const apiRating = Math.round(challenge.rating);
        const rating = apiRating >= minRating && apiRating <= maxRating;

        if (onlineCheckbox.checked && challenge.type === "online" && rating) {
            dataArr.push(challenge);
        }
        if (onsiteCheckbox.checked && challenge.type === "onsite" && rating) {
            dataArr.push(challenge);
        }
        if (!onlineCheckbox.checked && !onsiteCheckbox.checked && rating) {
            dataArr.push(challenge);
        }
    });
    
    return dataArr;
}

function renderChallenges(challenges) {
    const allContainer = document.getElementById('all-challenges');

    if (allContainer) {
        allContainer.replaceChildren();
        challenges.forEach((challenge) => {
            allContainer.append(createCard(challenge));
        });
    }
}

async function updateChallengeList() {
    const challenges = await filterChallenges();
    renderChallenges(challenges);
}

updateChallengeList();