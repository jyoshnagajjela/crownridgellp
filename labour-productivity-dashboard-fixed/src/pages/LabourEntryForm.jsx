import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { calculateAbsentWorkers } from '../utils/productivity'

const TRADE_TYPES = [
  'Mason',
  'Carpenter',
  'Welder',
  'Electrician',
  'Helper',
  'Painter',
  'Plumber',
  'Foreman'
]

function LabourEntryForm({ onSubmit }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    siteName: '',
    date: new Date().toISOString().split('T')[0],
    tradeType: 'Mason',
    totalWorkers: '',
    presentWorkers: '',
    tasksAssigned: '',
    tasksCompleted: '',
    workingHours: '',
    remarks: '',
    status: 'active',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => {
      const updated = { ...prev, [name]: value }

      if (name === 'totalWorkers' || name === 'presentWorkers') {
        const total = Number(name === 'totalWorkers' ? value : updated.totalWorkers) || 0
        const present = Number(name === 'presentWorkers' ? value : updated.presentWorkers) || 0
        updated.absentWorkers = calculateAbsentWorkers(total, present)
      }

      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const recordData = {
      ...formData,
      totalWorkers: Number(formData.totalWorkers),
      presentWorkers: Number(formData.presentWorkers),
      tasksAssigned: Number(formData.tasksAssigned),
      tasksCompleted: Number(formData.tasksCompleted),
      workingHours: Number(formData.workingHours),
    }

    const result = await onSubmit(recordData)
    setSubmitting(false)

    if (result && result.success) {
      navigate('/records')
    } else {
      setError(result?.message || 'Failed to save record. Please try again.')
    }
  }

  const absentWorkers = calculateAbsentWorkers(
    formData.totalWorkers,
    formData.presentWorkers
  )

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">New Labour Entry</h1>
        <p className="text-slate-600 mb-8">
          Record daily workforce productivity, attendance, and task completion details by site and trade
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-slate-900 mb-2">
                Site Name *
              </label>
              <input
                id="siteName" type="text" name="siteName" value={formData.siteName}
                onChange={handleChange} placeholder="Example: Hyderabad Site A" required disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-900 mb-2">Date *</label>
              <input
                id="date" type="date" name="date" value={formData.date}
                onChange={handleChange} required disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="tradeType" className="block text-sm font-medium text-slate-900 mb-2">Trade Type *</label>
              <select id="tradeType" name="tradeType" value={formData.tradeType} onChange={handleChange} disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                {TRADE_TYPES.map(trade => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="workingHours" className="block text-sm font-medium text-slate-900 mb-2">Working Hours *</label>
              <input
                id="workingHours" type="number" name="workingHours" value={formData.workingHours}
                onChange={handleChange} placeholder="8" min="0" step="0.5" required disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="totalWorkers" className="block text-sm font-medium text-slate-900 mb-2">Total Workforce *</label>
              <input
                id="totalWorkers" type="number" name="totalWorkers" value={formData.totalWorkers}
                onChange={handleChange} placeholder="50" min="0" required disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="presentWorkers" className="block text-sm font-medium text-slate-900 mb-2">Present Workers *</label>
              <input
                id="presentWorkers" type="number" name="presentWorkers" value={formData.presentWorkers}
                onChange={handleChange} placeholder="45" min="0" required disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="absentWorkers" className="block text-sm font-medium text-slate-900 mb-2">Absent Workers</label>
              <input
                id="absentWorkers" type="number" name="absentWorkers" value={absentWorkers}
                placeholder="Auto calculated" min="0" readOnly
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="tasksAssigned" className="block text-sm font-medium text-slate-900 mb-2">Tasks Assigned *</label>
              <input
                id="tasksAssigned" type="number" name="tasksAssigned" value={formData.tasksAssigned}
                onChange={handleChange} placeholder="20" min="0" required disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="tasksCompleted" className="block text-sm font-medium text-slate-900 mb-2">Tasks Completed *</label>
              <input
                id="tasksCompleted" type="number" name="tasksCompleted" value={formData.tasksCompleted}
                onChange={handleChange} placeholder="18" min="0" required disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="remarks" className="block text-sm font-medium text-slate-900 mb-2">Remarks</label>
            <textarea
              id="remarks" name="remarks" value={formData.remarks}
              onChange={handleChange} placeholder="Add any site updates or observations"
              rows="4" disabled={submitting}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit" disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Labour Entry'}
            </button>
            <button
              type="button" onClick={() => navigate(-1)} disabled={submitting}
              className="flex-1 bg-slate-200 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LabourEntryForm
