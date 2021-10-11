const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

const heavy_time = process.env.HEAVY_TIME || 5000;

app.get('/ping', (req, res) => res.sendStatus(200));

app.get('/sync_proxy', (req, res) => {});

app.get('/async_proxy', (req, res) => {});

app.get('/heavy', (req, res) => {
  const time = new Date();
  const target_time = new Date(time.getTime() + heavy_time);
  while (new Date() < target_time);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
