import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

function AnalyticsChart({
  type,
  title,
  data,
  dataKey,
  xAxisKey,
  colors,
  formatter
}) {
  const defaultColors = [
    '#2563eb',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899'
  ]

  const chartColors = colors || defaultColors

  if (type === 'pie') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">
          {title}
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              cx="50%"
              cy="50%"
              outerRadius={95}
              innerRadius={55}
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'line') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">
          {title}
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />

            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={chartColors[0]}
              strokeWidth={3}
              dot={{
                fill: chartColors[0],
                r: 5
              }}
              activeDot={{
                r: 7
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />

          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
          />

          <Tooltip formatter={formatter} />

          <Bar
            dataKey={dataKey}
            fill={chartColors[0]}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalyticsChart