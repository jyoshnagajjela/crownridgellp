import { SkeletonTableRows } from '../components/LoadingSkeleton'
import RecordsTable from '../components/RecordsTable'

function LabourRecords({ records, loading, onDelete }) {
  return (
    <div>
      <div className="bg-white border-b border-slate-200 p-8">
        <h1 className="text-4xl font-bold text-slate-900">Labour Records</h1>
        <p className="text-slate-600 mt-2">View and manage all labour entries</p>
      </div>
      <div className="bg-white">
        {loading ? (
          <div className="p-6">
            <SkeletonTableRows rows={8} />
          </div>
        ) : (
          <RecordsTable records={records} onDelete={onDelete} />
        )}
      </div>
    </div>
  )
}

export default LabourRecords
