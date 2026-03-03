import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileSearch, AlertTriangle, Shield, FileText, Wrench, Sparkles, Loader2 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import PageHeader from '../components/PageHeader'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import AiBadge from '../components/AiBadge'
import { getGapAnalysis, aiGapRecommendations } from '../lib/api'

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
  const [aiRecs, setAiRecs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingAi, setLoadingAi] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    Promise.all([
      getGapAnalysis().catch(() => null),
      aiGapRecommendations().catch(() => null),
    ]).then(([gapRes, aiRes]) => {
      if (gapRes?.data) setData(gapRes.data)
      if (aiRes?.data) setAiRecs(aiRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const handleRefreshAi = async () => {
    setLoadingAi(true)
    try {
      const res = await aiGapRecommendations()
      if (res?.data) setAiRecs(res.data)
    } catch { /* best-effort */ }
    finally { setLoadingAi(false) }
  }

  if (loading) return <LoadingScreen message="Analyzing compliance gaps..." />

  if (!data) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Gap Analysis" subtitle="Identify and prioritize compliance gaps for ISO 27001 certification" aiPowered />
        <div className="mt-6">
          <EmptyState
            icon={FileSearch}
            title="No gap analysis data available"
            description="Ensure controls and evidence are configured, then check your API connection in Settings."
          >
            <Link to="/settings" className="mt-3 text-sm text-emerald-400 hover:underline">Go to Settings</Link>
          </EmptyState>
        </div>
      </div>
    )
  }

  const summary = data.summary || {}
  const gaps = data.gaps || []
  const sortedGaps = [...gaps].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4)
  })

  const filteredGaps = activeFilter === 'all'
    ? sortedGaps
    : sortedGaps.filter((g) => g.gap_type === activeFilter || g.severity === activeFilter)

  const summaryCards = [
    { label: 'Total Gaps', value: summary.total_gaps ?? gaps.length, color: 'text-white', bg: 'bg-gray-800/50' },
    { label: 'Critical', value: summary.critical_gaps ?? gaps.filter((g) => g.severity === 'critical').length, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Evidence Gaps', value: summary.evidence_gaps ?? gaps.filter((g) => g.gap_type === 'evidence').length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Implementation', value: summary.implementation_gaps ?? gaps.filter((g) => g.gap_type === 'implementation').length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ]

  const recommendations = aiRecs?.recommendations || aiRecs?.gaps || []

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Gap Analysis"
        subtitle="Identify and prioritize compliance gaps for ISO 27001 certification"
        aiPowered
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
        {summaryCards.map((c) => (
          <GlassCard key={c.label} hover padding="p-5">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* AI Recommendations */}
      {(recommendations.length > 0 || loadingAi) && (
        <GlassCard gradient className="gradient-accent-soft animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg gradient-accent p-2 glow-sm">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">AI Gap Recommendations</h3>
                  <AiBadge size="xs" />
                </div>
                <p className="text-[10px] text-gray-500">Prioritized actions to close compliance gaps</p>
              </div>
            </div>
            <button
              onClick={handleRefreshAi}
              disabled={loadingAi}
              className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-[10px] text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors disabled:opacity-50"
            >
              {loadingAi ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
              Refresh
            </button>
          </div>
          <div className="space-y-2">
            {recommendations.slice(0, 4).map((rec, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-900/40 p-3">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[9px] font-bold text-emerald-400 shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs text-gray-300">{rec.title || rec.description || rec}</p>
                  {rec.impact && <p className="text-[10px] text-gray-600 mt-0.5">Impact: {rec.impact}</p>}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Filter */}
      <div className="flex gap-1 rounded-xl bg-gray-900/50 border border-gray-800/50 p-1 overflow-x-auto">
        {['all', 'critical', 'high', 'medium', 'low', 'implementation', 'evidence', 'policy'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === f ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Gap list */}
      {filteredGaps.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title={gaps.length === 0 ? 'No gaps identified' : 'No gaps match filter'}
          description={gaps.length === 0 ? 'Your organization appears to be fully compliant.' : 'Try a different filter.'}
        />
      ) : (
        <div className="space-y-3">
          {filteredGaps.map((gap, i) => {
            const gapStyle = GAP_TYPE_STYLES[gap.gap_type] || GAP_TYPE_STYLES.control
            const Icon = gapStyle.icon
            return (
              <GlassCard
                key={gap.id || i}
                hover
                padding="p-5"
                className={`${gapStyle.bg} animate-fade-in`}
                style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-gray-800/50 p-2 mt-0.5">
                      <Icon size={16} className={gapStyle.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        {gap.control_code && (
                          <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs font-mono font-bold text-gray-400">
                            {gap.control_code}
                          </span>
                        )}
                        <span className={`text-[10px] uppercase font-semibold ${gapStyle.color}`}>
                          {(gap.gap_type || 'gap').replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{gap.description || gap.recommendation}</p>
                      {gap.recommendation && gap.description && (
                        <div className="mt-2 rounded-lg bg-gray-800/30 p-2.5">
                          <p className="text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-400">Recommendation:</span> {gap.recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <SeverityBadge severity={gap.severity || gap.priority} />
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
