const STYLES = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  planned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_progress: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  open: 'bg-red-500/20 text-red-400 border-red-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  mitigate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  accept: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  transfer: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  avoid: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function StatusBadge({ status, className = '' }) {
  const key = status || 'draft'
  const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[key] || STYLES.draft} ${className}`}
    >
      {label}
    </span>
  )
}
