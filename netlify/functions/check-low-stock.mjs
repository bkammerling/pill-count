import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { daysRemaining, isLowStock, pillsRemaining } from '../../src/lib/meds.js'

export default async () => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data: meds, error } = await supabase.from('meds').select('*')
  if (error) {
    console.error('Failed to load meds:', error.message)
    return new Response('Failed to load meds', { status: 500 })
  }

  const dueForNotification = meds.filter(
    (med) => isLowStock(med) && !med.low_stock_notified_at,
  )

  const byUser = new Map()
  for (const med of dueForNotification) {
    if (!byUser.has(med.user_id)) byUser.set(med.user_id, [])
    byUser.get(med.user_id).push(med)
  }

  let emailsSent = 0

  for (const [userId, userMeds] of byUser) {
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(userId)
    if (userError || !userData?.user?.email) {
      console.error(`Could not find email for user ${userId}:`, userError?.message)
      continue
    }

    const listItems = userMeds
      .map(
        (med) =>
          `<li>${med.name} — ${pillsRemaining(med)} pills left (~${daysRemaining(med)} days)</li>`,
      )
      .join('')

    await resend.emails.send({
      from: process.env.NOTIFY_FROM_EMAIL,
      to: userData.user.email,
      subject: 'Pill Count: medication running low',
      html: `<p>The following medications are running low:</p><ul>${listItems}</ul><p>Log in to Pill Count to request a refill.</p>`,
    })

    await supabase
      .from('meds')
      .update({ low_stock_notified_at: new Date().toISOString() })
      .in(
        'id',
        userMeds.map((med) => med.id),
      )

    emailsSent += 1
  }

  return new Response(`Checked ${meds.length} meds, sent ${emailsSent} email(s).`)
}

export const config = {
  schedule: '@daily',
}
