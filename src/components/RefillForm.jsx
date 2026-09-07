import { useState } from 'react'
import { pillsRemaining } from '../lib/meds'

export default function RefillForm({ med, onCancel, onSave }) {
  const [pills, setPills] = useState('')
  const [saving, setSaving] = useState(false)
  const currentlyLeft = pillsRemaining(med)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await onSave({
      pills_at_last_refill: currentlyLeft + Number(pills),
      last_refill_date: new Date().toISOString().slice(0, 10),
    })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Log refill — {med.name}
        </h2>
        <p className="text-sm text-slate-500">
          Currently ~{currentlyLeft} left. How many new pills did you get?
        </p>

        <input
          type="number"
          min="1"
          required
          autoFocus
          value={pills}
          onChange={(e) => setPills(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-indigo-600 text-white text-sm font-medium py-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
