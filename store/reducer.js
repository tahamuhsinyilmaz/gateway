const actions = require('./actions')


const initialState = {
	online : true,
	energyInfo: {
		plugged: true,
		batterLevel: 100
	},
	armInfo: {
		armed: false,
		dateUpdated: '22082018 14:02 GMT'
	},
	sensors: ['1', '2', '3'],
	alarms: [],
	location  : {
		lat        : 21.472322132,
		lng        : 34.546732234,
		accuracy   : 15.25,
		dateUpdated: '22082018 14:02 GMT'
	},
	s_1: {
		connected: true,
		batteryLow: false,
		value : 0
	},
	s_2: {
		connected: true,
		batteryLow: false,
		value : 0
	},
	s_3: {
		connected: true,
		batteryLow: false,
		value : 0
	}
}


module.exports = (state = initialState, action) => {
	console.log('REDUCER ', action)
	switch (action.type) {
		case actions.MOTION_SENSOR_UPDATE:
		case actions.SMOKE_SENSOR_UPDATE:
		case actions.WATER_SENSOR_UPDATE: {
			return {...state, ['s_'+action.payload.sensorId]: action.payload }
		}
		case actions.ALARM: {
			
			let alreadyExists = false
			for (const alarm of state.alarms) {
				if(alarm.sensorId === action.payload.sensorId && alarm.type === action.payload.type && action.payload.date - alarm.date < (1000 * 60)) alreadyExists = true
			}
			return alreadyExists ? state : {...state, alarms : [action.payload, ...state.alarms]}
		}
		default:
			return state
	}
}