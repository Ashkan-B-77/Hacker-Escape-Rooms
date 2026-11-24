/**
 * @jest-environment jsdom
 */

import {filterByLabelsAndText, getAllLabels, updateStars} from "../js/filter.js";

const challenges = [
    { id: 1, title: "Project: X of Doom", description: "Try your hardest", labels: ["linux", "web"] },
    { id: 2, title: "Cipher Room", description: "Crack the code", labels: ["web", "cryptography"] },
    { id: 3, title: "Kernel Panic", description: "Linux basics", labels: ["linux"] },
];

test("no filters returns everything", () => {
    const result = filterByLabelsAndText(challenges, { labels: [], text: "" });
    expect(result).toHaveLength(3);
});

test("a challenge must have all active labels", () => {
    const result = filterByLabelsAndText(challenges, { labels: ["linux", "web"], text: "" });
    expect(result.map((c) => c.id)).toEqual([1]);
});

test("text matches the description, ignoring case", () => {
    const result = filterByLabelsAndText(challenges, { labels: [], text: "CRACK" });
    expect(result.map((c) => c.id)).toEqual([2]);
});

test("nothing matching returns an empty array", () => {
    const result = filterByLabelsAndText(challenges, { labels: [], text: "zzz" });
    expect(result).toEqual([]);
});

test("getAllLabels returns unique sorted labels", () => {
    expect(getAllLabels(challenges)).toEqual(["cryptography", "linux", "web"]);
});

test("labels and text must both match", () => {
    const result = filterByLabelsAndText(challenges, { labels: ["linux"], text: "basics" });
    expect(result.map((c) => c.id)).toEqual([3]);
});

test("labels match but text does not return an empty array", () => {
    const result = filterByLabelsAndText(challenges, { labels: ["web"], text: "kernel" });
    expect(result).toEqual([]);
});

test("text matches the title and is trimmed", () => {
    const result = filterByLabelsAndText(challenges, { labels: [], text: "  cipher " });
    expect(result.map((c) => c.id)).toEqual([2]);
});

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
    `;
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

test("marks 2 selected stars of max rating", () => {
    updateStars(".filter-card__right-stars", 2);
    
    const stars = document.querySelectorAll(".filter-card__right-stars .filter-card__star");
    
    expect(stars).toHaveLength(5);
    
    for (let i = 0; i < stars.length - 3; i++) {
        expect(stars[i].getAttribute("src")).toBe("./images/star_full.svg");
    }
    for (let i = 2; i < stars.length; i++) {
        expect(stars[i].getAttribute("src")).toBe("./images/star_empty.svg");
    }
});