const SerialPort = require('serialport');
const Gpio = require('onoff').Gpio
const sleep = require('sleep')
const buzzer = new Gpio(4, 'out')
let nData=[]

let port = new SerialPort('/dev/ttyUSB0', {
	baudRate: 9600
});

port.on('open',()=> console.log('Port was opened'))

// Switches the port into "flowing mode"
port.on('data', function (data) {
	
	buzzer.writeSync(0)
	
	nData.push(data)
	let bfr = Buffer.concat(nData)
	if(bfr.length>27){
		if(bfr[25]==0){
			buzzer.writeSync(1)
			sleep.sleep(1)
			buzzer.writeSync(0)
			console.log('alarm var')
		}
		bfr = {} // renewing the buffer and nData array
		nData=[]
	}
	
	
	
});