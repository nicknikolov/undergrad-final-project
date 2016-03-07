const mockArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const defaultState = { data: { x: mockArray, y: mockArray, z: mockArray }, selectedClass: -1 }
const inputs = (state = [defaultState], action) => {
  switch (action.type) {
    case 'ADD_INPUT':
      return [
        ...state,
        { data: action.data, selectedClass: action.selectedClass }
      ]
    default:
      return state
  }
}

export default inputs
