import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardCheck, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
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
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <ClipboardCheck size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Join Y-QA ISO Certification</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">First Name</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={set('first_name')}
                placeholder="Jane"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Last Name</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={set('last_name')}
                placeholder="Doe"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={form.password_confirmation}
              onChange={set('password_confirmation')}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Create Account
          </button>

          <p className="text-center text-xs text-gray-500 pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign in
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-[11px] text-gray-600">
          Powered by <span className="text-emerald-500 font-semibold">Y-QA</span>
        </p>
      </div>
    </div>
  )
}
