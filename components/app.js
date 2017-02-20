import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Scene, Router } from 'react-native-router-flux'

import { getStore } from '../store'

import BoardList from './board_list'
import Board from './board'

export default class App extends Component {
	render() {
		return <Provider store={getStore()}>
				<Router>
					<Scene key="root" hideNavBar={true}>
						<Scene key="boards" component={BoardList} title="Boards" initial={true} />
						<Scene key="board" component={Board} title="Board" />
					</Scene>
				</Router>
			</Provider>
	}
}
