const express = require('express')
const app = express()
const http = require('http').Server(app)
app.use(express.static('.'))

const io = require('socket.io')(http)

const osc = require('osc-min')
const dgram = require('dgram')

const remoteIp = '127.0.0.1'
const remotePort = 6448

const udpServer = dgram.createSocket('udp4')
const users = {}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

// io.on('connection', function(socket){
//   console.log('user connected')
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg)
//   })
// })
io.on('connection', (socket) => {
  console.log('user connected')

  socket.on('id', (data) => {
    users[data] = socket.id
    console.log('session ' + data + ' set')
  })

  socket.on('browser', (event) => {

    console.log(event)

    var data = event.inputs

    io.to(users[event.id]).emit('inputs', [ event.xArray, event.yArray, event.zArray] )

    var args = []

    data.forEach(function (element) {
      args.push({
        type: 'float',
        value: parseFloat(element) || 0
      })
    })

    var oscMsg = osc.toBuffer({
      oscType: 'message',
      address: '/wek/inputs',
      args: args
    })

    udpServer.send(oscMsg, 0, oscMsg.length, remotePort, remoteIp)
    console.log('OSC message sent to ' + remoteIp + ':' + remotePort)

  })
})

http.listen(3000, function(){
  console.log('listening on *:3000')
})
