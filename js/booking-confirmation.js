document.addEventListener("booking:confirmed", function (event) {
    const dialog = event.target;
    const detailsForm = dialog.querySelector("#booking-details-form");
    const { booking, challenge } = event.detail;

    if (!detailsForm || detailsForm.hidden) return;

    detailsForm.hidden = true;

    dialog.querySelector(".booking-dialog__step").textContent = "Step 3 of 3";
    dialog.querySelector("#booking-title").textContent = "Thank you!";
    dialog.querySelector(".booking-dialog__status").textContent =
        `Booking confirmed for "${challenge.title}" on ${booking.date} at ${booking.time}.`;

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "booking-button";
    backButton.textContent = "Back to challenges";

    backButton.addEventListener("click", function () {
        dialog.close();
    });

    // Put the button outside the hidden booking form so it stays visible.
    detailsForm.after(backButton);
    backButton.focus();
});