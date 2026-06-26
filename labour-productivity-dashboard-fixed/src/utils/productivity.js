// Centralized business logic for labour productivity calculations

export function calculateProductivityRate(assigned, completed) {
  const a = Number(assigned) || 0
  const c = Number(completed) || 0
  return a > 0 ? ((c / a) * 100).toFixed(1) : '0.0'
}

export function calculateAttendanceRate(total, present) {
  const t = Number(total) || 0
  const p = Number(present) || 0
  return t > 0 ? ((p / t) * 100).toFixed(1) : '0.0'
}

export function calculateAbsenteeismRate(total, absent) {
  const t = Number(total) || 0
  const a = Number(absent) || 0
  return t > 0 ? ((a / t) * 100).toFixed(1) : '0.0'
}

export function calculateAbsentWorkers(total, present) {
  const t = Number(total) || 0
  const p = Number(present) || 0
  return t >= p ? t - p : 0
}

export function getPerformanceStatus(productivityRate) {
  const rate = Number(productivityRate)
  if (rate >= 80) return 'Good'
  if (rate >= 60) return 'Average'
  return 'Low'
}

export function getPerformanceStatusColor(status) {
  const colors = {
    Good: 'bg-green-100 text-green-800',
    Average: 'bg-amber-100 text-amber-800',
    Low: 'bg-red-100 text-red-800',
  }
  return colors[status] || colors.Average
}

const DETAIL_STATUS_COLORS = {
  Good: 'bg-green-100 text-green-800',
  'Needs Attention': 'bg-amber-100 text-amber-800',
  Critical: 'bg-red-100 text-red-800',
  active: 'bg-blue-100 text-blue-800',
  archived: 'bg-slate-100 text-slate-700',
}

export function getDetailStatusColor(status) {
  return DETAIL_STATUS_COLORS[status] || DETAIL_STATUS_COLORS.active
}

// Aggregate all stats from a list of records
export function aggregateStats(records) {
  const totalWorkers = records.reduce((sum, r) => sum + (Number(r.totalWorkers) || 0), 0)
  const presentWorkers = records.reduce((sum, r) => sum + (Number(r.presentWorkers) || 0), 0)
  const absentWorkers = records.reduce((sum, r) => sum + (Number(r.absentWorkers) || 0), 0)
  const tasksAssigned = records.reduce((sum, r) => sum + (Number(r.tasksAssigned) || 0), 0)
  const tasksCompleted = records.reduce((sum, r) => sum + (Number(r.tasksCompleted) || 0), 0)
  const activeSites = new Set(records.map(r => r.siteName).filter(Boolean)).size

  return {
    totalWorkers,
    presentWorkers,
    absentWorkers,
    tasksAssigned,
    tasksCompleted,
    activeSites,
    productivityRate: calculateProductivityRate(tasksAssigned, tasksCompleted),
    attendanceRate: calculateAttendanceRate(totalWorkers, presentWorkers),
    absenteeismRate: calculateAbsenteeismRate(totalWorkers, absentWorkers),
  }
}

// Trade-wise workforce distribution
export function getTradeWiseData(records) {
  const data = {}
  records.forEach(r => {
    data[r.tradeType] = (data[r.tradeType] || 0) + (Number(r.totalWorkers) || 0)
  })
  return Object.entries(data).map(([tradeType, workforce]) => ({ tradeType, workforce }))
}

// Present vs Absent breakdown for pie chart
export function getAttendanceBreakdown(records) {
  const present = records.reduce((sum, r) => sum + (Number(r.presentWorkers) || 0), 0)
  const absent = records.reduce((sum, r) => sum + (Number(r.absentWorkers) || 0), 0)
  return [
    { name: 'Present Workers', value: present, fill: '#10b981' },
    { name: 'Absent Workers', value: absent, fill: '#ef4444' },
  ]
}

// Site-wise productivity rate
export function getSiteProductivity(records) {
  const data = {}
  records.forEach(r => {
    const siteName = r.siteName || 'Unknown Site'
    const assigned = Number(r.tasksAssigned) || 0
    const completed = Number(r.tasksCompleted) || 0
    if (!data[siteName]) data[siteName] = { assigned: 0, completed: 0 }
    data[siteName].assigned += assigned
    data[siteName].completed += completed
  })
  return Object.entries(data).map(([siteName, values]) => ({
    siteName,
    productivity: values.assigned > 0
      ? Number(((values.completed / values.assigned) * 100).toFixed(1))
      : 0,
  }))
}

// Daily productivity trend for line chart
export function getDailyTrend(records) {
  const data = {}
  records.forEach(r => {
    const date = r.date || 'Unknown'
    const assigned = Number(r.tasksAssigned) || 0
    const completed = Number(r.tasksCompleted) || 0
    if (!data[date]) data[date] = { assigned: 0, completed: 0 }
    data[date].assigned += assigned
    data[date].completed += completed
  })
  return Object.entries(data)
    .map(([date, values]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      productivity: values.assigned > 0
        ? Number(((values.completed / values.assigned) * 100).toFixed(1))
        : 0,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

// Get productivity rate for a single record
export function getRecordProductivity(record) {
  return calculateProductivityRate(record.tasksAssigned, record.tasksCompleted)
}
