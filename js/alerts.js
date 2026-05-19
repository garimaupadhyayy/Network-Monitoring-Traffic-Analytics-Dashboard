/* alerts.js — Alert panel rendering & management */

// ── RENDER ALERTS ──────────────────────────────────────────────
function renderAlerts() {
  const container = document.getElementById('alertsContainer');
  const countEl   = document.getElementById('alert-count');

  countEl.textContent = `${ALERTS.length} open`;

  container.innerHTML = ALERTS.map(alert => {
    const isCrit = alert.severity === 'critical';
    const isWarn = alert.severity === 'warning';

    const itemClass  = isCrit ? 'ai-err'  : isWarn ? 'ai-warn'  : 'ai-info';
    const badgeClass = isCrit ? 'ab-err'  : isWarn ? 'ab-warn'  : 'ab-info';
    const icon       = isCrit ? '⚠'       : isWarn ? '○'        : 'ℹ';
    const badgeText  = isCrit ? 'Critical' : isWarn ? 'Warning'  : 'Info';

    return `
      <div class="alert-item ${itemClass}">
        <div class="ai-icon">${icon}</div>
        <div style="flex:1">
          <div class="ai-title">${alert.title}</div>
          <div class="ai-meta">${alert.location} · ${alert.time}</div>
        </div>
        <div class="ai-badge ${badgeClass}">${badgeText}</div>
      </div>`;
  }).join('');
}

// ── ADD NEW ALERT ──────────────────────────────────────────────
// Called when a node threshold is exceeded
function addAlert(node, message, severity) {
  // Avoid duplicate alerts for same node
  const exists = ALERTS.find(a => a.node === node.id);
  if (exists) return;

  ALERTS.unshift({
    id:       Date.now(),
    node:     node.id,
    title:    `${node.id} — ${message}`,
    detail:   message,
    location: node.location,
    severity: severity,
    time:     'just now',
  });

  // Keep max 5 alerts
  if (ALERTS.length > 5) ALERTS.pop();

  renderAlerts();
}

// ── AUTO ALERT CHECK ───────────────────────────────────────────
// Runs every tick — checks thresholds and fires alerts
function checkThresholds() {
  NODES.forEach(node => {
    if (node.latency > CONFIG.THRESHOLDS.LATENCY_MS * 2) {
      addAlert(node, `Latency spike: ${node.latency}ms`, 'critical');
    }
    if (node.load > CONFIG.THRESHOLDS.LOAD_PERCENT) {
      addAlert(node, `Load exceeded ${node.load}%`, 'warning');
    }
  });
}
