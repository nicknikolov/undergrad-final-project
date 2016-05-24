const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)

const osc = require('osc-min')
const dgram = require('dgram')

app.use(express.static('.'))

const io = require('socket.io')(http)

const remoteIp = '127.0.0.1'
const remotePort = 6448
const udpServer = dgram.createSocket('udp4')

const users = {}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

io.on('connection', (socket) => {
  console.log('user connected')

  socket.on('id', (data) => {
    users[data] = socket.id
    console.log('session ' + data + ' set')
  })

  socket.on('recording', (event) => {
    io.to(users[event.id]).emit('recording', event.touch)
  })

  socket.on('data', (event) => {
    io.to(users[event.id]).emit('inputs', [event.xArray, event.yArray, event.zArray])
  })

  socket.on('prediction', (event) => {
    console.log(event)
    if (event.prediction === 'clip1') {
      var oscMsg = osc.toBuffer({
        oscType: 'message',
        address: '/clip',
        args: 0
      })

      console.log('message sent')
      udpServer.send(oscMsg, 0, oscMsg.length, remotePort, remoteIp)
    }

    if (event.prediction === 'clip2') {
      var oscMsg = osc.toBuffer({
        oscType: 'message',
        address: '/clip',
        args: 1
      })

      console.log('message sent')
      udpServer.send(oscMsg, 0, oscMsg.length, remotePort, remoteIp)
    }
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
