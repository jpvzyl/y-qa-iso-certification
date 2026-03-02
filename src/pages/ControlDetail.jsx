import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Shield, FileSearch, AlertTriangle, CheckCircle2 } from 'lucide-react'
import ComplianceBadge from '../components/ComplianceBadge'
import StatusBadge from '../components/StatusBadge'
import { getControl } from '../lib/api'

export default function ControlDetail() {
  const { id } = useParams()
  const [control, setControl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getControl(id)
      .then((res) => setControl(res.data?.control || res.data))
      .catch(() => setControl(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  if (!control) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Shield size={40} className="mb-3" />
        <p>Control not found.</p>
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/controls" className="rounded-lg bg-gray-900 border border-gray-800 p-2 hover:bg-gray-800">
          <ArrowLeft size={16} className="text-gray-400" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded bg-gray-800 px-2 py-1 text-sm font-mono font-bold text-emerald-400">{control.code}</span>
            <ComplianceBadge status={control.compliance_status || control.status} />
          </div>
          <h1 className="mt-1 text-xl font-bold text-white">{control.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="space-y-6 lg:col-span-2">
          {control.description && (
            <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
              <h3 className="mb-2 text-sm font-medium text-gray-400 uppercase tracking-wide">Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{control.description}</p>
            </div>
          )}

          {control.guidance && (
            <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
              <h3 className="mb-2 text-sm font-medium text-gray-400 uppercase tracking-wide">Implementation Guidance</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{control.guidance}</p>
            </div>
          )}

          {/* Evidence */}
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Evidence ({evidences.length})</h3>
              <Link to="/evidence" className="text-xs text-emerald-400 hover:underline">Manage evidence</Link>
            </div>
            {evidences.length > 0 ? (
              <div className="space-y-2">
                {evidences.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg bg-gray-800 p-3">
                    <div className="flex items-center gap-3">
                      <FileSearch size={14} className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-200">{e.title || e.name}</p>
                        <p className="text-xs text-gray-600">{e.source} • {e.collected_at ? new Date(e.collected_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <StatusBadge status={e.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No evidence linked to this control.</p>
            )}
          </div>

          {/* Findings */}
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Findings ({findings.length})</h3>
            {findings.length > 0 ? (
              <div className="space-y-2">
                {findings.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-lg bg-gray-800 p-3">
                    <div>
                      <p className="text-sm text-gray-200">{f.description || f.title}</p>
                      <p className="text-xs text-gray-600">{f.finding_type}</p>
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No findings for this control.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Applicability */}
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="mb-3 text-sm font-medium text-gray-400 uppercase tracking-wide">Applicability</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Applicable</span>
                <span className={`text-sm font-medium ${applicability.applicable !== false ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {applicability.applicable !== false ? 'Yes' : 'No'}
                </span>
              </div>
              {applicability.justification && (
                <div>
                  <span className="text-xs text-gray-600">Justification</span>
                  <p className="text-sm text-gray-300 mt-1">{applicability.justification}</p>
                </div>
              )}
            </div>
          </div>

          {/* Implementation Progress */}
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="mb-3 text-sm font-medium text-gray-400 uppercase tracking-wide">Implementation</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm font-bold text-white">{implementationPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${implementationPct}%` }}
                />
              </div>
              {control.implementation_status && (
                <StatusBadge status={control.implementation_status} />
              )}
            </div>
          </div>

          {/* Risk Treatments */}
          {riskTreatments.length > 0 && (
            <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
              <h3 className="mb-3 text-sm font-medium text-gray-400 uppercase tracking-wide">Risk Treatments</h3>
              <div className="space-y-2">
                {riskTreatments.map((rt) => (
                  <div key={rt.id} className="rounded-lg bg-gray-800 p-3">
                    <p className="text-sm text-gray-200">{rt.description || rt.title}</p>
                    <StatusBadge status={rt.treatment_type || rt.status} className="mt-1" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
