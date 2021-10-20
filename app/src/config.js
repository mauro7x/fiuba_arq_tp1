module.exports = {
  bbox: {
    port1: process.env.BBOX1_PORT || 9090,
    port2: process.env.BBOX2_PORT || 9091
  },
  heavy_time: 5000, // ms
  n_workers: process.env.N_WORKERS || 1,
  port: process.env.PORT || 3000
};
