-- SteppeInn current schema cleanup migration.
-- Idempotent where PostgreSQL/Supabase support it.

create extension if not exists "pgcrypto";

do $$
begin
  create type user_role as enum ('client', 'owner', 'admin');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type property_status as enum ('draft', 'pending', 'published', 'rejected', 'changes_requested', 'expired');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter type property_status add value if not exists 'changes_requested';
exception
  when undefined_object then null;
end;
$$;

do $$
begin
  create type booking_status as enum ('pending', 'confirmed', 'declined', 'cancelled', 'completed');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type location_category as enum ('attraction', 'shopping', 'transport', 'business', 'recreation');
exception
  when duplicate_object then null;
end;
$$;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'client',
  full_name text,
  phone text,
  preferred_language text default 'RU',
  city text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles
  add column if not exists role user_role not null default 'client',
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists preferred_language text default 'RU',
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role user_role := 'client';
begin
  if new.raw_user_meta_data ->> 'role' in ('client', 'owner', 'admin') then
    requested_role := (new.raw_user_meta_data ->> 'role')::user_role;
  end if;

  insert into public.profiles (id, role, full_name, preferred_language, country)
  values (
    new.id,
    requested_role,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(nullif(upper(new.raw_user_meta_data ->> 'preferred_language'), ''), 'RU'),
    coalesce(nullif(new.raw_user_meta_data ->> 'country', ''), 'Kazakhstan')
  )
  on conflict (id) do update
  set
    role = excluded.role,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    preferred_language = coalesce(excluded.preferred_language, profiles.preferred_language),
    country = coalesce(excluded.country, profiles.country),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  region text,
  country text not null default 'Kazakhstan',
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references cities(id) on delete cascade,
  name text not null,
  category location_category,
  description text,
  description_en text,
  description_ru text,
  description_kk text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  metadata jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table locations
  add column if not exists city_id uuid references cities(id) on delete cascade,
  add column if not exists category location_category,
  add column if not exists description text,
  add column if not exists description_en text,
  add column if not exists description_ru text,
  add column if not exists description_kk text,
  add column if not exists latitude numeric(9, 6),
  add column if not exists longitude numeric(9, 6),
  add column if not exists metadata jsonb,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists tariffs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  metadata jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  city_id uuid references cities(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  tariff_id uuid references tariffs(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  description_en text,
  description_ru text,
  description_kk text,
  address text,
  city text not null default 'Almaty',
  property_type text not null,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  status property_status not null default 'draft',
  submitted_at timestamptz,
  moderated_at timestamptz,
  moderated_by uuid references profiles(id) on delete set null,
  moderation_notes text,
  published_at timestamptz,
  expires_at timestamptz,
  billing_status text,
  billing_period_started_at timestamptz,
  billing_period_ends_at timestamptz,
  rating numeric(2, 1),
  price_from integer,
  amenities text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table properties
  add column if not exists owner_id uuid references profiles(id) on delete cascade,
  add column if not exists city_id uuid references cities(id) on delete set null,
  add column if not exists location_id uuid references locations(id) on delete set null,
  add column if not exists tariff_id uuid references tariffs(id) on delete set null,
  add column if not exists short_description text,
  add column if not exists description text,
  add column if not exists description_en text,
  add column if not exists description_ru text,
  add column if not exists description_kk text,
  add column if not exists address text,
  add column if not exists city text not null default 'Almaty',
  add column if not exists property_type text,
  add column if not exists latitude numeric(9, 6),
  add column if not exists longitude numeric(9, 6),
  add column if not exists status property_status not null default 'draft',
  add column if not exists submitted_at timestamptz,
  add column if not exists moderated_at timestamptz,
  add column if not exists moderated_by uuid references profiles(id) on delete set null,
  add column if not exists moderation_notes text,
  add column if not exists published_at timestamptz,
  add column if not exists expires_at timestamptz,
  add column if not exists billing_status text,
  add column if not exists billing_period_started_at timestamptz,
  add column if not exists billing_period_ends_at timestamptz,
  add column if not exists rating numeric(2, 1),
  add column if not exists price_from integer,
  add column if not exists amenities text[] not null default '{}',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists property_moderation_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  admin_id uuid references profiles(id) on delete set null,
  status property_status not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  room_type text,
  description text,
  area_m2 integer,
  max_guests integer,
  capacity integer,
  bed_type text,
  size_m2 integer,
  quantity integer not null default 1,
  price_per_night integer,
  availability_status text not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rooms_availability_status_check check (availability_status in ('available', 'unavailable'))
);

alter table rooms
  add column if not exists room_type text,
  add column if not exists description text,
  add column if not exists area_m2 integer,
  add column if not exists max_guests integer,
  add column if not exists capacity integer,
  add column if not exists bed_type text,
  add column if not exists size_m2 integer,
  add column if not exists quantity integer not null default 1,
  add column if not exists price_per_night integer,
  add column if not exists availability_status text not null default 'available',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  alter table rooms
    add constraint rooms_availability_status_check
    check (availability_status in ('available', 'unavailable'));
exception
  when duplicate_object then null;
end;
$$;

create table if not exists property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,
  url text not null,
  media_type text not null default 'image',
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table property_media
  add column if not exists property_id uuid references properties(id) on delete cascade,
  add column if not exists room_id uuid references rooms(id) on delete cascade,
  add column if not exists media_type text not null default 'image',
  add column if not exists alt_text text,
  add column if not exists is_primary boolean not null default false,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  alter table property_media
    add constraint property_media_room_id_fkey
    foreign key (room_id) references rooms(id) on delete cascade;
exception
  when duplicate_object then null;
end;
$$;

create table if not exists room_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,
  url text not null,
  media_type text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  room_id uuid references rooms(id) on delete set null,
  client_id uuid references profiles(id) on delete set null,
  guest_name text not null,
  phone text,
  email text,
  check_in date not null,
  check_out date not null,
  guests integer not null default 1,
  comment text,
  special_requests text,
  status booking_status not null default 'pending',
  response_message text,
  responded_at timestamptz,
  status_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table bookings
  add column if not exists room_id uuid references rooms(id) on delete set null,
  add column if not exists client_id uuid references profiles(id) on delete set null,
  add column if not exists comment text,
  add column if not exists special_requests text,
  add column if not exists response_message text,
  add column if not exists responded_at timestamptz,
  add column if not exists status_changed_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, property_id)
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  client_id uuid references profiles(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists advertisements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  metadata jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on profiles(role);
create index if not exists cities_slug_idx on cities(slug);
create index if not exists cities_active_idx on cities(is_active);
create index if not exists locations_city_id_idx on locations(city_id);
create index if not exists locations_category_idx on locations(category);
create index if not exists locations_active_idx on locations(is_active);
create index if not exists locations_lat_lng_idx on locations(latitude, longitude);
create index if not exists properties_owner_id_idx on properties(owner_id);
create index if not exists properties_city_id_idx on properties(city_id);
create index if not exists properties_location_id_idx on properties(location_id);
create index if not exists properties_tariff_id_idx on properties(tariff_id);
create index if not exists properties_moderated_by_idx on properties(moderated_by);
create index if not exists properties_status_idx on properties(status);
create index if not exists properties_expires_at_idx on properties(expires_at);
create index if not exists properties_lat_lng_idx on properties(latitude, longitude);
create index if not exists properties_published_idx on properties(status, published_at) where status = 'published';
create index if not exists property_media_property_id_idx on property_media(property_id);
create index if not exists property_media_room_id_idx on property_media(room_id);
create index if not exists property_media_sort_order_idx on property_media(property_id, sort_order);
create unique index if not exists property_media_one_primary_per_property_idx
  on property_media(property_id)
  where is_primary = true and property_id is not null;
create index if not exists property_moderation_events_property_id_idx on property_moderation_events(property_id);
create index if not exists property_moderation_events_admin_id_idx on property_moderation_events(admin_id);
create index if not exists property_moderation_events_status_idx on property_moderation_events(status);
create index if not exists rooms_property_id_idx on rooms(property_id);
create index if not exists rooms_availability_status_idx on rooms(availability_status);
create index if not exists room_media_property_id_idx on room_media(property_id);
create index if not exists room_media_room_id_idx on room_media(room_id);
create index if not exists bookings_property_id_idx on bookings(property_id);
create index if not exists bookings_client_id_idx on bookings(client_id);
create index if not exists bookings_room_id_idx on bookings(room_id);
create index if not exists bookings_status_idx on bookings(status);
create index if not exists bookings_created_at_idx on bookings(created_at);
create index if not exists bookings_dates_idx on bookings(property_id, check_in, check_out);
create index if not exists favorites_client_id_idx on favorites(client_id);
create index if not exists favorites_property_id_idx on favorites(property_id);
create index if not exists reviews_property_id_idx on reviews(property_id);
create index if not exists reviews_client_id_idx on reviews(client_id);
create index if not exists reviews_visible_idx on reviews(is_visible);
create index if not exists advertisements_active_idx on advertisements(is_active);
create index if not exists tariffs_active_idx on tariffs(is_active);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_owner_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'cities',
    'locations',
    'properties',
    'property_media',
    'property_moderation_events',
    'rooms',
    'room_media',
    'bookings',
    'favorites',
    'reviews',
    'advertisements',
    'tariffs'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end;
$$;

drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own
  on profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own
  on profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists profiles_admin_select on profiles;
create policy profiles_admin_select
  on profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists profiles_admin_update on profiles;
create policy profiles_admin_update
  on profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists cities_public_active_select on cities;
create policy cities_public_active_select
  on cities for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists cities_admin_all on cities;
create policy cities_admin_all
  on cities for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists locations_public_active_select on locations;
create policy locations_public_active_select
  on locations for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists locations_admin_all on locations;
create policy locations_admin_all
  on locations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists tariffs_public_active_select on tariffs;
create policy tariffs_public_active_select
  on tariffs for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists tariffs_admin_all on tariffs;
create policy tariffs_admin_all
  on tariffs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists advertisements_public_active_select on advertisements;
create policy advertisements_public_active_select
  on advertisements for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists advertisements_admin_all on advertisements;
create policy advertisements_admin_all
  on advertisements for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists properties_owner_insert on properties;
create policy properties_owner_insert
  on properties for insert
  to authenticated
  with check (owner_id = auth.uid() and public.is_owner_or_admin());

drop policy if exists properties_owner_select on properties;
create policy properties_owner_select
  on properties for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists properties_owner_update on properties;
create policy properties_owner_update
  on properties for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists properties_public_published_select on properties;
create policy properties_public_published_select
  on properties for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists properties_admin_select on properties;
create policy properties_admin_select
  on properties for select
  to authenticated
  using (public.is_admin());

drop policy if exists properties_admin_update on properties;
create policy properties_admin_update
  on properties for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists property_moderation_events_owner_select on property_moderation_events;
create policy property_moderation_events_owner_select
  on property_moderation_events for select
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = property_moderation_events.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists property_moderation_events_admin_select on property_moderation_events;
create policy property_moderation_events_admin_select
  on property_moderation_events for select
  to authenticated
  using (public.is_admin());

drop policy if exists property_moderation_events_admin_insert on property_moderation_events;
create policy property_moderation_events_admin_insert
  on property_moderation_events for insert
  to authenticated
  with check (admin_id = auth.uid() and public.is_admin());

drop policy if exists property_media_public_published_select on property_media;
create policy property_media_public_published_select
  on property_media for select
  to anon, authenticated
  using (
    media_type = 'image'
    and exists (
      select 1 from properties
      where properties.id = property_media.property_id
        and properties.status = 'published'
    )
  );

drop policy if exists property_media_owner_select on property_media;
create policy property_media_owner_select
  on property_media for select
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists property_media_owner_insert on property_media;
create policy property_media_owner_insert
  on property_media for insert
  to authenticated
  with check (
    media_type = 'image'
    and exists (
      select 1 from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists property_media_owner_update on property_media;
create policy property_media_owner_update
  on property_media for update
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists property_media_owner_delete on property_media;
create policy property_media_owner_delete
  on property_media for delete
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists rooms_public_published_select on rooms;
create policy rooms_public_published_select
  on rooms for select
  to anon, authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = rooms.property_id
        and properties.status = 'published'
    )
  );

drop policy if exists rooms_owner_select on rooms;
create policy rooms_owner_select
  on rooms for select
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists rooms_owner_insert on rooms;
create policy rooms_owner_insert
  on rooms for insert
  to authenticated
  with check (
    exists (
      select 1 from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists rooms_owner_update on rooms;
create policy rooms_owner_update
  on rooms for update
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists rooms_owner_delete on rooms;
create policy rooms_owner_delete
  on rooms for delete
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists room_media_public_published_select on room_media;
create policy room_media_public_published_select
  on room_media for select
  to anon, authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = room_media.property_id
        and properties.status = 'published'
    )
  );

drop policy if exists room_media_owner_all on room_media;
create policy room_media_owner_all
  on room_media for all
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = room_media.property_id
        and properties.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from properties
      where properties.id = room_media.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists bookings_client_insert on bookings;
create policy bookings_client_insert
  on bookings for insert
  to authenticated
  with check (client_id = auth.uid());

drop policy if exists bookings_client_select on bookings;
create policy bookings_client_select
  on bookings for select
  to authenticated
  using (client_id = auth.uid());

drop policy if exists bookings_owner_select on bookings;
create policy bookings_owner_select
  on bookings for select
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = bookings.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists bookings_owner_update on bookings;
create policy bookings_owner_update
  on bookings for update
  to authenticated
  using (
    exists (
      select 1 from properties
      where properties.id = bookings.property_id
        and properties.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from properties
      where properties.id = bookings.property_id
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists bookings_admin_select on bookings;
create policy bookings_admin_select
  on bookings for select
  to authenticated
  using (public.is_admin());

drop policy if exists favorites_client_all on favorites;
create policy favorites_client_all
  on favorites for all
  to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

drop policy if exists reviews_public_visible_select on reviews;
create policy reviews_public_visible_select
  on reviews for select
  to anon, authenticated
  using (is_visible = true);

drop policy if exists reviews_client_insert on reviews;
create policy reviews_client_insert
  on reviews for insert
  to authenticated
  with check (client_id = auth.uid());

drop policy if exists reviews_client_select on reviews;
create policy reviews_client_select
  on reviews for select
  to authenticated
  using (client_id = auth.uid());

drop policy if exists reviews_admin_all on reviews;
create policy reviews_admin_all
  on reviews for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

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

drop policy if exists property_images_public_read on storage.objects;
create policy property_images_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

drop policy if exists property_images_owner_insert on storage.objects;
create policy property_images_owner_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and split_part(name, '/', 1) = auth.uid()::text
    and exists (
      select 1 from properties
      where properties.id::text = split_part(name, '/', 2)
        and properties.owner_id = auth.uid()
    )
  );

drop policy if exists property_images_owner_update on storage.objects;
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

drop policy if exists property_images_owner_delete on storage.objects;
create policy property_images_owner_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and split_part(name, '/', 1) = auth.uid()::text
    and exists (
      select 1 from properties
      where properties.id::text = split_part(name, '/', 2)
        and properties.owner_id = auth.uid()
    )
  );

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'cities',
    'locations',
    'properties',
    'property_media',
    'property_moderation_events',
    'rooms',
    'room_media',
    'bookings',
    'favorites',
    'reviews',
    'advertisements',
    'tariffs'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

create or replace function public.nearby_properties(
  search_latitude numeric,
  search_longitude numeric,
  radius_km numeric default 10
)
returns table (
  id uuid,
  name text,
  slug text,
  distance_km numeric
)
language sql
stable
as $$
  select
    properties.id,
    properties.name,
    properties.slug,
    (
      6371 * acos(
        greatest(
          -1,
          least(
            1,
            cos(radians(search_latitude))
            * cos(radians(properties.latitude))
            * cos(radians(properties.longitude) - radians(search_longitude))
            + sin(radians(search_latitude))
            * sin(radians(properties.latitude))
          )
        )
      )
    )::numeric as distance_km
  from properties
  where properties.latitude is not null
    and properties.longitude is not null
    and properties.status = 'published'
    and (
      6371 * acos(
        greatest(
          -1,
          least(
            1,
            cos(radians(search_latitude))
            * cos(radians(properties.latitude))
            * cos(radians(properties.longitude) - radians(search_longitude))
            + sin(radians(search_latitude))
            * sin(radians(properties.latitude))
          )
        )
      )
    ) <= radius_km
  order by distance_km asc;
$$;
