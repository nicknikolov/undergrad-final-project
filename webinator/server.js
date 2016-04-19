const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
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
  socket.on('data', (event) => {
    var data = event.inputs
    io.to(users[event.id]).emit('inputs', [event.xArray, event.yArray, event.zArray])
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
