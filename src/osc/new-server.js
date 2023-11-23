const express    = require('express');
const OSC        = require('osc-js');
const cors = require('cors');

const app = express();
let udpPort = 8000;

app.use(cors);



let oscConfig = {udpClient: {port: udpPort}};

app.post('/updateUserPort', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Credentials', 'true');
	if (req.body && req.body.userPort) {
		udpPort = req.body;
		// Faites quelque chose avec userPort
		res.status(200).json({success: true});
	}
	else {
		res.status(400).json({error: 'Request body is empty or undefined'});
	}
});


const port = 8080;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

console.log(oscConfig);
const osc = new OSC({plugin: new OSC.BridgePlugin(oscConfig)});
osc.open();