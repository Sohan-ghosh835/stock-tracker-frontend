async function fetchStock() {
  const symbol = document.getElementById("symbolInput").value.trim();
  if (!symbol) return;

  try {
    const res = await fetch(`https://stock-tracker-backend-6sye.onrender.com/stock/${symbol}`);
    if (!res.ok) throw new Error("Failed to fetch stock");

    const data = await res.json();
    const info = data.info || {};

    const name = info.longName || symbol.toUpperCase();
    const sector = info.sector || 'N/A';
    const marketCap = info.marketCap ? (info.marketCap / 1e7).toFixed(2) + " Cr" : 'N/A';
    const price = info.currentPrice || 'N/A';
    const high = info.high || 'N/A';
    const low = info.low || 'N/A';
    const pe = info.trailingPE || 'N/A';
    const eps = info.trailingEps || 'N/A';
    const book = info.bookValue || 'N/A';
    const dividend = info.dividendYield || 'N/A';
    const roce = info.ROCE || 'N/A';
    const roe = info.ROE || 'N/A';
    const faceValue = info.faceValue || 'N/A';
    const description = info.description || 'No company description available.';

    let html = `
      <h2>${name}</h2>
      <p><strong>Sector:</strong> ${sector}</p>
      <p><strong>Market Cap:</strong> ₹${marketCap}</p>
      <p><strong>Current Price:</strong> ₹${price}</p>
      <p><strong>Day High:</strong> ₹${high}</p>
      <p><strong>Day Low:</strong> ₹${low}</p>
      <p><strong>PE Ratio:</strong> ${pe}</p>
      <p><strong>EPS:</strong> ${eps}</p>
      <p><strong>Book Value:</strong> ${book}</p>
      <p><strong>Dividend Yield:</strong> ${dividend}</p>
      <p><strong>ROCE:</strong> ${roce}</p>
      <p><strong>ROE:</strong> ${roe}</p>
      <p><strong>Face Value:</strong> ₹${faceValue}</p>
      <p><strong>Company Summary:</strong> ${description}</p>
    `;

    if (data.history && data.history.length > 0) {
      html += `<canvas id="stockChart"></canvas>`;
    } else {
      html += `<p style="color:orange;">No historical chart available.</p>`;
    }

    document.getElementById("stockDetails").innerHTML = html;

    if (data.history && data.history.length > 0) {
      drawChart(data.history);
    }

  } catch (err) {
    console.error("Error fetching stock:", err);
    document.getElementById("stockDetails").innerHTML = `<p style="color:red;">Failed to load stock data.</p>`;
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
