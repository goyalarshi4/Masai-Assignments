// Express App combined with Modules//
// index.js

const express = require('express');
const fs = require('fs');
const os = require('os');
const dns = require('dns');

const app = express();
const port = 3000;

// Function to read Data.txt (replacing separate read.js module)
function readFileContent(callback) {
  fs.readFile('Data.txt', 'utf8', (err, data) => {
    if (err) {
      callback('Error reading file or file not found.');
    } else {
      callback(data);
    }
  });
}

// /test route
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// /readfile route
app.get('/readfile', (req, res) => {
  readFileContent((content) => {
    res.send(content);
  });
});

// /systemdetails route
app.get('/systemdetails', (req, res) => {
  const platform = os.platform();
  const totalMemory = (os.totalmem() / (1024 ** 3)).toFixed(2) + ' GB';
  const freeMemory = (os.freemem() / (1024 ** 3)).toFixed(2) + ' GB';
  const cpuModel = os.cpus()[0].model;
  const cpuCores = os.cpus().length;

  res.json({
    platform,
    totalMemory,
    freeMemory,
    cpuModel,
    cpuCores,
  });
});

// /getip route
app.get('/getip', (req, res) => {
  dns.lookup('masaischool.com', { all: true }, (err, addresses) => {
    if (err) {
      res.status(500).json({ error: 'Failed to resolve IP address' });
    } else {
      const ipv4 = addresses.find(a => a.family === 4)?.address || 'Not found';
      const ipv6 = addresses.find(a => a.family === 6)?.address || 'Not found';

      res.json({
        hostname: 'masaischool.com',
        ipv4,
        ipv6,
      });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
