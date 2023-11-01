var { randomFloat, randomInt } = require("./utils");
var startServer = require("./server");
var startClient = require("./client");

var server;
var ip;
var port;
var lat;
var long;

function setup() {
  ip = "127.0.0.1";
  port = randomInt(8000, 65000);
  lat = randomFloat(45.75, 45.85);
  long = randomFloat(15.87, 16);
}

async function main() {
  setup();
  server = await startServer(ip, port);
  await startClient(lat, long, ip, port);
}

main().catch((error) => {
  server.forceShutdown();
  console.error(`ERROR: ${error}`);
  process.exitCode = 1;
});

process.on("SIGINT", function () {
  console.log("\rEXITING");
  process.exit();
});
