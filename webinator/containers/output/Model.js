import ModelComponent from '../../components/output/Model'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    inputs: state.inputs
  }
}

const Model = connect(mapStateToProps, null)(ModelComponent)

export default Model
