/* utils.js — Helper / utility functions used across all modules */

// Random float between min and max, 2 decimal places
function rnd(min, max) {
  return parseFloat((min + Math.random() * (max - min)).toFixed(2));
}

// Clamp a value between min and max
function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

// Small random shift (+/-) for simulating live data
function randShift(range) {
  return Math.round((Math.random() - 0.48) * range);
}

// Format uptime float as "99.9%"
function fmtUptime(val) {
  return val.toFixed(1) + '%';
}

// Format latency with color class
function latencyColor(ms) {
  if (ms > CONFIG.THRESHOLDS.LATENCY_MS) return CONFIG.COLORS.RED;
  if (ms > 20) return CONFIG.COLORS.AMBER;
  return '#374151';
}

// Bar color based on load %
function loadColor(pct) {
  if (pct > 80) return CONFIG.COLORS.RED;
  if (pct > 60) return CONFIG.COLORS.AMBER;
  return CONFIG.COLORS.GREEN;
}

// Trigger a CSS flash animation on an element
function flashElement(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('flash');
  void el.offsetWidth; // reflow trick to restart animation
  el.classList.add('flash');
}

// Update clock display
function updateClock() {
  const now = new Date();
  document.getElementById('clk').textContent   = now.toLocaleTimeString('en-IN');
  document.getElementById('cdate').textContent  = now.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}
