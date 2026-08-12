import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { loginOwner } from '../../server/auth.functions'
import { ensureSeeded } from '../../server/seed.server'
import { createServerFn } from '@tanstack/react-start'

const seedForLogin = createServerFn({ method: 'GET' }).handler(async () => {
  await ensureSeeded()
  return null
})

export const Route = createFileRoute('/owner/login')({
  loader: async () => {
    await seedForLogin()
    return null
  },
  component: OwnerLogin,
})

function OwnerLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('owner@olivetable.dev')
  const [password, setPassword] = useState('owner123')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await loginOwner({ data: { email, password } })
      if ('error' in result && result.error) {
        setError(result.error)
      } else {
        navigate({ to: '/owner' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-stone-200 p-8">
        <h1 className="text-xl font-bold text-stone-900">Restaurant owner login</h1>
        <p className="text-sm text-stone-500 mt-1">Demo credentials are pre-filled.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div>
            <label className="text-xs text-stone-500">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-stone-300 text-sm" />
          </div>
          <div>
            <label className="text-xs text-stone-500">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-stone-300 text-sm" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-xs text-stone-400 mt-4">Other demo restaurant: owner@sakurahouse.dev / owner123</p>
      </div>
    </div>
  )
}
