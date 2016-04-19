import React from 'react'
import { connect } from 'react-redux'
import KNN from 'ml-knn'
import io from 'socket.io-client'
import Model from './Model'
import Graph from './Graph'
import { Row, Panel, Col, ListGroup, ListGroupItem, Button, Grid, Input } from 'react-bootstrap'

const App = React.createClass({
  propTypes: {
    inputs: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      words: {},
      sessionName: 'test session',
      sessionSet: false,
      firstClassSet: false,
      secondClassSet: false,
      numberOfClasses: 0,
      incomingExamples: [],
      bulkMode: false,
      model: {},
      dataForVisualisation: [],
      visualisedDataIndex: 0
    }
  },

  componentWillMount: function () {
    this.knn = new KNN()
    this.tutorial = []
    this.socket = io()
  },

  componentDidMount: function () {
    this.socket.on('inputs', (event) => {
      if (this.props.inputs.length > 2) {
        let data = { x: event[0], y: event[1], z: event[2] }
        let arr = []
        for (let i = 0; i < data.x.length; i++) {
          arr.push(data.x[i])
          arr.push(data.y[i])
          arr.push(data.z[i])
        }
      }

      if (this.state.bulkMode) {
        this.setState({
          incomingExamples: [...this.state.incomingExamples, { x: event[0], y: event[1], z: event[2] }]
        })
      } else {
        this.setState({
          incomingExamples: [{ x: event[0], y: event[1], z: event[2] }]
        })
      }
    })
  },

  // TODO: perhaps I should get rid of redux?
  assign: function (classIndex) {
    let newExamples = []
    this.state.incomingExamples.forEach((example) => {
      newExamples.push({ data: example, assignedClass: classIndex })
      this.props.dispatch({
        type: 'ADD_INPUT',
        data: example,
        assignedClass: classIndex
      })
    })

    this.train(newExamples)
    if (this.tutorial.length < 6 || this.state.bulkMode) {
      this.setState({ incomingExamples: [] })
    }
  },

  train: function (newExamples) {
    if (Object.keys(this.props.inputs).length < 1) return // TODO

    let cases = []
    let labels = []

    Object.keys(this.props.inputs).forEach((assignedClass) => {
      let classArray = this.props.inputs[assignedClass]
      if (!classArray) return
      let classCases = []
      classArray.forEach((data) => {
        let currentCase = []
        for (let i = 0; i < data.x.length; i++) {
          currentCase.push(data.x[i], data.y[i], data.z[i])
        }
        classCases.push(currentCase)
        labels.push(assignedClass)
      })
      cases.push(...classCases)
    })

    // newExamples.forEach((example, index) => {
    //   let currentCase = []
    //   for (let i = 0; i < example.data.x.length; i++) {
    //     currentCase.push(example.data.x[i], example.data.y[i], example.data.z[i])
    //   }
    //   cases.push(currentCase)
    //   labels.push(example.assignedClass)
    // })

    console.log('cases:' + cases.length)
    console.log('labels:' + labels)
    this.knn.train(cases, labels, { k: 1 })
    this.setState({ model: this.knn }) // TODO: is this needed?
  },

  resend: function (input) {
    if (this.state.bulkMode) {
      this.setState({
        incomingExamples: [...this.state.incomingExamples, input]
      })
    } else {
      this.setState({
        incomingExamples: [input]
      })
    }
  },

  handleSessionName: function (event) {
    this.setState({ sessionName: event.target.value })
  },

  setSessionName: function () {
    this.setState({ sessionSet: true })
    this.socket.emit('id', this.state.sessionName)
  },

  handleWord: function (assignedClass, event) {
    let words = this.state.words
    words[assignedClass] = event.target.value
    this.setState({ words: words })
  },

  addClass: function () {
    let numberOfClasses = Object.keys(this.props.inputs).length
    this.assign(numberOfClasses)
  },

  deleteClass: function (assignedClass) {
    this.props.dispatch({
      type: 'DELETE_CLASS',
      assignedClass: assignedClass
    })

    this.train([]) // TODO: mmmm... I shouldn't pass empty array probably
    this.setState({ incomingExamples: this.state.incomingExamples })
  },

  setDataForVisualisation: function (assignedClass) {
    this.setState({
      dataForVisualisation: this.props.inputs[assignedClass],
      visualisedDataIndex: assignedClass
    })
  },

  setExampleForVisualisation: function (data) {
    this.setState({
      dataForVisualisation: data,
      visualisedDataIndex: -1
    })
  },

  deleteExample: function (data) {
    this.props.dispatch({
      type: 'DELETE_EXAMPLE',
      data: data,
      assignedClass: this.state.visualisedDataIndex
    })
    this.train([]) // TODO: mmmm... I shouldn't pass empty array probably
    this.setDataForVisualisation(this.state.visualisedDataIndex)
  },

  render: function () {
    if (this.tutorial.length === 0) {
      this.tutorial.push(
        <ListGroupItem key={1}>
          <form className='form-inline'>
            <div className='form-group'>
              <span> Welcome, this is a new session! It exists only for you so let's give it a name: </span>
              <Input
                type='text'
                value={this.state.sessionName}
                onChange={this.handleSessionName}
                bsStyle={this.state.sessionSet ? 'success' : 'warning'}
              />
            </div>
            <Button bsStyle='link' onClick={this.setSessionName}> Sounds good! </Button>
          </form>
        </ListGroupItem>
      )
    }

    if (this.tutorial.length === 1 && this.state.sessionSet) {
      this.tutorial.push(
        <ListGroupItem key={2}>
          <span> Good. You can always change it something else above. Now, send over your first gesture... </span>
        </ListGroupItem>
      )
    }

    if (this.state.incomingExamples.length === 1 && this.tutorial.length === 2) {
      this.tutorial.push(
        <ListGroupItem key={3}>
          <form className='form-inline'>
            <div className='form-group'>
              <span> Ok, why don't you name that class: </span>
              <Input
                type='text'
                placeholder='e.g. Happy'
                onChange={this.handleWord.bind(this, 0)}
              />
              <Button bsStyle='link' onClick={() => {
                this.setState({firstClassSet: true, numberOfClasses: 1})
                this.assign(0)
              }}> Ok. </Button>
            </div>
          </form>
        </ListGroupItem>
      )
    }

    if (this.state.firstClassSet && this.tutorial.length === 3) {
      this.tutorial.push(
        <ListGroupItem key={4}>
          <span>
            We need at least two classes in order for our algorithm to be a useful classifer.
            So send over a different one...
          </span>
        </ListGroupItem>
      )
    }

    if (this.state.incomingExamples.length === 1 && this.tutorial.length === 4) {
      this.tutorial.push(
        <ListGroupItem key={5}>
          <form className='form-inline'>
            <div className='form-group'>
              <span> What's this one called? </span>
              <Input
                type='text'
                placeholder='e.g. Sad'
                onChange={this.handleWord.bind(this, 1)}
              />
              <Button bsStyle='link' onClick={() => {
                this.setState({secondClassSet: true, numberOfClasses: 2})
                this.assign(1)
              }}> Done. </Button>
            </div>
          </form>
        </ListGroupItem>
      )
    }

    if (this.state.secondClassSet && this.tutorial.length === 5) {
      this.tutorial.push(
        <ListGroupItem key={6}>
          <span> Ok. Two is the minimum but you can add as many classes as you find useful. Below is your model. You can test it out by sending a bunch of gestures and see if it guesses it to be the correct class (e.g. if you send a gesture that is similar to your original happy gesture it should display 'Happy'). If it wrong you have to help it out. You can do that by clicking the 'Assign' button next to the correct class. That will use this new example to retrain the model and try to guess it again. Keep training it until all guesses are correct. </span>
        </ListGroupItem>
      )
      this.tutorial[1] = ''
      this.tutorial[2] = ''
      this.tutorial[3] = ''
      this.tutorial[4] = ''
    }

    let prediction = ''
    if (this.tutorial.length === 6 && this.state.incomingExamples.length > 0) {
      let data = this.state.incomingExamples[0] // TODO: should be last of array?
      let arr = []
      for (let i = 0; i < data.x.length; i++) {
        arr.push(data.x[i])
        arr.push(data.y[i])
        arr.push(data.z[i])
      }
      console.log(this.state.model.predict([arr]))
      prediction = this.state.words[this.state.model.predict([arr])]
    }

    let graph = this.state.dataForVisualisation.length > 0
      ? (<Graph
        inputs={this.state.dataForVisualisation}
        resend={this.resend}
        deleteExample={this.deleteExample}
      />)
      : ''

    return (
      <Grid>
        <ListGroup>
          {this.tutorial}
            {(() => {
              if (this.tutorial.length === 6) {
                return (
                  <div>
                    <Panel header={(<h4>Dashboard </h4>)}>
                      <Row>
                        <Col md={3}>
                          <b>New Example: </b>
                          <Button
                            bsStyle='link'
                            onClick={this.setExampleForVisualisation.bind(this, this.state.incomingExamples.map((entry) => {
                              return entry
                            }))}>
                            {prediction}
                          </Button>
                          {this.state.bulkMode && this.state.incomingExamples.length > 1
                            ? ' and ' + (this.state.incomingExamples.length - 1).toString() + ' more' : ''}
                        </Col>
                        <Col md={2}>
                          <Button bsStyle='default' onClick={this.addClass}>Add as new class</Button>
                        </Col>
                        <Col md={1}>
                          <Button bsStyle='danger' onClick={() => { this.setState({ incomingExamples: [] }) }}>
                            Clear
                          </Button>
                        </Col>
                        <Col md={2}>
                          <b>Bulk mode: </b>
                          <Button bsStyle='default' onClick={() => { this.setState({ bulkMode: !this.state.bulkMode }) }}>
                            {this.state.bulkMode ? 'on' : 'off'}
                          </Button>
                        </Col>
                      </Row>
                    </Panel>
                    <Model
                      numberOfClasses={this.state.numberOfClasses}
                      words={this.state.words}
                      addClass={this.addClass}
                      assign={this.assign}
                      incomingExamples={this.state.incomingExamples}
                      handleWord={this.handleWord}
                      deleteClass={this.deleteClass}
                      setDataForVisualisation={this.setDataForVisualisation}
                      inputs={this.props.inputs}
                    />
                    {graph}
                  </div>
                )
              }
            })()}
        </ListGroup>
      </Grid>
    )
  }
})

// export default App

const mapStateToProps = (state) => {
  return {
    inputs: state.inputs
  }
}
const AppComponent = connect(mapStateToProps, null)(App)

export default AppComponent

