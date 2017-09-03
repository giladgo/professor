import { getBoards, getBoard } from '../api'
import { knuthShuffle } from 'knuth-shuffle'
import { Set } from 'immutable'

const FILL_BOARD = 'FILL_BOARD'
const ADD_BOARDS = 'ADD_BOARDS'
const RANDOMIZE_BOARD = 'RANDOMIZE_BOARD'
const SOLVE_GROUP = 'SOLVE_GROUP'
const SOLVE_CONNECTION = 'SOLVE_CONNECTION'
const WRONG_CONNECTION = 'WRONG_CONNECTION'

function swap(a, i1, i2) {
	const temp = a[i1]
	a[i1] = a[i2]
	a[i2] = temp
}

function sortRandomization(group, randomization, solvedGroups) {
	randomization = [ ...randomization ]
	
	if (solvedGroups.length === 4) {
		return randomization
	}

	let availableSpots = []
	for (let i = (solvedGroups.length * 4); i < (solvedGroups.length + 1) * 4; i++) {
		if (randomization[i][0] !== group) {
			availableSpots.push(i)
		}
	}

	let swapIndicies = []
	
	for (let i = (solvedGroups.length + 1) * 4; i < randomization.length; i++) {
		if (randomization[i][0] === group) {
			const availableSpot = availableSpots.shift()
			swapIndicies.push([i, availableSpot])
			swap(randomization, i, availableSpot)
		}
	}
	return { randomization, swapIndicies }
}

function modifyBoard(state, id, newStuff) {
	return {
		...state,
		[id]: {
			...state[id],
			...newStuff
		}
	}
}

export default function reducer(state = { board_list: [], boards: {} }, action) {
	console.log('******************', action )
	switch (action.type) {
		case FILL_BOARD: return {...state, 
			[action.payload.boardId]: action.payload.board
		}
		case ADD_BOARDS: return {...state, board_list: [
			...state.board_list,
			...action.payload.boards
		] }
		case RANDOMIZE_BOARD: return modifyBoard(state, action.payload.boardId, {
			randomization: action.payload.randomization,
			solvedGroups: [],
			solvedGroupConnections: Set(),
			wrongGroupConnections: Set(),
			swapIndicies: []
		})
		case SOLVE_GROUP: {
			const board = state[action.payload.boardId]
			return modifyBoard(state, action.payload.boardId, {
				...sortRandomization(action.payload.group, board.randomization, board.solvedGroups),
				solvedGroups: [...(board.solvedGroups || []), action.payload.group ]
			})
		}
		case SOLVE_CONNECTION: {
			const board = state[action.payload.boardId]
			return modifyBoard(state, action.payload.boardId, {
				solvedGroupConnections: board.solvedGroupConnections.add(action.payload.group)
			})
		}
		case WRONG_CONNECTION: {
			const board = state[action.payload.boardId]
			return modifyBoard(state, action.payload.boardId, {
				wrongGroupConnections: board.wrongGroupConnections.add(action.payload.group)
			})
		}
	}
	return state
}

export function fillBoard(boardId, board) {
	return { type: FILL_BOARD, payload: { boardId, board } }
}

export function randomizeBoard(boardId) {
	return (dispatch, getState) => {
		const board = getState().boards[boardId]
		let randomization = knuthShuffle(Array(16).fill(0).map((x,index) => [Math.floor(index / 4), index % 4]))
		dispatch({ type: RANDOMIZE_BOARD, payload: { boardId, randomization } })
	}
}

export function addBoards(boards) {
	return { type: ADD_BOARDS, payload: { boards } }
}

export function loadBoards() {
	return dispatch => {
		getBoards().then(boards => {
			dispatch(addBoards(boards.map((id, index)=> {
				return { id, board: index + 1 }
			})))
		})
	}
}

export function loadBoard(boardId) {
	return dispatch => {
		getBoard(boardId).then(board => {
			dispatch(fillBoard(boardId, board))
			dispatch(randomizeBoard(boardId))
		})
	}
}

export function solveBoardGroup(boardId, group) {
	return { type: SOLVE_GROUP, payload: { boardId, group } }
}

export function solveConnection(boardId, group) {
	return { type: SOLVE_CONNECTION, payload: { boardId, group } }
}

export function wrongConnection(boardId, group) {
	return { type: WRONG_CONNECTION, payload: { boardId, group } }
}

export function submitConnection(boardId, input, group) {
	return (dispatch, getState) => {
		const board = getState().boards[boardId]
		let possibleConnections = board.connections[group].split('!').filter(v => v && v.length)
		if (possibleConnections.indexOf(input) >= 0) {
			dispatch(solveConnection(boardId, group))
		} else {
			dispatch(wrongConnection(boardId, group))
		}
	}
	
}