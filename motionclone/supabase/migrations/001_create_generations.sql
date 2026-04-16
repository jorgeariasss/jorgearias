create table generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  input_image_url text not null,
  input_video_url text not null,
  output_video_url text,
  replicate_prediction_id text,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  model text default 'mimic-motion',
  quality text default 'fast',
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table generations enable row level security;

create policy "Users see own generations" on generations
  for select using (auth.uid() = user_id);

create policy "Users insert own generations" on generations
  for insert with check (auth.uid() = user_id);

create policy "Users update own generations" on generations
  for update using (auth.uid() = user_id);
