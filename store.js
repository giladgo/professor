import { createStore, combineReducers, applyMiddleware } from 'redux';
import boards from './modules/boards'
import thunk from 'redux-thunk'

const reducer = combineReducers({
	boards
})

const store = createStore(reducer, applyMiddleware(thunk))

export function getStore() {
	return store
}

