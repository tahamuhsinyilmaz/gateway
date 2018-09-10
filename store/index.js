const redux = require('redux')
const reducer = require('./reducer')
const middleware = require('./middleware')

const store = redux.createStore(reducer, redux.applyMiddleware(middleware))

// Every time the state changes, log it
module.exports = store

const cloudServices = require('./../cloudServices')

console.log(store.getState())

store.subscribe(() => {
	const state = store.getState()
	console.log('STATE CHANGED : ' +  JSON.stringify(state, null, 4))
	cloudServices.reportState(state)
} )
