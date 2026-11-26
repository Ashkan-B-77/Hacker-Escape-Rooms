import { getAvailableTimes, createReservation } from "./booking-api.js";
import "./booking-confirmation.js";

function today() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

export function openBooking(challenge, trigger = document.activeElement) {
    if (document.querySelector(".booking-dialog[open]")) return;

    const dialog = document.createElement("dialog");
    dialog.className = "booking-dialog";
    dialog.setAttribute("aria-labelledby", "booking-title");
    dialog.innerHTML = `
        <div class="booking-dialog__content">
            <button type="button" class="booking-dialog__close" aria-label="Close booking">×</button>
            <p class="booking-dialog__step">Step 1 of 3</p>
            <h2 class="booking-dialog__title" id="booking-title"></h2>
            <p class="booking-dialog__status" role="status" tabindex="-1"></p>
            <form id="booking-date-form">
                <fieldset name="controls" aria-label="Booking date">
                    <div class="booking-dialog__field">
                        <label for="booking-date">What date would you like to come?</label>
                        <input id="booking-date" name="date" type="date" required autofocus>
                    </div>
                    <button class="booking-button" type="submit">Search available times</button>
                </fieldset>
            </form>
            <form id="booking-details-form" hidden>
                <fieldset name="controls" aria-label="Booking details">
                    <p class="booking-dialog__selected-date"></p>
                    <div class="booking-dialog__field">
                        <label for="booking-name">Name</label>
                        <input id="booking-name" name="name" autocomplete="name" maxlength="100" required>
                    </div>
                    <div class="booking-dialog__field">
                        <label for="booking-email">Email</label>
                        <input id="booking-email" name="email" type="email" autocomplete="email" maxlength="254" required>
                    </div>
                    <div class="booking-dialog__field-row">
                        <div class="booking-dialog__field">
                            <label for="booking-time">What time?</label>
                            <select id="booking-time" name="time" required></select>
                        </div>
                        <div class="booking-dialog__field">
                            <label for="booking-participants">How many participants?</label>
                            <select id="booking-participants" name="participants" required></select>
                        </div>
                    </div>
                    <div class="booking-dialog__actions">
                        <button class="booking-dialog__back" name="back" type="button">Change date</button>
                        <button class="booking-button" name="send" type="submit">Submit booking</button>
                    </div>
                </fieldset>
            </form>
        </div>`;

    const dateForm = dialog.querySelector("#booking-date-form");
    const detailsForm = dialog.querySelector("#booking-details-form");
    const date = dateForm.elements.date;
    const fields = detailsForm.elements;
    const close = dialog.querySelector(".booking-dialog__close");
    const status = dialog.querySelector('[role="status"]');
    const { id, title, minParticipants, maxParticipants } = challenge;
    let bookingDate = "";
    let availableTimes = [];

    const bookingLabel = challenge.type === "online" ? "Book challenge" : "Book room";
    dialog.querySelector("#booking-title").textContent = `${bookingLabel} “${title}”`;
    date.min = today();
    if (Number.isSafeInteger(minParticipants) && Number.isSafeInteger(maxParticipants) && minParticipants >= 1) {
        for (let count = minParticipants; count <= maxParticipants; count++) {
            fields.participants.add(new Option(count, count));
        }
    }
    if (!Number.isInteger(id) || id < 1 || !fields.participants.options.length) {
        dateForm.elements.controls.disabled = true;
        status.textContent = "Booking is unavailable for this room.";
    }

    function showStep(step) {
        dateForm.hidden = step !== 1;
        detailsForm.hidden = step !== 2;
        dialog.querySelector(".booking-dialog__step").textContent = `Step ${step} of 3`;
        status.textContent = "";
        dialog.scrollTop = 0;
        (step === 1 ? date : fields.name).focus();
    }

    close.onclick = () => dialog.close();
    dialog.oncancel = (event) => {
        if (close.disabled) event.preventDefault();
    };
    dialog.onclose = () => {
        dialog.remove();
        if (!document.querySelector(".booking-dialog[open]")) {
            document.documentElement.classList.remove("booking-scroll-lock");
            if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        }
    };
    fields.back.onclick = () => showStep(1);
    date.oninput = () => {
        status.textContent = "";
    };

    dateForm.onsubmit = async (event) => {
        event.preventDefault();
        date.min = today();
        if (dateForm.hidden || dateForm.elements.controls.disabled || !dateForm.reportValidity()) return;
        const chosenDate = date.value;
        dateForm.elements.controls.disabled = true;
        dateForm.setAttribute("aria-busy", "true");
        status.textContent = "Looking for available times…";
        try {
            const slots = await getAvailableTimes(id, chosenDate);
            // Ignore a late reply if the visitor closed this room.
            if (!dialog.open) return;
            if (!slots.length) {
                status.textContent = "No times are available on this date. Please choose another date.";
                return;
            }
            bookingDate = chosenDate;
            availableTimes = [...new Set(slots)];
            const previous = fields.time.value;
            fields.time.replaceChildren();
            for (const time of availableTimes) fields.time.add(new Option(time, time));
            if (availableTimes.includes(previous)) fields.time.value = previous;
            dialog.querySelector(".booking-dialog__selected-date").textContent = `Your date: ${bookingDate}`;
            showStep(2);
        } catch {
            if (dialog.open) status.textContent = "We could not load available times. Please try again.";
        } finally {
            dateForm.elements.controls.disabled = false;
            dateForm.removeAttribute("aria-busy");
            if (dialog.open && !dateForm.hidden) date.focus();
        }
    };

    detailsForm.onsubmit = async (event) => {
        event.preventDefault();
        if (detailsForm.hidden || fields.controls.disabled) return;
        fields.name.value = fields.name.value.trim();
        fields.email.value = fields.email.value.trim();
        if (!detailsForm.reportValidity()) return;
        date.min = today();
        if (bookingDate < date.min) {
            showStep(1);
            status.textContent = "Please choose today or a future date.";
            return;
        }
        const participants = Number(fields.participants.value);
        const countAllowed = Number.isInteger(participants) &&
            participants >= minParticipants && participants <= maxParticipants;
        if (!availableTimes.includes(fields.time.value) || !countAllowed) {
            status.textContent = "Please choose an available time and a valid participant count.";
            status.focus();
            return;
        }
        const reservation = {
            challenge: id,
            name: fields.name.value,
            email: fields.email.value,
            date: bookingDate,
            time: fields.time.value,
            participants
        };
        fields.controls.disabled = true;
        detailsForm.setAttribute("aria-busy", "true");
        close.disabled = true;
        status.textContent = "Sending your booking…";
        status.focus();
        try {
            const booking = await createReservation(reservation);
            if (!dialog.open) return;
            status.textContent = "Booking confirmed.";
            fields.send.textContent = "Booking confirmed";
            dialog.dispatchEvent(new CustomEvent("booking:confirmed", {
                bubbles: true, detail: { booking, challenge }
            }));
        } catch {
            if (!dialog.open) return;
            fields.controls.disabled = false;
            status.textContent = "We could not confirm the booking. Please try again.";
            status.focus();
        } finally {
            close.disabled = false;
            detailsForm.removeAttribute("aria-busy");
        }
    };

    document.body.append(dialog);
    document.documentElement.classList.add("booking-scroll-lock");
    dialog.showModal();
}
