//modul tanimlamalari

const awsIot = require('aws-iot-device-sdk')
const Gpio = require('onoff').Gpio

const keypath = '/home/pi/Desktop/gateway/certs/54296b77b9/private.key'
const certpath = '/home/pi/Desktop/gateway/certs/54296b77b9/cert.crt'
const capath = '/home/pi/Desktop/gateway/certs/54296b77b9/ca.pem'
const endPoint = 'a3p843671svo75.iot.us-east-1.amazonaws.com'

const device = awsIot.device({
	keyPath : keypath,
	certPath: certpath,
	caPath  : capath,
	clientId: 'device',
	host    : endPoint
})

device
	.on('connect', function () {
		console.log('connect')
		device.subscribe('topic_1')
		device.publish('topic_2', JSON.stringify({ test_data: 1 }))
	})

device
	.on('message', (topic, payload) => console.log('message', topic, payload.toString()))
device
	.on('error', error => console.log(error))


const thingShadows = awsIot.thingShadow({
	keyPath : keypath,
	certPath: certpath,
	caPath  : capath,
	clientId: 'shadow',
	host    : endPoint
})

let clientTokenUpdate


thingShadows.on('connect', function () {
//
// After connecting to the AWS IoT platform, register interest in the
// Thing Shadow named 'RGBLedLamp'.
//
	console.log('shadow connect')
	thingShadows.register('IKOL-OFFICE-GATEWAY', {}, function () {

// Once registration is complete, update the Thing Shadow named
// 'RGBLedLamp' with the latest device state and save the clientToken
// so that we can correlate it with status or timeout events.
//
// Thing shadow state
//
		const sss = {
			online    : true, // connection type ???
			energyInfo: {
				plugged     : true,
				batteryLevel: 100
			},
			armInfo   : {
				armed      : false,
				dateUpdated: '22082018 14:02 GMT',
				userId     : '12314'
			},
			sensors   : ['12123123', '4435562', '76856442'],
			s_12123123: {
				connected: true,
				battery  : 70,
				active   : false,
			},
			s_4435562 : {
				connected: true,
				battery  : 55,
				active   : true,
				value    : false
			},
			s_76856442: {
				connected: true,
				active   : true,
				value    : 5234
			},
			location  : {
				lat        : 21.472322132,
				lng        : 34.546732234,
				accuracy   : 15.25,
				dateUpdated: '22082018 14:02 GMT'
			}
		}
		const ikolGatewayState = {
			state: {
				reported: sss
			}
			
		}
		
		clientTokenUpdate = thingShadows.update('IKOL-OFFICE-GATEWAY', ikolGatewayState)
//
// The update method returns a clientToken; if non-null, this value will
// be sent in a 'status' event when the operation completes, allowing you
// to know whether or not the update was successful.  If the update method
// returns null, it's because another operation is currently in progress and
// you'll need to wait until it completes (or times out) before updating the
// shadow.
//
		if (clientTokenUpdate === null) {
			console.log('update shadow failed, operation still in progress')
		}
	})
})

thingShadows.on('status',
	function (thingName, stat, clientToken, stateObject) {
		console.log('received ' + stat + ' on ' + thingName + ': ' +
			JSON.stringify(stateObject))
//
// These events report the status of update(), get(), and delete()
// calls.  The clientToken value associated with the event will have
// the same value which was returned in an earlier call to get(),
// update(), or delete().  Use status events to keep track of the
// status of shadow operations.
//
	})

thingShadows.on('delta',
	function (thingName, stateObject) {
		console.log('received delta on ' + thingName + ': ' +
			JSON.stringify(stateObject))
	})

thingShadows.on('timeout',
	function (thingName, clientToken) {
		console.log('received timeout on ' + thingName +
			' with token: ' + clientToken)
//
// In the event that a shadow operation times out, you'll receive
// one of these events.  The clientToken value associated with the
// event will have the same value which was returned in an earlier
// call to get(), update(), or delete().
//
	})

const LED = new Gpio(4, 'out') //use GPIO pin 4 as output
const motionSensor = new Gpio(13, 'in', 'both')
const floodSensor = new Gpio(19, 'in', 'both')
const smokeSensor = new Gpio(26, 'in', 'both')


motionSensor.watch((err, value) => { //Watch for hardware interrupts on pushButton GPIO, specify callback function
	return console.log('motionSensor : ', value)
	if (err) return console.error('There was an error', err) //output error message to console
	LED.writeSync(value) //turn LED on or off depending on the button state (0 or 1)
	
	const ikolGatewayState = {
		state: {
			reported: { s_12123123: { value : value } }
		}
	}
	clientTokenUpdate = thingShadows.update('IKOL-OFFICE-GATEWAY', ikolGatewayState)
	
})


floodSensor.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
	return console.log('floodSensor : ', value)
	
	if (err) { //if an error
		console.error('There was an error', err) //output error message to console
		return
	}
	LED.writeSync(value) //turn LED on or off depending on the button state (0 or 1)
	const ikolGatewayState = {
		state: {
			reported: { s_4435562: { value : value } }
		}
	}
	clientTokenUpdate = thingShadows.update('IKOL-OFFICE-GATEWAY', ikolGatewayState)
})


smokeSensor.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
	return console.log('smokeSensor : ', value)
	
	if (err) { //if an error
		console.error('There was an error', err) //output error message to console
		return
	}
	LED.writeSync(value) //turn LED on or off depending on the button state (0 or 1)
	const ikolGatewayState = {
		state: {
			reported: { s_76856442: { value : value } }
		}
	}
	clientTokenUpdate = thingShadows.update('IKOL-OFFICE-GATEWAY', ikolGatewayState)
})

