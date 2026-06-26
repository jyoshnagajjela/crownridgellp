import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ErrorAlert from '../components/ErrorAlert'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, loading, error, clearError } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const loggedUser = await login(email, password)

    if (loggedUser) {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Crownridge LLP
        </h1>

        <p className="text-slate-600 mb-6">
          Labour Productivity Dashboard Login
        </p>

        <ErrorAlert message={error} onDismiss={clearError} />

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center">
          New user?{' '}
          <Link to="/register" className="text-blue-600">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage