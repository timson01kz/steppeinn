create extension if not exists "pgcrypto";

create type user_role as enum ('client', 'owner', 'admin');
create type property_status as enum ('draft', 'pending', 'published', 'rejected', 'changes_requested', 'expired');
create type booking_status as enum ('pending', 'confirmed', 'declined', 'cancelled', 'completed');
create type location_category as enum ('attraction', 'shopping', 'transport', 'business', 'recreation');

create table profiles (
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

create or replace function handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, role, full_name, preferred_language, country)
  values (
    new.id,
    case
      when new.raw_user_meta_data ->> 'role' in ('client', 'owner', 'admin')
        then (new.raw_user_meta_data ->> 'role')::user_role
      else 'client'
    end,
    new.raw_user_meta_data ->> 'full_name',
    'RU',
    'Kazakhstan'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user_profile();

create table cities (
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

create table locations (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references cities(id) on delete cascade,
  name text not null,
  category location_category not null,
  description text,
  -- Translation-ready fields for future RU/KZ/EN location descriptions.
  description_en text,
  description_ru text,
  description_kk text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  metadata jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, name)
);

create table properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  city_id uuid references cities(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  -- Translation-ready fields for future RU/KZ/EN property descriptions.
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
  rating numeric(2, 1),
  price_from integer,
  amenities text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  room_id uuid,
  url text not null,
  media_type text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table property_moderation_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  admin_id uuid references profiles(id) on delete set null,
  status property_status not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  room_type text,
  description text,
  area_m2 integer,
  max_guests integer,
  capacity integer not null,
  bed_type text,
  size_m2 integer,
  quantity integer not null default 1,
  price_per_night integer not null,
  availability_status text not null default 'available'
    check (availability_status in ('available', 'unavailable')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table property_media
  add constraint property_media_room_id_fkey
  foreign key (room_id) references rooms(id) on delete cascade;

create table room_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,
  url text not null,
  media_type text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table bookings (
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
  status booking_status not null default 'pending',
  response_message text,
  responded_at timestamptz,
  status_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table favorites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, property_id)
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  client_id uuid references profiles(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table advertisements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  metadata jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tariffs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  metadata jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table properties
  add column tariff_id uuid references tariffs(id) on delete set null,
  add column billing_status text,
  add column billing_period_started_at timestamptz,
  add column billing_period_ends_at timestamptz;

create index properties_owner_id_idx on properties(owner_id);
create index properties_city_id_idx on properties(city_id);
create index properties_location_id_idx on properties(location_id);
create index properties_tariff_id_idx on properties(tariff_id);
create index properties_moderated_by_idx on properties(moderated_by);
create index properties_status_idx on properties(status);
create index properties_expires_at_idx on properties(expires_at);
create index properties_lat_lng_idx on properties(latitude, longitude);
create index locations_city_id_idx on locations(city_id);
create index locations_category_idx on locations(category);
create index locations_lat_lng_idx on locations(latitude, longitude);
create index property_media_property_id_idx on property_media(property_id);
create index property_media_room_id_idx on property_media(room_id);
create unique index property_media_one_primary_per_property_idx
  on property_media(property_id)
  where is_primary = true and property_id is not null;
create index property_moderation_events_property_id_idx on property_moderation_events(property_id);
create index property_moderation_events_admin_id_idx on property_moderation_events(admin_id);
create index property_moderation_events_status_idx on property_moderation_events(status);
create index rooms_property_id_idx on rooms(property_id);
create index rooms_availability_status_idx on rooms(availability_status);
create index room_media_property_id_idx on room_media(property_id);
create index room_media_room_id_idx on room_media(room_id);
create index bookings_property_id_idx on bookings(property_id);
create index bookings_client_id_idx on bookings(client_id);
create index bookings_room_id_idx on bookings(room_id);
create index bookings_status_idx on bookings(status);
create index favorites_client_id_idx on favorites(client_id);
create index favorites_property_id_idx on favorites(property_id);
create index reviews_property_id_idx on reviews(property_id);
create index reviews_client_id_idx on reviews(client_id);

alter table profiles enable row level security;
alter table cities enable row level security;
alter table locations enable row level security;
alter table properties enable row level security;
alter table property_media enable row level security;
alter table property_moderation_events enable row level security;
alter table rooms enable row level security;
alter table room_media enable row level security;
alter table bookings enable row level security;
alter table favorites enable row level security;
alter table reviews enable row level security;
alter table advertisements enable row level security;
alter table tariffs enable row level security;

create policy profiles_select_own
  on profiles for select
  to authenticated
  using (id = auth.uid());

create policy properties_owner_insert
  on properties for insert
  to authenticated
  with check (
    owner_id = auth.uid()
    and exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('owner', 'admin')
    )
  );

create policy properties_owner_select
  on properties for select
  to authenticated
  using (owner_id = auth.uid());

create policy properties_public_published_select
  on properties for select
  to anon, authenticated
  using (status = 'published');

create policy properties_admin_select
  on properties for select
  to authenticated
  using (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy properties_admin_update
  on properties for update
  to authenticated
  using (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy property_moderation_events_owner_select
  on property_moderation_events for select
  to authenticated
  using (
    exists (
      select 1
      from properties
      where properties.id = property_moderation_events.property_id
        and properties.owner_id = auth.uid()
    )
  );

create policy property_moderation_events_admin_select
  on property_moderation_events for select
  to authenticated
  using (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy property_moderation_events_admin_insert
  on property_moderation_events for insert
  to authenticated
  with check (
    admin_id = auth.uid()
    and exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy property_media_public_published_select
  on property_media for select
  to anon, authenticated
  using (
    media_type = 'image'
    and exists (
      select 1
      from properties
      where properties.id = property_media.property_id
        and properties.status = 'published'
    )
  );

create policy property_media_owner_select
  on property_media for select
  to authenticated
  using (
    exists (
      select 1
      from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  );

create policy property_media_owner_insert
  on property_media for insert
  to authenticated
  with check (
    media_type = 'image'
    and exists (
      select 1
      from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  );

create policy property_media_owner_update
  on property_media for update
  to authenticated
  using (
    exists (
      select 1
      from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  );

create policy property_media_owner_delete
  on property_media for delete
  to authenticated
  using (
    exists (
      select 1
      from properties
      where properties.id = property_media.property_id
        and properties.owner_id = auth.uid()
    )
  );

create policy rooms_public_published_select
  on rooms for select
  to anon, authenticated
  using (
    exists (
      select 1
      from properties
      where properties.id = rooms.property_id
        and properties.status = 'published'
    )
  );

create policy rooms_owner_select
  on rooms for select
  to authenticated
  using (
    exists (
      select 1
      from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  );

create policy rooms_owner_insert
  on rooms for insert
  to authenticated
  with check (
    exists (
      select 1
      from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  );

create policy rooms_owner_update
  on rooms for update
  to authenticated
  using (
    exists (
      select 1
      from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  );

create policy rooms_owner_delete
  on rooms for delete
  to authenticated
  using (
    exists (
      select 1
      from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  );

-- Distance-based search preparation using the Haversine formula.
-- This avoids requiring PostGIS for MVP setup. If search becomes core, replace
-- this with PostGIS geography columns and GiST indexes.
create or replace function nearby_properties(
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

-- RLS draft notes:
-- 1. Public users should read only published properties, active cities,
--    active locations,
--    visible reviews, active advertisements, and active tariffs.
-- 2. Clients should manage their own profile, favorites, reviews, and booking
--    requests.
-- 3. Owners should manage their own draft properties, rooms, media, and view
--    bookings for properties they own.
-- 4. Admins should have full moderation access across all tables.
-- 5. Detailed policies are intentionally deferred until authentication and role
--    middleware are wired into the application.
