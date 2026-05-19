/* main.js — Dashboard orchestrator. Wires everything together. */

let tickCount = 0;

// ── UPDATE METRIC CARDS ────────────────────────────────────────
function updateMetrics(inbound, latency, packetLoss) {
  // Throughput
  document.getElementById('m-t').textContent = inbound.toFixed(1);
  const td = document.getElementById('m-td');
  td.textContent = inbound > 5 ? '↑ High load' : '↑ Nominal';
  td.className   = 'mdelta ' + (inbound > 5 ? 'dn' : 'up');

  // Latency
  document.getElementById('m-l').textContent = latency;
  const ld = document.getElementById('m-ld');
  ld.textContent = latency > CONFIG.THRESHOLDS.LATENCY_MS ? '↑ High — check FW-01' : '↓ Within threshold';
  ld.className   = 'mdelta ' + (latency > CONFIG.THRESHOLDS.LATENCY_MS ? 'dn' : 'up');

  // Packet loss
  document.getElementById('m-p').textContent = packetLoss.toFixed(2);
  const pd = document.getElementById('m-pd');
  pd.textContent = packetLoss > CONFIG.THRESHOLDS.PACKET_LOSS ? '⚠ Above normal' : 'Normal range';
  pd.className   = 'mdelta ' + (packetLoss > CONFIG.THRESHOLDS.PACKET_LOSS ? 'dn' : 'neu');

  // Node count
  const onlineCount = NODES.filter(n => n.status === 'online').length;
  document.getElementById('m-n').textContent = onlineCount;
}

// ── MAIN TICK ──────────────────────────────────────────────────
// This is the "heartbeat" — runs every CONFIG.TICK_INTERVAL ms
function tick() {
  tickCount++;
  document.getElementById('tick-count').textContent = tickCount;

  // 1. Generate new data
  const pt         = generateTrafficPoint();
  const latency    = Math.round(8 + Math.random() * 40);
  const packetLoss = rnd(0, 1.5);

  // 2. Update clock
  updateClock();

  // 3. Update KPI cards
  updateMetrics(pt.inbound, latency, packetLoss);

  // 4. Update traffic chart
  updateTrafficChart(pt.inbound, pt.outbound);

  // 5. Update sparklines
  updateSparklines(pt.inbound, latency, packetLoss);

  // 6. Simulate node changes
  updateNodeMetrics();

  // 7. Re-render node table + bandwidth bars
  renderNodeTable();
  renderBandwidthBars();

  // 8. Check thresholds → auto alerts
  checkThresholds();

  // Flash card to show update (subtle)
  if (tickCount % 5 === 0) flashElement('card-throughput');
}

// ── STARTUP ────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Init all modules
  initTrafficChart();
  initProtoChart();
  initSparklines();
  initSearch();

  // First render
  renderNodeTable();
  renderAlerts();
  renderBandwidthBars();
  updateClock();

  // Start heartbeat
  setInterval(tick, CONFIG.TICK_INTERVAL);
  tick(); // Run immediately so page isn't blank for 1.5s
});
