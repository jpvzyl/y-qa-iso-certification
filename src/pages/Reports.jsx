import { useEffect, useState } from 'react'
import {
  FileBarChart, Download, Plus, Clock, CheckCircle2, Loader2,
  FileText, Shield, AlertTriangle, BarChart3, Sparkles, Eye,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import PageHeader from '../components/PageHeader'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import AiBadge from '../components/AiBadge'
import StatusBadge from '../components/StatusBadge'
import { getReports, generateReport } from '../lib/api'

const REPORT_TYPES = [
  { id: 'compliance_summary', label: 'Compliance Summary', icon: Shield, description: 'Overall compliance status, control coverage, and gap summary', ai: true },
  { id: 'risk_assessment', label: 'Risk Assessment Report', icon: AlertTriangle, description: 'Complete risk register with treatments and residual risk analysis', ai: true },
  { id: 'audit_report', label: 'Audit Report', icon: FileText, description: 'Internal audit findings, non-conformities, and corrective actions', ai: false },
  { id: 'soa_export', label: 'Statement of Applicability', icon: FileBarChart, description: 'Full SoA document with justifications and implementation status', ai: false },
  { id: 'gap_analysis', label: 'Gap Analysis Report', icon: BarChart3, description: 'Detailed gap analysis with AI-powered recommendations', ai: true },
  { id: 'management_review', label: 'Management Review', icon: FileBarChart, description: 'Executive summary for management review meetings', ai: true },
  { id: 'training_report', label: 'Training Compliance', icon: FileBarChart, description: 'Training completion rates and awareness program status', ai: false },
  { id: 'evidence_report', label: 'Evidence Status', icon: FileBarChart, description: 'Evidence freshness, coverage, and collection summary', ai: false },
]

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(null)
  const [showGenerator, setShowGenerator] = useState(false)

  useEffect(() => {
    getReports()
      .then((res) => setReports(res.data?.reports || res.data || []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }, [])

  const handleGenerate = async (reportType) => {
    setGenerating(reportType)
    try {
      const res = await generateReport({ report_type: reportType })
      const newReport = res.data?.report || res.data
      if (newReport) setReports((prev) => [newReport, ...prev])
      setShowGenerator(false)
    } catch { /* best-effort */ }
    finally { setGenerating(null) }
  }

  if (loading) return <LoadingScreen message="Loading reports..." />

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports"
        subtitle="Generate and manage ISO 27001 compliance reports"
        aiPowered
        actions={
          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className="flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            Generate Report
          </button>
        }
      />

      {/* Report generator */}
      {showGenerator && (
        <div className="animate-scale-in">
          <GlassCard gradient>
            <h3 className="text-sm font-semibold text-white mb-4">Select Report Type</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {REPORT_TYPES.map((reportType) => (
                <button
                  key={reportType.id}
                  onClick={() => handleGenerate(reportType.id)}
                  disabled={generating !== null}
                  className="flex flex-col items-start gap-2 rounded-xl border border-gray-800/50 bg-gray-900/50 p-4 text-left transition-all hover:bg-gray-800/50 hover:border-gray-700 disabled:opacity-50 group"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="rounded-lg bg-gray-800/50 p-2 group-hover:bg-emerald-500/10 transition-colors">
                      {generating === reportType.id ? (
                        <Loader2 size={14} className="text-emerald-400 animate-spin" />
                      ) : (
                        <reportType.icon size={14} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                      )}
                    </div>
                    {reportType.ai && <AiBadge size="xs" />}
                  </div>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{reportType.label}</p>
                  <p className="text-[10px] text-gray-600 leading-relaxed">{reportType.description}</p>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Recent reports */}
      {reports.length === 0 ? (
        <EmptyState
          icon={FileBarChart}
          title="No reports generated yet"
          description="Generate your first compliance report to track and share your ISO 27001 certification progress."
          action={() => setShowGenerator(true)}
          actionLabel="Generate Report"
        />
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Generated Reports</h3>
          {reports.map((report, i) => (
            <GlassCard
              key={report.id || i}
              hover
              padding="p-4"
              className="animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-2.5 ${
                    report.status === 'completed' ? 'bg-emerald-500/10' : 'bg-gray-800/50'
                  }`}>
                    <FileBarChart size={18} className={
                      report.status === 'completed' ? 'text-emerald-400' : 'text-gray-500'
                    } />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-200">{report.title || report.report_type?.replace(/_/g, ' ')}</p>
                      {report.ai_generated && <AiBadge size="xs" />}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {report.created_at ? new Date(report.created_at).toLocaleString() : '—'}
                      </span>
                      {report.file_size && <span>{report.file_size}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={report.status || 'completed'} />
                  {report.download_url && (
                    <a
                      href={report.download_url}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <Download size={12} />
                      Download
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* AI insight */}
      <GlassCard gradient className="gradient-accent-soft">
        <div className="flex items-start gap-4">
          <div className="rounded-xl gradient-accent p-3 glow-sm shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">AI Report Insights</h3>
              <AiBadge size="xs" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered reports analyze your current compliance posture and provide actionable recommendations.
              Generate a Compliance Summary report for a comprehensive overview of your certification readiness.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
