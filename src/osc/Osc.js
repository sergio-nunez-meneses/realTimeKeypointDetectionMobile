import OSC from "osc-js";


export default class Osc {
	constructor() {
		this.osc = new OSC({plugin: new OSC.WebsocketClientPlugin()});
		this.osc.open();
	}

	stop() {
		this.osc.close();
	}

	sendMessage(address, value) {
		const message = new OSC.Message(address, value);
		this.osc.send(message);
	}
}
