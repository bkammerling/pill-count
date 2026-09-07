import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function AppContent() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    )
  }

  return session ? <Dashboard /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
