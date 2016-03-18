import React from 'react'
import { Button } from 'react-bootstrap'
import io from 'socket.io-client'
import ip from 'ip'

var Mobile = React.createClass({

  getInitialState: function () {
    return {
      acceleration: {x: 0, y: 0, z: 0},
      remoteSessionName: 'test'
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
    // this.socket = io('http://' + ip.address() + ':3000')
    // this.socket = io('127.0.0.1:3000')
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

  handleGestureStart: function () {
    this.touchEvent = true
  },

  handleContinuousStart: function () {
    this.continuousSend = true
  },

  handleTouchEnd: function () {
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
      var x = rawData[Math.round(sampleIndex)].x * 10
      var y = rawData[Math.round(sampleIndex)].y * 10
      var z = rawData[Math.round(sampleIndex)].z * 10
      inputsArray.push(x, y, z)
      xArray.push(x)
      yArray.push(y)
      zArray.push(z)
      sampleIndex += downsampleFactor
    }

    this.rawData = []
    this.socket.emit('browser', {'inputs': inputsArray,
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
        <div>
          <Button
            bsSize='large'
            bsStyle='primary'
            onTouchStart={this.handleGestureStart}
            onTouchEnd={this.handleTouchEnd}>
            Record Gesture
          </Button>
        </div>
        <div>
          <Button
            bsSize='large'
            bsStyle='primary'
            onTouchEnd={this.sendGestureData}>
            Send Gesture
          </Button>
        </div>
        <div>
          <Button
            bsSize='large'
            bsStyle='primary'
            onTouchEnd={this.cancelGesture}>
            Cancel Gesture
          </Button>
        </div>
        <div>
          <Button
            bsSize='large'
            bsStyle='primary'
            onTouchStart={this.handleContinuousStart}
            onTouchEnd={this.handleTouchEnd}>
            Send continuous data
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
