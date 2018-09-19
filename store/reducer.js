const actions = require('./actions')


const initialState = {
	online : true,
	energyInfo: {
		plugged: true,
		batterLevel: 100
	},
	mode: {
		type: 'protection'
	},
	connection : {
		type: 'wifi',
		signal: 4
	},
	sensors: ['FBineZasPz', 'iir1AOx11R', 'zCGU5YAhze', 'A38pwvLEcH', '75ujv4uaR1', 'uVDVPnAUpG'],
	alarms: [],
	location  : {
		lat        : 36.747057,
		lng        : 28.941542,
		accuracy   : 15.25,
	},
	s_FBineZasPz: {
		connected: true,
		batteryLow: false,
		value : 0,
		name: 'Kamara',
		type: 'motion'
	},
	s_iir1AOx11R: {
		connected: true,
		batteryLow: false,
		value : 0,
		name: 'Pruva',
		type: 'water'
	},
	s_zCGU5YAhze: {
		connected: true,
		batteryLow: false,
		value : 0,
		name: 'Pupa',
		type: 'water'
	},
	s_A38pwvLEcH: {
		connected: true,
		batteryLow: false,
		value : 13.5,
		name: 'Akü',
		type: 'battery'
	},
	s_75ujv4uaR1: {
		connected: true,
		batteryLow: false,
		value : 0,
		name: 'Makine Dairesi',
		type: 'smoke'
	},
	s_uVDVPnAUpG: {
		connected: true,
		batteryLow: false,
		value : 0,
		name: 'Sahil 220',
		type: 'power'
	}
}


module.exports = (state = initialState, action) => {
	console.log('REDUCER ', action)
	switch (action.type) {
		case actions.MOTION_SENSOR_UPDATE:
		case actions.SMOKE_SENSOR_UPDATE:
		case actions.WATER_SENSOR_UPDATE: {
			const sensorId = action.payload.sensorId
			delete action.payload.sensorId
			return {...state, ['s_'+sensorId]: action.payload }
		}
		case actions.ALARM: {
			return {...state, alarms : [action.payload, ...state.alarms]}
		}
		default:
			return state
	}
}