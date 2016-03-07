const selectedClass = (state = 0, action) => {
  switch (action.type) {
    case 'SELECT':
      return action.index
    default:
      return state
  }
}

export default selectedClass
