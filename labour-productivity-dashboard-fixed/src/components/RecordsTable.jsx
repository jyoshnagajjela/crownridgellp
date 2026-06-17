import { Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react'
import { useState, useMemo } from 'react'

function RecordsTable({ records, onDelete, onViewDetail }) {
  const [sortField, setSortField] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [tradeFilter, setTradeFilter] = useState('all')

  const getProductivityRate = (record) => {
    const assigned = Number(record.tasksAssigned) || 0
    const completed = Number(record.tasksCompleted) || 0
    return assigned > 0 ? ((completed / assigned) * 100).toFixed(1) : '0.0'
  }

  const getStatus = (record) => {
    const productivity = Number(getProductivityRate(record))

    if (productivity >= 80) return 'Good'
    if (productivity >= 60) return 'Average'
    return 'Low'
  }

  const getStatusColor = (status) => {
    const colors = {
      Good: 'bg-green-100 text-green-800',
      Average: 'bg-amber-100 text-amber-800',
      Low: 'bg-red-100 text-red-800',
    }

    return colors[status] || colors.Average
  }

  const sortedRecords = useMemo(() => {
    let filtered = records

    if (searchTerm) {
      const lower = searchTerm.toLowerCase()

      filtered = filtered.filter(r =>
        (r.siteName || '').toLowerCase().includes(lower) ||
        (r.tradeType || '').toLowerCase().includes(lower) ||
        (r.date || '').toLowerCase().includes(lower)
      )
    }

    if (tradeFilter !== 'all') {
      filtered = filtered.filter(r => r.tradeType === tradeFilter)
    }

    return [...filtered].sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      }

      return sortOrder === 'asc'
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal)
    })
  }, [records, sortField, sortOrder, searchTerm, tradeFilter])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null

    return sortOrder === 'asc'
      ? <ChevronUp size={16} className="inline" />
      : <ChevronDown size={16} className="inline" />
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by site, trade, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={tradeFilter}
          onChange={(e) => setTradeFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Trades</option>
          <option value="Mason">Mason</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Welder">Welder</option>
          <option value="Electrician">Electrician</option>
          <option value="Helper">Helper</option>
          <option value="Painter">Painter</option>
          <option value="Plumber">Plumber</option>
          <option value="Foreman">Foreman</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('siteName')}
                  className="font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                >
                  Site <SortIcon field="siteName" />
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                >
                  Date <SortIcon field="date" />
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('tradeType')}
                  className="font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                >
                  Trade <SortIcon field="tradeType" />
                </button>
              </th>

              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('totalWorkers')}
                  className="font-semibold text-slate-700 hover:text-blue-600 flex items-center justify-end gap-1 ml-auto"
                >
                  Workforce <SortIcon field="totalWorkers" />
                </button>
              </th>

              <th className="px-4 py-3 text-right font-semibold text-slate-700">Present</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Absent</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Tasks</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Productivity</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedRecords.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-4 py-8 text-center text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              sortedRecords.map(record => {
                const productivityRate = getProductivityRate(record)
                const status = getStatus(record)

                return (
                  <tr key={record.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium text-slate-900">{record.siteName}</td>
                    <td className="px-4 py-3 text-slate-600">{record.date}</td>
                    <td className="px-4 py-3 text-slate-600">{record.tradeType}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">{record.totalWorkers}</td>
                    <td className="px-4 py-3 text-right text-green-700">{record.presentWorkers}</td>
                    <td className="px-4 py-3 text-right text-red-700">{record.absentWorkers}</td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {record.tasksCompleted}/{record.tasksAssigned}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      {productivityRate}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onViewDetail(record)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => onDelete(record.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-slate-600">
        Showing {sortedRecords.length} of {records.length} records
      </div>
    </div>
  )
}

export default RecordsTable