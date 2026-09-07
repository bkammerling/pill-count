import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [mode, setMode] = useState('sign-in') // 'sign-in' | 'sign-up'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)

    const { error } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setSubmitting(false)

    if (error) {
      setError(error.message)
    } else if (mode === 'sign-up') {
      setInfo('Check your email to confirm your account.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          Pill Count
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {mode === 'sign-in' ? 'Sign in to your account' : 'Create an account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-emerald-600">{info}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 text-white text-sm font-medium py-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            {mode === 'sign-in' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
          className="w-full text-center text-sm text-indigo-600 mt-4 hover:underline"
        >
          {mode === 'sign-in'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
