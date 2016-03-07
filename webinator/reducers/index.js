import { combineReducers } from 'redux'
import inputs from './inputs.js'
import selectedClass from './selectedClass.js'

const trainingData = combineReducers({
  inputs,
  selectedClass
})

export default trainingData
