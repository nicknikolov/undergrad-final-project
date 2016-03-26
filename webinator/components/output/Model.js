import React from 'react'
import { ButtonToolbar, Popover, OverlayTrigger, Row, Col, Button } from 'react-bootstrap'
import RadioGroup from 'react-radio-group'

var Model = React.createClass({
  propTypes: {
    createModel: React.PropTypes.func,
    setWords: React.PropTypes.func,
    setSelectedClass: React.PropTypes.func,
    numberOfClasses: React.PropTypes.number,
    inputs: React.PropTypes.array,
    rules: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      words: [],
      classes: [],
      trainedClass: 0,
      trained: false,
      usedExamples: 0
    }
  },

  handleWord: function (i, event) {
    var words = this.state.words
    words[i] = event.target.value
    this.props.setWords(words)
  },

  selectTrainedClass: function (event) {
    this.props.setSelectedClass(event)
    this.setState({trainedClass: event})
  },

  train: function () {
    var cases = []
    var labels = []

    this.props.inputs.forEach(function (obj, i) {
      if (i === 0) return // TODO: this is stupid

      var c = []
      for (let k = 0; k < obj.data.x.length; k++) {
        if (this.props.rules.x) c.push(obj.data.x[k])
        if (this.props.rules.y) c.push(obj.data.y[k])
        if (this.props.rules.z) c.push(obj.data.z[k])
      }

      cases.push(c)
      labels.push(obj.selectedClass)
    }.bind(this))

    this.props.createModel(cases, labels)
    this.setState({ trained: true, usedExamples: this.props.inputs.length })
  },

  render: function () {
    let classes = []
    let examples = []
    for (var i = 0; i < this.props.numberOfClasses; i++) {
      classes.push(
        <div key={i} >
          <input
            type='text'
            value={this.state.words[i]}
            onChange={this.handleWord.bind(this, i)}
          />
        </div>
      )

      let n = this.props.inputs.filter((input) => { return input.selectedClass === i })
      examples.push(
        <div key={i} className='radio-button'>
          {n.length}
        </div>
      )
    }

    let buttonName = this.state.trained ? 'Retrain' : 'Train'
    let disableButton = !(this.props.inputs.length > 1 && this.props.inputs.length > this.state.usedExamples)

    return (
      // TODO: this whole thing should be rewritten
      <div>
        <Row>
        <Col md={4}>
          <h5>Classes</h5>
          {classes}
        </Col>
        <Col md={4}>
          <h5>Trained Class</h5>
          <RadioGroup
            name='classes'
            selectedValue={this.state.trainedClass}
            onChange={this.selectTrainedClass}>
            {
              function (Radio) {
                return (
                  <div className='radio-group'>
                    {
                      classes.map(function (cl, i) {
                        return (
                          <div key={i} className='radio-button'>
                            <label><Radio value={i} /></label>
                          </div>
                        )
                      })
                    }
                  </div>
                  )
              }
            }
          </RadioGroup>
        </Col>
        <Col md={3}>
          <h5>Examples</h5>
          {examples}
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <ButtonToolbar>
            <Button
              id='make-button'
              bsStyle='primary'
              disabled={disableButton}
              onClick={this.train}>
              {buttonName}
            </Button>
            <OverlayTrigger trigger='click' placement='bottom' overlay={
              <Popover title='Words'>
                Write the different words that you would to be the output of your model.
                Click on the Trained Class button when you are sending training examples for each word.
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

export default Model
