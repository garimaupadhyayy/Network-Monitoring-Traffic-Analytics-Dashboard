/* sparklines.js — Mini sparkline charts inside each metric card */

let sparkCharts = {};

function initSparklines() {
  const opts = (color) => ({
    type: 'line',
    data: { labels: Array(15).fill(''), datasets: [{ data: [], borderColor: color, borderWidth: 1.5, pointRadius: 0, fill: false, tension: 0.4 }] },
    options: {
      responsive: false, animation: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
    },
  });

  sparkCharts.s1 = new Chart(document.getElementById('spark1'), opts(CONFIG.COLORS.INBOUND));
  sparkCharts.s2 = new Chart(document.getElementById('spark2'), opts(CONFIG.COLORS.GREEN));
  sparkCharts.s3 = new Chart(document.getElementById('spark3'), opts(CONFIG.COLORS.AMBER));
  sparkCharts.s4 = new Chart(document.getElementById('spark4'), opts(CONFIG.COLORS.RED));

  // Prefill
  sparkCharts.s1.data.datasets[0].data = [...sparkHistory.throughput];
  sparkCharts.s2.data.datasets[0].data = [...sparkHistory.latency];
  sparkCharts.s3.data.datasets[0].data = [...sparkHistory.packetLoss];
  sparkCharts.s4.data.datasets[0].data = [...sparkHistory.nodes];

  Object.values(sparkCharts).forEach(c => c.update('none'));
}

function updateSparklines(throughput, latency, packetLoss) {
  sparkHistory.throughput.push(throughput);  sparkHistory.throughput.shift();
  sparkHistory.latency.push(latency);        sparkHistory.latency.shift();
  sparkHistory.packetLoss.push(packetLoss);  sparkHistory.packetLoss.shift();

  sparkCharts.s1.data.datasets[0].data = [...sparkHistory.throughput];
  sparkCharts.s2.data.datasets[0].data = [...sparkHistory.latency];
  sparkCharts.s3.data.datasets[0].data = [...sparkHistory.packetLoss];

  Object.values(sparkCharts).forEach(c => c.update('none'));
}
