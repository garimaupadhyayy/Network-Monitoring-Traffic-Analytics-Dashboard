/* data.js — All network node data, alerts, and data generators */

// ── NODES ──────────────────────────────────────────────────────
const NODES = [
  { id:'RTR-01', name:'Core Router 01',    location:'Mumbai',    type:'Router',        ip:'10.0.1.1',  load:72, latency:12, uptime:99.9, status:'online'  },
  { id:'RTR-02', name:'Core Router 02',    location:'Delhi',     type:'Router',        ip:'10.0.1.2',  load:88, latency:31, uptime:97.2, status:'warn'    },
  { id:'SW-01',  name:'Edge Switch 01',    location:'Chennai',   type:'Switch',        ip:'10.0.2.1',  load:45, latency:8,  uptime:99.9, status:'online'  },
  { id:'SW-02',  name:'Edge Switch 02',    location:'Pune',      type:'Switch',        ip:'10.0.2.2',  load:61, latency:15, uptime:99.7, status:'online'  },
  { id:'FW-01',  name:'Firewall Gateway',  location:'Bengaluru', type:'Firewall',      ip:'10.0.3.1',  load:95, latency:67, uptime:98.1, status:'warn'    },
  { id:'LB-01',  name:'Load Balancer 01',  location:'Hyderabad', type:'Load Balancer', ip:'10.0.4.1',  load:33, latency:6,  uptime:100,  status:'online'  },
  { id:'RTR-03', name:'Edge Router 03',    location:'Kolkata',   type:'Router',        ip:'10.0.1.3',  load:54, latency:19, uptime:99.5, status:'online'  },
  { id:'SW-03',  name:'Access Switch 03',  location:'Kolkata',   type:'Switch',        ip:'10.0.2.3',  load:78, latency:22, uptime:96.8, status:'online'  },
];

// ── ALERTS ─────────────────────────────────────────────────────
const ALERTS = [
  { id:1, node:'FW-01', title:'FW-01 latency spike',    detail:'Latency exceeded 50ms threshold', location:'Bengaluru', severity:'critical', time:'32s ago' },
  { id:2, node:'RTR-02', title:'RTR-02 load > 85%',     detail:'CPU load exceeded 85% threshold', location:'Delhi',     severity:'critical', time:'1m ago'  },
  { id:3, node:'SW-03',  title:'SW-03 packet loss 2%',  detail:'Packet loss above normal on eth0',location:'Kolkata',   severity:'warning',  time:'4m ago'  },
];

// ── TRAFFIC HISTORY ────────────────────────────────────────────
const trafficHistory = {
  inbound:  [],
  outbound: [],
  labels:   Array(CONFIG.HISTORY_LENGTH).fill(''),
};

// Pre-fill so chart isn't empty on load
(function initHistory() {
  for (let i = 0; i < CONFIG.HISTORY_LENGTH; i++) {
    trafficHistory.inbound.push(rnd(CONFIG.TRAFFIC.INBOUND_MIN,  CONFIG.TRAFFIC.INBOUND_MAX));
    trafficHistory.outbound.push(rnd(CONFIG.TRAFFIC.OUTBOUND_MIN, CONFIG.TRAFFIC.OUTBOUND_MAX));
  }
})();

// ── GENERATORS ─────────────────────────────────────────────────
// Returns a new simulated traffic data point
function generateTrafficPoint() {
  return {
    inbound:  rnd(CONFIG.TRAFFIC.INBOUND_MIN,  CONFIG.TRAFFIC.INBOUND_MAX),
    outbound: rnd(CONFIG.TRAFFIC.OUTBOUND_MIN, CONFIG.TRAFFIC.OUTBOUND_MAX),
  };
}

// Simulate live changes in each node's metrics
function updateNodeMetrics() {
  NODES.forEach(node => {
    node.load    = clamp(node.load    + randShift(8),  10, 99);
    node.latency = clamp(node.latency + randShift(6),   3, 120);
    node.status  = node.load > CONFIG.THRESHOLDS.LOAD_PERCENT ? 'warn'
                 : node.load < 15 ? 'offline' : 'online';
  });
}

// ── SPARKLINE HISTORY (per metric card) ──────────────────────
const sparkHistory = {
  throughput:  Array(15).fill(0).map(() => rnd(3,7)),
  latency:     Array(15).fill(0).map(() => rnd(8,40)),
  packetLoss:  Array(15).fill(0).map(() => rnd(0,1.5)),
  nodes:       Array(15).fill(18),
};
