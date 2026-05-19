/* charts.js — Traffic line chart + protocol donut chart */

let trafficChart = null;
let protoChart   = null;

// ── INIT TRAFFIC CHART ─────────────────────────────────────────
function initTrafficChart() {
  const ctx = document.getElementById('trafficChart').getContext('2d');
  trafficChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...trafficHistory.labels],
      datasets: [
        {
          label: 'Inbound',
          data: [...trafficHistory.inbound],
          borderColor: CONFIG.COLORS.INBOUND,
          backgroundColor: 'rgba(59,130,246,0.08)',
          fill: true, tension: 0.45, borderWidth: 2,
          pointRadius: 0, pointHoverRadius: 5,
        },
        {
          label: 'Outbound',
          data: [...trafficHistory.outbound],
          borderColor: CONFIG.COLORS.OUTBOUND,
          backgroundColor: 'rgba(139,92,246,0.05)',
          fill: true, tension: 0.45, borderWidth: 1.5,
          pointRadius: 0, pointHoverRadius: 5,
          borderDash: [6, 4],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1f36',
          titleColor: '#9199ab',
          bodyColor: '#fff',
          padding: 10,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} Gbps`,
          },
        },
      },
      scales: {
        x: { display: false },
        y: {
          min: 0, max: 8,
          grid: { color: '#f0f2f5' },
          border: { display: false },
          ticks: {
            color: '#9199ab',
            font: { size: 10, family: 'DM Mono' },
            callback: v => v + 'G',
          },
        },
      },
    },
  });
}

// ── INIT PROTOCOL DONUT ────────────────────────────────────────
function initProtoChart() {
  const ctx = document.getElementById('protoChart').getContext('2d');
  protoChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: CONFIG.PROTOCOLS.labels,
      datasets: [{
        data: CONFIG.PROTOCOLS.values,
        backgroundColor: CONFIG.PROTOCOLS.colors,
        borderWidth: 0, hoverOffset: 5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1f36',
          bodyColor: '#fff',
          padding: 8,
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` },
        },
      },
    },
  });

  // Render the custom legend with progress bars
  renderProtoLegend();
}

function renderProtoLegend() {
  const el = document.getElementById('protoLegend');
  el.innerHTML = CONFIG.PROTOCOLS.labels.map((label, i) => `
    <div class="proto-leg-row">
      <div class="proto-leg-left">
        <div class="leg-dot" style="background:${CONFIG.PROTOCOLS.colors[i]}"></div>
        ${label}
      </div>
      <div class="proto-leg-bar">
        <div class="proto-leg-fill" style="width:${CONFIG.PROTOCOLS.values[i]}%;background:${CONFIG.PROTOCOLS.colors[i]}"></div>
      </div>
      <div class="proto-leg-pct">${CONFIG.PROTOCOLS.values[i]}%</div>
    </div>`).join('');
}

// ── UPDATE TRAFFIC CHART ───────────────────────────────────────
// Push new point, drop oldest (FIFO sliding window)
function updateTrafficChart(inbound, outbound) {
  trafficHistory.inbound.push(inbound);   trafficHistory.inbound.shift();
  trafficHistory.outbound.push(outbound); trafficHistory.outbound.shift();
  trafficHistory.labels.push('');         trafficHistory.labels.shift();

  trafficChart.data.datasets[0].data = [...trafficHistory.inbound];
  trafficChart.data.datasets[1].data = [...trafficHistory.outbound];
  trafficChart.data.labels = [...trafficHistory.labels];
  trafficChart.update('none'); // No animation for smooth real-time feel
}

// ── TIME RANGE SWITCH ──────────────────────────────────────────
// Changes how many history points are shown
function setTimeRange(range, btn) {
  document.querySelectorAll('.ttab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // In real app: fetch different time window from API
  // Here we just visually indicate selection
  const points = range === '1m' ? 20 : range === '5m' ? 60 : 120;
  trafficChart.options.scales.y.max = range === '15m' ? 12 : 8;
  trafficChart.update();
}
