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