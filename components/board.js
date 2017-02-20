import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'
import { loadBoard } from '../modules/boards'

class Board extends Component {
	componentDidMount() {
		this.props.dispatch(loadBoard(this.props.boardId))
	}

	render() {
		let { board } = this.props
		if (!board) {
			return <View style={styles.container} />
		}
		let { randomization } = board
		board = board.board

		if (!randomization) {
			return <View style={styles.container} />
		}

		return (
				<View style={styles.container}>
					{randomization.map((r,i) => {
						return <Text style={styles.tile} key={i}>{board[r[0]][r[1]]}</Text>
					})}
				</View>
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
	},
	tile: {
		borderRadius: 5,
		backgroundColor: 'rgb(0,128,0)',
		color: 'white'
	}
})

export default connect((state, { boardId }) => ({ board: state.boards[boardId] }))(Board)