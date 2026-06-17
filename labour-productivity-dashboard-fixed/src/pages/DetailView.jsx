import { ChevronLeft, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'

function DetailView({ record, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(record)

  const tradeTypes = [
    'Mason',
    'Carpenter',
    'Welder',
    'Electrician',
    'Helper',
    'Painter',
    'Plumber',
    'Foreman'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target

    setEditData(prev => {
      const updated = {
        ...prev,
        [name]: value
      }

      if (name === 'totalWorkers' || name === 'presentWorkers') {
        const total = Number(name === 'totalWorkers' ? value : updated.totalWorkers) || 0
        const present = Number(name === 'presentWorkers' ? value : updated.presentWorkers) || 0
        updated.absentWorkers = total >= present ? String(total - present) : '0'
      }

      return updated
    })
  }

  const handleSave = () => {
    onUpdate(record.id, {
      ...editData,
      totalWorkers: Number(editData.totalWorkers),
      presentWorkers: Number(editData.presentWorkers),
      absentWorkers: Number(editData.absentWorkers),
      tasksAssigned: Number(editData.tasksAssigned),
      tasksCompleted: Number(editData.tasksCompleted),
      workingHours: Number(editData.workingHours),
    })

    setIsEditing(false)
  }

  const productivityRate =
    Number(record.tasksAssigned) > 0
      ? ((Number(record.tasksCompleted) / Number(record.tasksAssigned)) * 100).toFixed(1)
      : '0.0'

  const absenteeismRate =
    Number(record.totalWorkers) > 0
      ? ((Number(record.absentWorkers) / Number(record.totalWorkers)) * 100).toFixed(1)
      : '0.0'

  const attendanceRate =
    Number(record.totalWorkers) > 0
      ? ((Number(record.presentWorkers) / Number(record.totalWorkers)) * 100).toFixed(1)
      : '0.0'

  const getPerformanceStatus = () => {
    const productivity = Number(productivityRate)

   if (productivity >= 80) return 'Good'
if (productivity >= 60) return 'Needs Attention'
return 'Critical'
  }

  const getStatusColor = (status) => {
   const colors = {
  Good: 'bg-green-100 text-green-800',
  'Needs Attention': 'bg-amber-100 text-amber-800',
  Critical: 'bg-red-100 text-red-800',
  active: 'bg-blue-100 text-blue-800',
  archived: 'bg-slate-100 text-slate-700',
}
    return colors[status] || colors.active
  }

  return (
    <div className="p-8">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Labour Productivity Detail
        </h1>

        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
          {!isEditing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Site Name</p>
                  <p className="text-2xl font-bold text-slate-900">{record.siteName}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Trade Type</p>
                  <p className="text-2xl font-bold text-slate-900">{record.tradeType}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Date</p>
                  <p className="text-xl font-semibold text-slate-900">{record.date}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Working Hours</p>
                  <p className="text-xl font-semibold text-slate-900">{record.workingHours}h</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
                    {record.status || 'active'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Total Workforce</p>
                  <p className="text-2xl font-bold text-blue-600">{record.totalWorkers}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Present Workers</p>
                  <p className="text-2xl font-bold text-green-600">{record.presentWorkers}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Absent Workers</p>
                  <p className="text-2xl font-bold text-red-600">{record.absentWorkers}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Tasks Assigned</p>
                  <p className="text-2xl font-bold text-slate-900">{record.tasksAssigned}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Tasks Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{record.tasksCompleted}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Performance Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(getPerformanceStatus())}`}>
                    {getPerformanceStatus()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="p-5 bg-green-50 rounded-lg border border-green-100">
    <p className="text-sm font-medium text-green-700 mb-2">Attendance Rate</p>
    <p className="text-3xl font-bold text-green-700">{attendanceRate}%</p>
  </div>

  <div className="p-5 bg-red-50 rounded-lg border border-red-100">
    <p className="text-sm font-medium text-red-700 mb-2">Absenteeism Rate</p>
    <p className="text-3xl font-bold text-red-700">{absenteeismRate}%</p>
  </div>

  <div className="p-5 bg-purple-50 rounded-lg border border-purple-100">
    <p className="text-sm font-medium text-purple-700 mb-2">Productivity Rate</p>
    <p className="text-3xl font-bold text-purple-700">{productivityRate}%</p>
  </div>
</div>

{Number(productivityRate) < 80 && (
  <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-medium">
    ⚠ Productivity below target of 80%. This site requires management attention.
  </div>
)}

              <div className="mb-8">
                <p className="text-sm font-medium text-slate-600 mb-2">Remarks</p>
                <p className="text-slate-900 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {record.remarks || 'No remarks added.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <Edit2 size={20} />
                  Edit
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this record?')) {
                      onDelete(record.id)
                      onClose()
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={editData.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Trade Type
                  </label>
                  <select
                    name="tradeType"
                    value={editData.tradeType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {tradeTypes.map(trade => (
                      <option key={trade} value={trade}>{trade}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Working Hours
                  </label>
                  <input
                    type="number"
                    name="workingHours"
                    value={editData.workingHours}
                    onChange={handleChange}
                    step="0.5"
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Total Workforce
                  </label>
                  <input
                    type="number"
                    name="totalWorkers"
                    value={editData.totalWorkers}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Present Workers
                  </label>
                  <input
                    type="number"
                    name="presentWorkers"
                    value={editData.presentWorkers}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Absent Workers
                  </label>
                  <input
                    type="number"
                    name="absentWorkers"
                    value={editData.absentWorkers}
                    readOnly
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Tasks Assigned
                  </label>
                  <input
                    type="number"
                    name="tasksAssigned"
                    value={editData.tasksAssigned}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Tasks Completed
                  </label>
                  <input
                    type="number"
                    name="tasksCompleted"
                    value={editData.tasksCompleted}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={editData.remarks}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditData(record)
                  }}
                  className="flex-1 bg-slate-200 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailView