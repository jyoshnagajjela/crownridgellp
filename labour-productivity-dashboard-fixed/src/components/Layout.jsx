import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

function Layout({ user, onLogout, records }) {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPage = location.pathname.replace('/', '') || 'dashboard'

  const totalWorkforce = records.reduce(
    (sum, r) => sum + (Number(r.totalWorkers) || 0),
    0
  )

  const handleNavigate = (page) => {
    navigate(page === 'dashboard' ? '/' : `/${page}`)
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        totalWorkers={totalWorkforce}
      />

      <main className="flex-1 overflow-auto">
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200">
          <div>
            <p className="font-semibold text-slate-900">
              Welcome, {user.name}
            </p>
            <p className="text-sm text-slate-500">
              {user.role}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  )
}

export default Layout
