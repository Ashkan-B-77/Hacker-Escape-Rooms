// ----------------------------------- Imports -------------------------------
import { getDataFromApi, createCard } from './challenge-data.js';

// ----------------------------------- DOM Elements -------------------------------
const filterSection = document.querySelector(".filter");
const filterCard = document.querySelector(".filter-card");
const filterButton = document.querySelector(".filter__button");
const closeButton = document.querySelector(".filter-card__close-button");
const onlineCheckbox = document.querySelector("input[value='online-challenges']");
const onsiteCheckbox = document.querySelector("input[value='onsite-challenges']");

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

onlineCheckbox.addEventListener('click', updateChallengeList);
onsiteCheckbox.addEventListener('click', updateChallengeList);

// ----------------------------------- functions -------------------------------

async function filterChallenges() {
    const data = await getDataFromApi();
    const dataArr = [];
    const onlineChecked = document.querySelector("input[value='online-challenges']");
    const onSiteChecked = document.querySelector("input[value='onsite-challenges']");

    data.challenges.forEach((challenge) => {
        if (onlineChecked.checked && challenge.type === "online") {
            dataArr.push(challenge);
        }
        if (onSiteChecked.checked && challenge.type === "onsite") {
            dataArr.push(challenge);
        }
        if (!onlineChecked.checked && !onSiteChecked.checked) {
            dataArr.push(challenge)
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