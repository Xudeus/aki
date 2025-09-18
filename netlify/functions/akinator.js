import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { action } = event.queryStringParameters || {};
    const query = event.rawQuery
      .replace("action=" + action, "")
      .replace(/^&/, "");

    const servers = [
      "https://srv2.akinator.com/ws",
      "https://srv6.akinator.com/ws",
      "https://srv7.akinator.com/ws",
    ];

    let response;
    for (let base of servers) {
      try {
        response = await fetch(`${base}/${action}?${query}`);
        if (response.ok) break;
      } catch (err) {
        console.log(`? Server ${base} failed:`, err.message);
      }
    }

    if (!response) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "All servers failed" }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
