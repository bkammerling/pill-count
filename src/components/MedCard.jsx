import { daysRemaining, isLowStock, pillsRemaining } from '../lib/meds'

export default function MedCard({ med, onRefill, onEdit, onDelete }) {
  const remaining = pillsRemaining(med)
  const days = daysRemaining(med)
  const low = isLowStock(med)

  return (
    <div
      className={`rounded-xl border p-4 bg-white shadow-sm ${
        low ? 'border-red-300' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{med.name}</h3>
          <p className="text-sm text-slate-500">
            {med.daily_dose} pill{med.daily_dose === 1 ? '' : 's'}/day
          </p>
        </div>
        {low && (
          <span className="text-xs font-medium text-red-700 bg-red-100 rounded-full px-2 py-1">
            Low stock
          </span>
        )}
      </div>

      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900">
          {remaining} <span className="text-sm font-normal text-slate-500">pills left</span>
        </p>
        <p className="text-sm text-slate-500">
          ~{Number.isFinite(days) ? `${days} days` : '—'} remaining
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Notify at{' '}
          {med.low_stock_threshold_type === 'pills'
            ? `${med.low_stock_threshold_pills} pills left`
            : `${med.low_stock_threshold_days} days left`}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onRefill(med)}
          className="flex-1 rounded-lg bg-indigo-600 text-white text-sm font-medium py-1.5 hover:bg-indigo-700"
        >
          Log refill
        </button>
        <button
          onClick={() => onEdit(med)}
          className="rounded-lg border border-slate-300 text-slate-700 text-sm font-medium px-3 py-1.5 hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(med)}
          className="rounded-lg border border-slate-300 text-slate-500 text-sm font-medium px-3 py-1.5 hover:bg-slate-50"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
