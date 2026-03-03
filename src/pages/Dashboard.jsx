import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, FileSearch, AlertTriangle, BookOpen, ClipboardCheck,
  TrendingUp, Sparkles, Map, GraduationCap, ChevronRight,
  ArrowUpRight, ArrowDownRight, Target, Zap,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts'
import GlassCard from '../components/GlassCard'
import ProgressRing from '../components/ProgressRing'
import AiBadge from '../components/AiBadge'
import LoadingScreen from '../components/LoadingScreen'
import { getComplianceDashboard, getGapAnalysis, aiAuditReadiness } from '../lib/api'

const STATUS_COLORS = {
  compliant: '#10b981',
  partial: '#f59e0b',
  non_compliant: '#ef4444',
  not_assessed: '#6b7280',
}

function StatCard(props) {
  const { icon, label, value, trend, trendUp, color = 'text-white', link, delay = 0 } = props
  const CardIcon = icon
  const content = (
    <GlassCard hover padding="p-4" className="animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-800/80 p-2.5">
            <CardIcon size={16} className="text-gray-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
          </div>
        </div>
        {trend != null && (
          <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend}%
          </div>
        )}
      </div>
    </GlassCard>
  )
  return link ? <Link to={link}>{content}</Link> : content
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.[0]) return null
  return (
    <div className="rounded-lg border border-gray-700/50 bg-gray-900/95 backdrop-blur-xl px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-white capitalize">{label}</p>
      <p className="text-xs text-gray-400">{payload[0].value} controls</p>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [gaps, setGaps] = useState(null)
  const [readiness, setReadiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      getComplianceDashboard().catch(() => null),
      getGapAnalysis().catch(() => null),
      aiAuditReadiness().catch(() => null),
    ]).then(([dashRes, gapRes, readinessRes]) => {
      setData(dashRes?.data)
      setGaps(gapRes?.data)
      setReadiness(readinessRes?.data)
    }).catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen message="Analyzing compliance data..." />

  if (error && !data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-400 animate-fade-in">
        <div className="rounded-2xl bg-amber-500/10 p-4">
          <AlertTriangle size={48} className="text-amber-500" />
        </div>
        <p className="text-lg font-medium">Could not load dashboard data</p>
        <p className="text-sm text-gray-600">
          Check your API connection in <Link to="/settings" className="text-emerald-400 underline">Settings</Link>.
        </p>
      </div>
    )
  }

  const score = data?.compliance_score ?? 0
  const breakdown = data?.status_breakdown || {}
  const barData = Object.entries(breakdown).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value,
    key: name,
  }))

  const stats = [
    { icon: Shield, label: 'Total Controls', value: data?.total_controls ?? 0, link: '/controls', delay: 0 },
    { icon: ClipboardCheck, label: 'Applicable', value: data?.applicable_controls ?? 0, link: '/soa', delay: 50 },
    { icon: FileSearch, label: 'Evidence Items', value: data?.evidence_count ?? 0, link: '/evidence', delay: 100 },
    { icon: AlertTriangle, label: 'Open Findings', value: data?.open_findings ?? 0, color: (data?.open_findings ?? 0) > 0 ? 'text-red-400' : 'text-white', link: '/audits', delay: 150 },
    { icon: BookOpen, label: 'Upcoming Audits', value: data?.upcoming_audits ?? 0, link: '/audits', delay: 200 },
  ]

  const recentActivity = data?.recent_activity || []
  const gapSummary = gaps?.summary || {}
  const readinessScore = readiness?.readiness_score ?? readiness?.score

  const trendData = data?.compliance_trend || [
    { month: 'Aug', score: 25 }, { month: 'Sep', score: 35 }, { month: 'Oct', score: 48 },
    { month: 'Nov', score: 55 }, { month: 'Dec', score: 62 }, { month: 'Jan', score: score },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Compliance Dashboard</h1>
          <p className="text-sm text-gray-500">ISO 27001:2022 certification overview</p>
        </div>
        <Link
          to="/ai-assistant"
          className="flex items-center gap-2 rounded-xl gradient-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity glow-sm"
        >
          <Sparkles size={14} />
          AI Assistant
        </Link>
      </div>

      {/* Main metrics row */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Compliance Score */}
        <GlassCard className="lg:col-span-3 flex flex-col items-center justify-center animate-fade-in" glow>
          <ProgressRing value={score} size={160} strokeWidth={10} sublabel="Compliance" />
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs font-medium ${score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {score >= 80 ? 'On Track' : score >= 50 ? 'In Progress' : 'Needs Attention'}
            </span>
          </div>
        </GlassCard>

        {/* Status Breakdown */}
        <GlassCard className="lg:col-span-5 animate-fade-in delay-100">
          <h3 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Control Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} layout="vertical" margin={{ left: 90, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                width={90}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                {barData.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key] || '#6b7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Compliance Trend */}
        <GlassCard className="lg:col-span-4 animate-fade-in delay-200">
          <h3 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Compliance Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip content={({ active, payload }) =>
                active && payload?.[0] ? (
                  <div className="rounded-lg border border-gray-700/50 bg-gray-900/95 backdrop-blur-xl px-3 py-2 shadow-xl">
                    <p className="text-xs text-emerald-400 font-medium">{payload[0].value}% compliance</p>
                  </div>
                ) : null
              } />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#trendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Bottom section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gap Summary */}
        <GlassCard className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gap Summary</h3>
            <Link to="/gap-analysis" className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">
              View all <ChevronRight size={10} />
            </Link>
          </div>
          {gaps ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Gaps', value: gapSummary.total_gaps ?? 0, color: 'text-red-400', bg: 'bg-red-500/10' },
                { label: 'Critical', value: gapSummary.critical_gaps ?? 0, color: 'text-red-400', bg: 'bg-red-500/10' },
                { label: 'Evidence Gaps', value: gapSummary.evidence_gaps ?? 0, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                { label: 'Implementation', value: gapSummary.implementation_gaps ?? 0, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((g) => (
                <div key={g.label} className={`rounded-xl ${g.bg} border border-gray-800/30 p-3 text-center`}>
                  <p className={`text-xl font-bold ${g.color}`}>{g.value}</p>
                  <p className="text-[10px] text-gray-500">{g.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No gap analysis data available.</p>
          )}
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="animate-fade-in delay-100">
          <h3 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.slice(0, 6).map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-800/30 p-2.5">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 truncate">{item.description || item.action}</p>
                    <p className="text-[10px] text-gray-600">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-600">
              <TrendingUp size={28} className="mb-2" />
              <p className="text-xs">No recent activity yet</p>
            </div>
          )}
        </GlassCard>

        {/* AI Insights + Quick Links */}
        <div className="space-y-4">
          {/* AI audit readiness */}
          <GlassCard gradient className="gradient-accent-soft animate-fade-in delay-200">
            <div className="flex items-start gap-3">
              <div className="rounded-xl gradient-accent p-2.5 glow-sm shrink-0">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-xs font-semibold text-white">AI Audit Readiness</h3>
                  <AiBadge size="xs" />
                </div>
                {readinessScore != null ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-800">
                        <div
                          className="h-full rounded-full bg-emerald-500 animate-progress"
                          style={{ width: `${readinessScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{readinessScore}%</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {readinessScore >= 80
                        ? 'Your organization is well-prepared for certification audit.'
                        : readinessScore >= 50
                        ? 'Good progress. Focus on addressing remaining gaps.'
                        : 'Significant work needed. Prioritize critical controls.'}
                    </p>
                  </>
                ) : (
                  <p className="text-[11px] text-gray-500">Analyzing your compliance posture...</p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Quick Links */}
          <GlassCard className="animate-fade-in delay-300">
            <h3 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-1.5">
              {[
                { to: '/ai-assistant', icon: Sparkles, label: 'Ask AI Assistant', color: 'text-emerald-400' },
                { to: '/roadmap', icon: Map, label: 'Certification Roadmap', color: 'text-blue-400' },
                { to: '/reports', icon: TrendingUp, label: 'Generate Report', color: 'text-purple-400' },
                { to: '/training', icon: GraduationCap, label: 'Training Programs', color: 'text-amber-400' },
              ].map((quickLink) => (
                <Link
                  key={quickLink.to}
                  to={quickLink.to}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 transition-colors group"
                >
                  <quickLink.icon size={14} className={`${quickLink.color} transition-colors`} />
                  <span className="flex-1">{quickLink.label}</span>
                  <ChevronRight size={12} className="text-gray-700 group-hover:text-gray-500 transition-colors" />
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
