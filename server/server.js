const OSC = require("osc-js");
const http = require("http");
const WebSocket = require("ws");
const hostname = "127.0.0.1";
const port = 3003;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  // Gérez les messages OSC ici et transmettez-les à PureData
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const config = {
  udpClient: { port: 9129 },
  wsServer: { port: 8080 },
};
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });
osc.open();

osc.on("open", function () {
  console.log("Listening for OSC over UDP.");
});
