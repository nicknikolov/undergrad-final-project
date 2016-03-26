import React from 'react'
import { ButtonToolbar, Popover, OverlayTrigger, Row, Col, Button } from 'react-bootstrap'
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
        <Row className='more-space'>
          <Col md={4}>
            <h5>Learning</h5>
            <DropdownList
              defaultValue={this.state.learningType}
              data={this.state.learningOptions}
              onChange={this.handleLearningSelection}
            />
          </Col>
          <Col md={4}>
            <h5>Classes</h5>
            <NumberPicker
              value={this.state.numberOfClasses}
              onChange={this.handleNumberOfClasses}
            />
          </Col>
          <Col md={4}>
            <h5>Output</h5>
            <DropdownList
              defaultValue={this.state.outputType}
              data={this.state.outputOptions}
              onChange={this.handleOutputSelection}
            />
          </Col>
        </Row>
        <Row className='more-space'>
          <Col md={3}>
            <ButtonToolbar>
              <Button id='make-button' bsStyle='primary' onClick={this.makeModel}>Make</Button>
              <OverlayTrigger trigger='click' placement='bottom' overlay={
                <Popover title='Generating a model'>
                  Choose what type of learning you want to do, the amount of classes and the type of output.
                  <b> Classification</b> is used when you want to map a distinct input value to a distinct
                  output value (i.e. a "happy" gesture can result in the word "happy')
                </Popover>
                }>
                <Button bsStyle="default">Help</Button>
              </OverlayTrigger>
            </ButtonToolbar>
          </Col>
        </Row>
      </div>
    )
  }
})

export default Generator
