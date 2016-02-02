var io = require('socket.io-client')
// var socket = io('http://localhost:3000')
var socket = io('http://192.168.0.5:3000')
var inputsNumber = 60

socket.on('connect', function () {
  var touchEvent = false
  var rawData = []
  document.body.style.background = 'grey'

  document.ontouchstart = function (e) {
    touchEvent = true
    document.body.style.background = 'red'
  }

  document.ontouchend = function () {
    document.body.style.background = 'grey'
    touchEvent = false
    var inputsArray = []

    // TODO: how do I deal with short gestures?
    // Ignore for now, later maybe interpolation
    if ((rawData.length * 3) < inputsNumber) {
      rawData = []
      return
    }

    // Downsample by sampling every N sample using the downsampleFactor variable
    var downsampleFactor = (rawData.length * 3) / inputsNumber
    var sampleIndex = 0

    for (var i = 0; i < inputsNumber / 3; i++) {
      var x = rawData[Math.round(sampleIndex)].x
      var y = rawData[Math.round(sampleIndex)].y
      var z = rawData[Math.round(sampleIndex)].z
      inputsArray.push(x, y, z)
      sampleIndex += downsampleFactor
    }

    socket.emit('browser', inputsArray)
    rawData = []
  }

  window.addEventListener('devicemotion', function (e) {
    if (touchEvent) {
      rawData.push({'x': e.acceleration.x, 'y': e.acceleration.y, 'z': e.acceleration.z})
    }
  }, true)
})

