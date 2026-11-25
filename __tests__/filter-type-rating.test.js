/**
 * @jest-environment jsdom
 */
import {jest} from "@jest/globals";

jest.unstable_mockModule("../js/challenge-data.js", () => ({
    getDataFromApi: jest.fn()
}));

const {getDataFromApi} = await import("../js/challenge-data.js");
const {updateStars, filterChallenges} = await import("../js/filter.js");

beforeEach(() => {
    document.body.innerHTML = `
        <div class="filter-card__left-stars">
            <img class="filter-card__star" src="./images/star_empty.svg">
            <img class="filter-card__star" src="./images/star_empty.svg">
            <img class="filter-card__star" src="./images/star_empty.svg">
            <img class="filter-card__star" src="./images/star_empty.svg">
            <img class="filter-card__star" src="./images/star_empty.svg">
        </div>
        <div class="filter-card__right-stars">
            <img class="filter-card__star" src="./images/star_empty.svg">
            <img class="filter-card__star" src="./images/star_empty.svg">
            <img class="filter-card__star" src="./images/star_empty.svg">
            <img class="filter-card__star" src="./images/star_empty.svg">
            <img class="filter-card__star" src="./images/star_empty.svg">
        </div>
        
        <input type="checkbox" value="online-challenges">
        <input type="checkbox" value="onsite-challenges">

        <input type="radio" name="min-rating" value="3">
        <input type="radio" name="min-rating" value="2" checked>

        <input type="radio" name="max-rating" value="2">
        <input type="radio" name="max-rating" value="4" checked>
    `;

    getDataFromApi.mockResolvedValue({
        challenges: [
            { id: 1, type: "online", rating: 3 },
            { id: 2, type: "onsite", rating: 4 },
            { id: 3, type: "online", rating: 2 }
        ]
    });
});

test("marks 3 selected stars of min rating", () => {
    updateStars(".filter-card__left-stars", 3);
    
    const stars = document.querySelectorAll(".filter-card__left-stars .filter-card__star");
    
    expect(stars).toHaveLength(5);
    
    for (let i = 0; i < stars.length - 2; i++) {
        expect(stars[i].getAttribute("src")).toBe("./images/star_full.svg");
    }
    for (let i = 3; i < stars.length; i++) {
        expect(stars[i].getAttribute("src")).toBe("./images/star_empty.svg");
    }
});

test("marks 4 selected stars of max rating", () => {
    updateStars(".filter-card__right-stars", 4);
    
    const stars = document.querySelectorAll(".filter-card__right-stars .filter-card__star");
    
    expect(stars).toHaveLength(5);
    
    for (let i = 0; i < stars.length - 1; i++) {
        expect(stars[i].getAttribute("src")).toBe("./images/star_full.svg");
    }
    for (let i = 4; i < stars.length; i++) {
        expect(stars[i].getAttribute("src")).toBe("./images/star_empty.svg");
    }
});

test("show online challenges when online input is checked", async () => {
    document.querySelector("input[value='online-challenges']").checked = true;

    const result = await filterChallenges();

    expect(result.map(challenge => challenge.id)).toEqual([1, 3]);
});

test("show onsite challenge when onsite input is checked", async () => {
    document.querySelector("input[value='onsite-challenges']").checked = true;

    const result = await filterChallenges();

    expect(result.map(challenge => challenge.id)).toEqual([2]);
});

test("show challenges where min-rating is 2 and max-rating is 4", async () => {
    const result = await filterChallenges();

    expect(result.map(challenge => challenge.id)).toEqual([1, 2, 3]);
});

test("show no challenges where min-rating is 3 and max-rating is 2", async () => {
    document.querySelector("input[name='min-rating'][value='3']").checked = true;
    document.querySelector("input[name='max-rating'][value='2']").checked = true;

    const result = await filterChallenges();

    expect(result.map(challenge => challenge.id)).toEqual([]);
});

test("show only one online challenge when max-rating is not met for two", async () => {
    document.querySelector("input[name='max-rating'][value='2']").checked = true;

    const result = await filterChallenges();

    expect(result.map(challenge => challenge.id)).toEqual([3]);
})