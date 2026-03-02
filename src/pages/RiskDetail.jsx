import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Plus, Loader2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { getRiskEntry, updateRiskEntry } from '../lib/api'

export default function RiskDetail() {
  const { id } = useParams()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ description: '', treatment_type: 'mitigate', due_date: '', responsible: '' })

  useEffect(() => {
    getRiskEntry(id)
      .then((res) => setEntry(res.data?.risk_entry || res.data))
      .catch(() => setEntry(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddTreatment = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await updateRiskEntry(id, {
        risk_entry: {
          risk_treatments_attributes: [form],
        },
      })
      const res = await getRiskEntry(id)
      setEntry(res.data?.risk_entry || res.data)
      setShowAdd(false)
      setForm({ description: '', treatment_type: 'mitigate', due_date: '', responsible: '' })
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

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <AlertTriangle size={40} className="mb-3" />
        <p>Risk entry not found.</p>
        <Link to="/risk" className="mt-2 text-sm text-emerald-400 hover:underline">Back to risk management</Link>
      </div>
    )
  }

  const treatments = entry.risk_treatments || entry.treatments || []
  const riskScore = entry.risk_score || (entry.likelihood || 0) * (entry.impact || 0)
  const scoreColor = riskScore >= 20 ? 'text-red-400' : riskScore >= 10 ? 'text-amber-400' : 'text-emerald-400'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/risk" className="rounded-lg bg-gray-900 border border-gray-800 p-2 hover:bg-gray-800">
          <ArrowLeft size={16} className="text-gray-400" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{entry.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={entry.risk_level} />
            {entry.treatment_strategy && <StatusBadge status={entry.treatment_strategy} />}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Details */}
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Risk Details</h3>
            {entry.description && (
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">{entry.description}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-600">Asset</p>
                <p className="text-sm text-gray-200">{entry.asset || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Likelihood</p>
                <p className="text-sm text-gray-200">{entry.likelihood ?? '—'} / 5</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Impact</p>
                <p className="text-sm text-gray-200">{entry.impact ?? '—'} / 5</p>
              </div>
            </div>
          </div>

          {/* Treatment plans */}
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Treatment Plans ({treatments.length})</h3>
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-800"
              >
                <Plus size={12} />
                Add Treatment
              </button>
            </div>

            {showAdd && (
              <form onSubmit={handleAddTreatment} className="mb-4 rounded-lg bg-gray-800 p-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <textarea
                    placeholder="Treatment description"
                    required
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="col-span-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none resize-none"
                  />
                  <select
                    value={form.treatment_type}
                    onChange={(e) => setForm({ ...form, treatment_type: e.target.value })}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="mitigate">Mitigate</option>
                    <option value="accept">Accept</option>
                    <option value="transfer">Transfer</option>
                    <option value="avoid">Avoid</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Responsible"
                    value={form.responsible}
                    onChange={(e) => setForm({ ...form, responsible: e.target.value })}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
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

            {treatments.length > 0 ? (
              <div className="space-y-2">
                {treatments.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg bg-gray-800 p-4">
                    <div>
                      <p className="text-sm text-gray-200">{t.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        {t.responsible && <span>Responsible: {t.responsible}</span>}
                        {t.due_date && <span>Due: {new Date(t.due_date).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <StatusBadge status={t.treatment_type || t.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No treatment plans defined yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 text-center">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Risk Score</p>
            <p className={`text-4xl font-bold ${scoreColor}`}>{riskScore}</p>
            <p className="text-xs text-gray-600 mt-1">{entry.likelihood} x {entry.impact}</p>
          </div>

          {entry.control_code && (
            <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
              <h3 className="mb-2 text-sm font-medium text-gray-400 uppercase tracking-wide">Linked Control</h3>
              <Link to="/controls" className="text-sm text-emerald-400 hover:underline">{entry.control_code}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
