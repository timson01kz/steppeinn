-- Supabase Storage setup for property photos.
-- Run this after supabase/schema.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy property_images_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

create policy property_images_owner_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and split_part(name, '/', 1) = auth.uid()::text
    and exists (
      select 1
      from properties
      where properties.id::text = split_part(name, '/', 2)
        and properties.owner_id = auth.uid()
    )
  );

create policy property_images_owner_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'property-images'
    and split_part(name, '/', 1) = auth.uid()::text
  )
  with check (
    bucket_id = 'property-images'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy property_images_owner_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and split_part(name, '/', 1) = auth.uid()::text
    and exists (
      select 1
      from properties
      where properties.id::text = split_part(name, '/', 2)
        and properties.owner_id = auth.uid()
    )
  );
