const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyUSB0', { // change path
	baudRate: 9600
});

const GPS = require('gps');
const gps = new GPS;

gps.on('data', function(data) {
	console.log("latitude: "+gps.state.lat, "longitude: "+gps.state.lon + "Speed over the ground: "+gps.state.speed );
});

port.on('data', function(data) {
	gps.updatePartial(data);
});
