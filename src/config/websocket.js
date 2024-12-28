const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const { Message } = require('../Modules/Chat/model')

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server })
  const clients = new Map()

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established')

    ws.on('message', async (message) => {
      try {
        console.log('Received WebSocket message:', message.toString())
        const data = JSON.parse(message)

        switch (data.type) {
          case 'USER_CONNECTED':
            console.log('User connected:', data.userId)
            clients.set(data.userId, ws)
            broadcastOnlineUsers()
            break

          case 'CHAT_MESSAGE':
            console.log('Processing chat message:', data)
            try {
              const newMessage = new Message({
                sender: data.senderId,
                receiver: data.receiverId,
                content: data.content
              })
              const savedMessage = await newMessage.save()
              console.log('Message saved:', savedMessage)

              const messageData = {
                type: 'NEW_MESSAGE',
                message: {
                  _id: savedMessage._id,
                  sender: savedMessage.sender,
                  receiver: savedMessage.receiver,
                  content: savedMessage.content,
                  createdAt: savedMessage.createdAt
                }
              }

              // Send to receiver
              const receiverWs = clients.get(data.receiverId)
              if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
                console.log('Sending to receiver:', data.receiverId)
                receiverWs.send(JSON.stringify(messageData))
              }

              // Send back to sender
              console.log('Sending back to sender:', data.senderId)
              ws.send(JSON.stringify(messageData))
            } catch (error) {
              console.error('Error saving message:', error)
              ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Failed to save message'
              }))
            }
            break
        }
      } catch (error) {
        console.error('Error processing message:', error)
      }
    })

    ws.on('close', () => {
      console.log('WebSocket connection closed')
      for (const [userId, client] of clients.entries()) {
        if (client === ws) {
          clients.delete(userId)
          console.log('User disconnected:', userId)
          broadcastOnlineUsers()
          break
        }
      }
    })
  })

  function broadcastOnlineUsers() {
    const onlineUsers = Array.from(clients.keys())
    const message = JSON.stringify({
      type: 'ONLINE_USERS',
      users: onlineUsers
    })
    
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  }
}

module.exports = setupWebSocket