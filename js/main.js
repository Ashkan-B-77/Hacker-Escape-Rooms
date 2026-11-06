// ---------------------------------------- DOM elements ----------------------------------------
const elMenuButton = document.querySelector(".header__menu-button");
const elNav = document.querySelector(".nav");
const elNavLinks = document.querySelectorAll(".nav__link");
const desktopQuery = window.matchMedia("(min-width: 900px)");

// ---------------------------------------- listeners ----------------------------------------
elMenuButton.addEventListener("click", toggleMenu);

elNavLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});

desktopQuery.addEventListener("change", function (event) {
    if (event.matches) {
        closeMenu();
    }
});

// ---------------------------------------- functions ----------------------------------------
function toggleMenu() {
    setMenu(!elNav.classList.contains("nav--open"));
}

function closeMenu() {
    setMenu(false);
}

function setMenu(isOpen) {
    elNav.classList.toggle("nav--open", isOpen);
    document.body.classList.toggle("body--no-scroll", isOpen);
    elMenuButton.setAttribute("aria-expanded", isOpen);
    elMenuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}