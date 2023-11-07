const OSC    = require("osc-js");
const config = {udpClient: {port: 8000}};
const client = new OSC({plugin: new OSC.BridgePlugin(config)});

client.open();