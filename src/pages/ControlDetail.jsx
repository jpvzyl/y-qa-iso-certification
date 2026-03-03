import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Shield, FileSearch, AlertTriangle, Sparkles, Loader2 } from 'lucide-react'
import ComplianceBadge from '../components/ComplianceBadge'
import StatusBadge from '../components/StatusBadge'
import GlassCard from '../components/GlassCard'
import LoadingScreen from '../components/LoadingScreen'
import AiBadge from '../components/AiBadge'
import { getControl, aiControlSuggestions } from '../lib/api'

export default function ControlDetail() {
  const { id } = useParams()
  const [control, setControl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [loadingAi, setLoadingAi] = useState(false)

  useEffect(() => {
    getControl(id)
      .then((res) => setControl(res.data?.control || res.data))
      .catch(() => setControl(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAiSuggestions = async () => {
    setLoadingAi(true)
    try {
      const res = await aiControlSuggestions(id)
      setAiSuggestions(res.data)
    } catch { /* graceful fallback */ }
    finally { setLoadingAi(false) }
  }

  if (loading) return <LoadingScreen message="Loading control details..." />

  if (!control) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 animate-fade-in">
        <div className="rounded-2xl bg-gray-800/50 p-4 mb-3">
          <Shield size={40} className="text-gray-600" />
        </div>
        <p className="text-lg font-medium">Control not found</p>
        <Link to="/controls" className="mt-2 text-sm text-emerald-400 hover:underline">Back to controls</Link>
      </div>
    )
  }

  const evidences = control.evidences || control.control_evidences || []
  const findings = control.findings || control.compliance_findings || []
  const applicability = control.applicability || control.control_applicability || {}
  const riskTreatments = control.risk_treatments || []
  const implementationPct = control.implementation_percentage ?? control.implementation_progress ?? 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/controls" className="rounded-xl bg-gray-900/80 border border-gray-800/80 p-2.5 hover:bg-gray-800/50 transition-colors">
          <ArrowLeft size={16} className="text-gray-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-gray-800 px-2.5 py-1 text-sm font-mono font-bold text-emerald-400">{control.code}</span>
            <ComplianceBadge status={control.compliance_status || control.status} />
          </div>
          <h1 className="mt-1 text-xl font-bold text-white">{control.title}</h1>
        </div>
        <button
          onClick={handleAiSuggestions}
          disabled={loadingAi}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 px-3 py-2 text-xs font-medium text-emerald-400 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all disabled:opacity-50"
        >
          {loadingAi ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          AI Suggestions
        </button>
      </div>

      {/* AI suggestions */}
      {aiSuggestions && (
        <GlassCard gradient className="gradient-accent-soft animate-scale-in">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">AI Implementation Suggestions</h3>
            <AiBadge size="xs" />
          </div>
          <div className="space-y-2">
            {(aiSuggestions.suggestions || [aiSuggestions.suggestion || aiSuggestions.message]).map((s, i) => (
              <p key={i} className="text-xs text-gray-400 leading-relaxed">{typeof s === 'string' ? s : s?.description || s?.text}</p>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {control.description && (
            <GlassCard>
              <h3 className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{control.description}</p>
            </GlassCard>
          )}

          {control.guidance && (
            <GlassCard>
              <h3 className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Implementation Guidance</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{control.guidance}</p>
            </GlassCard>
          )}

          {/* Evidence */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Evidence ({evidences.length})</h3>
              <Link to="/evidence" className="text-[10px] text-emerald-400 hover:underline">Manage evidence</Link>
            </div>
            {evidences.length > 0 ? (
              <div className="space-y-2">
                {evidences.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                    <div className="flex items-center gap-3">
                      <FileSearch size={14} className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-200">{e.title || e.name}</p>
                        <p className="text-[10px] text-gray-600">{e.source} &middot; {e.collected_at ? new Date(e.collected_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <StatusBadge status={e.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No evidence linked to this control.</p>
            )}
          </GlassCard>

          {/* Findings */}
          <GlassCard>
            <h3 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Findings ({findings.length})</h3>
            {findings.length > 0 ? (
              <div className="space-y-2">
                {findings.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                    <div>
                      <p className="text-sm text-gray-200">{f.description || f.title}</p>
                      <p className="text-[10px] text-gray-600">{f.finding_type}</p>
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No findings for this control.</p>
            )}
          </GlassCard>
        </div>

        <div className="space-y-6">
          {/* Applicability */}
          <GlassCard>
            <h3 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Applicability</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Applicable</span>
                <span className={`text-sm font-medium ${applicability.applicable !== false ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {applicability.applicable !== false ? 'Yes' : 'No'}
                </span>
              </div>
              {applicability.justification && (
                <div>
                  <span className="text-[10px] text-gray-600">Justification</span>
                  <p className="text-sm text-gray-300 mt-1">{applicability.justification}</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Implementation */}
          <GlassCard>
            <h3 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Implementation</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm font-bold text-white">{implementationPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-emerald-500 animate-progress transition-all"
                  style={{ width: `${implementationPct}%` }}
                />
              </div>
              {control.implementation_status && <StatusBadge status={control.implementation_status} />}
            </div>
          </GlassCard>

          {/* Risk Treatments */}
          {riskTreatments.length > 0 && (
            <GlassCard>
              <h3 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Treatments</h3>
              <div className="space-y-2">
                {riskTreatments.map((rt) => (
                  <div key={rt.id} className="rounded-xl bg-gray-800/30 p-3">
                    <p className="text-sm text-gray-200">{rt.description || rt.title}</p>
                    <StatusBadge status={rt.treatment_type || rt.status} className="mt-1" />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
