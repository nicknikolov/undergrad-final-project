import React from 'react'
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap'
import io from 'socket.io-client'

var Mobile = React.createClass({

  getInitialState: function () {
    return {
      acceleration: {x: 0, y: 0, z: 0},
      remoteSessionName: 'test session'
    }
  },

  componentWillMount: function () {
    if (window && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleMotionChange, false)
    }

    if (window && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.handleOrientationChange, false)
    }
  },

  componentDidMount: function () {
    this.touchEvent = false
    this.continuousSend = false
    this.rawData = []
    this.socket = io()
  },

  componentWillUnmount: function () {
    if (window) {
      window.removeEventListener('devicemotion', this.handleMotionChange, false)
    }

    if (window) {
      window.removeEventListener('deviceorientation', this.handleOrientationChange, false)
    }
  },

  handleMotionChange: function (event) {
    if (!this.touchEvent) return

    var acceleration = {
      x: event.acceleration.x,
      y: event.acceleration.y,
      z: event.acceleration.z
    }

    this.setState({
      acceleration: acceleration
    })

    this.rawData.push(acceleration)
  },

  handleOrientationChange: function (event) {
    if (!this.continuousSend) return

    var inputsArray = []
    inputsArray.push(
      event.alpha,
      event.beta,
      event.gamma
    )
    this.socket.emit('browser', {'inputs': inputsArray, 'id': this.state.remoteSessionName})
  },

  touchStart: function () {
    this.touchEvent = true
    this.socket.emit('recording', { 'touch': true , 'id': this.state.remoteSessionName})
  },

  touchEnd: function () {
    this.socket.emit('recording', { 'touch': false , 'id': this.state.remoteSessionName})
    this.touchEvent = false
    this.continuousSend = false
  },

  cancelGesture: function () {
    this.rawData = []
  },

  sendGestureData: function () {
    var inputsNumber = 60
    var inputsArray = []
    var rawData = this.rawData

    // TODO: how do I deal with short gestures?
    // Ignore for now, later maybe interpolation
    if ((rawData.length * 3) < inputsNumber) {
      this.rawData = []
      return
    }

    // Downsample by sampling every N sample using the downsampleFactor variable
    var downsampleFactor = (rawData.length * 3) / inputsNumber
    var sampleIndex = 0
    var xArray = []
    var yArray = []
    var zArray = []

    for (var i = 0; i < inputsNumber / 3; i++) {
      var x = rawData[Math.round(sampleIndex)].x
      var y = rawData[Math.round(sampleIndex)].y
      var z = rawData[Math.round(sampleIndex)].z
      inputsArray.push(x, y, z)
      xArray.push(x)
      yArray.push(y)
      zArray.push(z)
      sampleIndex += downsampleFactor
    }

    this.rawData = []
    this.socket.emit('data', {'inputs': inputsArray,
                                  'xArray': xArray,
                                  'yArray': yArray,
                                  'zArray': zArray,
                                  'id': this.state.remoteSessionName})
  },

  handleRemoteSessionName: function (event) {
    this.setState({remoteSessionName: event.target.value})
  },

  render: function () {
    return (
      <div>
        <ListGroup>
          <ListGroupItem bsStyle="warning">Please lock your device in portrat mode.</ListGroupItem>
        </ListGroup>
        <div>
          <Button
            className='btn-mobile'
            bsSize='large'
            bsStyle='primary'
            onTouchStart={this.touchStart}
            onTouchEnd={this.touchEnd}>
            Record
          </Button>
        </div>
        <div>
          <Button
            className='btn-mobile'
            bsSize='large'
            bsStyle='primary'
            onTouchEnd={this.sendGestureData}>
            Send
          </Button>
        </div>
        <div>
          <Button
            className='btn-mobile'
            bsSize='large'
            bsStyle='primary'
            onTouchEnd={this.cancelGesture}>
            Cancel
          </Button>
        </div>
        <div>
          Remote session name:
          <input
            bsSize='large'
            type='text'
            value={this.state.remoteSessionName}
            onChange={this.handleRemoteSessionName}
          />
        </div>
        <div>
          {this.touchEvent ? <div> {this.state.acceleration.x} </div> : null}
          {this.touchEvent ? <div> {this.state.acceleration.y} </div> : null}
          {this.touchEvent ? <div> {this.state.acceleration.z} </div> : null}
        </div>
      </div>
    )
  }
})

export default Mobile
