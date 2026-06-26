import { useState, useCallback } from 'react'

const API_URL = 'http://localhost:5000/api/auth'

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      return savedUser && token ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        setUser(result.user)
        return result.user
      } else {
        setError(result.message || 'Login failed')
        return null
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (name, email, password, role) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      const result = await response.json()

      if (result.success) {
        return { success: true, message: result.message }
      } else {
        setError(result.message || 'Registration failed')
        return { success: false, message: result.message }
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.')
      return { success: false, message: 'Connection error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setError('')
  }, [])

  const clearError = useCallback(() => setError(''), [])

  return { user, loading, error, login, register, logout, clearError }
}
