function DashboardCard({ title, value, icon: Icon }) {
  const getStyles = () => {
    if (title.includes('Total')) {
      return {
        value: 'text-blue-600',
        icon: 'bg-blue-100 text-blue-600',
        line: 'from-blue-500 to-blue-700'
      }
    }

    if (title.includes('Present')) {
      return {
        value: 'text-emerald-600',
        icon: 'bg-emerald-100 text-emerald-600',
        line: 'from-emerald-500 to-green-600'
      }
    }

    if (title.includes('Absent')) {
      return {
        value: 'text-red-500',
        icon: 'bg-red-100 text-red-500',
        line: 'from-red-400 to-red-600'
      }
    }

    if (title.includes('Tasks')) {
      return {
        value: 'text-cyan-600',
        icon: 'bg-cyan-100 text-cyan-600',
        line: 'from-cyan-500 to-blue-500'
      }
    }

    if (title.includes('Productivity')) {
      return {
        value: 'text-violet-600',
        icon: 'bg-violet-100 text-violet-600',
        line: 'from-violet-500 to-purple-600'
      }
    }

    if (title.includes('Active')) {
      return {
        value: 'text-amber-600',
        icon: 'bg-amber-100 text-amber-600',
        line: 'from-amber-400 to-orange-500'
      }
    }

    return {
      value: 'text-blue-600',
      icon: 'bg-blue-100 text-blue-600',
      line: 'from-blue-500 to-blue-700'
    }
  }

  const styles = getStyles()

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {title}
          </p>

          <h3 className={`text-3xl font-bold mt-3 ${styles.value}`}>
            {value}
          </h3>
        </div>

        <div className={`${styles.icon} p-4 rounded-2xl shadow-sm`}>
          <Icon size={26} />
        </div>

      </div>

      <div
        className={`mt-6 h-1 rounded-full bg-gradient-to-r ${styles.line}`}
      ></div>

    </div>
  )
}

export default DashboardCard