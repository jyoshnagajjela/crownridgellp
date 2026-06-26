import { useState, useCallback } from 'react'

const API_URL = 'https://crownridgellp-ldd9.onrender.com/api/records'

export function useRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL)
      const result = await response.json()

      if (result.success) {
        setRecords(result.data || [])
      } else {
        setError(result.message || 'Failed to fetch records')
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const addRecord = useCallback(async (recordData) => {
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchRecords()
        return { success: true }
      } else {
        setError(result.message || 'Failed to add record')
        return { success: false }
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.')
      return { success: false }
    }
  }, [fetchRecords])

  const updateRecord = useCallback(async (id, updatedData) => {
    setError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchRecords()
        return { success: true }
      } else {
        setError(result.message || 'Failed to update record')
        return { success: false }
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.')
      return { success: false }
    }
  }, [fetchRecords])

  const deleteRecord = useCallback(async (id) => {
    setError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchRecords()
        return { success: true }
      } else {
        setError(result.message || 'Failed to delete record')
        return { success: false }
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.')
      return { success: false }
    }
  }, [fetchRecords])

  const clearError = useCallback(() => setError(''), [])

  return {
    records,
    loading,
    error,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    clearError,
  }
}