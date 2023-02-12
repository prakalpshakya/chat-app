const express = require('express')
const app = express()
const path = require('path')
require('./db/mongoose')
const messageRouter = require('./routers/message')
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT

const publicPath = path.join(__dirname, '../public')

// Serve static directory
app.use(express.static(publicPath))

app.use(express.json())
app.use(messageRouter)

app.set('socketio', io)

io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id)
})

server.listen(port, () => {
  console.log('Server is up on port ' + port)
})
