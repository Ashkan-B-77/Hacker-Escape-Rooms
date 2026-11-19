import {filterChallenges, getAllLabels} from "../js/filter.js";

const challenges = [
    { id: 1, title: "Project: X of Doom", description: "Try your hardest", labels: ["linux", "web"] },
    { id: 2, title: "Cipher Room", description: "Crack the code", labels: ["web", "cryptography"] },
    { id: 3, title: "Kernel Panic", description: "Linux basics", labels: ["linux"] },
];

test("no filters returns everything", () => {
    const result = filterChallenges(challenges, { labels: [], text: "" });
    expect(result).toHaveLength(3);
});

test("a challenge must have ALL active labels", () => {
    const result = filterChallenges(challenges, { labels: ["linux", "web"], text: "" });
    expect(result.map((c) => c.id)).toEqual([1]);
});

test("text matches the description, ignoring case", () => {
    const result = filterChallenges(challenges, { labels: [], text: "CRACK" });
    expect(result.map((c) => c.id)).toEqual([2]);
});

test("nothing matching returns an empty array", () => {
    const result = filterChallenges(challenges, { labels: [], text: "zzz" });
    expect(result).toEqual([]);
});

test("getAllLabels returns unique sorted labels", () => {
    expect(getAllLabels(challenges)).toEqual(["cryptography", "linux", "web"]);
});