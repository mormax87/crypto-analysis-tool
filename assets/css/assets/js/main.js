document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const input = document.getElementById("symbols").value;
    const results = document.getElementById("results");

    if (!input.trim()) {
      results.innerHTML = "<p>Please enter at least one trading pair.</p>";
      return;
    }

    const pairs = input
      .split(",")
      .map(p => p.trim().toUpperCase());

    results.innerHTML = "<p>Fetching live spot data...</p>";

    let output = `<h3>Live Spot Prices (Binance)</h3><ul>`;

    for (const pair of pairs) {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
        );

        if (!response.ok) {
          throw new Error("Invalid symbol or unavailable");
        }

        const data = await response.json();
        const utcTime = new Date().toUTCString();

        output += `
          <li>
            <strong>${pair}</strong><br>
            Price: ${data.price}<br>
            Source: Binance Spot<br>
            Time (UTC): ${utcTime}
          </li>
          <br>
        `;
      } catch (err) {
        output += `
          <li>
            <strong>${pair}</strong><br>
            ❌ Unable to fetch live data
          </li>
          <br>
        `;
      }
    }

    output += "</ul>";
    results.innerHTML = output;
  });
});
