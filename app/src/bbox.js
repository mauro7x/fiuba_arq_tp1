const axios = require('axios');
const {
  bbox: { port1, port2 }
} = require('./config');

const fetch_bbox = async (port) => {
  try {
    const { data } = await axios.get(`http://bbox:${port}`);
    return data;
  } catch (err) {
    return err;
  }
};

module.exports = {
  fetch_bbox1: () => fetch_bbox(port1),
  fetch_bbox2: () => fetch_bbox(port2)
};
