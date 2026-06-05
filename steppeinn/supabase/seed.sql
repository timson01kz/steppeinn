insert into cities (name, slug, region, country, latitude, longitude)
values
  ('Almaty', 'almaty', 'Almaty', 'Kazakhstan', 43.238949, 76.889709)
on conflict (slug) do update set
  name = excluded.name,
  region = excluded.region,
  country = excluded.country,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  updated_at = now();

with almaty as (
  select id from cities where slug = 'almaty'
)
insert into locations (
  city_id,
  name,
  category,
  description,
  description_en,
  description_ru,
  description_kk,
  latitude,
  longitude,
  metadata
)
select
  almaty.id,
  seed.name,
  seed.category::location_category,
  seed.description,
  seed.description_en,
  seed.description_ru,
  seed.description_kk,
  seed.latitude,
  seed.longitude,
  seed.metadata::jsonb
from almaty
cross join (
  values
    ('Shymbulak', 'recreation', 'Ski slopes, alpine dining, and premium weekend escapes.', 'Ski slopes, alpine dining, and premium weekend escapes.', 'Горнолыжные склоны, альпийские рестораны и премиальные выходные.', 'Тау шаңғысы, альпілік мейрамханалар және премиум демалыс.', 43.128395, 77.080857, '{"map_x":"33%","map_y":"20%"}'),
    ('Medeu', 'recreation', 'Iconic ice rink route with nature-focused stays nearby.', 'Iconic ice rink route with nature-focused stays nearby.', 'Культовый маршрут к катку с отелями рядом с природой.', 'Табиғатқа жақын қонақүйлері бар әйгілі мұз айдыны бағыты.', 43.157553, 77.058405, '{"map_x":"42%","map_y":"31%"}'),
    ('Kok-Tobe', 'attraction', 'Panoramic city views and restaurants above Almaty.', 'Panoramic city views and restaurants above Almaty.', 'Панорамные виды на город и рестораны над Алматы.', 'Алматы үстіндегі панорамалық көріністер мен мейрамханалар.', 43.233611, 76.976111, '{"map_x":"53%","map_y":"40%"}'),
    ('Airport', 'transport', 'Convenient stays for early flights and business arrivals.', 'Convenient stays for early flights and business arrivals.', 'Удобные отели для ранних рейсов и деловых поездок.', 'Ерте рейстер мен іскерлік сапарларға ыңғайлы қонақүйлер.', 43.352072, 77.040508, '{"map_x":"80%","map_y":"66%"}'),
    ('Arbat', 'attraction', 'Cafes, galleries, shopping streets, and central hotels.', 'Cafes, galleries, shopping streets, and central hotels.', 'Кафе, галереи, торговые улицы и центральные отели.', 'Кафелер, галереялар, сауда көшелері және орталық қонақүйлер.', 43.261944, 76.940833, '{"map_x":"49%","map_y":"62%"}'),
    ('Mega Alma-Ata', 'shopping', 'Family-friendly hotels near dining and entertainment.', 'Family-friendly hotels near dining and entertainment.', 'Семейные отели рядом с ресторанами и развлечениями.', 'Тамақтану және ойын-сауыққа жақын отбасылық қонақүйлер.', 43.202710, 76.892360, '{"map_x":"37%","map_y":"71%"}'),
    ('Mega Park', 'shopping', 'Central retail and casual dining route.', 'Central retail and casual dining route.', 'Центральный торговый маршрут и casual dining.', 'Орталық сауда және casual dining бағыты.', 43.263509, 76.927120, '{"map_x":"40%","map_y":"68%"}'),
    ('Esentai Mall', 'business', 'Premium stays close to offices, shopping, and fine dining.', 'Premium stays close to offices, shopping, and fine dining.', 'Премиальные отели рядом с офисами, шопингом и ресторанами.', 'Кеңселерге, саудаға және мейрамханаларға жақын премиум қонақүйлер.', 43.218410, 76.927983, '{"map_x":"59%","map_y":"56%"}')
) as seed(name, category, description, description_en, description_ru, description_kk, latitude, longitude, metadata)
on conflict (city_id, name) do update set
  category = excluded.category,
  description = excluded.description,
  description_en = excluded.description_en,
  description_ru = excluded.description_ru,
  description_kk = excluded.description_kk,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  metadata = excluded.metadata,
  is_active = true,
  updated_at = now();
