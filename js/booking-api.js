const API_BASE = "https://lernia-sjj-assignments.vercel.app/api";

export async function getAvailableTimes(challengeId, date) {
  const query = new URLSearchParams({
    challenge: String(challengeId),
    date: date,
  });

  const response = await fetch(
    `${API_BASE}/booking/available-times?${query}`
  );

  if (!response.ok) {
    throw new Error(
      `Could not load available times. HTTP status: ${response.status}`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data?.slots)) {
    throw new Error("The server returned an unexpected times response.");
  }

  return data.slots;
}

export async function createReservation(booking) {
  const response = await fetch(`${API_BASE}/booking/reservations`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(booking),

    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(
      `Reservation request returned HTTP ${response.status}.`
    );
  }

  const data = await response.json();

  const fields = [
    "challenge",
    "name",
    "email",
    "date",
    "time",
    "participants",
  ];

  if (
    data?.status !== "ok" ||
    !data.booking ||
    fields.some(function (field) {
      return data.booking[field] !== booking[field];
    })
  ) {
    throw new Error("The server did not confirm the submitted booking.");
  }

  return data.booking;
}