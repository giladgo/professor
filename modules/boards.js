import { getBoards, getBoard } from '../api'
import { knuthShuffle } from 'knuth-shuffle'

const FILL_BOARD = 'FILL_BOARD'
const ADD_BOARDS = 'ADD_BOARDS'
const RANDOMIZE_BOARD = 'RANDOMIZE_BOARD'

export default function reducer(state = { board_list: [], boards: {} }, action) {
	switch (action.type) {
		case FILL_BOARD: return {...state, 
			[action.payload.boardId]: action.payload.board
		}
		case ADD_BOARDS: return {...state, board_list: [
			...state.board_list,
			...action.payload.boards
		] }
		case RANDOMIZE_BOARD: return {
			...state,
			[action.payload.boardId]: {
				...state[action.payload.boardId],
				randomization: action.payload.randomization
			}
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
