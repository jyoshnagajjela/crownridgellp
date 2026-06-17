function DashboardCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200',
    green: 'bg-gradient-to-br from-green-50 to-green-100 text-green-700 border-green-200',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200',
    amber: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 border-amber-200',
    red: 'bg-gradient-to-br from-red-50 to-red-100 text-red-700 border-red-200',
  }

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color] || colorClasses.blue} shadow-sm hover:shadow-md transition`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={24} className="opacity-50" />
      </div>
    </div>
  )
}

export default DashboardCard
