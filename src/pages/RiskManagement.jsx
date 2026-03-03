import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Plus, ChevronRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StatusBadge from '../components/StatusBadge'
import GlassCard from '../components/GlassCard'
import PageHeader from '../components/PageHeader'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import AiBadge from '../components/AiBadge'
import { getRiskRegisters, getRiskEntries, createRiskEntry, approveRiskRegister, aiRiskAssessment } from '../lib/api'

const RISK_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#10b981',
}

function RiskLevelBadge({ level }) {
  const colors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[level] || colors.low}`}>
      {(level || 'low').charAt(0).toUpperCase() + (level || 'low').slice(1)}
    </span>
  )
}

function HeatmapTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-gray-700/50 bg-gray-900/95 backdrop-blur-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-white">{d.title}</p>
      <p className="text-gray-400">Likelihood: {d.likelihood} | Impact: {d.impact}</p>
      <p className="text-gray-400">Score: {d.risk_score}</p>
    </div>
  )
}

export default function RiskManagement() {
  const [registers, setRegisters] = useState([])
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [approving, setApproving] = useState(false)
  const [aiAssessing, setAiAssessing] = useState(false)
  const [form, setForm] = useState({
    title: '', asset: '', description: '', likelihood: 3, impact: 3, risk_level: 'medium', treatment_strategy: 'mitigate',
  })

  useEffect(() => {
    Promise.all([
      getRiskRegisters().catch(() => ({ data: [] })),
      getRiskEntries().catch(() => ({ data: [] })),
    ]).then(([regRes, entRes]) => {
      setRegisters(regRes.data?.risk_registers || regRes.data || [])
      setEntries(entRes.data?.risk_entries || entRes.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const registerId = registers[0]?.id
      const data = { ...form, likelihood: Number(form.likelihood), impact: Number(form.impact) }
      if (registerId) data.risk_register_id = registerId
      await createRiskEntry({ risk_entry: data })
      const res = await getRiskEntries()
      setEntries(res.data?.risk_entries || res.data || [])
      setShowCreate(false)
      setForm({ title: '', asset: '', description: '', likelihood: 3, impact: 3, risk_level: 'medium', treatment_strategy: 'mitigate' })
    } catch { /* best-effort */ }
    finally { setCreating(false) }
  }

  const handleApprove = async (regId) => {
    setApproving(true)
    try {
      await approveRiskRegister(regId)
      const res = await getRiskRegisters()
      setRegisters(res.data?.risk_registers || res.data || [])
    } catch { /* best-effort */ }
    finally { setApproving(false) }
  }

  const handleAiAssess = async () => {
    setAiAssessing(true)
    try {
      const res = await aiRiskAssessment({ title: form.title, asset: form.asset, description: form.description })
      const assessment = res.data
      if (assessment) {
        setForm((prev) => ({
          ...prev,
          likelihood: assessment.likelihood ?? prev.likelihood,
          impact: assessment.impact ?? prev.impact,
          risk_level: assessment.risk_level ?? prev.risk_level,
          treatment_strategy: assessment.treatment_strategy ?? prev.treatment_strategy,
        }))
      }
    } catch { /* best-effort */ }
    finally { setAiAssessing(false) }
  }

  const scatterData = entries.map((e) => ({
    likelihood: e.likelihood || 1,
    impact: e.impact || 1,
    risk_score: e.risk_score || (e.likelihood || 1) * (e.impact || 1),
    title: e.title,
    risk_level: e.risk_level || 'low',
  }))

  const riskSummary = {
    critical: entries.filter((e) => e.risk_level === 'critical').length,
    high: entries.filter((e) => e.risk_level === 'high').length,
    medium: entries.filter((e) => e.risk_level === 'medium').length,
    low: entries.filter((e) => e.risk_level === 'low').length,
  }

  if (loading) return <LoadingScreen message="Loading risk data..." />

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Management"
        subtitle="Information security risk register and treatment plans"
        aiPowered
        actions={
          <div className="flex gap-2">
            {registers[0] && registers[0].status !== 'approved' && (
              <button
                onClick={() => handleApprove(registers[0].id)}
                disabled={approving}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50 transition-colors"
              >
                {approving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Approve Register
              </button>
            )}
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={14} />
              New Risk Entry
            </button>
          </div>
        }
      />

      {/* Risk summary */}
      <div className="grid grid-cols-4 gap-3 stagger">
        {[
          { label: 'Critical', value: riskSummary.critical, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'High', value: riskSummary.high, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Medium', value: riskSummary.medium, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Low', value: riskSummary.low, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((s) => (
          <GlassCard key={s.label} hover padding="p-4 text-center" className={s.bg.replace('bg-', 'border-').replace('/10', '/20')}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="animate-scale-in">
          <GlassCard gradient>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">New Risk Entry</h3>
                <button
                  type="button"
                  onClick={handleAiAssess}
                  disabled={aiAssessing || (!form.title && !form.description)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all disabled:opacity-50"
                >
                  {aiAssessing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  AI Assess Risk
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text" placeholder="Risk title" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none transition-all"
                />
                <input
                  type="text" placeholder="Asset" value={form.asset}
                  onChange={(e) => setForm({ ...form, asset: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none transition-all"
                />
                <div>
                  <label className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>Likelihood</span>
                    <span className="font-mono text-emerald-400">{form.likelihood}</span>
                  </label>
                  <input type="range" min="1" max="5" value={form.likelihood}
                    onChange={(e) => setForm({ ...form, likelihood: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>Impact</span>
                    <span className="font-mono text-emerald-400">{form.impact}</span>
                  </label>
                  <input type="range" min="1" max="5" value={form.impact}
                    onChange={(e) => setForm({ ...form, impact: e.target.value })} className="w-full" />
                </div>
                <select value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                  <option value="low">Low</option><option value="medium">Medium</option>
                  <option value="high">High</option><option value="critical">Critical</option>
                </select>
                <select value={form.treatment_strategy} onChange={(e) => setForm({ ...form, treatment_strategy: e.target.value })}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none">
                  <option value="mitigate">Mitigate</option><option value="accept">Accept</option>
                  <option value="transfer">Transfer</option><option value="avoid">Avoid</option>
                </select>
                <textarea placeholder="Description" value={form.description} rows={2}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="col-span-full rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none resize-none" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={creating}
                  className="flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  Create
                </button>
                <button type="button" onClick={() => setShowCreate(false)}
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800/50">
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Risk heatmap */}
      {scatterData.length > 0 && (
        <GlassCard className="animate-fade-in">
          <h3 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Heatmap</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
              <XAxis type="number" dataKey="likelihood" domain={[0, 6]} ticks={[1, 2, 3, 4, 5]}
                tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}
                label={{ value: 'Likelihood', position: 'bottom', fill: '#4b5563', fontSize: 11 }} />
              <YAxis type="number" dataKey="impact" domain={[0, 6]} ticks={[1, 2, 3, 4, 5]}
                tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}
                label={{ value: 'Impact', angle: -90, position: 'left', fill: '#4b5563', fontSize: 11 }} />
              <Tooltip content={<HeatmapTooltip />} />
              <Scatter data={scatterData}>
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={RISK_COLORS[entry.risk_level] || RISK_COLORS.low} r={8} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Risk entries table */}
      {entries.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No risk entries yet"
          description="Create your first risk entry to build the risk register."
          action={() => setShowCreate(true)}
          actionLabel="Add Risk Entry"
        />
      ) : (
        <div className="overflow-x-auto">
          <GlassCard padding="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800/50 text-left text-[10px] uppercase text-gray-600 tracking-wider">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3 w-28">Asset</th>
                  <th className="px-5 py-3 w-24">Risk Level</th>
                  <th className="px-5 py-3 w-20 text-center">Score</th>
                  <th className="px-5 py-3 w-28">Treatment</th>
                  <th className="px-5 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={e.id}
                    className="border-t border-gray-800/30 hover:bg-gray-800/20 transition-colors animate-fade-in"
                    style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                  >
                    <td className="px-5 py-3">
                      <Link to={`/risk/${e.id}`} className="text-gray-200 hover:text-emerald-400 transition-colors">{e.title}</Link>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">{e.asset || '—'}</td>
                    <td className="px-5 py-3"><RiskLevelBadge level={e.risk_level} /></td>
                    <td className="px-5 py-3 text-center font-mono text-gray-400">{e.risk_score || (e.likelihood || 0) * (e.impact || 0)}</td>
                    <td className="px-5 py-3"><StatusBadge status={e.treatment_strategy || e.treatment_status} /></td>
                    <td className="px-5 py-3">
                      <Link to={`/risk/${e.id}`}><ChevronRight size={14} className="text-gray-700" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
