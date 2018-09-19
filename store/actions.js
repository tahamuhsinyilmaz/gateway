module.exports.MOTION_SENSOR_UPDATE = 'MOTION_SENSOR_UPDATE'
module.exports.SMOKE_SENSOR_UPDATE = 'SMOKE_SENSOR_UPDATE'
module.exports.WATER_SENSOR_UPDATE = 'WATER_SENSOR_UPDATE'
module.exports.ALARM = 'ALARM'
module.exports.WARNING = 'WARNING'

const uuid = require('uuid/v4')

module.exports.createSensorAction = function ({ actionType, sensorId, name, type, value, batteryLow, connected }) {
	return {
		type: actionType,
		payload: { sensorId, name, type, value, batteryLow, connected }
	}
}

module.exports.createAlarm = function ({ type, sensorId, extra }) {
	return {
		type: module.exports.ALARM,
		payload: { id: uuid(), type, sensorId, date: Date.now(), extra }
	}
}

module.exports.createWarning = function ({ type, sensorId, extra }) {
	return {
		type: module.exports.WARNING,
		payload: { id: uuid(), type, sensorId, date: Date.now(), extra }
	}
}



