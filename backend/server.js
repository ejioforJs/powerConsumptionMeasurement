const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const fs = require('fs');

var app = express();
var PORT = 2000;

app.use(express.json());
app.use(cors());

// Route to fetch power consumption data for a single application
app.post('/power-consumption', async function (req, res) {
  var applicationName = req.body.applicationName;

  try {
    var powerConsumptionData = await getPowerConsumptionForApplication(applicationName);
    res.json(powerConsumptionData);
  } catch (error) {
    console.error('Error retrieving power consumption data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to retrieve power consumption data for a single application
async function getPowerConsumptionForApplication(applicationName) {
  return new Promise((resolve, reject) => {
    const script = `
      $ProcessName = "${applicationName}"
      $PowerConsumption = (Get-Process | Where-Object { $_.ProcessName -like $ProcessName }).CPU
      $PowerConsumption
    `;

    const child = spawn('powershell.exe', ['-command', script]);

    let powerConsumption = null;

    child.stdout.on('data', (data) => {
      powerConsumption = parseFloat(data.toString().trim());
    });

    child.stderr.on('data', (data) => {
      reject(new Error('Error retrieving power consumption data: ' + data.toString().trim()));
    });

    child.on('error', (error) => {
      reject(new Error('Error executing PowerShell command: ' + error.message));
    });

    child.on('close', (code) => {
      if (code === 0 && powerConsumption !== null) {
        resolve(powerConsumption);
      } else {
        reject(new Error('Error retrieving power consumption data. Exit code: ' + code));
      }
    });
  });
}

// Function to execute a command asynchronously
function executeCommand(command) {
  return new Promise(function (resolve, reject) {
    exec(command, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Function to read power consumption data from file
// Function to read power consumption data from file
function readPowerConsumptionFromFile(filePath) {
  var data = fs.readFileSync(filePath, 'utf8');
  var lines = data.trim().split('\r\n');

  console.log('File contents:', data); // Add this line for logging

  if (lines.length < 2) {
    throw new Error('Invalid power consumption data');
  }

  var headers = lines[0].split(',');
  var values = lines[1].split(',');

  var powerConsumptionData = {};

  for (var i = 0; i < headers.length; i++) {
    var header = headers[i].trim();
    var value = parseFloat(values[i].trim());

    powerConsumptionData[header] = value;
  }

  return powerConsumptionData;
}

app.listen(PORT, function () {
  console.log('Server is running on port ' + PORT);
});

module.exports = app;
