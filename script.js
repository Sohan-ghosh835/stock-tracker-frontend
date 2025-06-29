async function fetchStock() {
  const symbol = document.getElementById("symbolInput").value;
  try {
    const res = await fetch(`https://stock-tracker-backend-6sye.onrender.com/stock/${symbol}`);
    if (!res.ok) throw new Error("Failed to fetch stock");
    const data = await res.json();

    const info = data.info || {};
    const name = info.longName || symbol.toUpperCase();
    const sector = info.sector || 'N/A';
    const marketCap = info.marketCap ? (info.marketCap / 1e7).toFixed(2) : 'N/A';
    const peRatio = info.trailingPE || 'N/A';
    const eps = info.trailingEps || 'N/A';

    document.getElementById("stockDetails").innerHTML = `
      <h2>${name}</h2>
      <p><strong>Sector:</strong> ${sector}</p>
      <p><strong>Market Cap:</strong> ₹${marketCap} Cr</p>
      <p><strong>PE Ratio:</strong> ${peRatio}</p>
      <p><strong>EPS:</strong> ${eps}</p>
      <canvas id="stockChart"></canvas>
    `;

    drawChart(data.history);
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("stockDetails").innerHTML = `<p>Failed to load stock data.</p>`;
  }
}

function drawChart(history) {
  const labels = history.map(h => h.Date.split("T")[0]);
  const prices = history.map(h => h.Close);
  const ctx = document.getElementById("stockChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Closing Price",
        data: prices,
        borderColor: "#00bcd4",
        backgroundColor: "rgba(0, 188, 212, 0.1)",
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
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

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
  const username = prompt("Enter new username:");
  const password = prompt("Enter new password:");
  if (!username || !password) return;

  const res = await fetch("https://stock-tracker-backend-6sye.onrender.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  alert(data.message || "Registration complete");
}
