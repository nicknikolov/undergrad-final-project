import React from 'react'
import io from 'socket.io-client'
import Output from './output'
import Input from './input'
import { Button, Grid, Col, Row } from 'react-bootstrap'

const App = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      sessionName: 'test',
      isRunning: false,
      dataForPrediction: [],
      selectedClass: 0
    }
  },

  componentDidMount: function () {
    this.socket = io('http://192.168.0.5:3000')
    // this.socket = io('http://10.100.131.82:3000')
    // this.socket = io('http://172.16.42.86:3000/')

    this.socket.on('inputs', (event) => {
      if (this.state.isRunning) {
        let data = { x: event[0], y: event[1], z: event[2] }
        let arr = []
        for (let i = 0; i < data.x.length; i++) {
          arr.push(data.x[i])
          arr.push(data.y[i])
          arr.push(data.z[i])
        }
        this.setState({dataForPrediction: arr})
      } else {
        this.props.dispatch({
          type: 'ADD_INPUT',
          data: { x: event[0], y: event[1], z: event[2] },
          selectedClass: this.state.selectedClass
        })
      }
    })
  },

  resend: function (input) {
    let data = input.data
    if (this.state.isRunning) {
      let arr = []
      for (let i = 0; i < data.x.length; i++) {
        arr.push(data.x[i])
        arr.push(data.y[i])
        arr.push(data.z[i])
      }
      this.setState({dataForPrediction: arr})
    }
  },

  handleSessionName: function (event) {
    this.setState({sessionName: event.target.value})
  },

  setSessionName: function () {
    this.socket.emit('id', this.state.sessionName)
  },

  setIsRunning: function (isRunning) {
    this.setState({ isRunning: !this.state.isRunning })
  },

  setSelectedClass: function (classIndex) {
    this.setState({ selectedClass: classIndex })
  },

  render: function () {
    return (
      <Grid fluid>
        <Row>
          <div>
            <input
              type='text'
              value={this.state.sessionName}
              onChange={this.handleSessionName}
            />
            <Button bsStyle='primary' onClick={this.setSessionName}>Set session name</Button>
          </div>
        </Row>
        <Row className='show-grid'>
          <Col lg={6}>
            <Input
              resend={this.resend}
            />
          </Col>
          <Col lg={6}>
            <Output
              setIsRunning={this.setIsRunning}
              isRunning={this.state.isRunning}
              setSelectedClass={this.setSelectedClass}
              dataForPrediction={this.state.dataForPrediction}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
})

export default App

