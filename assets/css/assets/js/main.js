document.getElementById("analyzeBtn").addEventListener("click", () => {
  const input = document.getElementById("symbols").value;
  const results = document.getElementById("results");

  if (!input.trim()) {
    results.innerHTML = "<p>Please enter at least one trading pair.</p>";
    return;
  }

  const pairs = input
    .split(",")
    .map(p => p.trim().toUpperCase());

  results.innerHTML = `
    <h3>Requested pairs:</h3>
    <ul>
      ${pairs.map(p => `<li>${p}</li>`).join("")}
    </ul>
  `;
});
