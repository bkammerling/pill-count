const MS_PER_DAY = 1000 * 60 * 60 * 24

// Pill count is computed from the last refill rather than decremented by a
// background job: remaining = pills at refill - (daily dose * days elapsed).
export function pillsRemaining(med) {
  const daysElapsed = Math.floor(
    (Date.now() - new Date(med.last_refill_date).getTime()) / MS_PER_DAY,
  )
  const remaining = med.pills_at_last_refill - med.daily_dose * daysElapsed
  return Math.max(0, Math.round(remaining * 100) / 100)
}

export function daysRemaining(med) {
  if (med.daily_dose <= 0) return Infinity
  return Math.floor(pillsRemaining(med) / med.daily_dose)
}

export function runOutDate(med, now = new Date()) {
  if (med.daily_dose <= 0) return null

  const remaining = pillsRemaining(med)
  if (remaining <= 0) return new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const days = Math.ceil(remaining / med.daily_dose)
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days)
}

export function isLowStock(med) {
  if (med.low_stock_threshold_type === 'pills') {
    return pillsRemaining(med) <= med.low_stock_threshold_pills
  }
  return daysRemaining(med) <= med.low_stock_threshold_days
}
