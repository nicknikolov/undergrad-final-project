const inputs = (state = {}, action) => {
  let newState
  switch (action.type) {
    case 'ADD_INPUT':
      newState = Object.assign({}, state)
      if (!newState[action.assignedClass]) {
        newState[action.assignedClass] = [action.data]
      } else {
        newState[action.assignedClass].push(action.data)
      }
      return newState
    case 'DELETE_CLASS':
      newState = Object.assign({}, state)
      newState[action.assignedClass] = undefined
      return newState
    case 'DELETE_EXAMPLE':
      newState = Object.assign({}, state)
      newState[action.assignedClass] = action.data
      return newState
    default:
      return state
  }
}

export default inputs
