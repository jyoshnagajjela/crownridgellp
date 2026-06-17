import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import LabourEntryForm from './pages/LabourEntryForm'
import LabourRecords from './pages/LabourRecords'
import ReportsAnalytics from './pages/ReportsAnalytics'
import DetailView from './pages/DetailView'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem('labour_records')
    return savedRecords ? JSON.parse(savedRecords) : []
  })

  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    localStorage.setItem('labour_records', JSON.stringify(records))
  }, [records])

  const totalWorkforce = records.reduce(
    (sum, r) => sum + (Number(r.totalWorkers) || 0),
    0
  )

  const handleAddRecord = (newRecord) => {
    const record = {
      id: Date.now(),
      ...newRecord
    }

    setRecords([record, ...records])
    setCurrentPage('records')
  }

  const handleDeleteRecord = (id) => {
    setRecords(records.filter(r => r.id !== id))
  }

  const handleSelectRecord = (record) => {
    setSelectedRecord(record)
    setCurrentPage('detail')
  }

  const handleUpdateRecord = (id, updatedData) => {
    setRecords(records.map(r => r.id === id ? { ...r, ...updatedData } : r))
    setSelectedRecord(null)
    setCurrentPage('records')
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        totalWorkers={totalWorkforce}
      />

      <main className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && (
          <Dashboard
            records={records}
            onViewDetail={handleSelectRecord}
          />
        )}

        {currentPage === 'entry' && (
          <LabourEntryForm
            onSubmit={handleAddRecord}
            onCancel={() => setCurrentPage('dashboard')}
          />
        )}

        {currentPage === 'records' && (
          <LabourRecords
            records={records}
            onDelete={handleDeleteRecord}
            onViewDetail={handleSelectRecord}
          />
        )}

        {currentPage === 'analytics' && (
          <ReportsAnalytics records={records} />
        )}

        {currentPage === 'detail' && selectedRecord && (
          <DetailView
            record={selectedRecord}
            onClose={() => setCurrentPage('records')}
            onUpdate={handleUpdateRecord}
            onDelete={handleDeleteRecord}
          />
        )}
      </main>
    </div>
  )
}

export default App