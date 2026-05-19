/* bandwidth.js — Bandwidth utilization bar chart per node */

function renderBandwidthBars() {
  const container = document.getElementById('bandwidthBars');

  container.innerHTML = NODES.map(node => {
    const color = loadColor(node.load);
    return `
      <div class="bw-row">
        <div class="bw-label">${node.id}</div>
        <div class="bw-loc">${node.location}</div>
        <div class="bw-bar-wrap">
          <div class="bw-bar-fill" style="width:${node.load}%;background:${color}"></div>
        </div>
        <div class="bw-pct" style="color:${color}">${node.load}%</div>
      </div>`;
  }).join('');
}
