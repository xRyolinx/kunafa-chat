'use client'

import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import './Chat.css'

const MESSAGES_PER_PAGE = 20

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [theme, setTheme] = useState('light')
  const [socket, setSocket] = useState(null)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const applyTheme = (nextTheme) => {
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('kunafa_theme', nextTheme)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages.length])

  useEffect(() => {
    const savedTheme = localStorage.getItem('kunafa_theme')
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    applyTheme(initialTheme)
  }, [])

  // Load more messages when scrolling to top
  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return

    // Check if user scrolled to top
    if (container.scrollTop < 100 && hasMore && !loadingMore && messages.length > 0) {
      loadMoreMessages()
    }
  }

  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore || !token) return

    setLoadingMore(true)

    try {
      const offset = messages.length
      const response = await fetch(
        `/api/chat/messages?offset=${offset}&limit=${MESSAGES_PER_PAGE}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        const oldScrollHeight = messagesContainerRef.current.scrollHeight

        // Prepend old messages
        setMessages((prev) => [...data.messages, ...prev])
        setHasMore(data.hasMore)

        // Maintain scroll position
        setTimeout(() => {
          const newScrollHeight = messagesContainerRef.current.scrollHeight
          const scrollDiff = newScrollHeight - oldScrollHeight
          messagesContainerRef.current.scrollTop += scrollDiff
        }, 0)
      } else if (response.status === 401) {
        handleLogout()
      }
    } catch (err) {
      console.error('Error loading more messages:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  // Initial setup and WebSocket connection
  useEffect(() => {
    const storedToken = localStorage.getItem('kunafa_token')
    const storedUserId = localStorage.getItem('kunafa_userId')
    const connectedAt = localStorage.getItem('kunafa_connectedAt')

    if (!storedToken || !storedUserId) {
      window.location.href = '/'
      return
    }

    const connectedTime = new Date(connectedAt)
    const now = new Date()
    const dayInMs = 24 * 60 * 60 * 1000

    if (now - connectedTime > dayInMs) {
      handleLogout()
      return
    }

    setToken(storedToken)
    setUserId(storedUserId)

    // Initialize WebSocket connection
    const newSocket = io({
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket')
      newSocket.emit('join', storedToken)
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    newSocket.on('message:new', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    newSocket.on('message:moreLoaded', (data) => {
      setMessages((prev) => [...data.messages, ...prev])
      setHasMore(data.hasMore)
    })

    newSocket.on('user:joined', (data) => {
      console.log(`${data.userId} joined`)
    })

    newSocket.on('user:left', (data) => {
      console.log(`${data.userId} left`)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket')
    })

    setSocket(newSocket)

    // Load initial messages
    fetchInitialMessages(storedToken)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const fetchInitialMessages = async (token) => {
    try {
      const response = await fetch(`/api/chat/messages?offset=0&limit=${MESSAGES_PER_PAGE}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
        setHasMore(data.hasMore)
      } else if (response.status === 401) {
        handleLogout()
      }
    } catch (err) {
      console.error('Error fetching initial messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!input.trim() || !socket) return

    const messageText = input
    setInput('')

    socket.emit('message:send', { text: messageText })
  }

  const handleLoadMore = () => {
    loadMoreMessages()
  }

  const handleLogout = () => {
    if (socket) {
      socket.disconnect()
    }

    const token = localStorage.getItem('kunafa_token')
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      }).catch((err) => console.error('Logout error:', err))
    }

    localStorage.removeItem('kunafa_token')
    localStorage.removeItem('kunafa_userId')
    localStorage.removeItem('kunafa_connectedAt')
    window.location.href = '/'
  }

  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!userId) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="chat-container">
      <div className="navbar">
        <div className="navbar-left">
          <h1>kunafa</h1>
        </div>
        <div className="navbar-right">
          <button className="theme-toggle-button" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="chat-content">
        <div className="messages-container" ref={messagesContainerRef} onScroll={handleScroll}>
          {messages.length === 0 ? (
            <div className="no-messages">
              {loading ? 'Loading messages...' : 'No messages yet. Start the conversation!'}
            </div>
          ) : (
            <>
              {hasMore && (
                <button
                  className="load-more-button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : '📥 Load More Messages'}
                </button>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender === userId ? 'own' : 'other'}`}
                >
                  <div className="message-header">
                    <strong className="sender">{msg.sender}</strong>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="message-text">{msg.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form className="message-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={!input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
