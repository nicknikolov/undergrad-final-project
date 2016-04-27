import React from 'react'
import { Panel, Row, Col, Button } from 'react-bootstrap'

var Model = React.createClass({
  propTypes: {
    inputs: React.PropTypes.object,
    words: React.PropTypes.object,
    incomingExamples: React.PropTypes.array,
    assign: React.PropTypes.func,
    handleWord: React.PropTypes.func,
    deleteClass: React.PropTypes.func,
    setDataForVisualisation: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      classes: []
    }
  },

  handleWord: function (i, event) {
    this.props.handleWord(i, event)
    this.forceUpdate() // TODO: Welp...
  },

  assign: function (classIndex) {
    this.props.assign(classIndex)
  },

  deleteClass: function (assignedClass) {
    this.props.deleteClass(assignedClass)
  },

  setDataForVisualisation: function (assignedClass) {
    this.props.setDataForVisualisation(assignedClass)
  },

  render: function () {
    let classes = []
    let disableAssign = this.props.incomingExamples.length === 0

    Object.keys(this.props.inputs).forEach((assignedClass) => {
      let input = this.props.inputs[assignedClass]
      if (!input) return
      let currentClass = assignedClass
      let word = this.props.words[assignedClass]
      classes.push(
        <Row key={currentClass}>
          <Col md={3}>
            <input
              type='text'
              value={word}
              onChange={this.handleWord.bind(this, currentClass)}
            />
            <Button bsStyle='link'
              disabled={disableAssign}
              onClick={this.assign.bind(this, currentClass)}>
              Assign
            </Button>
          </Col>
          <Col md={2}>
            <Button
              bsStyle='link'
              onClick={this.setDataForVisualisation.bind(this, assignedClass)}>
              {input.length}
            </Button>
          </Col>
          <Col md={3}>
            <Button bsStyle='danger' onClick={this.deleteClass.bind(this, currentClass)}>Delete</Button>
          </Col>
        </Row>
      )
    })
    return (
      <Panel header={(<h4>Model </h4>)}>
        <Row>
          <Col md={3}>
            <h5>Classes</h5>
          </Col>
          <Col md={3}>
            <h5>Examples</h5>
          </Col>
        </Row>
        {classes}
      </Panel>
    )
  }
})

export default Model
