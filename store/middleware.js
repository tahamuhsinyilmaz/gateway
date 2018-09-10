const actions = require('./actions')
const constants = require('./../constants')

module.exports = store => next => action => {
	next(action)
	
	switch (action.type){
		case actions.MOTION_SENSOR_UPDATE:
		case actions.WATER_SENSOR_UPDATE:
		case actions.SMOKE_SENSOR_UPDATE:
			if(action.payload.value === 1 ){
				const alarm = actions.createAlarm({ type: getAlarmTypeForActionType(action.type), sensorId: action.payload.sensorId})
				store.dispatch(alarm)
			}
	}
}

function getAlarmTypeForActionType (actionType) {
	switch (actionType) {
		case actions.MOTION_SENSOR_UPDATE:
			return constants.ALARM_TYPES.INTRUSION
		case actions.WATER_SENSOR_UPDATE:
			return constants.ALARM_TYPES.WATER_LEVEL
		case actions.SMOKE_SENSOR_UPDATE:
			return constants.ALARM_TYPES.SMOKE
	}
}