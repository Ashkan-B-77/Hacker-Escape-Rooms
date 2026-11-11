// Create the booking window.
const dialog = document.createElement("dialog");

dialog.className = "booking-dialog";
dialog.setAttribute("aria-labelledby", "booking-title");

// Add the window's HTML.
dialog.innerHTML = `
  <div class="booking-dialog__content">
    <button
      class="booking-close"
      type="button"
      aria-label="Close booking"
    >
      ×
    </button>

    <p class="booking-step">Step 1 of 3</p>

    <h2 class="booking-title" id="booking-title"></h2>

    <form id="booking-date-form">
      <div class="booking-field">
        <label for="booking-date">
          What date would you like to come?
        </label>

        <input
          id="booking-date"
          name="date"
          type="date"
          required
        >
      </div>

      <button
        class="booking-submit"
        type="submit"
        disabled
      >
        Search available times
      </button>
    </form>
  </div>
`;

// Insert the window into the page.
document.body.append(dialog);

// Find the elements we will control.
const title = dialog.querySelector("#booking-title");
const dateForm = dialog.querySelector("#booking-date-form");
const dateInput = dialog.querySelector("#booking-date");
const closeButton = dialog.querySelector(".booking-close");

let openingButton;

// Get today's local date in YYYY-MM-DD format.
function today() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Connect the current homepage's room buttons.
const bookButtons = document.querySelectorAll(".room-card .button");

bookButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    if (dialog.open) return;

    const card = button.closest(".room-card");
    const roomTitle = card.querySelector(".room-card__title");

    openingButton = button;

    title.textContent = `Book room “${roomTitle.textContent.trim()}”`;

    dateForm.reset();
    dateInput.min = today();

    document.documentElement.classList.add("booking-open");

    dialog.showModal();
    dateInput.focus();
  });
});

// Close the window when its X button is clicked.
closeButton.addEventListener("click", function () {
  dialog.close();
});

// This runs after closing with either X or Escape.
dialog.addEventListener("close", function () {
  document.documentElement.classList.remove("booking-open");

  if (openingButton && openingButton.isConnected) {
    openingButton.focus({ preventScroll: true });
  }
});

// Prevent normal form navigation while we build the next stage.
dateForm.addEventListener("submit", function (event) {
  event.preventDefault();
});