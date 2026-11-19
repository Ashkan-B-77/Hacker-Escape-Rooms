const filterSection = document.querySelector(".filter");
const filterCard = document.querySelector(".filter-card");
const filterButton = document.querySelector(".filter__button");
const closeButton = document.querySelector(".filter-card__close-button");

filterCard.remove();

filterButton.addEventListener('click', () => {
    filterSection.appendChild(filterCard);
    filterButton.remove();
});

closeButton.addEventListener('click', () => {
    filterSection.appendChild(filterButton);
    filterCard.remove();
})