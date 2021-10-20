const express = require('express');

const { fetch_bbox1, fetch_bbox2 } = require('./bbox');
const { heavy_time } = require('./config');

module.exports = (port) => {
  const app = express();
  const pid = process.pid;

  const response = (message) => ({
    message,
    pid
  });

  app.get('/ping', (req, res) => res.json(response('OK')));
  app.get('/heavy', (req, res) => {
    const time = new Date();
    const target_time = new Date(time.getTime() + heavy_time);
    while (new Date() < target_time);
    res.json(response('OK'));
  });

  // bbox services
  app.get('/bbox1', async (req, res) => {
    const data = await fetch_bbox1();
    res.json(response(data));
  });
  app.get('/bbox2', async (req, res) => {
    const data = await fetch_bbox2();
    res.json(response(data));
  });

  app.listen(port, () =>
    console.log(`[Worker ${pid}] Listening on port ${port}`)
  );
};
