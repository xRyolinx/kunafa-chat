const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const { prisma } = require('./server-prisma')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

// Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Store active sessions and their socket IDs for notifications
const userSessions = new Map()

// Session verification helper
async function verifySocketSession(token) {
  if (!token) return null

  try {
    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (!session) return null

    const now = new Date()
    if (new Date(session.expiresAt) < now) {
      await prisma.session.delete({ where: { token } })
      return null
    }

    return session.user
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

app.prepare().then(async () => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Next.js handler error:', err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  // Socket.IO connection handling
  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id)

    // User joins chat with token
    socket.on('join', async (token) => {
      const userId = await verifySocketSession(token)

      if (!userId) {
        socket.emit('error', 'Invalid session')
        socket.disconnect()
        return
      }

      socket.join('chat')
      socket.data.userId = userId
      socket.data.token = token

      userSessions.set(socket.id, { userId, token })
      console.log(`${userId} joined chat`)

      // Notify others that user joined
      socket.broadcast.to('chat').emit('user:joined', {
        userId,
        timestamp: new Date().toISOString(),
      })
    })

    // Receive new message and broadcast to all
    socket.on('message:send', async (data) => {
      const userId = socket.data.userId
      if (!userId) {
        socket.emit('error', 'Not authenticated')
        return
      }

      try {
        const message = await prisma.message.create({
          data: {
            sender: userId,
            text: data.text.trim(),
          },
        })

        // Broadcast to all users in chat room
        io.to('chat').emit('message:new', {
          id: message.id,
          sender: message.sender,
          text: message.text,
          timestamp: message.timestamp.toISOString(),
        })
      } catch (error) {
        console.error('Message send error:', error)
        socket.emit('error', 'Failed to send message')
      }
    })

    // Request older messages (pagination)
    socket.on('message:loadMore', async (data) => {
      const userId = socket.data.userId
      if (!userId) {
        socket.emit('error', 'Not authenticated')
        return
      }

      try {
        const offset = data.offset || 0
        const limit = data.limit || 20

        const messages = await prisma.message.findMany({
          skip: offset,
          take: limit,
          orderBy: {
            timestamp: 'desc',
          },
        })

        // Return in ascending order for display
        socket.emit('message:moreLoaded', {
          messages: messages.reverse(),
          hasMore: messages.length === limit,
        })
      } catch (error) {
        console.error('Load more error:', error)
        socket.emit('error', 'Failed to load messages')
      }
    })

    // Disconnect handler
    socket.on('disconnect', () => {
      const session = userSessions.get(socket.id)
      if (session) {
        userSessions.delete(socket.id)
        socket.broadcast.to('chat').emit('user:left', {
          userId: session.userId,
          timestamp: new Date().toISOString(),
        })
        console.log(`${session.userId} left chat`)
      }
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
