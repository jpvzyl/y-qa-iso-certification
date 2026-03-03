import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Plus, ChevronRight, Calendar, Loader2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import GlassCard from '../components/GlassCard'
import PageHeader from '../components/PageHeader'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import { getAudits, createAudit } from '../lib/api'

const TYPE_COLORS = {
  internal: 'border-blue-500/20',
  external: 'border-purple-500/20',
  surveillance: 'border-amber-500/20',
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
    } catch { /* best-effort */ }
    finally { setCreating(false) }
  }

  if (loading) return <LoadingScreen message="Loading audits..." />

  const upcoming = audits.filter((a) => a.status === 'planned' || a.status === 'scheduled')

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Audits"
        subtitle="Manage compliance audits and findings"
        actions={
          <button onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
            <Plus size={14} />
            New Audit
          </button>
        }
      />

      {/* Create form */}
      {showCreate && (
        <div className="animate-scale-in">
          <GlassCard gradient>
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Create New Audit</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" placeholder="Audit title" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none" />
                <select value={form.audit_type} onChange={(e) => setForm({ ...form, audit_type: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                  <option value="surveillance">Surveillance</option>
                </select>
                <input type="text" placeholder="Auditor" value={form.auditor}
                  onChange={(e) => setForm({ ...form, auditor: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none" />
                <input type="date" value={form.scheduled_date}
                  onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none" />
                <input type="text" placeholder="Scope" value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  className="col-span-full rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={creating}
                  className="flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  Create
                </button>
                <button type="button" onClick={() => setShowCreate(false)}
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800/50">Cancel</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {audits.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No audits yet"
          description="Create your first audit to start tracking compliance assessments."
          action={() => setShowCreate(true)}
          actionLabel="Create Audit"
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="animate-fade-in">
              <h2 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Upcoming Audits</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((a, i) => (
                  <Link key={a.id} to={`/audits/${a.id}`}
                    className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <GlassCard hover className={TYPE_COLORS[a.audit_type] || 'border-gray-800'}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-semibold uppercase text-gray-500">{a.audit_type}</span>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="text-sm font-medium text-white mb-1.5">{a.title || `${a.audit_type} audit`}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={11} />
                        {a.scheduled_date ? new Date(a.scheduled_date).toLocaleDateString() : 'Not scheduled'}
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="animate-fade-in">
            <h2 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">All Audits</h2>
            <div className="space-y-2">
              {audits.map((a, i) => (
                <Link key={a.id} to={`/audits/${a.id}`}
                  className="animate-fade-in" style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}>
                  <GlassCard hover padding="p-4" className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        a.audit_type === 'internal' ? 'bg-blue-500/20 text-blue-400' :
                        a.audit_type === 'external' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>{a.audit_type}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{a.title || `${a.audit_type} audit`}</p>
                        <p className="text-[10px] text-gray-600">
                          {a.auditor && `Auditor: ${a.auditor} · `}
                          {a.scheduled_date ? new Date(a.scheduled_date).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.findings_count != null && <span className="text-[10px] text-gray-600">{a.findings_count} findings</span>}
                      <StatusBadge status={a.status} />
                      <ChevronRight size={14} className="text-gray-700" />
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
