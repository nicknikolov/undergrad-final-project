import React from 'react'
import { Col, Button } from 'react-bootstrap'
import { DropdownList, NumberPicker } from 'react-widgets'

import localizer from 'react-widgets/lib/localizers/simple-number'
localizer()

var Generator = React.createClass({
  propTypes: {
    setNumberOfClasses: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      learningOptions: [ 'Classification', 'Regression' ],
      learningType: 'Classification',
      numberOfClasses: 2,
      outputOptions: [ 'Words' ],
      outputType: 'Words'
    }
  },

  handleLearningSelection: function (event) {
    this.setState({learningType: event})
  },

  handleOutputSelection: function (event) {
    this.setState({outputType: event})
  },

  handleNumberOfClasses: function (event) {
    this.setState({numberOfClasses: event})
  },

  makeModel: function () {
    this.props.setNumberOfClasses(parseInt(this.state.numberOfClasses, 10))
  },

  render: function () {
    return (
      <div>
        <Col md={3}>
          <h4>Learning</h4>
          <DropdownList
            defaultValue={this.state.learningType}
            data={this.state.learningOptions}
            onChange={this.handleLearningSelection}
          />
        </Col>
        <Col md={3}>
          <h4>Classes</h4>
          <NumberPicker
            value={this.state.numberOfClasses}
            onChange={this.handleNumberOfClasses}
          />
        </Col>
        <Col md={3}>
          <h4>Output</h4>
          <DropdownList
            defaultValue={this.state.outputType}
            data={this.state.outputOptions}
            onChange={this.handleOutputSelection}
          />
        </Col>
        <Col md={3}>
          <Button id='make-button' bsStyle='primary' onClick={this.makeModel}>Make</Button>
        </Col>
      </div>
    )
  }
})

export default Generator
