import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { loadBoards } from '../modules/boards'
import { Actions } from 'react-native-router-flux'

class BoardList extends Component {

	componentDidMount() {
		this.props.dispatch(loadBoards())
	}

	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					{this.props.boards.map(board => {
						return <Text
							style={styles.boardButton}
							key={board.id}
							onPress={() => Actions.board({ boardId: board.id })}
							>
							{board.board}
						</Text>
					})}
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgb(110, 220, 130)',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		flexWrap: 'wrap',
		overflow: 'scroll'
	},
	boardButton: {
		height: 50,
		width: 50,
		margin: 3,
		borderRadius: 5,
		backgroundColor: 'rgb(0,128,0)',
		textAlignVertical: 'center',
		textAlign: 'center',
		color: 'white',
		fontSize: 18
	}
})

export default connect(state => ({ boards: state.boards.board_list }))(BoardList)