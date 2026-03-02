import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Plus, ChevronRight, Calendar, Loader2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { getAudits, createAudit } from '../lib/api'

const TYPE_COLORS = {
  internal: 'border-blue-500/30 bg-blue-500/5',
  external: 'border-purple-500/30 bg-purple-500/5',
  surveillance: 'border-amber-500/30 bg-amber-500/5',
}

export default function Audits() {
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ audit_type: 'internal', title: '', auditor: '', scope: '', scheduled_date: '' })

  const fetchAudits = () => {
    setLoading(true)
    getAudits()
      .then((res) => setAudits(res.data?.audits || res.data || []))
      .catch(() => setAudits([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAudits() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await createAudit({ compliance_audit: form })
      setShowCreate(false)
      setForm({ audit_type: 'internal', title: '', auditor: '', scope: '', scheduled_date: '' })
      fetchAudits()
    } catch {
      // handled gracefully
    } finally {
      setCreating(false)
    }
  }

  const upcoming = audits.filter((a) => a.status === 'planned' || a.status === 'scheduled')
  const past = audits.filter((a) => a.status !== 'planned' && a.status !== 'scheduled')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audits</h1>
          <p className="text-sm text-gray-500">Manage compliance audits and findings</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus size={14} />
          New Audit
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Create New Audit</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Audit title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
            <select
              value={form.audit_type}
              onChange={(e) => setForm({ ...form, audit_type: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="surveillance">Surveillance</option>
            </select>
            <input
              type="text"
              placeholder="Auditor"
              value={form.auditor}
              onChange={(e) => setForm({ ...form, auditor: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="date"
              value={form.scheduled_date}
              onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Scope"
              value={form.scope}
              onChange={(e) => setForm({ ...form, scope: e.target.value })}
              className="col-span-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {creating && <Loader2 size={14} className="animate-spin" />}
              Create
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : audits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 border border-gray-800 py-16 text-gray-500">
          <BookOpen size={48} className="mb-3" />
          <p className="text-lg font-medium">No audits yet</p>
          <p className="mt-1 text-sm text-gray-600">Create your first audit to get started.</p>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-medium text-gray-400 uppercase tracking-wide">Upcoming Audits</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((a) => (
                  <Link
                    key={a.id}
                    to={`/audits/${a.id}`}
                    className={`rounded-xl border p-5 transition-colors hover:bg-gray-800/50 ${TYPE_COLORS[a.audit_type] || 'border-gray-800 bg-gray-900'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium uppercase text-gray-500">{a.audit_type}</span>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-sm font-medium text-white mb-1">{a.title || `${a.audit_type} audit`}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      {a.scheduled_date ? new Date(a.scheduled_date).toLocaleDateString() : 'Not scheduled'}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All audits list */}
          <div>
            <h2 className="mb-3 text-sm font-medium text-gray-400 uppercase tracking-wide">All Audits</h2>
            <div className="space-y-2">
              {audits.map((a) => (
                <Link
                  key={a.id}
                  to={`/audits/${a.id}`}
                  className="flex items-center justify-between rounded-lg bg-gray-900 border border-gray-800 p-4 transition-colors hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-4">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase ${
                      a.audit_type === 'internal' ? 'bg-blue-500/20 text-blue-400' :
                      a.audit_type === 'external' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>{a.audit_type}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{a.title || `${a.audit_type} audit`}</p>
                      <p className="text-xs text-gray-600">
                        {a.auditor && `Auditor: ${a.auditor} • `}
                        {a.scheduled_date ? new Date(a.scheduled_date).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.findings_count != null && (
                      <span className="text-xs text-gray-600">{a.findings_count} findings</span>
                    )}
                    <StatusBadge status={a.status} />
                    <ChevronRight size={16} className="text-gray-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
