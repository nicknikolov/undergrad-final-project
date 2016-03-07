import Inputs from '../components/Outputs.js'
import { connect } from 'react-redux'

// const mapStateToProps = (state) => {
//   return {
//     data: state.inputs
//   }
// }

const Outputs = connect()(Inputs)

export default Outputs
