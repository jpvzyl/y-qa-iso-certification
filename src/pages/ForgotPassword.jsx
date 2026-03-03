import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Loader2, CheckCircle2, Mail } from 'lucide-react'
import { forgotPassword } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 gradient-mesh">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-accent glow-sm">
            <KeyRound size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="mt-1 text-sm text-gray-500">We&apos;ll send you a reset link</p>
        </div>

        {success ? (
          <div className="rounded-xl bg-gray-900/80 backdrop-blur-sm border border-gray-800/80 p-8 text-center animate-scale-in">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 mb-4">
              If an account exists for {email}, we&apos;ve sent a password reset link.
            </p>
            <Link to="/login" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-xl bg-gray-900/80 backdrop-blur-sm border border-gray-800/80 p-6 space-y-5">
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
                  className="w-full rounded-xl border border-gray-800 bg-gray-800/50 pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl gradient-accent py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all glow-sm"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Send Reset Link
            </button>

            <p className="text-center text-sm text-gray-500">
              Remember your password?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        )}

        <p className="mt-8 text-center text-[10px] text-gray-700 tracking-wide">
          Powered by <span className="text-gradient font-bold">Y-QA</span> &middot; ISO 27001:2022
        </p>
      </div>
    </div>
  )
}
