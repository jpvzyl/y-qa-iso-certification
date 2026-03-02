import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, CheckCircle2, XCircle, Loader2, User, FolderOpen } from 'lucide-react'
import { testConnection } from '../lib/api'
import { useAuth } from '../lib/auth'

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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500">Account and connection details</p>
      </div>

      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-300">Account</h3>
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <User size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">
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
      </div>

      {selectedProject && (
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Current Project</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <FolderOpen size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">{selectedProject.name}</p>
              {selectedProject.description && (
                <p className="text-xs text-gray-500">{selectedProject.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-5">
        <h3 className="text-sm font-medium text-gray-300">Framework &amp; Connection</h3>

        {frameworks.length > 0 && (
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Framework</label>
            <select
              value={framework}
              onChange={handleFrameworkChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
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

        <div className="flex items-center gap-3">
          <button
            onClick={handleTest}
            disabled={testing}
            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            {testing ? <Loader2 size={14} className="animate-spin" /> : <SettingsIcon size={14} />}
            Test Connection
          </button>
        </div>

        {testResult && (
          <div
            className={`flex items-center gap-3 rounded-lg p-4 ${
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
      </div>

      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-300">About</h3>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Y-QA ISO Certification is a compliance management dashboard for ISO 27001:2022.</p>
          <p>It connects to the Y-QA Rails API to manage controls, evidence, audits, risks, and policies.</p>
          <div className="pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-600">
              Powered by <span className="text-emerald-500 font-semibold">Y-QA</span> &middot; ISO 27001:2022
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
