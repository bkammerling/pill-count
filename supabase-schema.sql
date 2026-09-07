-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists meds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  daily_dose numeric not null check (daily_dose > 0),
  pills_at_last_refill numeric not null check (pills_at_last_refill >= 0),
  last_refill_date date not null default current_date,
  low_stock_threshold_type text not null default 'days'
    check (low_stock_threshold_type in ('days', 'pills')),
  low_stock_threshold_days integer not null default 7,
  low_stock_threshold_pills numeric,
  low_stock_notified_at timestamptz,
  created_at timestamptz not null default now()
);

alter table meds enable row level security;

create policy "Users can view their own meds"
  on meds for select
  using (auth.uid() = user_id);

create policy "Users can insert their own meds"
  on meds for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own meds"
  on meds for update
  using (auth.uid() = user_id);

create policy "Users can delete their own meds"
  on meds for delete
  using (auth.uid() = user_id);
