-- Create storage buckets
insert into storage.buckets (id, name, public) values ('inputs', 'inputs', false);
insert into storage.buckets (id, name, public) values ('outputs', 'outputs', true);

-- Policies for 'inputs' bucket (private)
create policy "Users can upload to inputs"
  on storage.objects for insert
  with check (bucket_id = 'inputs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read own inputs"
  on storage.objects for select
  using (bucket_id = 'inputs' and auth.uid()::text = (storage.foldername(name))[1]);

-- Policies for 'outputs' bucket (public read)
create policy "Anyone can read outputs"
  on storage.objects for select
  using (bucket_id = 'outputs');

create policy "Service role can write outputs"
  on storage.objects for insert
  with check (bucket_id = 'outputs');
