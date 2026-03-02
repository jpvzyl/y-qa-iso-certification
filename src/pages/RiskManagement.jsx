import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Plus, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StatusBadge from '../components/StatusBadge'
import { getRiskRegisters, getRiskEntries, createRiskEntry, approveRiskRegister } from '../lib/api'

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
    <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs shadow-lg">
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
    } catch {
      // handled gracefully
    } finally {
      setCreating(false)
    }
  }

  const handleApprove = async (regId) => {
    setApproving(true)
    try {
      await approveRiskRegister(regId)
      const res = await getRiskRegisters()
      setRegisters(res.data?.risk_registers || res.data || [])
    } catch {
      // handled gracefully
    } finally {
      setApproving(false)
    }
  }

  const scatterData = entries.map((e) => ({
    likelihood: e.likelihood || 1,
    impact: e.impact || 1,
    risk_score: e.risk_score || (e.likelihood || 1) * (e.impact || 1),
    title: e.title,
    risk_level: e.risk_level || 'low',
  }))

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
          <h1 className="text-2xl font-bold text-white">Risk Management</h1>
          <p className="text-sm text-gray-500">Information security risk register and treatment plans</p>
        </div>
        <div className="flex gap-2">
          {registers[0] && registers[0].status !== 'approved' && (
            <button
              onClick={() => handleApprove(registers[0].id)}
              disabled={approving}
              className="flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-600/10 disabled:opacity-50"
            >
              {approving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Approve Register
            </button>
          )}
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus size={14} />
            New Risk Entry
          </button>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-300">New Risk Entry</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Risk title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Asset"
              value={form.asset}
              onChange={(e) => setForm({ ...form, asset: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
            />
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Likelihood (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={form.likelihood}
                onChange={(e) => setForm({ ...form, likelihood: e.target.value })}
                className="w-full accent-emerald-500"
              />
              <span className="text-xs text-gray-400">{form.likelihood}</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Impact (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={form.impact}
                onChange={(e) => setForm({ ...form, impact: e.target.value })}
                className="w-full accent-emerald-500"
              />
              <span className="text-xs text-gray-400">{form.impact}</span>
            </div>
            <select
              value={form.risk_level}
              onChange={(e) => setForm({ ...form, risk_level: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={form.treatment_strategy}
              onChange={(e) => setForm({ ...form, treatment_strategy: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="mitigate">Mitigate</option>
              <option value="accept">Accept</option>
              <option value="transfer">Transfer</option>
              <option value="avoid">Avoid</option>
            </select>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
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

      {/* Risk heatmap */}
      {scatterData.length > 0 && (
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Risk Heatmap</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
              <XAxis
                type="number"
                dataKey="likelihood"
                domain={[0, 6]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                label={{ value: 'Likelihood', position: 'bottom', fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="impact"
                domain={[0, 6]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                label={{ value: 'Impact', angle: -90, position: 'left', fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip content={<HeatmapTooltip />} />
              <Scatter data={scatterData}>
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={RISK_COLORS[entry.risk_level] || RISK_COLORS.low} r={8} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Risk entries table */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 border border-gray-800 py-16 text-gray-500">
          <AlertTriangle size={48} className="mb-3" />
          <p className="text-lg font-medium">No risk entries yet</p>
          <p className="mt-1 text-sm text-gray-600">Create your first risk entry to build the risk register.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-gray-900 border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs uppercase text-gray-600">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3 w-28">Asset</th>
                <th className="px-5 py-3 w-24">Risk Level</th>
                <th className="px-5 py-3 w-20 text-center">Score</th>
                <th className="px-5 py-3 w-28">Treatment</th>
                <th className="px-5 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-5 py-3">
                    <Link to={`/risk/${e.id}`} className="text-gray-200 hover:text-emerald-400">{e.title}</Link>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{e.asset || '—'}</td>
                  <td className="px-5 py-3"><RiskLevelBadge level={e.risk_level} /></td>
                  <td className="px-5 py-3 text-center font-mono text-gray-400">{e.risk_score || (e.likelihood || 0) * (e.impact || 0)}</td>
                  <td className="px-5 py-3"><StatusBadge status={e.treatment_strategy || e.treatment_status} /></td>
                  <td className="px-5 py-3">
                    <Link to={`/risk/${e.id}`}><ChevronRight size={14} className="text-gray-600" /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
