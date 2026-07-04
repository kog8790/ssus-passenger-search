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
    const {
      searchTerm = "",
      page = 1,
      turnstileToken = "",
    } = JSON.parse(event.body || "{}");

    if (Number(page) === 1) {
      const verifyResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        return {
          statusCode: 403,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            error: "Please complete archive verification before searching.",
          }),
        };
      }
    }

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