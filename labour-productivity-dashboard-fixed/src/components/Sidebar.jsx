import {
  BarChart3,
  ClipboardList,
  FileText,
  PieChart,
  Building2,
} from 'lucide-react'

function Sidebar({ currentPage, onNavigate, totalWorkers }) {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'entry', label: 'New Entry', icon: ClipboardList },
    { id: 'records', label: 'Records', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white flex flex-col shadow-2xl">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
            <Building2 size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide">
              Crownridge LLP
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Labour Productivity Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 px-3">
          Navigation
        </p>

        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = currentPage === link.id

            return (
              <li key={link.id}>
                <button
                  onClick={() => onNavigate(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-[1.02]'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />

                  <span className="font-medium">
                    {link.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Workforce Card */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 shadow-xl">

          <p className="text-xs uppercase tracking-widest text-blue-100">
            Total Workforce
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {totalWorkers}
          </h2>

          <p className="text-sm text-blue-100 mt-2">
            Active Workers
          </p>

        </div>
      </div>

    </aside>
  )
}

export default Sidebar