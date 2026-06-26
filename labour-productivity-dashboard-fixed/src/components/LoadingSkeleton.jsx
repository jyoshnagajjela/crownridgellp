function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <div className="h-3 bg-slate-200 rounded w-24"></div>
          <div className="h-8 bg-slate-200 rounded w-20"></div>
        </div>
        <div className="h-12 w-12 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="mt-5 h-1 bg-slate-200 rounded-full"></div>
    </div>
  )
}

function SkeletonTableRows({ rows = 5 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <div className="h-4 bg-slate-200 rounded flex-1"></div>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-48 mb-4"></div>
      <div className="h-[300px] bg-slate-200 rounded"></div>
    </div>
  )
}

function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  )
}

export { SkeletonCard, SkeletonTableRows, SkeletonChart, PageSpinner }
