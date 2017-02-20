const SERVER = 'http://professor.amiacyb.org/cgi-bin/'

export async function getBoards() {
	try {
		let response = await fetch(`${SERVER}getBoards.py`)
		let responseJson = await response.json()
		return responseJson.boards
  } catch(error) {
    console.error(error)
  }
}

export async function getBoard(boardId) {
	try {
		let response = await fetch(`${SERVER}retrieve.py?id=${boardId}`)
		let responseJson = await response.json()
		return {
			board: eval(unescape(responseJson.board)),
			connections: eval(unescape(responseJson.connections))
		}
  } catch(error) {
    console.error(error)
  }
}