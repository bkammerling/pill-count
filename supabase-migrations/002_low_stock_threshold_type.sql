-- Run this in the Supabase SQL editor to let users choose whether "low
-- stock" is based on days remaining (existing behaviour) or pills remaining.
alter table meds add column if not exists low_stock_threshold_type text
  not null default 'days' check (low_stock_threshold_type in ('days', 'pills'));
alter table meds add column if not exists low_stock_threshold_pills numeric;
