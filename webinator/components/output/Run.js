import React from 'react'
import { Button } from 'react-bootstrap'

var Run = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    words: React.PropTypes.array,
    setIsRunning: React.PropTypes.func,
    isRunning: React.PropTypes.bool,
    dataForPrediction: React.PropTypes.array
  },

  handleRun: function () {
    this.props.setIsRunning()
  },

  render: function () {
    let div
    if (this.props.dataForPrediction.length > 0) {
      div = <div> {this.props.words[this.props.model.predict([this.props.dataForPrediction])]} </div>
    } else {
      div = <div> Train the model and send some data </div>
    }

    let buttonName = this.props.isRunning ? 'Stop running' : 'Run'
    return (
      <div>
        <Button bsStyle='primary' onClick={this.handleRun}>{buttonName}</Button>
        {div}
      </div>
    )
  }
})

export default Run
