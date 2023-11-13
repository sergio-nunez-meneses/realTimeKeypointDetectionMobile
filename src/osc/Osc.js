import OSC from "osc-js";


export default class Osc {
	constructor(port) {
		this.serverPort = port;
		this.osc        = new OSC({plugin: new OSC.WebsocketClientPlugin()});
	}
}
