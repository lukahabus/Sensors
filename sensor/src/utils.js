const fs = require("fs");
const { parse } = require("csv-parse/sync");

function randomInt(min, max) {
  return Math.floor(randomFloat(min, max));
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const startTime = new Date();
const measurements = parse(fs.readFileSync("./readings.csv"), {
  columns: true,
  skip_empty_lines: true,
});

function getMeasurement() {
  const dsecs = Math.floor((Date.now() - startTime) / 1000);
  const row = measurements[dsecs % 100 + 1];
  return {
    temperature: parseFloat("0" + row.Temperature),
    pressure: parseFloat("0" + row.Pressure),
    humidity: parseFloat("0" + row.Humidity),
    co: parseFloat("0" + row.CO),
    no2: parseFloat("0" + row.NO2),
    so2: parseFloat("0" + row.SO2),
  };
}

function print(d1, d2, d3) {
  console.log();
  console.log("\t\tTemperature\tPressure\tHumidity\tCO\tNO2\tSO2");
  console.log(
    `My:\t\t${d1.temperature}\t\t${d1.pressure}\t\t${d1.humidity}\t\t${d1.co}\t${d1.no2}\t${d1.so2}`
  );
  console.log(
    `Neighbour:\t${d2.temperature}\t\t${d2.pressure}\t\t${d2.humidity}\t\t${d2.co}\t${d2.no2}\t${d2.so2}`
  );
  console.log(
    `Calibrated:\t${d3.temperature}\t\t${d3.pressure}\t\t${d3.humidity}\t\t${d3.co}\t${d3.no2}\t${d3.so2}`
  );
}

module.exports = { randomInt, randomFloat, sleep, getMeasurement, print };
