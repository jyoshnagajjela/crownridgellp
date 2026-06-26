import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UserCheck,
  UserX,
  CheckCircle,
  TrendingUp,
  Building2,
} from 'lucide-react'
import DashboardCard from '../components/DashboardCard'
import ErrorAlert from '../components/ErrorAlert'
import { SkeletonCard } from '../components/LoadingSkeleton'
import { aggregateStats } from '../utils/productivity'

function Dashboard({ records, loading, error, onDismissError }) {
  const navigate = useNavigate()
  const stats = records.length > 0
    ? (() => {
        const s = aggregateStats(records)
        return [
          { title: 'Total Workforce', value: s.totalWorkers, icon: Users },
          { title: 'Present Workers', value: s.presentWorkers, icon: UserCheck },
          { title: 'Absent Workers', value: s.absentWorkers, icon: UserX },
          { title: 'Tasks Completed', value: s.tasksCompleted, icon: CheckCircle },
          { title: 'Productivity Rate', value: `${s.productivityRate}%`, icon: TrendingUp },
          { title: 'Active Sites', value: s.activeSites, icon: Building2 },
        ]
      })()
    : [
        { title: 'Total Workforce', value: 0, icon: Users },
        { title: 'Present Workers', value: 0, icon: UserCheck },
        { title: 'Absent Workers', value: 0, icon: UserX },
        { title: 'Tasks Completed', value: 0, icon: CheckCircle },
        { title: 'Productivity Rate', value: '0.0%', icon: TrendingUp },
        { title: 'Active Sites', value: 0, icon: Building2 },
      ]

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <div className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-4xl font-bold text-slate-900">
          Labour Productivity Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Real-time workforce productivity monitoring and reporting
        </p>
      </div>

      <ErrorAlert message={error} onDismiss={onDismissError} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((stat, idx) => (
              <DashboardCard
                key={idx}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Recent Labour Entries
          </h2>

          <div className="space-y-3">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>
                ))}
              </div>
            ) : records.slice(0, 5).length > 0 ? (
              records.slice(0, 5).map(record => (
                <div
                  key={record._id}
                  onClick={() => navigate(`/detail/${record._id}`, { state: { record } })}
                  className="flex justify-between items-start p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {record.siteName || 'Site Entry'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {record.tradeType || 'Labour'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {record.tasksCompleted || 0} Tasks
                    </p>
                    <p className="text-sm text-slate-500">
                      {record.date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500">
                No labour entries available.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Summary
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-slate-200 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex justify-between">
                <span className="text-slate-600">Attendance Rate</span>
                <span className="font-bold text-slate-900">
                  {records.length > 0
                    ? (() => {
                        const s = aggregateStats(records)
                        return `${s.attendanceRate}%`
                      })()
                    : '0.0%'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Absenteeism Rate</span>
                <span className="font-bold text-slate-900">
                  {records.length > 0
                    ? (() => {
                        const s = aggregateStats(records)
                        return `${s.absenteeismRate}%`
                      })()
                    : '0.0%'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Productivity Rate</span>
                <span className="font-bold text-slate-900">
                  {records.length > 0
                    ? (() => {
                        const s = aggregateStats(records)
                        return `${s.productivityRate}%`
                      })()
                    : '0.0%'}
                </span>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-200">
                <span className="text-slate-600">Total Records</span>
                <span className="font-bold text-slate-900">
                  {records.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
