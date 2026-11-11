import { getAvailableTimes } from "./booking-api.js";

// Create the booking window.
const dialog = document.createElement("dialog");

dialog.className = "booking-dialog";
dialog.setAttribute("aria-labelledby", "booking-title");

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

      <p
        class="booking-status"
        id="booking-date-status"
        role="status"
      ></p>

      <button
        class="booking-submit"
        type="submit"
        disabled
      >
        Search available times
      </button>
    </form>
        <form id="booking-details-form" hidden>
      <p
        class="booking-selected-date"
        id="booking-selected-date"
      ></p>

      <div class="booking-field">
        <label for="booking-name">Name</label>

        <input
          id="booking-name"
          name="name"
          type="text"
          autocomplete="name"
          maxlength="100"
          required
        >
      </div>

      <div class="booking-field">
        <label for="booking-email">Email</label>

        <input
          id="booking-email"
          name="email"
          type="email"
          autocomplete="email"
          maxlength="254"
          required
        >
      </div>

      <div class="booking-field-row">
        <div class="booking-field">
          <label for="booking-time">What time?</label>

          <select
            id="booking-time"
            name="time"
            required
          ></select>
        </div>

        <div class="booking-field">
          <label for="booking-participants">
            How many participants?
          </label>

          <select
            id="booking-participants"
            name="participants"
            required
          ></select>
        </div>
      </div>

      <div class="booking-actions">
        <button
          id="booking-back"
          class="booking-back"
          type="button"
        >
          Change date
        </button>

        <button
          class="booking-submit"
          type="submit"
          disabled
        >
          Submit booking
        </button>
      </div>
    </form>
  </div>
`;

document.body.append(dialog);

// Find the elements we will control.
const title = dialog.querySelector("#booking-title");
const dateForm = dialog.querySelector("#booking-date-form");
const dateInput = dialog.querySelector("#booking-date");
const dateStatus = dialog.querySelector("#booking-date-status");
const searchButton = dateForm.querySelector(".booking-submit");
const closeButton = dialog.querySelector(".booking-close");

// Remember the current booking and request.
let selectedChallenge;
let openingButton;
let busy = false;
let requestNumber = 0;
// Elements belonging to the second step.
const stepLabel = dialog.querySelector(".booking-step");
const detailsForm = dialog.querySelector("#booking-details-form");
const selectedDateText = dialog.querySelector("#booking-selected-date");

const nameInput = dialog.querySelector("#booking-name");
const emailInput = dialog.querySelector("#booking-email");
const timeInput = dialog.querySelector("#booking-time");
const participantsInput = dialog.querySelector("#booking-participants");
const backButton = dialog.querySelector("#booking-back");

// Remember the successful date search for the booking.
let bookingDate = "";
let availableSlots = [];

// Show either the date form or the details form.
function showStep(step) {
  dateForm.hidden = step !== 1;
  detailsForm.hidden = step !== 2;

  stepLabel.textContent = `Step ${step} of 3`;
  dialog.scrollTop = 0;
}

// Fill the time dropdown and display the details form.
function showDetails(slots, date) {
  if (participantsInput.options.length === 0) {
    dateStatus.textContent =
      "The participant limits for this room are unavailable.";
    return;
  }

  const previousTime = timeInput.value;

  bookingDate = date;
  availableSlots = [...new Set(slots)];

  timeInput.replaceChildren();

  availableSlots.forEach(function (time) {
    timeInput.add(new Option(time, time));
  });

  if (availableSlots.includes(previousTime)) {
    timeInput.value = previousTime;
  }

  selectedDateText.textContent = `Your date: ${bookingDate}`;

  showStep(2);
  nameInput.focus();
}

function today() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// A real challenge must have a positive integer ID.
function hasChallengeId() {
  return (
    Number.isInteger(selectedChallenge?.id) &&
    selectedChallenge.id > 0
  );
}

// Update the controls while a request is running.
function setBusy(isBusy) {
  busy = isBusy;

  dateInput.disabled = isBusy;
  searchButton.disabled = isBusy || !hasChallengeId();

  searchButton.textContent = isBusy
    ? "Finding available times…"
    : "Search available times";

  dateForm.setAttribute("aria-busy", String(isBusy));
}

// Other files can call this function with challenge data.
export function openBooking(challenge, triggerElement) {
  if (dialog.open) return;

  requestNumber += 1;

  selectedChallenge = { ...challenge };
  openingButton = triggerElement || document.activeElement;

  title.textContent = `Book room “${selectedChallenge.title}”`;

  dateForm.reset();
detailsForm.reset();

dateInput.min = today();

bookingDate = "";
availableSlots = [];

timeInput.replaceChildren();
participantsInput.replaceChildren();

const minimum = selectedChallenge.minParticipants;
const maximum = selectedChallenge.maxParticipants;

if (
  Number.isInteger(minimum) &&
  Number.isInteger(maximum) &&
  minimum >= 1 &&
  maximum >= minimum
) {
  for (let count = minimum; count <= maximum; count += 1) {
    participantsInput.add(
      new Option(String(count), String(count))
    );
  }
}

showStep(1);


  dateStatus.textContent = hasChallengeId()
    ? ""
    : "Booking is not available for this room yet.";

  setBusy(false);

  document.documentElement.classList.add("booking-open");

  dialog.showModal();
  dateInput.focus();
}

// Keep the existing placeholder cards able to open the window.
// They do not have real challenge IDs, so searching stays disabled.
const bookButtons = document.querySelectorAll(".room-card .button");

bookButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const card = button.closest(".room-card");
    const roomTitle = card.querySelector(".room-card__title");

    openBooking(
      { title: roomTitle.textContent.trim() },
      button
    );
  });
});

// Close the booking window.
closeButton.addEventListener("click", function () {
  dialog.close();
});

dialog.addEventListener("close", function () {
  // Ignore any response belonging to the closed booking.
  requestNumber += 1;

  setBusy(false);
  document.documentElement.classList.remove("booking-open");

  if (openingButton && openingButton.isConnected) {
    openingButton.focus({ preventScroll: true });
  }
});

// Clear old results when the visitor changes the date.
dateInput.addEventListener("input", function () {
  if (hasChallengeId()) {
    dateStatus.textContent = "";
  }
});

// Search for available times when the date form is submitted.
dateForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (busy || !hasChallengeId()) return;

  dateInput.min = today();

  if (!dateForm.reportValidity()) return;

  const chosenDate = dateInput.value;
  const thisRequest = ++requestNumber;

  bookingDate = "";
availableSlots = [];

setBusy(true);
dateStatus.textContent = "Looking for available times…";

  try {
    const slots = await getAvailableTimes(
      selectedChallenge.id,
      chosenDate
    );

    // Ignore a response if this booking has since been closed.
    if (thisRequest !== requestNumber || !dialog.open) return;

    if (slots.length === 0) {
      dateStatus.textContent =
        "No times are available on this date. Please choose another date.";
        } else {
      showDetails(slots, chosenDate);
    }
  } catch (error) {
    if (thisRequest !== requestNumber || !dialog.open) return;

    dateStatus.textContent =
      "We could not load available times. Please try again.";

    console.error("Available-times request failed:", error);
  } finally {
    if (thisRequest === requestNumber && dialog.open) {
      setBusy(false);
    }
  }
});

// Return to the date form while preserving customer details.
backButton.addEventListener("click", function () {
  if (busy) return;

  dateStatus.textContent = "";

  showStep(1);
  dateInput.focus();
});

// Prevent normal navigation until reservation submission is connected.
detailsForm.addEventListener("submit", function (event) {
  event.preventDefault();
});