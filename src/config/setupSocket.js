const socketIO = require('socket.io')

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  const users = new Map()

  io.on('connection', (socket) => {
    socket.on('addUser', ({ userId }) => {
      users.set(userId, socket.id)
      io.emit('getUsers', Array.from(users.entries()))
    })

    socket.on('callUser', ({ userToCall, signalData, from }) => {
      const userSocket = users.get(userToCall)
      if (userSocket) {
        io.to(userSocket).emit('callUser', {
          signal: signalData,
          from
        })
      }
    })

    socket.on('answerCall', ({ to, signal }) => {
      const userSocket = users.get(to)
      if (userSocket) {
        io.to(userSocket).emit('callAccepted', signal)
      }
    })

    socket.on('disconnect', () => {
      users.forEach((value, key) => {
        if (value === socket.id) {
          users.delete(key)
        }
      })
      io.emit('getUsers', Array.from(users.entries()))
    })
  })

  return io
}

module.exports = setupSocket