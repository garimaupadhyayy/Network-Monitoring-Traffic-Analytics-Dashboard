/* config.js — All configurable constants in one place.
   Change values here to customize the dashboard. */

const CONFIG = {
  // How often the dashboard updates (milliseconds)
  TICK_INTERVAL: 1500,

  // How many data points to keep in traffic chart history
  HISTORY_LENGTH: 20,

  // Alert thresholds — if exceeded, node turns to 'warn'
  THRESHOLDS: {
    LATENCY_MS:    30,   // ms — above this = high latency
    LOAD_PERCENT:  85,   // % — above this = high load
    PACKET_LOSS:   1.0,  // % — above this = packet loss warning
  },

  // Traffic simulation ranges (Gbps)
  TRAFFIC: {
    INBOUND_MIN:  3.0,
    INBOUND_MAX:  7.0,
    OUTBOUND_MIN: 1.0,
    OUTBOUND_MAX: 3.5,
  },

  // Chart colors
  COLORS: {
    INBOUND:  '#3b82f6',
    OUTBOUND: '#8b5cf6',
    GREEN:    '#10b981',
    AMBER:    '#f59e0b',
    RED:      '#ef4444',
    GREY:     '#9199ab',
  },

  // Protocol split (must add to 100)
  PROTOCOLS: {
    labels: ['HTTP/S', 'VoIP', 'DNS', 'Other'],
    values: [42, 23, 18, 17],
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
  },
};
