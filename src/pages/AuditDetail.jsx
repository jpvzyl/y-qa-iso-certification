import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Plus, CheckCircle2, Loader2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { getAudit, updateAudit, createFinding } from '../lib/api'

const FINDING_TYPE_STYLES = {
  major_nc: 'bg-red-500/20 text-red-400 border-red-500/30',
  minor_nc: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  observation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  opportunity: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

const FINDING_TYPE_LABELS = {
  major_nc: 'Major NC',
  minor_nc: 'Minor NC',
  observation: 'Observation',
  opportunity: 'Opportunity',
}

function FindingTypeBadge({ type }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${FINDING_TYPE_STYLES[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
      {FINDING_TYPE_LABELS[type] || type}
    </span>
  )
}

export default function AuditDetail() {
  const { id } = useParams()
  const [audit, setAudit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ finding_type: 'observation', description: '', control_code: '', severity: 'low' })

  const fetchAudit = () => {
    setLoading(true)
    getAudit(id)
      .then((res) => setAudit(res.data?.audit || res.data))
      .catch(() => setAudit(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAudit() }, [id])

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await updateAudit(id, { compliance_audit: { status: 'completed' } })
      fetchAudit()
    } catch {
      // handled gracefully
    } finally {
      setCompleting(false)
    }
  }

  const handleAddFinding = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await createFinding({ compliance_finding: { ...form, compliance_audit_id: id } })
      setShowAdd(false)
      setForm({ finding_type: 'observation', description: '', control_code: '', severity: 'low' })
      fetchAudit()
    } catch {
      // handled gracefully
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  if (!audit) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <BookOpen size={40} className="mb-3" />
        <p>Audit not found.</p>
        <Link to="/audits" className="mt-2 text-sm text-emerald-400 hover:underline">Back to audits</Link>
      </div>
    )
  }

  const findings = audit.findings || audit.compliance_findings || []
  const majorCount = findings.filter((f) => f.finding_type === 'major_nc').length
  const minorCount = findings.filter((f) => f.finding_type === 'minor_nc').length
  const obsCount = findings.filter((f) => f.finding_type === 'observation').length
  const oppCount = findings.filter((f) => f.finding_type === 'opportunity').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/audits" className="rounded-lg bg-gray-900 border border-gray-800 p-2 hover:bg-gray-800">
          <ArrowLeft size={16} className="text-gray-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{audit.title || `${audit.audit_type} Audit`}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={audit.status} />
            <span className="text-xs text-gray-500 uppercase">{audit.audit_type}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {audit.status !== 'completed' && (
            <button
              onClick={handleComplete}
              disabled={completing}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {completing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Complete Audit
            </button>
          )}
        </div>
      </div>

      {/* Audit info */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 lg:col-span-2">
          <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Audit Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-600">Auditor</p>
              <p className="text-sm text-gray-200">{audit.auditor || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Scope</p>
              <p className="text-sm text-gray-200">{audit.scope || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Scheduled Date</p>
              <p className="text-sm text-gray-200">{audit.scheduled_date ? new Date(audit.scheduled_date).toLocaleDateString() : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Completed Date</p>
              <p className="text-sm text-gray-200">{audit.completed_at ? new Date(audit.completed_at).toLocaleDateString() : '—'}</p>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Finding Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FindingTypeBadge type="major_nc" />
              <span className="text-sm font-bold text-white">{majorCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <FindingTypeBadge type="minor_nc" />
              <span className="text-sm font-bold text-white">{minorCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <FindingTypeBadge type="observation" />
              <span className="text-sm font-bold text-white">{obsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <FindingTypeBadge type="opportunity" />
              <span className="text-sm font-bold text-white">{oppCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Findings ({findings.length})</h3>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-800"
          >
            <Plus size={12} />
            Add Finding
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAddFinding} className="mb-4 rounded-lg bg-gray-800 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={form.finding_type}
                onChange={(e) => setForm({ ...form, finding_type: e.target.value })}
                className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="major_nc">Major Non-Conformity</option>
                <option value="minor_nc">Minor Non-Conformity</option>
                <option value="observation">Observation</option>
                <option value="opportunity">Opportunity for Improvement</option>
              </select>
              <input
                type="text"
                placeholder="Control code"
                value={form.control_code}
                onChange={(e) => setForm({ ...form, control_code: e.target.value })}
                className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
              />
              <textarea
                placeholder="Description"
                required
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="col-span-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={creating} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                {creating && <Loader2 size={12} className="animate-spin" />}
                Add
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-800">
                Cancel
              </button>
            </div>
          </form>
        )}

        {findings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs uppercase text-gray-600">
                  <th className="px-4 py-2 w-32">Type</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2 w-24">Control</th>
                  <th className="px-4 py-2 w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((f) => (
                  <tr key={f.id} className="border-t border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 py-3"><FindingTypeBadge type={f.finding_type} /></td>
                    <td className="px-4 py-3 text-gray-300">{f.description}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{f.control_code || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No findings recorded yet.</p>
        )}
      </div>
    </div>
  )
}
