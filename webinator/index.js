var ReactFauxDOM = require('react-faux-dom')
var React = require('react')
var ReactDOM = require('react-dom')
var ReactTabs = require('react-tabs')
var Tab = ReactTabs.Tab
var Tabs = ReactTabs.Tabs
var TabList = ReactTabs.TabList
var TabPanel = ReactTabs.TabPanel
var d3 = require('d3')
var io = require('socket.io-client')

var App = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },

  getInitialState: function () {
    return {
      acceleration: {x: 0, y: 0, z: 0},
      data: [this.props.data, this.props.data, this.props.data],
      sessionName: '',
      remoteSessionName: ''
    }
  },

  componentWillMount: function () {
    if (window && window.DeviceMotionEvent) {
      this.motionListener = this.handleMotionChange
      window.addEventListener('devicemotion', this.motionListener, false)
    }

    if (window && window.DeviceOrientationEvent) {
      this.orientationListner = this.handleOrientationChange
      window.addEventListener('deviceorientation', this.orientationListner, false)
    }
  },

  componentDidMount: function () {
    this.touchEvent = false
    this.continuousSend = false
    this.rawData = []
    this.socket = io('http://192.168.0.5:3000')
    // this.socket = io('http://10.100.131.82:3000')
    // this.socket = io('http://172.16.42.86:3000/')

    this.socket.on('inputs', function (event) {
      this.setState({data: event})
    }.bind(this))
  },

  componentWillUnmount: function () {
    if (window) {
      window.removeEventListener('devicemotion', this.motionListener, false)
    }

    if (window) {
      window.removeEventListener('deviceorientation', this.orientationListner, false)
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
      event.alpha / 360,
      event.beta / 180,
      event.gamma / 90
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

    this.setState({
      data: [xArray, yArray, zArray]
    })
    this.rawData = []
    this.socket.emit('browser', {'inputs': inputsArray,
                                  'xArray': xArray,
                                  'yArray': yArray,
                                  'zArray': zArray,
                                  'id': this.state.remoteSessionName})
  },

  handleSessionName: function (event) {
    this.setState({sessionName: event.target.value})
  },

  handleRemoteSessionName: function (event) {
    this.setState({remoteSessionName: event.target.value})
  },

  setSessionName: function () {
    this.socket.emit('id', this.state.sessionName)
  },

  render: function () {
    var m = [10, 10, 25, 45] // margins
    var w = 300 - m[1] - m[3] // width
    var h = 200 - m[0] - m[2] // height
    var data = this.state.data

    var x = d3.scale.linear().domain([0, data[0].length]).range([0, w])
    var y = d3.scale.linear().domain([-7, 7]).range([h, 0])

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(5)

    var yAxisLeft = d3.svg.axis()
      .scale(y)
      .ticks(4)
      .orient('left')

    var line = d3.svg.line()
      .x(function (d, i) { return x(i) })
      .y(function (d) { return y(d) })

    var nodeX = ReactFauxDOM.createElement('svg')
    var nodeY = ReactFauxDOM.createElement('svg')
    var nodeZ = ReactFauxDOM.createElement('svg')
    var nodes = []
    nodes.push(nodeX, nodeY, nodeZ)

    for (var i = 0; i < 3; i++) {
      var svg = d3.select(nodes[i])
        .attr('width', w + m[1] + m[3])
        .attr('height', h + m[0] + m[2])
        .append('g')
        .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')')

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis)

      svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(-25,0)')
        .call(yAxisLeft)

      svg.append('path').attr('d', line(data[i]))
    }

    return (
      <Tabs>
        <TabList>
          <Tab>Graphs</Tab>
          <Tab>Record</Tab>
          <Tab>Session</Tab>
        </TabList>

        <TabPanel>
          <div> { nodes[0].toReact() } </div>
          <div> { nodes[1].toReact() } </div>
          <div> { nodes[2].toReact() } </div>
        </TabPanel>
        <TabPanel>
          <div className='button'
                onTouchStart={this.handleGestureStart}
                onTouchEnd={this.handleTouchEnd}>
            Record gesture
          </div>
          <div className='button'
                onTouchEnd={this.sendGestureData}>
            Send gesture
          </div>
          <div className='button'
                onTouchStart={this.handleContinuousStart}
                onTouchEnd={this.handleTouchEnd}>
            Send continuous data
          </div>
          Remote session name:
          <input
            type='text'
            value={this.state.remoteSessionName}
            onChange={this.handleRemoteSessionName}
          />
          {this.touchEvent ? <div> {this.state.acceleration.x} </div> : null}
          {this.touchEvent ? <div> {this.state.acceleration.y} </div> : null}
          {this.touchEvent ? <div> {this.state.acceleration.z} </div> : null}
        </TabPanel>
        <TabPanel>
          <input
            type='text'
            value={this.state.sessionName}
            onChange={this.handleSessionName}
          />
          <div className='button'
                onClick={this.setSessionName}>
            Set session name
          </div>
        </TabPanel>

      </Tabs>
    )
  }
})

var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
ReactDOM.render(<App data = {data} />, document.querySelector('#content'))

