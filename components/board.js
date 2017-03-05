import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, Animated, Easing } from 'react-native'
import { loadBoard, solveBoardGroup } from '../modules/boards'
import { Col, Row, Grid } from 'react-native-easy-grid'
import Tile from './tile'

class Board extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedTiles: [],
			animatedTileTop: new Animated.Value(0),
			rowPos: {},
			colPos: {}
		}
	}

	componentDidMount() {
		this.props.dispatch(loadBoard(this.props.boardId))

		this.state.animatedTileTop.setValue(100)
		Animated.timing(
			this.state.animatedTileTop,
			{
				toValue: 400,
				duration: 1000,
				easing: Easing.inOut(Easing.quad),
				delay: 1000
			}
		).start()
	}

	componentWillReceiveProps(nextProps) {
		const { swapIndicies } = nextProps.board

		
		if (!swapIndicies) {
			return
		}

		for (let s = 0; s < swapIndicies.length; s++) {
			let swapIndex = swapIndicies[s]
			let i1 = Math.floor(swapIndex[0] / 4)
			let j1 = swapIndex[0] % 4

			let i2 = Math.floor(swapIndex[1] / 4)
			let j2 = swapIndex[1] % 4

			this.animateSwap([i1, j1], [i2, j2])
		}
	}

	animateSwap([i1, j1], [i2, j2]) {
		const { realI: realI1, realJ: realJ1 } = this.getRealIndexes(i1,j1)
		const { realI: realI2, realJ: realJ2 } = this.getRealIndexes(i2,j2)

		console.log(this.props.board.board[realI1][realJ1])
		console.log(this.props.board.board[realI2][realJ2])

		// TODO: complete the animation
	}

	handlePress(i, j) {
		if (this.isSolved(i, j)) {
			return
		}

		if (this.isSelected(i, j)) {
			let selectedTiles = [...this.state.selectedTiles]
			selectedTiles.splice(this.findSelectedIndex(i, j), 1)
			this.setState({ selectedTiles })
		} else if (this.state.selectedTiles.length < 4) {
			this.setState({
				selectedTiles: [ ...this.state.selectedTiles, [ i, j ] ]
			}, () => {
				setTimeout(() => { this.checkSelectedTiles() }, 1000)
			})
		}
	}

	handleRowLayout(i, e) {
		this.setState({
			rowPos: {
				...this.state.rowPos,
				[i]: e.nativeEvent.layout.y
			}
		})
	}

	handleColLayout(i, j, e) {
		this.setState({
			colPos: {
				...this.state.colPos,
				[j]: e.nativeEvent.layout.x
			}
		})
	}

	checkSelectedTiles() {
		let { selectedTiles } = this.state
		if (selectedTiles.length !== 4) {
			return
		}
		const boardGroup = selectedTiles[0][0]
		if (
			selectedTiles[1][0] === boardGroup &&
			selectedTiles[2][0] === boardGroup &&
			selectedTiles[3][0] === boardGroup 
			) {
			console.log('*** YAY SOLVED', boardGroup)
			this.props.dispatch(solveBoardGroup(this.props.boardId, boardGroup))
		} else {
			console.log('*** NOPE')
		}
		this.setState({ selectedTiles: [] })
	}

	isSelected(i, j) {
		 return this.findSelectedIndex(i, j) >= 0
	}

	isSolved(i,j) {
		return this.props.board.solvedGroups.indexOf(i) >= 0
	}

	findSelectedIndex(i, j) {
		return this.state.selectedTiles.findIndex(([_i, _j]) => i === _i && j === _j)
	}

	getRealIndexes(i, j) {
		let { randomization } = this.props.board
		return {
			realI: randomization[i*4+j][0],
			realJ: randomization[i*4+j][1]
		}
	}

	render() {
		const { board } = this.props
		if (!board) {
			return <View style={styles.container} />
		}
		let { randomization } = board

		if (!randomization) {
			return <View style={styles.container} />
		}

		// console.log(this.props.board)

		return (
			<View style={styles.container}>
				<View style={styles.board}>
					<Grid>
						{[0,1,2,3].map(i => {
							let rowStyles = [styles.row]
							
							if (i < this.props.board.solvedGroups.length) {
								rowStyles.push(styles.solvedRow)
							}

							if (i === 0) {
								rowStyles.push(styles.firstRow)
							} else if (i === 3) {
								rowStyles.push(styles.lastRow)
							}

							return (
								<Row key={i} style={rowStyles} onLayout={this.handleRowLayout.bind(this, i)}>
									{[0,1,2,3].map(j => {
										const { realI, realJ } = this.getRealIndexes(i,j)
										return (<Col key={j} onLayout={this.handleColLayout.bind(this, i, j)}>
											<Tile
												selected={this.isSelected(realI, realJ)}
												solved={this.isSolved(realI, realJ)} 
												onPress={this.handlePress.bind(this, realI, realJ)}>
												{board.board[realI][realJ]}
											</Tile>
										</Col>)
									})
									}
								</Row>
							)
						})}
					</Grid>
					<Animated.View style={[styles.animatedTile,
						{
							top: this.state.animatedTileTop
						}]}>
						<Tile>OH HAI</Tile>
					</Animated.View>
				</View>
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
		padding: 2
	},
	board: {
		borderRadius: 15,
		backgroundColor: 'rgb(35,78,43)',
		padding: 3,
		flex: 1,
		height: 256,
		borderColor: 'black',
		borderStyle: 'solid',
		borderWidth: 2
	},
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
	},
	row: {
		marginTop: 2,
		marginBottom: 2
	},
	firstRow: {
		marginTop: 0
	},
	lastRow: {
		marginBottom: 0
	},
	solvedRow: {
		backgroundColor: 'rgb(21,177,50)',
		borderRadius: 12
	},
	animatedTile: {
		position: 'absolute',
		zIndex: 100
	}
})

export default connect((state, { boardId }) => ({ board: state.boards[boardId] }))(Board)