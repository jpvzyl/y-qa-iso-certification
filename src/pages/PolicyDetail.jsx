import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Edit3, Send, Loader2, Clock } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { getPolicy, updatePolicy, publishPolicy } from '../lib/api'

export default function PolicyDetail() {
  const { id } = useParams()
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const fetchPolicy = () => {
    setLoading(true)
    getPolicy(id)
      .then((res) => {
        const p = res.data?.policy || res.data
        setPolicy(p)
        setEditContent(p?.content || '')
        setEditTitle(p?.title || '')
      })
      .catch(() => setPolicy(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPolicy() }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePolicy(id, { compliance_policy: { title: editTitle, content: editContent } })
      setEditing(false)
      fetchPolicy()
    } catch {
      // handled gracefully
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await publishPolicy(id)
      fetchPolicy()
    } catch {
      // handled gracefully
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FileText size={40} className="mb-3" />
        <p>Policy not found.</p>
        <Link to="/policies" className="mt-2 text-sm text-emerald-400 hover:underline">Back to policies</Link>
      </div>
    )
  }

  const versions = policy.versions || policy.version_history || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/policies" className="rounded-lg bg-gray-900 border border-gray-800 p-2 hover:bg-gray-800">
          <ArrowLeft size={16} className="text-gray-400" />
        </Link>
        <div className="flex-1">
          {editing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xl font-bold text-white focus:border-emerald-500 focus:outline-none"
            />
          ) : (
            <h1 className="text-xl font-bold text-white">{policy.title}</h1>
          )}
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={policy.status} />
            {policy.version && <span className="text-xs text-gray-600">Version {policy.version}</span>}
            {policy.category && <span className="text-xs text-gray-600">{policy.category.replace(/_/g, ' ')}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
            >
              <Edit3 size={14} />
              Edit
            </button>
          )}
          {editing && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setEditContent(policy.content || ''); setEditTitle(policy.title || '') }}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800"
              >
                Cancel
              </button>
            </>
          )}
          {policy.status !== 'published' && !editing && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {publishing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Publish
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Content */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Content</h3>
            {editing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={20}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-200 leading-relaxed focus:border-emerald-500 focus:outline-none resize-y"
              />
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                {policy.content ? (
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                    {policy.content}
                  </div>
                ) : (
                  <p className="text-gray-600 italic">No content yet. Click Edit to add policy content.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="mb-3 text-sm font-medium text-gray-400 uppercase tracking-wide">Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Created</p>
                <p className="text-sm text-gray-200">{policy.created_at ? new Date(policy.created_at).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Last Updated</p>
                <p className="text-sm text-gray-200">{policy.updated_at ? new Date(policy.updated_at).toLocaleDateString() : '—'}</p>
              </div>
              {policy.approved_at && (
                <div>
                  <p className="text-xs text-gray-600">Approved</p>
                  <p className="text-sm text-gray-200">{new Date(policy.approved_at).toLocaleDateString()}</p>
                </div>
              )}
              {policy.review_due_date && (
                <div>
                  <p className="text-xs text-gray-600">Review Due</p>
                  <p className={`text-sm ${new Date(policy.review_due_date) <= new Date() ? 'text-red-400' : 'text-gray-200'}`}>
                    {new Date(policy.review_due_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Version history */}
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="mb-3 text-sm font-medium text-gray-400 uppercase tracking-wide">Version History</h3>
            {versions.length > 0 ? (
              <div className="space-y-2">
                {versions.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-800 p-3">
                    <Clock size={12} className="text-gray-600 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-300">v{v.version || i + 1}</p>
                      <p className="text-[10px] text-gray-600">{v.created_at ? new Date(v.created_at).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No version history available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
