const STYLES = {
  compliant: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  partial: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  non_compliant: 'bg-red-500/20 text-red-400 border-red-500/30',
  not_assessed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const LABELS = {
  compliant: 'Compliant',
  partial: 'Partial',
  non_compliant: 'Non-Compliant',
  not_assessed: 'Not Assessed',
}

export default function ComplianceBadge({ status, className = '' }) {
  const key = status || 'not_assessed'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[key] || STYLES.not_assessed} ${className}`}
    >
      {LABELS[key] || key}
    </span>
  )
}
