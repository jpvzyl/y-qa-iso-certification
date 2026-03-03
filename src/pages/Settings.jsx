import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, CheckCircle2, XCircle, Loader2, User, FolderOpen, Shield, Sparkles } from 'lucide-react'
import { testConnection } from '../lib/api'
import { useAuth } from '../lib/auth'
import GlassCard from '../components/GlassCard'
import PageHeader from '../components/PageHeader'
import AiBadge from '../components/AiBadge'

export default function Settings() {
  const { user, selectedProject } = useAuth()
  const [framework, setFramework] = useState('')
  const [frameworks, setFrameworks] = useState([])
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    setFramework(localStorage.getItem('yqa_framework_id') || '')
  }, [])

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await testConnection()
      const fw = res.data?.frameworks || res.data || []
      setFrameworks(fw)
      setTestResult({ success: true, message: `Connected successfully. Found ${fw.length} framework(s).` })
    } catch (err) {
      setTestResult({
        success: false,
        message: err.response?.data?.error || err.message || 'Connection failed.',
      })
    } finally {
      setTesting(false)
    }
  }

  const handleFrameworkChange = (e) => {
    const val = e.target.value
    setFramework(val)
    if (val) localStorage.setItem('yqa_framework_id', val)
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Account, project, and connection configuration"
      />

      {/* Account */}
      <GlassCard>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account</h3>
        {user && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <User size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            {user.role && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Role:</span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400 capitalize">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Project */}
      {selectedProject && (
        <GlassCard>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Current Project</h3>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <FolderOpen size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200">{selectedProject.name}</p>
              {selectedProject.description && (
                <p className="text-xs text-gray-500">{selectedProject.description}</p>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Framework & Connection */}
      <GlassCard>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Framework & Connection</h3>

        {frameworks.length > 0 && (
          <div className="mb-5">
            <label className="block text-xs text-gray-500 mb-2">Framework</label>
            <select
              value={framework}
              onChange={handleFrameworkChange}
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none transition-all"
            >
              <option value="">Select a framework...</option>
              {frameworks.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name || f.title} {f.version ? `(${f.version})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleTest}
          disabled={testing}
          className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700/50 disabled:opacity-50 transition-colors"
        >
          {testing ? <Loader2 size={14} className="animate-spin" /> : <SettingsIcon size={14} />}
          Test Connection
        </button>

        {testResult && (
          <div
            className={`mt-4 flex items-center gap-3 rounded-xl p-4 animate-scale-in ${
              testResult.success
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <XCircle size={18} className="text-red-400 shrink-0" />
            )}
            <p className={`text-sm ${testResult.success ? 'text-emerald-300' : 'text-red-300'}`}>
              {testResult.message}
            </p>
          </div>
        )}
      </GlassCard>

      {/* AI Features */}
      <GlassCard gradient className="gradient-accent-soft">
        <div className="flex items-start gap-4">
          <div className="rounded-xl gradient-accent p-3 glow-sm shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-white">AI Features</h3>
              <AiBadge size="sm" label="Active" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              AI-powered features are enabled for this project. The AI assistant can help with policy drafting,
              risk assessment, gap analysis recommendations, audit readiness scoring, and evidence review.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Policy Drafting', 'Risk Assessment', 'Gap Analysis', 'Audit Readiness', 'Evidence Review'].map((f) => (
                <span key={f} className="rounded-full bg-gray-800/50 border border-gray-700/50 px-2.5 py-1 text-[10px] text-gray-400">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* About */}
      <GlassCard>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">About</h3>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Y-QA ISO Certification is an AI-powered compliance management platform for ISO 27001:2022.</p>
          <p>It connects to the Y-QA API to manage controls, evidence, audits, risks, policies, and provide intelligent compliance guidance.</p>
          <div className="pt-3 border-t border-gray-800/50">
            <p className="text-[10px] text-gray-700 tracking-wide">
              Powered by <span className="text-gradient font-bold">Y-QA</span> &middot; ISO 27001:2022 &middot; AI-Enhanced
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
