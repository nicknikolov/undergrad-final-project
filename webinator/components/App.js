import React from 'react'
import KNN from 'ml-knn'
import io from 'socket.io-client'
import Model from './Model'
import Graph from './Graph'
import VideoPlayer from './VideoPlayer'
import Dashboard from './Dashboard'
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Row,
  Panel,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
  Grid,
  OverlayTrigger,
  Popover,
  Input } from 'react-bootstrap'

const App = React.createClass({
  getInitialState: function () {
    return {
      inputs: {},
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
      visualisedDataIndex: 0,
      isRecording: false,
      playerPlayingIndex: -42,
      playerVolumeUpIndex: -42,
      playerVolumeDownIndex: -42,
      prediction: ''
    }
  },

  /* Lifecycle methods */

  componentWillMount: function () {
    this.knn = new KNN()
    this.tutorial = []
    this.socket = io()
    this.playerPlaying = false
    this.playerVolume = 0.8
    this.prediction = ''
  },

  componentDidMount: function () {
    this.socket.on('recording', (event) => {
      this.setState({ isRecording: event })
    })

    this.socket.on('inputs', (event) => {
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

  componentWillUpdate: function (props, state) {
    this.newExample = JSON.stringify(this.state.incomingExamples[0]) !== JSON.stringify(state.incomingExamples[0])
  },

  /*********************/

  handleSessionName: function (event) {
    this.setState({ sessionName: event.target.value })
  },

  setSessionName: function () {
    this.setState({ sessionSet: true })
    this.socket.emit('id', this.state.sessionName)

  },

  predict: function () {
    if (this.tutorial.length === 6 && this.state.incomingExamples.length > 0) {
      let data = this.state.incomingExamples[0] // TODO: should be last of array?
      let arr = []
      for (let i = 0; i < data.x.length; i++) {
        arr.push(data.x[i])
        arr.push(data.y[i])
        arr.push(data.z[i])
      }
      this.prediction = this.state.words[this.state.model.predict([arr])]
      let predictionElement = document.getElementById('prediction')
      if (predictionElement) {
        predictionElement.style.webkitAnimationName = ''
        setTimeout( function () { // the timeout hack is needed in order for the animation to be retriggered
          predictionElement.style.webkitAnimationName = 'shake'
        }.bind(this), 5)
      }
    } else {
      this.prediction = '(empty)'
    }

    if (!this.newExample) return

    if (this.prediction === this.state.words[this.state.playerPlayingIndex]) {
      this.playerPlaying = !this.playerPlaying
    }

    if (this.prediction === this.state.words[this.state.playerVolumeUpIndex]) {
      this.playerVolume += 0.1
    }

    if (this.prediction === this.state.words[this.state.playerVolumeDownIndex]) {
      this.playerVolume -= 0.1
    }

    this.socket.emit('prediction', { 'prediction': this.prediction })
  },

  assign: function (classIndex) {
    let newExamples = []
    this.state.incomingExamples.forEach((example) => {
      newExamples.push({ data: example, assignedClass: classIndex })
      let newInputs = this.state.inputs
      if (!newInputs[classIndex]) {
        newInputs[classIndex] = [example]
      } else {
        newInputs[classIndex].push(example)
      }
      this.setState({ inputs: newInputs })
    })

    this.train()
    if (this.tutorial.length < 6 || this.state.bulkMode) {
      this.setState({ incomingExamples: [] })
    }
  },

  train: function () {
    if (Object.keys(this.state.inputs).length < 1) return // TODO

    let cases = []
    let labels = []

    Object.keys(this.state.inputs).forEach((assignedClass) => {
      let classArray = this.state.inputs[assignedClass]
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

  handleWord: function (assignedClass, event) {
    let words = this.state.words
    words[assignedClass] = event.target.value
    this.setState({ words: words })
  },

  addClass: function () {
    let numberOfClasses = Object.keys(this.state.inputs).length
    this.assign(numberOfClasses)
  },

  deleteClass: function (assignedClass) {
    let newInputs = this.state.inputs
    newInputs[assignedClass] = undefined // TODO: is there a better option here?
    this.train()
    this.setState({ incomingExamples: this.state.incomingExamples })
  },

  setDataForVisualisation: function (assignedClass) {
    this.setState({
      dataForVisualisation: this.state.inputs[assignedClass],
      visualisedDataIndex: assignedClass
    })
  },

  setExampleForVisualisation: function (data) {
    // let data = this.state.incomingExamples.map((entry) => {
    //   return entry
    // })
    this.setState({
      dataForVisualisation: this.state.incomingExamples,
      visualisedDataIndex: -1
    })
  },

  deleteExample: function (data) {
    let newInputs = this.state.inputs
    newInputs[this.state.visualisedDataIndex] = data
    this.train()
    this.setDataForVisualisation(this.state.visualisedDataIndex)
  },

  setPlayerPlayingIndex: function (index) {
    console.log(index + ' assigned')
    this.setState({ playerPlayingIndex: index })
  },

  setPlayerVolumeUpIndex: function (index) {
    this.setState({ playerVolumeUpIndex: index })
  },

  setPlayerVolumeDownIndex: function (index) {
    this.setState({ playerVolumeDownIndex: index })
  },

  flipBulkMode: function () {
    this.setState({ bulkMode: !this.state.bulkMode })
  },

  clearIncomingExamples: function () {
    this.setState({ incomingExamples: [] })
  },

  render: function () {
    // if (this.tutorial.length === 0) {
      this.tutorial[0] = (
        <ListGroupItem key={1}>
          <form className='form-inline'>
            <div className='form-group'>
              <span> Welcome, this is a new session! It exists only for you so let's give it a name: </span>
              <FormGroup>
                <FormControl
                  type='text'
                  value={this.state.sessionName}
                  onChange={this.handleSessionName}
                  bsStyle={this.state.sessionSet ? 'success' : 'warning'}
                />
              </FormGroup>
            </div>
            <Button bsStyle='link' type='submit' onClick={this.setSessionName}> Sounds good! </Button>
          </form>
        </ListGroupItem>
      )
    // }

    if (this.tutorial.length === 1 && this.state.sessionSet) {
      this.tutorial.push(
        <ListGroupItem key={2}>
          <span> Good. You can always change it something else above. Now, send over your first gesture... </span>
          <OverlayTrigger trigger='click' placement='bottom' overlay={
            <Popover id='hint' title='Generating a gesture'>
              Take your mobile device, and while pressing <b>Record</b>, draw a smily mouth in the air. Do it once, since we need to send one example to our algorithm. A simple gesture shouldn't be much longer than 1-2 seconds (you can do it very slowly but you don't have to). When you are done, press <b>Send</b> and the tutorial will continue.
            <video width='400' height='320' controls='controls'>
              <source src='../example.mp4' type='video/mp4'/>
              </video>
            </Popover>
            }>
            <Button bsStyle="default">How?</Button>
          </OverlayTrigger>
        </ListGroupItem>
      )
    }

    if (this.state.incomingExamples.length === 1 && this.tutorial.length === 2) {
      this.tutorial.push(
        <ListGroupItem key={3}>
          <form className='form-inline'>
            <div className='form-group'>
              <span> Ok, why don't you name that class: </span>
              <FormGroup>
                <FormControl
                  type='text'
                  placeholder='e.g. Happy'
                  onChange={this.handleWord.bind(this, 0)}
                />
              </FormGroup>
              <Button bsStyle='link' type='submit' onClick={() => {
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
              <FormGroup>
                <FormControl
                  type='text'
                  placeholder='e.g. Sad'
                  onChange={this.handleWord.bind(this, 1)}
                />
              </FormGroup>
              <Button bsStyle='link' type='submit' onClick={() => {
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

    let graph = this.state.dataForVisualisation.length > 0
      ? (<Graph
        inputs={this.state.dataForVisualisation}
        resend={this.resend}
        deleteExample={this.deleteExample}
      />)
      : ''

    let videoWordsOptions = []

    Object.keys(this.state.words).forEach((wordIndex) => {
      videoWordsOptions.push(<option value={wordIndex} key={wordIndex}>{this.state.words[wordIndex]}</option>)
    })

    this.predict()

    return (
      <Grid>
        <ListGroup>
          {this.tutorial}
            {(() => {
              if (this.tutorial.length === 6) {
                return (
                  <div>
                    <Dashboard
                      prediction={this.prediction}
                      flipBulkMode={this.flipBulkMode}
                      bulkMode={this.state.bulkMode}
                      isRecording={this.state.isRecording}
                      addClass={this.addClass}
                      setExampleForVisualisation={this.setExampleForVisualisation}
                      incomingExamples={this.state.incomingExamples}
                      clearIncomingExamples={this.clearIncomingExamples}
                    />
                    <Model
                      numberOfClasses={this.state.numberOfClasses}
                      words={this.state.words}
                      assign={this.assign}
                      incomingExamples={this.state.incomingExamples}
                      handleWord={this.handleWord}
                      deleteClass={this.deleteClass}
                      setDataForVisualisation={this.setDataForVisualisation}
                      inputs={this.state.inputs}
                    />
                    {graph}
                    <VideoPlayer
                      playerPlaying={this.playerPlaying}
                      playerVolume={this.playerVolume}
                      videoWordsOptions={videoWordsOptions}
                      setPlayerPlayingIndex={this.setPlayerPlayingIndex}
                      setPlayerVolumeUpIndex={this.setPlayerVolumeUpIndex}
                      setPlayerVolumeDownIndex={this.setPlayerVolumeDownIndex}
                    />
                  </div>
                )
              }
            })()}
        </ListGroup>
      </Grid>
    )
  }
})

export default App
