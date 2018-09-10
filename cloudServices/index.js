const awsIot = require('aws-iot-device-sdk')
const store = require('./../store')

const keypath = '/home/pi/Desktop/gateway/certs/54296b77b9/private.key'
const certpath = '/home/pi/Desktop/gateway/certs/54296b77b9/cert.crt'
const capath = '/home/pi/Desktop/gateway/certs/54296b77b9/ca.pem'
const endPoint = 'a3p843671svo75.iot.us-east-1.amazonaws.com'

function getConfig (clientId) {
	return {
		keyPath : keypath,
		certPath: certpath,
		caPath  : capath,
		clientId,
		host    : endPoint
	}
}

/*
const device = awsIot.device(getConfig('IKOL-OFFICE-GATEWAY1'))

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
*/
const thingShadows = awsIot.thingShadow(getConfig('IKOL-OFFICE-GATEWAY'))

let clientTokenUpdate

thingShadows.on('connect', function () {
	console.log('shadow connect')
	
	thingShadows.register('IKOL-OFFICE-GATEWAY', {}, function () {
		
		const state = store.getState()
		const payload = {
			state: {
				reported: state
			}
		}
		
		clientTokenUpdate = thingShadows.update('IKOL-OFFICE-GATEWAY', payload)
		
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

thingShadows
	.on('error', error => console.log(error))


// module.exports.device = device
module.exports.shadow = thingShadows


module.exports.reportState = (state) => {
	const payload = {
		state: {
			reported: state
		}
	}
	
	clientTokenUpdate = thingShadows.update('IKOL-OFFICE-GATEWAY', payload)
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
		setTimeout(() => {
			module.exports.reportState(state)
		}, 1000)
	
	}
	
}
