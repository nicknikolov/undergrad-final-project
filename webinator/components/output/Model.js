import React from 'react'
import { Button, Col } from 'react-bootstrap'
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
        if (this.props.rules.x) c.push(obj.data.x[i])
        if (this.props.rules.y) c.push(obj.data.y[i])
        if (this.props.rules.z) c.push(obj.data.z[i])
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
          { n.length }
        </div>
      )
    }

    let buttonName = this.state.trained ? 'Retrain' : 'Train'
    let disableButton = !(this.props.inputs.length > 1 && this.props.inputs.length > this.state.usedExamples)

    return (
      <div>
        <Col md={3}>
          <h4>Classes</h4>
          {classes}
        </Col>
        <Col md={3}>
          <h4>Trained Class</h4>
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
          <h4>Examples</h4>
          {examples}
        </Col>
        <Col md={3}>
          <Button
            id='make-button'
            bsStyle='primary'
            disabled={disableButton}
            onClick={this.train}>
            {buttonName}
          </Button>
        </Col>
      </div>
    )
  }
})

export default Model
