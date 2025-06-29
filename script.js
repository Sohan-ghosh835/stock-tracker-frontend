async function fetchStock() {
  const rawInput = document.getElementById("symbolInput").value.trim();
  if (!rawInput) return;

  const baseSymbol = rawInput.replace(/(\.NS|\.BO|\^NSEI|\^BSESN)$/i, "").toUpperCase();
  const isIndex = rawInput.startsWith("^") || rawInput === "NSEI" || rawInput === "BSESN";

  const variants = isIndex
    ? [rawInput.toUpperCase()]
    : [`${baseSymbol}.NS`, `${baseSymbol}.BO`];

  document.getElementById("stockDetails").innerHTML = "";

  for (const symbol of variants) {
    try {
      const res = await fetch(`https://stock-tracker-backend-6sye.onrender.com/stock/${symbol}`);
      if (!res.ok) throw new Error("Failed to fetch stock");

      const data = await res.json();

      const info = data.info || {};
      const name = info.longName || symbol;
      const sector = info.sector || "N/A";
      const marketCap = info.marketCap ? (info.marketCap / 1e7).toFixed(2) : "N/A";
      const peRatio = info.trailingPE || "N/A";
      const eps = info.trailingEps || "N/A";

      const container = document.createElement("div");
      container.className = "stock-card";
      container.innerHTML = `
        <h2>${name} <span style="font-size:14px;">(${symbol})</span></h2>
        <p><strong>Sector:</strong> ${sector}</p>
        <p><strong>Market Cap:</strong> ₹${marketCap} Cr</p>
        <p><strong>PE Ratio:</strong> ${peRatio}</p>
        <p><strong>EPS:</strong> ${eps}</p>
        <canvas id="chart-${symbol}" height="200"></canvas>
      `;

      document.getElementById("stockDetails").appendChild(container);

      if (data.history && data.history.length > 0) {
        drawChart(data.history, `chart-${symbol}`, symbol);
      } else {
        container.innerHTML += `<p style="color:gray;">No historical data available.</p>`;
      }
    } catch (err) {
      console.error(`Error fetching ${symbol}:`, err);
      const errorDiv = document.createElement("div");
      errorDiv.innerHTML = `<p style="color:red;">Error loading data for ${symbol}</p>`;
      document.getElementById("stockDetails").appendChild(errorDiv);
    }
  }
}

function drawChart(history, canvasId, label) {
  const labels = history.map(h => h.Date.split("T")[0]);
  const prices = history.map(h => h.Close);
  const ctx = document.getElementById(canvasId).getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: `${label} - Closing Price`,
        data: prices,
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("https://stock-tracker-backend-6sye.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert("Login failed");
  }
});

async function registerUser() {
  const username = prompt("Enter new username:")?.trim();
  const password = prompt("Enter new password:")?.trim();
  if (!username || !password) return;

  const res = await fetch("https://stock-tracker-backend-6sye.onrender.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  alert(data.message || "Registration complete");
}
