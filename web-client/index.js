var io = require('socket.io-client')
var socket = io('http://localhost:3000')
var inputsNumber = 20

socket.on('connect', function() {

  var isMouseDown = false
  var rawData = []

  document.onmousedown = function() { isMouseDown = true  }
  document.onmouseup   = function() {
    isMouseDown = false
    var inputsArray = []

    // TODO: how do I deal with short gestures?
    if ((rawData.length * 2) < inputsNumber) {
      rawData = []
      return
    }

    var downsampleFactor = Math.round((rawData.length*2) / inputsNumber)

    for (var i=0; i<inputsNumber/2; i++) {
      inputsArray.push((rawData[i * downsampleFactor].x) / window.innerWidth,
                       (rawData[i * downsampleFactor].y) / window.innerHeight)
    }

    console.log('raw length: ' + rawData.length)
    console.log('res: ' + inputsArray)
    console.log('res length: ' + inputsArray.length)
    socket.emit('browser', inputsArray)
    rawData = []
  }
  document.onmousemove = function(e) {
    if(isMouseDown) {
      rawData.push({'x': e.clientX, 'y': e.clientY})
    }
  }
})

