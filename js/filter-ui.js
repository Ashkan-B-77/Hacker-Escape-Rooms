import {getAllLabels} from "./filter.js";

export function createFilterControls(challenges, onChange) {
    const state = {labels: [], text: ""};

    function update(changes) {
        Object.assign(state, changes);
        onChange({labels: [...state.labels], text: state.text});
    }

    // ----- search field -----
    const searchElement = document.createElement("div");
    searchElement.className = "filter-search";

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.className = "filter-search__input";
    searchInput.placeholder = "Start typing to filter";
    searchInput.setAttribute("aria-label", "Search for keyword");

    searchInput.addEventListener("input", function () {
        update({text: searchInput.value});
    });

    searchElement.append(searchInput);

    // ----- label buttons -----
    const labelsElement = document.createElement("ul");
    labelsElement.className = "filter-labels";

    getAllLabels(challenges).forEach(function (label) {
        const item = document.createElement("li");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "filter-labels__button";
        button.textContent = label;
        button.setAttribute("aria-pressed", "false");

        button.addEventListener("click", function () {
            const isActive = state.labels.includes(label);

            update({
                labels: isActive
                    ? state.labels.filter(function (l) { return l !== label; })
                    : [...state.labels, label],
            });

            button.setAttribute("aria-pressed", String(!isActive));
        });

        item.append(button);
        labelsElement.append(item);
    });

    return {labelsElement, searchElement};
}