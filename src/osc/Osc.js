import OSC from "osc-js";


export default class Osc {
	constructor(port) {
		this.serverPort = port;
		this.osc        = new OSC({plugin: new OSC.WebsocketClientPlugin()});
		this.osc.open();
	}

	// TODO: Add methods start and stop

	sendData(address, value) {
		const message = new OSC.Message(address, value);
		this.osc.send(message);
	}
}
