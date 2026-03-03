export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow = false,
  gradient = false,
  padding = 'p-6',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl border border-gray-800/80 bg-gray-900/80 backdrop-blur-sm
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${glow ? 'glow-sm' : ''}
        ${gradient ? 'gradient-border' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
