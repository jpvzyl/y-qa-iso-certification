import { PieChart, Pie, Cell } from 'recharts'

export default function ComplianceGauge({ score = 0, size = 200 }) {
  const pct = Math.min(100, Math.max(0, score))
  const data = [
    { value: pct },
    { value: 100 - pct },
  ]

  const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx={size / 2}
          cy={size / 2}
          startAngle={90}
          endAngle={-270}
          innerRadius={size * 0.35}
          outerRadius={size * 0.45}
          dataKey="value"
          stroke="none"
        >
          <Cell fill={color} />
          <Cell fill="#1f2937" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{Math.round(pct)}%</span>
        <span className="text-xs text-gray-400">Compliance</span>
      </div>
    </div>
  )
}
