import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import MedCard from '../components/MedCard'
import MedForm from '../components/MedForm'
import RefillForm from '../components/RefillForm'
import { supabase } from '../lib/supabase'
import { isLowStock } from '../lib/meds'

export default function Dashboard() {
  const { session } = useAuth()
  const [meds, setMeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // med being edited, or 'new'
  const [refilling, setRefilling] = useState(null) // med being refilled

  async function loadMeds() {
    setLoading(true)
    const { data } = await supabase
      .from('meds')
      .select('*')
      .order('created_at', { ascending: true })
    setMeds(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadMeds()
  }, [])

  async function handleSaveMed(values) {
    if (editing && editing !== 'new') {
      await supabase.from('meds').update(values).eq('id', editing.id)
    } else {
      await supabase
        .from('meds')
        .insert({ ...values, user_id: session.user.id })
    }
    setEditing(null)
    loadMeds()
  }

  async function handleRefill(values) {
    await supabase.from('meds').update(values).eq('id', refilling.id)
    setRefilling(null)
    loadMeds()
  }

  async function handleDelete(med) {
    if (!confirm(`Delete ${med.name}?`)) return
    await supabase.from('meds').delete().eq('id', med.id)
    loadMeds()
  }

  const lowStockCount = meds.filter(isLowStock).length

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Pill Count</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {lowStockCount > 0 && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">
            {lowStockCount} medication{lowStockCount === 1 ? ' is' : 's are'} running low —
            time to request a refill.
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-slate-500">
            Your medications
          </h2>
          <button
            onClick={() => setEditing('new')}
            className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-3 py-1.5 hover:bg-indigo-700"
          >
            + Add medication
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : meds.length === 0 ? (
          <p className="text-sm text-slate-500">
            No medications yet. Add one to start tracking.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {meds.map((med) => (
              <MedCard
                key={med.id}
                med={med}
                onRefill={setRefilling}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {editing && (
        <MedForm
          initial={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={handleSaveMed}
        />
      )}

      {refilling && (
        <RefillForm
          med={refilling}
          onCancel={() => setRefilling(null)}
          onSave={handleRefill}
        />
      )}
    </div>
  )
}
