import {
  Users,
  UserCheck,
  UserX,
  CheckCircle,
  TrendingUp,
  Building2,
} from 'lucide-react'
import DashboardCard from '../components/DashboardCard'

function Dashboard({ records, onViewDetail }) {
  const totalWorkers = records.reduce((sum, r) => sum + (Number(r.totalWorkers) || 0), 0)
  const presentWorkers = records.reduce((sum, r) => sum + (Number(r.presentWorkers) || 0), 0)
  const absentWorkers = records.reduce((sum, r) => sum + (Number(r.absentWorkers) || 0), 0)
  const tasksCompleted = records.reduce((sum, r) => sum + (Number(r.tasksCompleted) || 0), 0)

  const productivityRate =
    totalWorkers > 0 ? ((tasksCompleted / totalWorkers) * 100).toFixed(1) : '0.0'

  const activeSites = new Set(records.map(r => r.siteName).filter(Boolean)).size

  const stats = [
    { title: 'Total Workforce', value: totalWorkers, icon: Users, color: 'blue' },
    { title: 'Present Workers', value: presentWorkers, icon: UserCheck, color: 'green' },
    { title: 'Absent Workers', value: absentWorkers, icon: UserX, color: 'red' },
    { title: 'Tasks Completed', value: tasksCompleted, icon: CheckCircle, color: 'green' },
    { title: 'Productivity Rate', value: `${productivityRate}%`, icon: TrendingUp, color: 'purple' },
    { title: 'Active Sites', value: activeSites, icon: Building2, color: 'amber' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Labour Productivity Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <DashboardCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Labour Entries</h2>

          <div className="space-y-3">
            {records.slice(0, 5).map(record => (
              <div
                key={record.id}
                className="flex justify-between items-start pb-3 border-b border-slate-200 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {record.siteName || record.name || 'Site Entry'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {record.tradeType || record.position || 'Labour'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium text-slate-900">
                    {record.tasksCompleted || 0} tasks
                  </p>
                  <p className="text-sm text-slate-600">{record.date}</p>
                </div>
              </div>
            ))}

            {records.length === 0 && (
              <p className="text-slate-500 text-sm">No labour entries added yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Attendance Rate</span>
              <span className="font-semibold text-slate-900">
                {totalWorkers > 0 ? ((presentWorkers / totalWorkers) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">Absenteeism Rate</span>
              <span className="font-semibold text-slate-900">
                {totalWorkers > 0 ? ((absentWorkers / totalWorkers) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">Productivity Rate</span>
              <span className="font-semibold text-slate-900">{productivityRate}%</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <span className="text-slate-600">Total Records</span>
              <span className="font-semibold text-slate-900">{records.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard