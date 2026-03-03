export default function ProgressRing({ value = 0, size = 120, strokeWidth = 8, color, label, sublabel }) {
  const pct = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  const fillColor = color || (pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444')

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1f2937"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${fillColor}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{Math.round(pct)}%</span>
        {sublabel && <span className="text-[10px] text-gray-500 mt-0.5">{sublabel}</span>}
      </div>
      {label && <span className="mt-2 text-xs text-gray-400">{label}</span>}
    </div>
  )
}
