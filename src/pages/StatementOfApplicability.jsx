import { useEffect, useState, useCallback } from 'react'
import { ClipboardCheck, ChevronDown, ChevronRight, Download, Wand2, Save, Loader2 } from 'lucide-react'
import ComplianceBadge from '../components/ComplianceBadge'
import { getApplicabilities, updateApplicability, generateSoA } from '../lib/api'

const THEMES = ['organizational', 'people', 'physical', 'technological']
const THEME_LABELS = { organizational: 'Organizational', people: 'People', physical: 'Physical', technological: 'Technological' }

function guessTheme(code) {
  if (!code) return 'organizational'
  const num = parseInt(code.replace(/[^\d]/g, ''), 10)
  if (num >= 5 && num <= 8) return 'organizational'
  if (num >= 9 && num <= 14) return 'people'
  if (num >= 15 && num <= 21) return 'physical'
  if (num >= 22 && num <= 39) return 'technological'
  return 'organizational'
}

export default function StatementOfApplicability() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [collapsed, setCollapsed] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    getApplicabilities()
      .then((res) => setItems(res.data?.applicabilities || res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await generateSoA()
      fetchData()
    } catch {
      // handled gracefully
    } finally {
      setGenerating(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setEditData({ applicable: item.applicable, justification: item.justification || '' })
  }

  const handleSave = async (id) => {
    setSaving(true)
    try {
      await updateApplicability(id, { control_applicability: editData })
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...editData } : i))
      )
      setEditingId(null)
    } catch {
      // handled gracefully
    } finally {
      setSaving(false)
    }
  }

  const toggleTheme = (theme) => {
    setCollapsed((prev) => ({ ...prev, [theme]: !prev[theme] }))
  }

  const grouped = THEMES.reduce((acc, theme) => {
    acc[theme] = items.filter((i) => (i.theme?.toLowerCase() || guessTheme(i.control_code || i.code)) === theme)
    return acc
  }, {})

  const handleExport = () => {
    const rows = [['Control Code', 'Title', 'Applicable', 'Justification', 'Implementation Status', 'Evidence Count']]
    items.forEach((i) => {
      rows.push([
        i.control_code || i.code || '',
        i.control_title || i.title || '',
        i.applicable ? 'Yes' : 'No',
        i.justification || '',
        i.implementation_status || '',
        String(i.evidence_count ?? 0),
      ])
    })
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'statement-of-applicability.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Statement of Applicability</h1>
          <p className="text-sm text-gray-500">Define which controls apply to your organization</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
            Generate SoA
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 border border-gray-800 py-16 text-gray-500">
          <ClipboardCheck size={48} className="mb-3" />
          <p className="text-lg font-medium">No SoA data yet</p>
          <p className="mt-1 text-sm text-gray-600">Click "Generate SoA" to populate from your framework controls.</p>
        </div>
      ) : (
        THEMES.map((theme) => {
          const themeItems = grouped[theme]
          if (themeItems.length === 0) return null
          const isCollapsed = collapsed[theme]
          return (
            <div key={theme} className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
              <button
                onClick={() => toggleTheme(theme)}
                className="flex w-full items-center justify-between px-5 py-4 hover:bg-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  {isCollapsed ? <ChevronRight size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                  <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{THEME_LABELS[theme]}</h2>
                  <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-500">{themeItems.length}</span>
                </div>
              </button>
              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-gray-800 text-left text-xs uppercase text-gray-600">
                        <th className="px-5 py-3 w-24">Code</th>
                        <th className="px-5 py-3">Title</th>
                        <th className="px-5 py-3 w-24 text-center">Applicable</th>
                        <th className="px-5 py-3">Justification</th>
                        <th className="px-5 py-3 w-36">Implementation</th>
                        <th className="px-5 py-3 w-20 text-center">Evidence</th>
                        <th className="px-5 py-3 w-20"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {themeItems.map((item) => {
                        const isEditing = editingId === item.id
                        return (
                          <tr key={item.id} className="border-t border-gray-800/50 hover:bg-gray-800/30">
                            <td className="px-5 py-3 font-mono text-xs text-gray-400">{item.control_code || item.code}</td>
                            <td className="px-5 py-3 text-gray-300">{item.control_title || item.title}</td>
                            <td className="px-5 py-3 text-center">
                              {isEditing ? (
                                <input
                                  type="checkbox"
                                  checked={editData.applicable}
                                  onChange={(e) => setEditData({ ...editData, applicable: e.target.checked })}
                                  className="h-4 w-4 rounded accent-emerald-500"
                                />
                              ) : (
                                <span className={item.applicable ? 'text-emerald-400' : 'text-gray-600'}>
                                  {item.applicable ? '✓' : '—'}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-gray-500 text-xs max-w-xs">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editData.justification}
                                  onChange={(e) => setEditData({ ...editData, justification: e.target.value })}
                                  className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-200 focus:border-emerald-500 focus:outline-none"
                                />
                              ) : (
                                <span className="line-clamp-1">{item.justification || '—'}</span>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              <ComplianceBadge status={item.implementation_status || item.compliance_status} />
                            </td>
                            <td className="px-5 py-3 text-center text-gray-500">{item.evidence_count ?? 0}</td>
                            <td className="px-5 py-3">
                              {isEditing ? (
                                <button
                                  onClick={() => handleSave(item.id)}
                                  disabled={saving}
                                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                                >
                                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="text-xs text-gray-600 hover:text-gray-300"
                                >
                                  Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
