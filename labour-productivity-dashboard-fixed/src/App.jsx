import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useRecords } from './hooks/useRecords'
import { useEffect } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import Dashboard from './pages/Dashboard'
import LabourEntryForm from './pages/LabourEntryForm'
import LabourRecords from './pages/LabourRecords'
import ReportsAnalytics from './pages/ReportsAnalytics'
import DetailView from './pages/DetailView'

function App() {
  const { user, logout } = useAuth()
  const {
    records,
    loading: recordsLoading,
    error: recordsError,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    clearError,
  } = useRecords()

  useEffect(() => {
    if (user) {
      fetchRecords()
    }
  }, [user])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes with Layout */}
      <Route
        element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={logout} records={records} />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Dashboard
              records={records}
              loading={recordsLoading}
              error={recordsError}
              onDismissError={clearError}
            />
          }
        />
        <Route
          path="entry"
          element={<LabourEntryForm onSubmit={addRecord} />}
        />
        <Route
          path="records"
          element={
            <LabourRecords
              records={records}
              loading={recordsLoading}
              onDelete={deleteRecord}
            />
          }
        />
        <Route
          path="analytics"
          element={
            <ReportsAnalytics
              records={records}
              loading={recordsLoading}
              error={recordsError}
              onDismissError={clearError}
            />
          }
        />
        <Route
          path="detail/:id"
          element={
            <DetailView
              records={records}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
            />
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
