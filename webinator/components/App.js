import React from 'react'
import io from 'socket.io-client'
import Output from './output'
import Input from './input'
import { Button, Grid, Col, Row } from 'react-bootstrap'
import ip from 'ip'

const App = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      sessionName: 'test',
      isRunning: false,
      dataForPrediction: [],
      selectedClass: 0,
      rules: { x: true, y: true, z: true }
    }
  },

  componentDidMount: function () {
    this.socket = io()

    this.socket.on('inputs', (event) => {
      if (this.state.isRunning) {
        let data = { x: event[0], y: event[1], z: event[2] }
        let arr = []
        for (let i = 0; i < data.x.length; i++) {
          if (this.state.rules.x) arr.push(data.x[i])
          if (this.state.rules.y) arr.push(data.y[i])
          if (this.state.rules.z) arr.push(data.z[i])
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
        if (this.state.rules.x) arr.push(data.x[i])
        if (this.state.rules.y) arr.push(data.y[i])
        if (this.state.rules.z) arr.push(data.z[i])
      }
      this.setState({dataForPrediction: arr})
    }
  },

  setRules: function (coord) {
    let rules = this.state.rules
    rules[coord] = !this.state.rules[coord]
    this.setState({ rules: rules })
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
              rules={this.state.rules}
              setRules={this.setRules}
              isRunning={this.state.isRunning}
            />
          </Col>
          <Col lg={6}>
            <Output
              setIsRunning={this.setIsRunning}
              isRunning={this.state.isRunning}
              setSelectedClass={this.setSelectedClass}
              dataForPrediction={this.state.dataForPrediction}
              rules={this.state.rules}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
})

export default App

