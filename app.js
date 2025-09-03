const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// MongoDB Connection (no deprecated options)
mongoose.connect(process.env.MONGO_URI, {
  user: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASSWORD
})
  .then(() => console.log('MongoDB Connection Successful'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Schema and Model
const dataSchema = new mongoose.Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// Routes
// Get planet by ID (updated to async/await, no callbacks)
app.post('/planet', async (req, res) => {
  try {
    const planetData = await planetModel.findOne({ id: req.body.id }).exec();
    if (!planetData) {
      return res.status(404).send("Ooops, We only have 9 planets and a sun. Select a number from 0 - 9");
    }
    res.send(planetData);
  } catch (err) {
    console.error("Error fetching planet:", err);
    res.status(500).send("Error in Planet Data");
  }
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// OS Info
app.get('/os', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    os: OS.hostname(),
    env: process.env.NODE_ENV
  });
});

// Health check - Live
app.get('/live', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({ status: "live" });
});

// Health check - Ready
app.get('/ready', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({ status: "ready" });
});

// Start server
app.listen(3000, () => {
  console.log("Server successfully running on port - 3000");
});

module.exports = app;
