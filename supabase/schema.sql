create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  slug text unique,
  logo_url text,
  banner_url text,
  whatsapp_number text not null,
  address text,
  description text,
  opening_hours jsonb,
  payment_methods jsonb,
  base_whatsapp_message text,
  delivery_enabled boolean not null default true,
  delivery_cost numeric(10,2) not null default 0,
  currency text not null default 'DOP',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.business_settings(id) on delete cascade,
  name text not null,
  slug text,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, slug)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.business_settings(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  is_available boolean not null default true,
  is_active boolean not null default true,
  is_daily_special boolean not null default false,
  available_days integer[] check (
    available_days is null
    or available_days <@ array[0, 1, 2, 3, 4, 5, 6]
  ),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, slug)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.business_settings(id) on delete set null,
  order_code text unique not null,
  order_type text not null default 'pickup' check (order_type in ('table', 'delivery', 'pickup')),
  table_number text,
  customer_name text not null,
  customer_phone text,
  customer_address text,
  customer_notes text,
  customer_location_url text,
  payment_method text not null check (payment_method in ('cash', 'transfer', 'card')),
  subtotal numeric(10,2) not null default 0,
  delivery_cost numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'pending_whatsapp' check (status in ('pending_whatsapp', 'confirmed', 'preparing', 'completed', 'cancelled')),
  whatsapp_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_business_settings_active on public.business_settings (is_active);
create index if not exists idx_categories_business_active_sort on public.categories (business_id, is_active, sort_order);
create index if not exists idx_products_business_active_available_sort on public.products (business_id, is_active, is_available, sort_order);
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_daily_special on public.products (is_daily_special);
create index if not exists idx_orders_business_status_created on public.orders (business_id, status, created_at desc);
create index if not exists idx_order_items_order on public.order_items (order_id);

drop trigger if exists set_business_settings_updated_at on public.business_settings;
create trigger set_business_settings_updated_at
before update on public.business_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.business_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can read active business settings" on public.business_settings;
create policy "Public can read active business settings"
on public.business_settings for select
using (is_active = true);

drop policy if exists "Authenticated users can manage business settings" on public.business_settings;
create policy "Authenticated users can manage business settings"
on public.business_settings for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select
using (is_active = true);

drop policy if exists "Authenticated users can manage categories" on public.categories;
create policy "Authenticated users can manage categories"
on public.categories for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active available products" on public.products;
create policy "Public can read active available products"
on public.products for select
using (is_active = true and is_available = true);

drop policy if exists "Authenticated users can manage products" on public.products;
create policy "Authenticated users can manage products"
on public.products for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated users can read orders" on public.orders;
create policy "Authenticated users can read orders"
on public.orders for select
to authenticated
using (true);

drop policy if exists "Authenticated users can update orders" on public.orders;
create policy "Authenticated users can update orders"
on public.orders for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete orders" on public.orders;
create policy "Authenticated users can delete orders"
on public.orders for delete
to authenticated
using (true);

drop policy if exists "Public can create order items" on public.order_items;
create policy "Public can create order items"
on public.order_items for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated users can read order items" on public.order_items;
create policy "Authenticated users can read order items"
on public.order_items for select
to authenticated
using (true);

drop policy if exists "Authenticated users can update order items" on public.order_items;
create policy "Authenticated users can update order items"
on public.order_items for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete order items" on public.order_items;
create policy "Authenticated users can delete order items"
on public.order_items for delete
to authenticated
using (true);

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'products');

drop policy if exists "Authenticated users can upload product images" on storage.objects;
create policy "Authenticated users can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'products');

drop policy if exists "Authenticated users can update product images" on storage.objects;
create policy "Authenticated users can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'products')
with check (bucket_id = 'products');

drop policy if exists "Authenticated users can delete product images" on storage.objects;
create policy "Authenticated users can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'products');

insert into public.business_settings (
  business_name,
  slug,
  whatsapp_number,
  address,
  description,
  payment_methods,
  delivery_cost,
  currency
)
select
  'Cuki Yun Yun',
  'cuki-yun-yun',
  '18094338279',
  'Av. 25 de Febrero esq. Av. San Vicente de Paul, Los Mina, Santo Domingo Este, Republica Dominicana',
  'Cafeteria & Restaurant',
  '[{"id":"cash","label":"Efectivo"},{"id":"card","label":"Tarjeta al recibir"},{"id":"transfer","label":"Transferencia"}]'::jsonb,
  50,
  'DOP'
where not exists (select 1 from public.business_settings);
