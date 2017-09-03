import { createStore, combineReducers, applyMiddleware } from 'redux';
import boards from './modules/boards'
import thunk from 'redux-thunk'

// import { persistStore } from 'redux-persist'
// import {AsyncStorage} from 'react-native'


const reducer = combineReducers({
	boards
})

const store = createStore(reducer, applyMiddleware(thunk))
// persistStore(store, { storage: AsyncStorage })

export function getStore() {
	return store
}

