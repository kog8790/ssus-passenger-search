import { searchPassengers } from "../../shared/passengerSearch.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Method not allowed.",
      }),
    };
  }

  try {
    const { searchTerm = "", page = 1 } = JSON.parse(event.body || "{}");

    const results = await searchPassengers(searchTerm, Number(page));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Unable to search the passenger archive.",
      }),
    };
  }
}