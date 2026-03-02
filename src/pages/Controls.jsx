import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Shield, ChevronRight } from 'lucide-react'
import ComplianceBadge from '../components/ComplianceBadge'
import { getControls } from '../lib/api'

const THEMES = [
  { key: 'all', label: 'All Controls' },
  { key: 'organizational', label: 'Organizational' },
  { key: 'people', label: 'People' },
  { key: 'physical', label: 'Physical' },
  { key: 'technological', label: 'Technological' },
]

function groupByTheme(controls) {
  const groups = { organizational: [], people: [], physical: [], technological: [] }
  controls.forEach((c) => {
    const theme = c.theme?.toLowerCase() || guessTheme(c.code)
    if (groups[theme]) groups[theme].push(c)
    else groups.organizational.push(c)
  })
  return groups
}

function guessTheme(code) {
  if (!code) return 'organizational'
  const num = parseInt(code.replace(/[^\d]/g, ''), 10)
  if (num >= 5 && num <= 8) return 'organizational'
  if (num >= 9 && num <= 14) return 'people'
  if (num >= 15 && num <= 21) return 'physical'
  if (num >= 22 && num <= 39) return 'technological'
  return 'organizational'
}

const THEME_COLORS = {
  organizational: 'border-blue-500/30 bg-blue-500/5',
  people: 'border-purple-500/30 bg-purple-500/5',
  physical: 'border-amber-500/30 bg-amber-500/5',
  technological: 'border-emerald-500/30 bg-emerald-500/5',
}

const THEME_LABEL_COLORS = {
  organizational: 'text-blue-400',
  people: 'text-purple-400',
  physical: 'text-amber-400',
  technological: 'text-emerald-400',
}

export default function Controls() {
  const [controls, setControls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTheme, setActiveTheme] = useState('all')

  useEffect(() => {
    getControls()
      .then((res) => setControls(res.data?.controls || res.data || []))
      .catch(() => setControls([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = controls.filter((c) => {
    const q = search.toLowerCase()
    const matchesSearch = !q || c.code?.toLowerCase().includes(q) || c.title?.toLowerCase().includes(q)
    const matchesTheme = activeTheme === 'all' || (c.theme?.toLowerCase() || guessTheme(c.code)) === activeTheme
    return matchesSearch && matchesTheme
  })

  const grouped = groupByTheme(filtered)

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Controls</h1>
        <p className="text-sm text-gray-500">ISO 27001:2022 Annex A controls — 93 controls across 4 themes</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2.5 pl-9 pr-4 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-gray-900 border border-gray-800 p-1">
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTheme(t.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTheme === t.key
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-600">{filtered.length} controls found</p>

      {/* Grouped list */}
      {activeTheme === 'all' ? (
        Object.entries(grouped).map(([theme, items]) =>
          items.length > 0 ? (
            <div key={theme}>
              <h2 className={`mb-3 text-sm font-semibold uppercase tracking-wide ${THEME_LABEL_COLORS[theme]}`}>
                {theme} ({items.length})
              </h2>
              <div className="space-y-2">
                {items.map((c) => (
                  <ControlRow key={c.id} control={c} theme={theme} />
                ))}
              </div>
            </div>
          ) : null
        )
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <ControlRow key={c.id} control={c} theme={activeTheme} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
          <Shield size={40} className="mb-3" />
          <p>No controls found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

function ControlRow({ control, theme }) {
  return (
    <Link
      to={`/controls/${control.id}`}
      className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-800/50 ${THEME_COLORS[theme] || 'border-gray-800 bg-gray-900'}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <span className="shrink-0 rounded bg-gray-800 px-2 py-1 text-xs font-mono font-bold text-gray-300">
          {control.code}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate">{control.title}</p>
          {control.evidence_count != null && (
            <p className="text-xs text-gray-600">{control.evidence_count} evidence items</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <ComplianceBadge status={control.compliance_status || control.status} />
        <ChevronRight size={16} className="text-gray-600" />
      </div>
    </Link>
  )
}
