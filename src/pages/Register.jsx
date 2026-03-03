import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardCheck, Loader2, User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      setError(data?.error || data?.errors?.join(', ') || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 gradient-mesh">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-accent glow-sm">
            <ClipboardCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Join Y-QA ISO Certification</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl bg-gray-900/80 backdrop-blur-sm border border-gray-800/80 p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400 animate-scale-in">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">First Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input type="text" required value={form.first_name} onChange={set('first_name')} placeholder="Jane"
                  className="w-full rounded-xl border border-gray-800 bg-gray-800/50 pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Last Name</label>
              <input type="text" required value={form.last_name} onChange={set('last_name')} placeholder="Doe"
                className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-800/50 pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input type="password" required value={form.password} onChange={set('password')} placeholder="Min 8 characters"
                className="w-full rounded-xl border border-gray-800 bg-gray-800/50 pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input type="password" required value={form.password_confirmation} onChange={set('password_confirmation')} placeholder="Confirm password"
                className="w-full rounded-xl border border-gray-800 bg-gray-800/50 pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl gradient-accent py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all glow-sm">
            {loading && <Loader2 size={16} className="animate-spin" />}
            Create Account
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Sign in</Link>
          </p>
        </form>

        <p className="mt-8 text-center text-[10px] text-gray-700 tracking-wide">
          Powered by <span className="text-gradient font-bold">Y-QA</span> &middot; ISO 27001:2022
        </p>
      </div>
    </div>
  )
}
