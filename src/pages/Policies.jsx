import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus, ChevronRight, AlertTriangle, Loader2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { getPolicies, createPolicy } from '../lib/api'

const CATEGORY_COLORS = {
  information_security: 'border-blue-500/30 bg-blue-500/5',
  access_control: 'border-purple-500/30 bg-purple-500/5',
  asset_management: 'border-cyan-500/30 bg-cyan-500/5',
  hr_security: 'border-amber-500/30 bg-amber-500/5',
  physical_security: 'border-emerald-500/30 bg-emerald-500/5',
  operations: 'border-orange-500/30 bg-orange-500/5',
  communications: 'border-pink-500/30 bg-pink-500/5',
  incident_management: 'border-red-500/30 bg-red-500/5',
}

export default function Policies() {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'information_security', content: '' })

  const fetchPolicies = () => {
    setLoading(true)
    getPolicies()
      .then((res) => setPolicies(res.data?.policies || res.data || []))
      .catch(() => setPolicies([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPolicies() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await createPolicy({ compliance_policy: form })
      setShowCreate(false)
      setForm({ title: '', category: 'information_security', content: '' })
      fetchPolicies()
    } catch {
      // handled gracefully
    } finally {
      setCreating(false)
    }
  }

  const grouped = policies.reduce((acc, p) => {
    const cat = p.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  const isReviewDue = (policy) => {
    if (!policy.review_due_date) return false
    return new Date(policy.review_due_date) <= new Date(Date.now() + 30 * 86400000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Policies</h1>
          <p className="text-sm text-gray-500">Manage information security policies and procedures</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus size={14} />
          New Policy
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Create New Policy</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Policy title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="information_security">Information Security</option>
              <option value="access_control">Access Control</option>
              <option value="asset_management">Asset Management</option>
              <option value="hr_security">HR Security</option>
              <option value="physical_security">Physical Security</option>
              <option value="operations">Operations</option>
              <option value="communications">Communications</option>
              <option value="incident_management">Incident Management</option>
            </select>
            <textarea
              placeholder="Policy content..."
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="col-span-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={creating} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
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
      ) : policies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 border border-gray-800 py-16 text-gray-500">
          <FileText size={48} className="mb-3" />
          <p className="text-lg font-medium">No policies yet</p>
          <p className="mt-1 text-sm text-gray-600">Create your first security policy.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              {category.replace(/_/g, ' ')} ({items.length})
            </h2>
            <div className="space-y-2">
              {items.map((p) => (
                <Link
                  key={p.id}
                  to={`/policies/${p.id}`}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-800/50 ${
                    CATEGORY_COLORS[category] || 'border-gray-800 bg-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <FileText size={16} className="text-gray-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.version && <span className="text-xs text-gray-600">v{p.version}</span>}
                        {isReviewDue(p) && (
                          <span className="flex items-center gap-1 text-xs text-amber-400">
                            <AlertTriangle size={10} />
                            Review due
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={p.status} />
                    <ChevronRight size={16} className="text-gray-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
