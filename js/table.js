/* table.js — Node table rendering, sorting, filtering */

let currentFilter = 'all';
let currentSort   = { key: 'id', asc: true };

// ── RENDER TABLE ───────────────────────────────────────────────
function renderNodeTable() {
  const tbody = document.getElementById('tbody');

  // Filter
  let rows = currentFilter === 'all'
    ? [...NODES]
    : NODES.filter(n => n.status === currentFilter);

  // Sort
  rows.sort((a, b) => {
    let valA = a[currentSort.key];
    let valB = b[currentSort.key];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return currentSort.asc ? -1 :  1;
    if (valA > valB) return currentSort.asc ?  1 : -1;
    return 0;
  });

  tbody.innerHTML = rows.map(node => {
    const bc       = loadColor(node.load);
    const latColor = latencyColor(node.latency);
    const pillCls  = node.status === 'online' ? 'p-ok' : node.status === 'warn' ? 'p-warn' : 'p-off';
    const pillLbl  = node.status === 'online' ? 'Online' : node.status === 'warn' ? 'Warning' : 'Offline';

    return `
      <tr>
        <td class="node-id">${node.id}</td>
        <td>${node.location}</td>
        <td style="color:#9199ab">${node.type}</td>
        <td>
          <div class="bar-wrap">
            <div class="bar-fill" style="width:${node.load}%;background:${bc}"></div>
          </div>
          <span style="font-size:10px;color:${bc};font-weight:600">${node.load}%</span>
        </td>
        <td style="font-family:'DM Mono',monospace;font-size:11px;color:${latColor}">${node.latency} ms</td>
        <td style="font-family:'DM Mono',monospace;font-size:11px;color:#9199ab">${fmtUptime(node.uptime)}</td>
        <td style="font-family:'DM Mono',monospace;font-size:11px;color:#9199ab">${node.ip}</td>
        <td><span class="pill ${pillCls}"><span class="pill-dot"></span>${pillLbl}</span></td>
      </tr>`;
  }).join('');

  // Update footer counts
  document.getElementById('f-online').textContent  = NODES.filter(n => n.status === 'online').length;
  document.getElementById('f-warn').textContent    = NODES.filter(n => n.status === 'warn').length;
  document.getElementById('f-offline').textContent = NODES.filter(n => n.status === 'offline').length;
  document.getElementById('lupd').textContent = 'just now';
}

// ── SORT ───────────────────────────────────────────────────────
function sortTable(key) {
  if (currentSort.key === key) {
    currentSort.asc = !currentSort.asc; // Toggle direction
  } else {
    currentSort = { key, asc: true };
  }
  renderNodeTable();
}

// ── FILTER ─────────────────────────────────────────────────────
function filterTable(status, btn) {
  currentFilter = status;
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderNodeTable();
}
