import React, { Component, Children } from 'react'
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native'

class Tile extends Component {
	
	render() {
		let tileStyles = [styles.tile]
		if (this.props.selected) {
			tileStyles.push(styles.selectedTile)
		} else if (this.props.solved) {
			tileStyles.push(styles.solvedTile)
		}

		return (
			<TouchableHighlight style={tileStyles} {... this.props}>
				<Text style={styles.tileText}>
					{this.props.children}
				</Text>
			</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	tile: {
		borderRadius: 10,
		backgroundColor: 'rgb(68,144,155)',
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 2,
		height: 52
	},
	tileText: {		
		color: 'white',
	},
	selectedTile: {
		backgroundColor: 'rgb(10,60,130)',
	},
	solvedTile: {
		backgroundColor: 'rgb(0,128,0)',
	}
})

export default Tile