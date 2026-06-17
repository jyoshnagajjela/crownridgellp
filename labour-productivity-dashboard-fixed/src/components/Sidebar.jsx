import { BarChart3, ClipboardList, FileText, PieChart } from 'lucide-react'

function Sidebar({ currentPage, onNavigate, totalWorkers }) {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'entry', label: 'New Entry', icon: ClipboardList },
    { id: 'records', label: 'Records', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-blue-600">
          Crownridge LLP
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Project Labour Productivity Dashboard
        </p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {links.map(link => {
            const Icon = link.icon
            const isActive = currentPage === link.id

            return (
              <li key={link.id}>
                <button
                  onClick={() => onNavigate(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200"
        style={{ width: '16rem' }}
      >
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-xs text-slate-600">
            Total Workforce
          </p>

          <p className="text-2xl font-bold text-blue-600">
            {totalWorkers}
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar