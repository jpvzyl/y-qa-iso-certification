import { useEffect, useState } from 'react'
import { FileSearch, Upload, RefreshCw, Filter, Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { getEvidences, createEvidence, collectEvidence } from '../lib/api'

const SOURCE_STYLES = {
  y_qa_platform: 'bg-emerald-500/20 text-emerald-400',
  github: 'bg-purple-500/20 text-purple-400',
  manual: 'bg-blue-500/20 text-blue-400',
  ci_cd: 'bg-amber-500/20 text-amber-400',
  cloud: 'bg-cyan-500/20 text-cyan-400',
}

function SourceBadge({ source }) {
  const label = (source || 'unknown').replace(/_/g, ' ')
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${SOURCE_STYLES[source] || 'bg-gray-500/20 text-gray-400'}`}>
      {label}
    </span>
  )
}

function FreshnessIndicator({ status, collectedAt }) {
  if (!collectedAt) return <span className="text-gray-600 text-xs">—</span>
  const days = Math.floor((Date.now() - new Date(collectedAt).getTime()) / 86400000)
  if (days < 30) return <CheckCircle2 size={14} className="text-emerald-400" />
  if (days < 90) return <AlertTriangle size={14} className="text-amber-400" />
  return <XCircle size={14} className="text-red-400" />
}

export default function Evidence() {
  const [evidences, setEvidences] = useState([])
  const [loading, setLoading] = useState(true)
  const [collecting, setCollecting] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [filterSource, setFilterSource] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [uploadData, setUploadData] = useState({ title: '', control_code: '', evidence_type: 'document', notes: '' })
  const [uploading, setUploading] = useState(false)

  const fetchEvidences = () => {
    setLoading(true)
    const params = {}
    if (filterSource !== 'all') params.source = filterSource
    if (filterStatus !== 'all') params.status = filterStatus
    getEvidences(params)
      .then((res) => setEvidences(res.data?.evidences || res.data || []))
      .catch(() => setEvidences([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEvidences() }, [filterSource, filterStatus])

  const handleCollect = async () => {
    setCollecting(true)
    try {
      await collectEvidence()
      fetchEvidences()
    } catch {
      // handled gracefully
    } finally {
      setCollecting(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      await createEvidence({ control_evidence: { ...uploadData, source: 'manual' } })
      setShowUpload(false)
      setUploadData({ title: '', control_code: '', evidence_type: 'document', notes: '' })
      fetchEvidences()
    } catch {
      // handled gracefully
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Evidence</h1>
          <p className="text-sm text-gray-500">Manage compliance evidence for ISO 27001 controls</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCollect}
            disabled={collecting}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {collecting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Auto-Collect
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
          >
            <Upload size={14} />
            Upload Manual
          </button>
        </div>
      </div>

      {/* Upload form */}
      {showUpload && (
        <form onSubmit={handleUpload} className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Upload Manual Evidence</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Title"
              required
              value={uploadData.title}
              onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Control code (e.g. A.5.1)"
              value={uploadData.control_code}
              onChange={(e) => setUploadData({ ...uploadData, control_code: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
            <select
              value={uploadData.evidence_type}
              onChange={(e) => setUploadData({ ...uploadData, evidence_type: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="document">Document</option>
              <option value="screenshot">Screenshot</option>
              <option value="log">Log</option>
              <option value="configuration">Configuration</option>
              <option value="report">Report</option>
            </select>
            <input
              type="text"
              placeholder="Notes"
              value={uploadData.notes}
              onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Save Evidence
            </button>
            <button
              type="button"
              onClick={() => setShowUpload(false)}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-600" />
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Sources</option>
            <option value="y_qa_platform">Y-QA Platform</option>
            <option value="github">GitHub</option>
            <option value="manual">Manual</option>
            <option value="ci_cd">CI/CD</option>
            <option value="cloud">Cloud</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="valid">Valid</option>
            <option value="stale">Stale</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <span className="text-xs text-gray-600 self-center">{evidences.length} items</span>
      </div>

      {/* Evidence table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : evidences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 border border-gray-800 py-16 text-gray-500">
          <FileSearch size={48} className="mb-3" />
          <p className="text-lg font-medium">No evidence found</p>
          <p className="mt-1 text-sm text-gray-600">Use Auto-Collect or upload manual evidence.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-gray-900 border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs uppercase text-gray-600">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3 w-24">Control</th>
                <th className="px-5 py-3 w-28">Source</th>
                <th className="px-5 py-3 w-28">Type</th>
                <th className="px-5 py-3 w-28">Collected</th>
                <th className="px-5 py-3 w-20">Status</th>
                <th className="px-5 py-3 w-12 text-center">Fresh</th>
              </tr>
            </thead>
            <tbody>
              {evidences.map((e) => (
                <tr key={e.id} className="border-t border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-5 py-3 text-gray-200">{e.title || e.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{e.control_code || '—'}</td>
                  <td className="px-5 py-3"><SourceBadge source={e.source} /></td>
                  <td className="px-5 py-3 text-xs text-gray-500">{e.evidence_type || e.type || '—'}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {e.collected_at ? new Date(e.collected_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-5 py-3 text-center"><FreshnessIndicator collectedAt={e.collected_at} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
