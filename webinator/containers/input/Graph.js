import GraphComponent from '../../components/input/Graph'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    inputs: state.inputs
  }
}

const Graph = connect(mapStateToProps, null)(GraphComponent)

export default Graph
