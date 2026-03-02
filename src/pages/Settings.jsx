import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, CheckCircle2, XCircle, Loader2, Save } from 'lucide-react'
import { testConnection, getFrameworks } from '../lib/api'

export default function Settings() {
  const [projectId, setProjectId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [framework, setFramework] = useState('')
  const [frameworks, setFrameworks] = useState([])
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setProjectId(localStorage.getItem('yqa_project_id') || '')
    setApiKey(localStorage.getItem('yqa_api_key') || '')
    setFramework(localStorage.getItem('yqa_framework_id') || '')
  }, [])

  const handleSave = () => {
    localStorage.setItem('yqa_project_id', projectId)
    localStorage.setItem('yqa_api_key', apiKey)
    if (framework) localStorage.setItem('yqa_framework_id', framework)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500">Configure your Y-QA ISO Certification connection</p>
      </div>

      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-5">
        <h3 className="text-sm font-medium text-gray-300">API Configuration</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Project ID</label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter your Y-QA project ID"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Y-QA API key"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>

          {frameworks.length > 0 && (
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
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
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Save size={14} />
            {saved ? 'Saved!' : 'Save Configuration'}
          </button>
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
          <div className={`flex items-center gap-3 rounded-lg p-4 ${
            testResult.success
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
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
