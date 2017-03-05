import React, { Component, Children } from 'react'
import { View, Text, StyleSheet } from 'react-native'

class Tile extends Component {
	
	render() {
		let tileStyles = [styles.tile]
		if (this.props.selected) {
			tileStyles.push(styles.selectedTile)
		} else if (this.props.solved) {
			tileStyles.push(styles.solvedTile)
		}

		return <Text
			style={tileStyles}
			{... this.props}>
			{this.props.children}
		</Text>
	}
}

const styles = StyleSheet.create({
	tile: {
		borderRadius: 10,
		backgroundColor: 'rgb(68,144,155)',
		color: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
		flex: 1,
		margin: 3
	},
	selectedTile: {
		backgroundColor: 'rgb(10,60,130)',
	},
	solvedTile: {
		backgroundColor: 'rgb(0,128,0)',
	}
})

export default Tile