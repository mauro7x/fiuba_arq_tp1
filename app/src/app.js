const express = require('express');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 3000;

const heavy_time = process.env.HEAVY_TIME || 5000;

const bbox_port = {
  sync: process.env.BBOX_SYNC_PORT || 9090,
  async: process.env.BBOX_ASYNC_PORT || 9091
};

const fetch_bbox = async (port) => {
  try {
    const { data } = await axios.get(`http://bbox:${port}`);
    return data;
  } catch (err) {
    return err;
  }
};

app.get('/ping', (req, res) => res.sendStatus(200));

app.get('/bbox1', async (req, res) =>
  res.json(await fetch_bbox(bbox_port.sync))
);

app.get('/bbox2', async (req, res) =>
  res.json(await fetch_bbox(bbox_port.async))
);

app.get('/heavy', (req, res) => {
  const time = new Date();
  const target_time = new Date(time.getTime() + heavy_time);
  while (new Date() < target_time);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
