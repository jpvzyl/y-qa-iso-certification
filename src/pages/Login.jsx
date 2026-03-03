import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Loader2, Sparkles, Lock, Mail } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { login, demoLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    setDemoLoading(true)
    setTimeout(() => {
      demoLogin()
      navigate('/')
    }, 600)
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:relative lg:overflow-hidden">
        <div className="gradient-mesh absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />
        <div className="relative z-10 max-w-md text-center px-8">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl gradient-accent glow-md animate-float">
            <Shield size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Y-QA ISO Certification</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            AI-powered compliance management for ISO 27001:2022 certification
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              <span>AI-Driven</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-emerald-400" />
              <span>93 Controls</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-emerald-400" />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto lg:mx-0 mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-accent glow-sm lg:hidden">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to manage your ISO certification</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400 animate-scale-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/80 pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/80 pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-700 bg-gray-800 accent-emerald-500" />
                <span className="text-xs text-gray-500">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-emerald-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl gradient-accent py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all glow-sm"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Sign In
            </button>

            <div className="relative flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <button
              type="button"
              onClick={handleDemo}
              disabled={demoLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 disabled:opacity-50 transition-all"
            >
              {demoLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Try Interactive Demo
            </button>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Create account
              </Link>
            </p>
          </form>

          <p className="mt-8 text-center text-[10px] text-gray-700 tracking-wide">
            Powered by <span className="text-gradient font-bold">Y-QA</span> &middot; ISO 27001:2022
          </p>
        </div>
      </div>
    </div>
  )
}
