// ---------------------------------------- functions ----------------------------------------
function getAllLabels(challenges) {
    const labels = new Set();
    challenges.forEach(function (challenge) {
        challenge.labels.forEach(function (label) {
            labels.add(label);
        });
    });
    return [...labels].sort();
}

function filterChallenges(challenges, filters) {
    const text = filters.text.trim().toLowerCase();
    return challenges.filter(function (challenge) {
        const hasAllLabels = filters.labels.every(function (label) {
            return challenge.labels.includes(label);
        });
        const matchesText =
            challenge.title.toLowerCase().includes(text) ||
            challenge.description.toLowerCase().includes(text);
        return hasAllLabels && matchesText;
    });
}

// ---------------------------------------- JEST ----------------------------------------
if (typeof module !== "undefined") {
    module.exports = {filterChallenges, getAllLabels};
}