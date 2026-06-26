import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useRecords } from './hooks/useRecords'

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
  }, [user, fetchRecords])

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App