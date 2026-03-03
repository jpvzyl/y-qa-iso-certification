import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Plus, ChevronRight, AlertTriangle, Loader2, Sparkles,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/PageHeader'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import GlassCard from '../components/GlassCard'
import AiBadge from '../components/AiBadge'
import { getPolicies, createPolicy, aiPolicyDraft } from '../lib/api'

const CATEGORY_COLORS = {
  information_security: 'border-blue-500/20 bg-blue-500/5',
  access_control: 'border-purple-500/20 bg-purple-500/5',
  asset_management: 'border-cyan-500/20 bg-cyan-500/5',
  hr_security: 'border-amber-500/20 bg-amber-500/5',
  physical_security: 'border-emerald-500/20 bg-emerald-500/5',
  operations: 'border-orange-500/20 bg-orange-500/5',
  communications: 'border-pink-500/20 bg-pink-500/5',
  incident_management: 'border-red-500/20 bg-red-500/5',
}

const POLICY_CATEGORIES = [
  { value: 'information_security', label: 'Information Security' },
  { value: 'access_control', label: 'Access Control' },
  { value: 'asset_management', label: 'Asset Management' },
  { value: 'hr_security', label: 'HR Security' },
  { value: 'physical_security', label: 'Physical Security' },
  { value: 'operations', label: 'Operations' },
  { value: 'communications', label: 'Communications' },
  { value: 'incident_management', label: 'Incident Management' },
]

export default function Policies() {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [generatingAi, setGeneratingAi] = useState(false)
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
    } catch { /* best-effort */ }
    finally { setCreating(false) }
  }

  const handleAiDraft = async () => {
    if (!form.title && !form.category) return
    setGeneratingAi(true)
    try {
      const res = await aiPolicyDraft({
        title: form.title || `${form.category.replace(/_/g, ' ')} policy`,
        category: form.category,
      })
      const draft = res.data?.content || res.data?.draft || res.data?.policy?.content || ''
      const title = res.data?.title || res.data?.policy?.title || form.title
      setForm((prev) => ({ ...prev, content: draft, title: title || prev.title }))
    } catch { /* best-effort */ }
    finally { setGeneratingAi(false) }
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

  if (loading) return <LoadingScreen message="Loading policies..." />

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Policies"
        subtitle="Manage information security policies and procedures"
        aiPowered
        actions={
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            New Policy
          </button>
        }
      />

      {showCreate && (
        <div className="animate-scale-in">
          <GlassCard gradient>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Create New Policy</h3>
                <button
                  type="button"
                  onClick={handleAiDraft}
                  disabled={generatingAi}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all disabled:opacity-50"
                >
                  {generatingAi ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  AI Draft
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Policy title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none transition-all"
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none transition-all"
                >
                  {POLICY_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Policy content... Click 'AI Draft' to generate content automatically"
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="col-span-full rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none resize-y transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  Create Policy
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {policies.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No policies yet"
          description="Create your first security policy or use AI to draft one automatically."
          action={() => setShowCreate(true)}
          actionLabel="Create Policy"
        />
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="animate-fade-in">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {category.replace(/_/g, ' ')} ({items.length})
            </h2>
            <div className="space-y-2">
              {items.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/policies/${p.id}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <GlassCard
                    hover
                    padding="p-4"
                    className={`flex items-center justify-between ${CATEGORY_COLORS[category] || 'border-gray-800'}`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <FileText size={16} className="text-gray-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{p.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {p.version && <span className="text-[10px] text-gray-600">v{p.version}</span>}
                          {isReviewDue(p) && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-400">
                              <AlertTriangle size={9} />
                              Review due
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={p.status} />
                      <ChevronRight size={14} className="text-gray-700" />
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
