-- Run this in the Supabase SQL editor if you already created the meds table
-- before low-stock email notifications were added.
alter table meds add column if not exists low_stock_notified_at timestamptz;
