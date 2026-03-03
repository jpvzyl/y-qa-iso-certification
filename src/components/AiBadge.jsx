import { Sparkles } from 'lucide-react'

export default function AiBadge({ label = 'AI', size = 'sm', className = '' }) {
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  }
  const iconSizes = { xs: 8, sm: 10, md: 12 }

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wider
        bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20
        text-emerald-400 border border-emerald-500/30 ${sizes[size]} ${className}`}
    >
      <Sparkles size={iconSizes[size]} />
      {label}
    </span>
  )
}
