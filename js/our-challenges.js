// ----------------------------------- Imports -------------------------------
import { getDataFromApi, createCard } from './challenge-data.js';
import {updateStars, filterByTypeAndRating} from './filter-type-rating.js';
import {filterByLabelsAndText} from './filter-labels-text.js';
import {createFilterControls} from './filter-ui.js';

// ----------------------------------- DOM Elements -------------------------------
const filterSection = document.querySelector(".filter");
const filterCard = document.querySelector(".filter-card");
const filterButton = document.querySelector(".filter__button");
const closeButton = document.querySelector(".filter-card__close-button");
const onlineCheckbox = document.querySelector("input[value='online-challenges']");
const onsiteCheckbox = document.querySelector("input[value='onsite-challenges']");
const minRadioRatings = document.querySelectorAll("input[name='min-rating']");
const maxRadioRatings = document.querySelectorAll("input[name='max-rating']");

let labelAndTextFilters = {labels: [], text: ""};
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

function renderChallenges(challenges) {
    const allContainer = document.getElementById('all-challenges');
    const noMatches = document.getElementById('no-matches');
    if (allContainer) {
        allContainer.replaceChildren();
        challenges.forEach((challenge) => {
            allContainer.append(createCard(challenge));
        });
    }
    noMatches.textContent = challenges.length === 0 ? "No matching challenges" : "";
}

async function updateChallengeList() {
    const byTypeAndRating = await filterByTypeAndRating();
    const challenges = filterByLabelsAndText(byTypeAndRating, labelAndTextFilters);
    renderChallenges(challenges);
}

async function setupLabelAndTextFilters() {
    const data = await getDataFromApi();
    const {labelsElement, searchElement} = createFilterControls(data.challenges, (filters) => {
        labelAndTextFilters = filters;
        updateChallengeList();
    });
    document.querySelector("#filter-tags").append(labelsElement);
    document.querySelector("#filter-search").append(searchElement);
}

async function init() {
    await updateChallengeList();
    await setupLabelAndTextFilters();
}

init();