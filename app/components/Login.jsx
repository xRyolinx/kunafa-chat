'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './Login.css'

export default function Login() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/auth/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => console.error('Error fetching users:', err))
  }, [])

  const handleUserSelect = (userId) => {
    setSelectedUser(userId)
    setPassword('')
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      localStorage.setItem('kunafa_token', data.token)
      localStorage.setItem('kunafa_userId', data.userId)
      localStorage.setItem('kunafa_connectedAt', data.connectedAt)

      window.location.href = '/chat'
    } catch (err) {
      setError('Connection error. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedUser) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>kunafa</h1>
          <p className="subtitle">Select your profile</p>
          <div className="users-grid">
            {users.map((user) => (
              <button
                key={user.id}
                className="user-button"
                onClick={() => handleUserSelect(user.id)}
              >
                <span className="user-name">{user.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <button className="back-button" onClick={() => handleUserSelect(null)}>
          ← Back
        </button>
        <h1>kunafa</h1>
        <h2>Welcome, {users.find((u) => u.id === selectedUser)?.name}</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !password}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
