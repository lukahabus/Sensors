var messages = require("./proto/sensor_pb");
var services = require("./proto/sensor_grpc_pb");

var grpc = require("@grpc/grpc-js");
const { sleep, getMeasurement } = require("./utils");

function GetMeasurement(call, callback) {
  var reply = new messages.Measurement();

  const measurement = getMeasurement();
  reply.setTemperature(measurement.temperature);
  reply.setPressure(measurement.pressure);
  reply.setHumidity(measurement.humidity);
  reply.setCo(measurement.co);
  reply.setNo2(measurement.no2);
  reply.setSo2(measurement.so2);

  callback(null, reply);
}

async function startServer(ip, port) {
  var server = new grpc.Server();
  server.addService(services.SensorService, { getMeasurement: GetMeasurement });
  server.bindAsync(
    `${ip}:${port}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log(`Starting server on: ${ip}:${port}`);
    }
  );

  await sleep(100);
  return server;
}

module.exports = startServer;
