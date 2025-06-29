async function fetchStock() {
  const symbol = document.getElementById("symbolInput").value;
  const res = await fetch(`https://stock-tracker-backend-6sye.onrender.com/stock/${symbol}`);
  const data = await res.json();

  document.getElementById("stockDetails").innerHTML = `
    <h2>${data.info.longName || symbol.toUpperCase()}</h2>
    <p><strong>Sector:</strong> ${data.info.sector || 'N/A'}</p>
    <p><strong>Market Cap:</strong> ₹${(data.info.marketCap/1e7).toFixed(2)} Cr</p>
    <p><strong>PE Ratio:</strong> ${data.info.trailingPE || 'N/A'}</p>
    <p><strong>EPS:</strong> ${data.info.trailingEps || 'N/A'}</p>
    <canvas id="stockChart"></canvas>
  `;

  drawChart(data.history);
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
