import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, FileSearch, AlertTriangle, BookOpen, ClipboardCheck, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ComplianceGauge from '../components/ComplianceGauge'
import ComplianceBadge from '../components/ComplianceBadge'
import { getComplianceDashboard, getGapAnalysis } from '../lib/api'

const STAT_ICONS = {
  controls: Shield,
  applicable: ClipboardCheck,
  evidence: FileSearch,
  findings: AlertTriangle,
  audits: BookOpen,
}

function StatCard({ icon: Icon, label, value, color = 'text-white' }) {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gray-800 p-2">
          <Icon size={18} className="text-gray-400" />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}

const STATUS_COLORS = {
  compliant: '#10b981',
  partial: '#f59e0b',
  non_compliant: '#ef4444',
  not_assessed: '#6b7280',
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [gaps, setGaps] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      getComplianceDashboard().catch(() => null),
      getGapAnalysis().catch(() => null),
    ]).then(([dashRes, gapRes]) => {
      setData(dashRes?.data)
      setGaps(gapRes?.data)
    }).catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-400">
        <AlertTriangle size={48} className="text-amber-500" />
        <p>Could not load dashboard data.</p>
        <p className="text-sm text-gray-600">Check your API connection in <Link to="/settings" className="text-emerald-400 underline">Settings</Link>.</p>
      </div>
    )
  }

  const score = data?.compliance_score ?? 0
  const breakdown = data?.status_breakdown || {}
  const barData = Object.entries(breakdown).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value, key: name }))

  const stats = [
    { icon: Shield, label: 'Total Controls', value: data?.total_controls ?? 0 },
    { icon: ClipboardCheck, label: 'Applicable', value: data?.applicable_controls ?? 0 },
    { icon: FileSearch, label: 'Evidence Items', value: data?.evidence_count ?? 0 },
    { icon: AlertTriangle, label: 'Open Findings', value: data?.open_findings ?? 0, color: data?.open_findings > 0 ? 'text-red-400' : 'text-white' },
    { icon: BookOpen, label: 'Upcoming Audits', value: data?.upcoming_audits ?? 0 },
  ]

  const recentActivity = data?.recent_activity || []
  const gapSummary = gaps?.summary || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Compliance Dashboard</h1>
        <p className="text-sm text-gray-500">ISO 27001:2022 certification overview</p>
      </div>

      {/* Score + Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 border border-gray-800 p-6">
          <ComplianceGauge score={score} size={180} />
          <p className="mt-2 text-sm text-gray-400">Overall Compliance</p>
        </div>

        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 lg:col-span-2">
          <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Control Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} layout="vertical" margin={{ left: 100 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#d1d5db' }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                {barData.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key] || '#6b7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Gap Summary + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Gap Summary</h3>
            <Link to="/gap-analysis" className="text-xs text-emerald-400 hover:underline">View all</Link>
          </div>
          {gaps ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-800 p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{gapSummary.total_gaps ?? 0}</p>
                <p className="text-xs text-gray-500">Total Gaps</p>
              </div>
              <div className="rounded-lg bg-gray-800 p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{gapSummary.critical_gaps ?? 0}</p>
                <p className="text-xs text-gray-500">Critical</p>
              </div>
              <div className="rounded-lg bg-gray-800 p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{gapSummary.evidence_gaps ?? 0}</p>
                <p className="text-xs text-gray-500">Evidence Gaps</p>
              </div>
              <div className="rounded-lg bg-gray-800 p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{gapSummary.implementation_gaps ?? 0}</p>
                <p className="text-xs text-gray-500">Implementation</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No gap analysis data available.</p>
          )}
        </div>

        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 8).map((item, i) => (
                <div key={i} className="flex items-start gap-3 border-l-2 border-gray-800 pl-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{item.description || item.action}</p>
                    <p className="text-xs text-gray-600">{item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}</p>
                  </div>
                  {item.status && <ComplianceBadge status={item.status} />}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-600">
              <TrendingUp size={32} className="mb-2" />
              <p className="text-sm">No recent activity yet.</p>
              <p className="text-xs">Activity will appear as you work on compliance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
