import { useMemo } from 'react'
import AnalyticsChart from '../components/AnalyticsChart'

function ReportsAnalytics({ records }) {
  if (records.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600 mt-2">
            Workforce productivity, attendance, absenteeism, and site-wise insights
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No data available</h2>
          <p className="text-slate-600">Please add labour entries first to view analytics and reports.</p>
        </div>
      </div>
    )
  }

  const exportCSV = () => {
    const headers = [
      'Site Name',
      'Date',
      'Trade Type',
      'Total Workforce',
      'Present Workers',
      'Absent Workers',
      'Tasks Assigned',
      'Tasks Completed',
      'Working Hours',
      'Remarks'
    ]

    const rows = records.map(r => [
      r.siteName,
      r.date,
      r.tradeType,
      r.totalWorkers,
      r.presentWorkers,
      r.absentWorkers,
      r.tasksAssigned,
      r.tasksCompleted,
      r.workingHours,
      r.remarks || ''
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(value => `"${value}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'labour-productivity-report.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  const tradeWiseWorkforce = useMemo(() => {
    const data = {}

    records.forEach(r => {
      data[r.tradeType] = (data[r.tradeType] || 0) + (Number(r.totalWorkers) || 0)
    })

    return Object.entries(data).map(([tradeType, workforce]) => ({
      tradeType,
      workforce
    }))
  }, [records])

  const attendanceData = useMemo(() => {
    const present = records.reduce((sum, r) => sum + (Number(r.presentWorkers) || 0), 0)
    const absent = records.reduce((sum, r) => sum + (Number(r.absentWorkers) || 0), 0)

    return [
      { name: 'Present Workers', value: present, fill: '#10b981' },
      { name: 'Absent Workers', value: absent, fill: '#ef4444' },
    ]
  }, [records])

  const productivityBySite = useMemo(() => {
    const data = {}

    records.forEach(r => {
      const siteName = r.siteName || 'Unknown Site'
      const assigned = Number(r.tasksAssigned) || 0
      const completed = Number(r.tasksCompleted) || 0

      if (!data[siteName]) {
        data[siteName] = { assigned: 0, completed: 0 }
      }

      data[siteName].assigned += assigned
      data[siteName].completed += completed
    })

    return Object.entries(data).map(([siteName, values]) => ({
      siteName,
      productivity:
        values.assigned > 0
          ? Number(((values.completed / values.assigned) * 100).toFixed(1))
          : 0
    }))
  }, [records])

  const dailyProductivityTrend = useMemo(() => {
    const data = {}

    records.forEach(r => {
      const date = r.date || 'Unknown'
      const assigned = Number(r.tasksAssigned) || 0
      const completed = Number(r.tasksCompleted) || 0

      if (!data[date]) {
        data[date] = { assigned: 0, completed: 0 }
      }

      data[date].assigned += assigned
      data[date].completed += completed
    })

    return Object.entries(data)
      .map(([date, values]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        productivity:
          values.assigned > 0
            ? Number(((values.completed / values.assigned) * 100).toFixed(1))
            : 0
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [records])

  const totalWorkforce = records.reduce((sum, r) => sum + (Number(r.totalWorkers) || 0), 0)
  const presentWorkers = records.reduce((sum, r) => sum + (Number(r.presentWorkers) || 0), 0)
  const absentWorkers = records.reduce((sum, r) => sum + (Number(r.absentWorkers) || 0), 0)
  const tasksAssigned = records.reduce((sum, r) => sum + (Number(r.tasksAssigned) || 0), 0)
  const tasksCompleted = records.reduce((sum, r) => sum + (Number(r.tasksCompleted) || 0), 0)

  const attendanceRate =
    totalWorkforce > 0 ? ((presentWorkers / totalWorkforce) * 100).toFixed(1) : '0.0'

  const absenteeismRate =
    totalWorkforce > 0 ? ((absentWorkers / totalWorkforce) * 100).toFixed(1) : '0.0'

  const productivityRate =
    tasksAssigned > 0 ? ((tasksCompleted / tasksAssigned) * 100).toFixed(1) : '0.0'

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600 mt-2">
            Workforce productivity, attendance, absenteeism, and site-wise insights
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="bar"
          title="Trade-wise Workforce Count"
          data={tradeWiseWorkforce}
          dataKey="workforce"
          xAxisKey="tradeType"
          colors={['#3b82f6']}
        />

        <AnalyticsChart
          type="pie"
          title="Present vs Absent Workers"
          data={attendanceData}
          dataKey="value"
          xAxisKey="name"
        />

        <AnalyticsChart
          type="bar"
          title="Site-wise Productivity Rate"
          data={productivityBySite}
          dataKey="productivity"
          xAxisKey="siteName"
          colors={['#10b981']}
          formatter={(value) => `${value}%`}
        />

        <AnalyticsChart
          type="line"
          title="Daily Productivity Trend"
          data={dailyProductivityTrend}
          dataKey="productivity"
          xAxisKey="date"
          colors={['#8b5cf6']}
          formatter={(value) => `${value}%`}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Attendance Rate</h3>
          <p className="text-3xl font-bold text-green-600">{attendanceRate}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Absenteeism Rate</h3>
          <p className="text-3xl font-bold text-red-600">{absenteeismRate}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Productivity Rate</h3>
          <p className="text-3xl font-bold text-purple-600">{productivityRate}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Total Tasks Completed</h3>
          <p className="text-3xl font-bold text-blue-600">{tasksCompleted}</p>
        </div>
      </div>
    </div>
  )
}

export default ReportsAnalytics