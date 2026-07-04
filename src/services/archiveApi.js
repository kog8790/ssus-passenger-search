export async function searchPassengers(searchTerm, page = 1, turnstileToken = "") {
  const response = await fetch("/.netlify/functions/searchEndpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      searchTerm,
      page,
      turnstileToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to search the passenger archive.");
  }

  return data;
}