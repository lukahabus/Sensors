var { getMeasurement, sleep, print } = require("./utils");
var messages = require("./proto/sensor_pb");
var services = require("./proto/sensor_grpc_pb");

var { Empty } = require("google-protobuf/google/protobuf/empty_pb");

var grpc = require("@grpc/grpc-js");
var axios = require("axios");

const url = "http://127.0.0.1:3000";
const measuringInterval = 5000;

var id;
var client;

async function register(lat, long, ip, port) {
  try {
    const res = await axios.post(`${url}/api/register`, {
      latitude: lat,
      longitude: long,
      ip,
      port,
    });

    id = res.data.id;
  } catch {
    throw "Unable to register on server";
  }
}

async function findClosest() {
  try {
    const res = await axios.post(`${url}/api/closest`, {
      id,
    });

    if (res.status != 200) {
      throw new Error();
    }

    client = new services.SensorClient(
      `${res.data.ip}:${res.data.port}`,
      grpc.credentials.createInsecure()
    );

    console.log(`Found closest sensor on: ${res.data.ip}:${res.data.port}`);
  } catch {
    console.log("Couldn't find closest sensor");
  }
}

async function getNeighborMeasurement() {
  return new Promise((resolve, reject) => {
    if (!client)
      return resolve({
        temperature: null,
        pressure: null,
        humidity: null,
        co: null,
        no2: null,
        so2: null,
      });

    client.getMeasurement(new Empty(), (err, measurement) => {
      if (err) {
        return resolve({
          temperature: null,
          pressure: null,
          humidity: null,
          co: null,
          no2: null,
          so2: null,
        });
      }

      return resolve({
        temperature: measurement.getTemperature(),
        pressure: measurement.getPressure(),
        humidity: measurement.getHumidity(),
        co: measurement.getCo(),
        no2: measurement.getNo2(),
        so2: measurement.getSo2(),
      });
    });
  });
}

async function sendMeasurement(data) {
  var res;
  try {
    res = await axios.post(`${url}/api/measurement`, {
      sensorId: id,
      ...data,
    });

    if (res.status == 204) {
      throw new Error();
    }
  } catch {
    throw "Unable to send measurement to server";
  }
}

function parseMeasurements(myMeasurement, neighborMeasurement) {
  const parsedMeasurement = {};

  for (const key in myMeasurement) {
    if (myMeasurement[key] > 0 && neighborMeasurement[key] > 0) {
      parsedMeasurement[key] =
        (myMeasurement[key] + neighborMeasurement[key]) / 2;
    } else if (myMeasurement[key] > 0 || neighborMeasurement[key] > 0) {
      parsedMeasurement[key] = myMeasurement[key] + neighborMeasurement[key];
    } else {
      parsedMeasurement[key] = null;
    }
  }

  return parsedMeasurement;
}

async function startClient(lat, long, ip, port) {
  await register(lat, long, ip, port);
  await sleep(measuringInterval);
  await findClosest();

  while (true) {
    const myMeasurement = getMeasurement();
    const neighborMeasurement = await getNeighborMeasurement();
    const parsedMeasurement = parseMeasurements(
      myMeasurement,
      neighborMeasurement
    );

    print(myMeasurement, neighborMeasurement, parsedMeasurement);

    await sendMeasurement(parsedMeasurement);
    await sleep(measuringInterval);
  }
}

module.exports = startClient;
