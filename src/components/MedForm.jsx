import { useState } from 'react'
import MedNameInput from './MedNameInput'

const emptyForm = {
  name: '',
  daily_dose: 1,
  pills_at_last_refill: 30,
  last_refill_date: new Date().toISOString().slice(0, 10),
  low_stock_threshold_type: 'days',
  low_stock_threshold_days: 7,
  low_stock_threshold_pills: 10,
}

export default function MedForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial ?? emptyForm)
  const [saving, setSaving] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...form,
      daily_dose: Number(form.daily_dose),
      pills_at_last_refill: Number(form.pills_at_last_refill),
      low_stock_threshold_days: Number(form.low_stock_threshold_days),
      low_stock_threshold_pills: Number(form.low_stock_threshold_pills),
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
          {initial ? 'Edit medication' : 'Add medication'}
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <MedNameInput
            value={form.name}
            onChange={(value) => update('name', value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pills per day
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            required
            value={form.daily_dose}
            onChange={(e) => update('daily_dose', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pills currently on hand
          </label>
          <input
            type="number"
            min="0"
            required
            value={form.pills_at_last_refill}
            onChange={(e) => update('pills_at_last_refill', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            As of date
          </label>
          <input
            type="date"
            required
            value={form.last_refill_date}
            onChange={(e) => update('last_refill_date', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notify me when low, based on
          </label>
          <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden">
            <button
              type="button"
              onClick={() => update('low_stock_threshold_type', 'days')}
              className={`px-3 py-1.5 text-sm font-medium ${
                form.low_stock_threshold_type === 'days'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Days left
            </button>
            <button
              type="button"
              onClick={() => update('low_stock_threshold_type', 'pills')}
              className={`px-3 py-1.5 text-sm font-medium border-l border-slate-300 ${
                form.low_stock_threshold_type === 'pills'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Pills left
            </button>
          </div>

          {form.low_stock_threshold_type === 'days' ? (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="1"
                required
                value={form.low_stock_threshold_days}
                onChange={(e) => update('low_stock_threshold_days', e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-500">days remaining</span>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="1"
                required
                value={form.low_stock_threshold_pills}
                onChange={(e) => update('low_stock_threshold_pills', e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-500">pills remaining</span>
            </div>
          )}
        </div>

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
