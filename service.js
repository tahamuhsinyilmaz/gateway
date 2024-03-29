const Gpio = require('onoff').Gpio
const actions = require('./store/actions')
const store = require('./store')
const noble = require('./nobleSample')
// const rpio = require('./rpio')

const LED = new Gpio(4, 'out') //use GPIO pin 4 as output
const motionSensor = new Gpio(22, 'in', 'both')
const floodSensor = new Gpio(27, 'in', 'both')
const smokeSensor = new Gpio(17, 'in', 'both')

const cloud = require('./cloudServices')

motionSensor.watch((err, value) => { //Watch for hardware interrupts on pushButton GPIO, specify callback function
	if (err) return console.error('GPIO ERROR motionSensor: ', err)
	console.log('motionSensor : ', value)
	
	const action = actions.createSensorAction({
		actionType: actions.MOTION_SENSOR_UPDATE,
		sensorId: 'FBineZasPz',
		type: 'motion',
		name: 'Kamara',
		batteryLow : false,
		connected : true,
		value
	})
	
	store.dispatch(action)
	
	// LED.writeSync(value) //turn LED on or off depending on the button state (0 or 1)
})

floodSensor.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
	if (err) return console.error('GPIO ERROR floodSensor: ', err)
	console.log('floodSensor : ', value)
	
	const action = actions.createSensorAction({
		actionType: actions.WATER_SENSOR_UPDATE,
		sensorId: 'iir1AOx11R',
		type: 'water',
		name: 'pruva',
		batteryLow : false,
		connected : true,
		value
	})
	
	store.dispatch(action)
	//LED.writeSync(value) //turn LED on or off depending on the button state (0 or 1)
})

smokeSensor.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
	if (err) return console.error('GPIO ERROR smokeSensor : ', err)
	console.log('smokeSensor : ', value)
	
	const action = actions.createSensorAction({
		actionType: actions.SMOKE_SENSOR_UPDATE,
		sensorId: '75ujv4uaR1',
		type: 'smoke',
		name: 'Makine Dairesi',
		batteryLow : false,
		connected : true,
		value
	})
	
	store.dispatch(action)
	//LED.writeSync(value) //turn LED on or off depending on the button state (0 or 1)
})