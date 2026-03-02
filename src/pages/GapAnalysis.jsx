import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileSearch, AlertTriangle, Shield, FileText, Wrench } from 'lucide-react'
import { getGapAnalysis } from '../lib/api'

const GAP_TYPE_STYLES = {
  implementation: { bg: 'bg-red-500/10 border-red-500/20', icon: Wrench, color: 'text-red-400' },
  evidence: { bg: 'bg-amber-500/10 border-amber-500/20', icon: FileSearch, color: 'text-amber-400' },
  policy: { bg: 'bg-blue-500/10 border-blue-500/20', icon: FileText, color: 'text-blue-400' },
  control: { bg: 'bg-purple-500/10 border-purple-500/20', icon: Shield, color: 'text-purple-400' },
}

const SEVERITY_STYLES = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${SEVERITY_STYLES[severity] || SEVERITY_STYLES.low}`}>
      {(severity || 'low').charAt(0).toUpperCase() + (severity || 'low').slice(1)}
    </span>
  )
}

export default function GapAnalysis() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGapAnalysis()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FileSearch size={48} className="mb-3" />
        <p className="text-lg font-medium">No gap analysis data available</p>
        <p className="mt-1 text-sm text-gray-600">Ensure controls and evidence are configured, then check your API connection in <Link to="/settings" className="text-emerald-400 hover:underline">Settings</Link>.</p>
      </div>
    )
  }

  const summary = data.summary || {}
  const gaps = data.gaps || []
  const sortedGaps = [...gaps].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4)
  })

  const summaryCards = [
    { label: 'Total Gaps', value: summary.total_gaps ?? gaps.length, color: 'text-white', bg: 'bg-gray-800' },
    { label: 'Critical Gaps', value: summary.critical_gaps ?? gaps.filter((g) => g.severity === 'critical').length, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Evidence Gaps', value: summary.evidence_gaps ?? gaps.filter((g) => g.gap_type === 'evidence').length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Implementation Gaps', value: summary.implementation_gaps ?? gaps.filter((g) => g.gap_type === 'implementation').length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gap Analysis</h1>
        <p className="text-sm text-gray-500">Identify and prioritize compliance gaps for ISO 27001 certification</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`rounded-xl border border-gray-800 p-5 ${c.bg}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Gap list */}
      {sortedGaps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 border border-gray-800 py-16 text-gray-500">
          <AlertTriangle size={48} className="mb-3 text-emerald-400" />
          <p className="text-lg font-medium text-emerald-400">No gaps identified</p>
          <p className="mt-1 text-sm text-gray-600">Your organization appears to be fully compliant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedGaps.map((gap, i) => {
            const gapStyle = GAP_TYPE_STYLES[gap.gap_type] || GAP_TYPE_STYLES.control
            const Icon = gapStyle.icon
            return (
              <div
                key={gap.id || i}
                className={`rounded-xl border p-5 ${gapStyle.bg}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-gray-800 p-2 mt-0.5">
                      <Icon size={16} className={gapStyle.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        {gap.control_code && (
                          <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-mono font-bold text-gray-400">
                            {gap.control_code}
                          </span>
                        )}
                        <span className={`text-xs uppercase font-medium ${gapStyle.color}`}>
                          {(gap.gap_type || 'gap').replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{gap.description || gap.recommendation}</p>
                      {gap.recommendation && gap.description && (
                        <p className="mt-2 text-xs text-gray-500">
                          <span className="font-medium text-gray-400">Recommendation:</span> {gap.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                  <SeverityBadge severity={gap.severity || gap.priority} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
