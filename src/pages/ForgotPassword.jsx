import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react'
import { forgotPassword } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <KeyRound size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Reset Password</h1>
          <p className="mt-1 text-sm text-gray-500">We&apos;ll send you a reset link</p>
        </div>

        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 size={36} className="text-emerald-400" />
              <p className="text-sm text-gray-300">
                If an account exists for <span className="text-white font-medium">{email}</span>, you&apos;ll receive
                a password reset email shortly.
              </p>
              <Link to="/login" className="mt-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Send Reset Link
              </button>

              <p className="text-center text-xs text-gray-500 pt-1">
                Remember your password?{' '}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-600">
          Powered by <span className="text-emerald-500 font-semibold">Y-QA</span>
        </p>
      </div>
    </div>
  )
}
