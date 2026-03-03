import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Shield, ChevronRight, Sparkles, LayoutGrid, List } from 'lucide-react'
import ComplianceBadge from '../components/ComplianceBadge'
import PageHeader from '../components/PageHeader'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import GlassCard from '../components/GlassCard'
import { getControls } from '../lib/api'

const THEMES = [
  { key: 'all', label: 'All Controls' },
  { key: 'organizational', label: 'Organizational' },
  { key: 'people', label: 'People' },
  { key: 'physical', label: 'Physical' },
  { key: 'technological', label: 'Technological' },
]

function guessTheme(code) {
  if (!code) return 'organizational'
  const num = parseInt(code.replace(/[^\d]/g, ''), 10)
  if (num >= 5 && num <= 8) return 'organizational'
  if (num >= 9 && num <= 14) return 'people'
  if (num >= 15 && num <= 21) return 'physical'
  if (num >= 22 && num <= 39) return 'technological'
  return 'organizational'
}

function groupByTheme(controls) {
  const groups = { organizational: [], people: [], physical: [], technological: [] }
  controls.forEach((c) => {
    const theme = c.theme?.toLowerCase() || guessTheme(c.code)
    if (groups[theme]) groups[theme].push(c)
    else groups.organizational.push(c)
  })
  return groups
}

const THEME_COLORS = {
  organizational: { border: 'border-blue-500/20', bg: 'bg-blue-500/5', text: 'text-blue-400', dot: 'bg-blue-500' },
  people: { border: 'border-purple-500/20', bg: 'bg-purple-500/5', text: 'text-purple-400', dot: 'bg-purple-500' },
  physical: { border: 'border-amber-500/20', bg: 'bg-amber-500/5', text: 'text-amber-400', dot: 'bg-amber-500' },
  technological: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', text: 'text-emerald-400', dot: 'bg-emerald-500' },
}

export default function Controls() {
  const [controls, setControls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTheme, setActiveTheme] = useState('all')
  const [viewMode, setViewMode] = useState('list')

  useEffect(() => {
    getControls()
      .then((res) => setControls(res.data?.controls || res.data || []))
      .catch(() => setControls([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen message="Loading controls..." />

  const filtered = controls.filter((c) => {
    const q = search.toLowerCase()
    const matchesSearch = !q || c.code?.toLowerCase().includes(q) || c.title?.toLowerCase().includes(q)
    const matchesTheme = activeTheme === 'all' || (c.theme?.toLowerCase() || guessTheme(c.code)) === activeTheme
    return matchesSearch && matchesTheme
  })

  const grouped = groupByTheme(filtered)

  const complianceStats = {
    compliant: controls.filter((c) => c.compliance_status === 'compliant' || c.status === 'compliant').length,
    partial: controls.filter((c) => c.compliance_status === 'partial' || c.status === 'partial').length,
    non_compliant: controls.filter((c) => c.compliance_status === 'non_compliant' || c.status === 'non_compliant').length,
    not_assessed: controls.filter((c) => !c.compliance_status && !c.status || c.compliance_status === 'not_assessed' || c.status === 'not_assessed').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Controls"
        subtitle="ISO 27001:2022 Annex A controls — 93 controls across 4 themes"
      />

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Compliant', value: complianceStats.compliant, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Partial', value: complianceStats.partial, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Non-Compliant', value: complianceStats.non_compliant, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Not Assessed', value: complianceStats.not_assessed, color: 'text-gray-400', bg: 'bg-gray-800/50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl ${s.bg} border border-gray-800/30 px-4 py-3 text-center`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search by code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-900/80 py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded-xl bg-gray-900/50 border border-gray-800/50 p-1">
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTheme(t.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTheme === t.key
                    ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-gray-800 p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-1.5 ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-600'}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-600'}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600">{filtered.length} controls found</p>

      {filtered.length === 0 ? (
        <EmptyState icon={Shield} title="No controls found" description="No controls match your current search and filter criteria." />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => {
            const theme = c.theme?.toLowerCase() || guessTheme(c.code)
            const colors = THEME_COLORS[theme] || THEME_COLORS.organizational
            return (
              <Link
                key={c.id}
                to={`/controls/${c.id}`}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
              >
                <GlassCard hover padding="p-4" className={colors.border}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-md bg-gray-800 px-2 py-0.5 text-[10px] font-mono font-bold text-gray-400">
                      {c.code}
                    </span>
                    <ComplianceBadge status={c.compliance_status || c.status} />
                  </div>
                  <p className="text-sm font-medium text-gray-200 mb-2 line-clamp-2">{c.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-600">
                    <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                    <span className="capitalize">{theme}</span>
                    {c.evidence_count != null && <span>· {c.evidence_count} evidence</span>}
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      ) : (
        activeTheme === 'all' ? (
          Object.entries(grouped).map(([theme, items]) =>
            items.length > 0 ? (
              <div key={theme} className="animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`h-2 w-2 rounded-full ${THEME_COLORS[theme]?.dot}`} />
                  <h2 className={`text-sm font-semibold uppercase tracking-wide ${THEME_COLORS[theme]?.text}`}>
                    {theme} ({items.length})
                  </h2>
                </div>
                <div className="space-y-1.5">
                  {items.map((c, i) => (
                    <ControlRow key={c.id} control={c} theme={theme} delay={Math.min(i, 10) * 30} />
                  ))}
                </div>
              </div>
            ) : null
          )
        ) : (
          <div className="space-y-1.5">
            {filtered.map((c, i) => (
              <ControlRow key={c.id} control={c} theme={activeTheme} delay={Math.min(i, 10) * 30} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

function ControlRow({ control, theme, delay = 0 }) {
  const colors = THEME_COLORS[theme] || THEME_COLORS.organizational
  return (
    <Link
      to={`/controls/${control.id}`}
      className="animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <GlassCard hover padding="px-4 py-3" className={`${colors.border} flex items-center justify-between`}>
        <div className="flex items-center gap-4 min-w-0">
          <span className="shrink-0 rounded-md bg-gray-800 px-2 py-1 text-xs font-mono font-bold text-gray-300">
            {control.code}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{control.title}</p>
            {control.evidence_count != null && (
              <p className="text-[10px] text-gray-600">{control.evidence_count} evidence items</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <ComplianceBadge status={control.compliance_status || control.status} />
          <ChevronRight size={14} className="text-gray-700" />
        </div>
      </GlassCard>
    </Link>
  )
}
