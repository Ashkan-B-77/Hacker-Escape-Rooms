import {getDataFromApi} from "./challenge-data.js";

// ---------------------------------------- functions ----------------------------------------
export function updateStars(groupElements, selectedRating) {
    const stars = document.querySelectorAll(`${groupElements} .filter-card__star`);

    stars.forEach((star, index) => {
        star.src = index < selectedRating ? "./images/star_full.svg" : "./images/star_empty.svg";
    });
}

export async function filterByTypeAndRating() {
    const data = await getDataFromApi();
    const dataArr = [];

    const onlineCheckbox = document.querySelector("input[value='online-challenges']");
    const onsiteCheckbox = document.querySelector("input[value='onsite-challenges']");

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