const noble = require('noble');
const Gpio = require('onoff').Gpio
const sleep = require('sleep')
const store = require('./store')
const actions = require('./store/actions')

const LED = new Gpio(4, 'out') //use GPIO pin 4 as output

noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {
		// only scan for devices advertising these service UUID's (default or empty array => any peripherals
		let serviceUuids = [];
		// allow duplicate peripheral to be returned (default false) on discovery event
		let allowDuplicates = true;
		
		//noble.startScanning(serviceUuids, allowDuplicates);
		noble.startScanning(serviceUuids, allowDuplicates);
		
	} else {
		noble.stopScanning();
	}
});

noble.on('discover', function(peripheral) {
	// console.log('Found device with local name: ' + peripheral.advertisement.localName);
	// console.log('advertising the following service uuids: ' + peripheral.advertisement.serviceUuids);
	// console.log();
	LED.writeSync(0)
	if (peripheral.id === "ac9a22935ad0"){
		//console.log(peripheral.advertisement)
		
		// const motionAction = actions.createSensorAction({ actionType: actions.MOTION_SENSOR_UPDATE, sensorId : '1',value: 1, batteryLow : false, connected: true})
		//store.dispatch(motionAction)
		LED.writeSync(1)
		sleep.sleep(1)
		LED.writeSync(0)
	}

	
});




// var SerialPort = require('serialport');
//
//
// var port = new SerialPort('/dev/ttyUSB0', {
//     baudRate: 9600
// });
//
// port.on('open',()=> console.log('Port was opened'))
//
// // Switches the port into "flowing mode"
// port.on('data', function (data) {
//     console.log(data.toString());
// });
// port.write('merhaba')