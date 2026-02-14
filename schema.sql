-- Database Schema for Francal-Conecta

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (Users)
create table if not exists profiles (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  department text not null,
  role text not null,
  created_at timestamp with time zone default now()
);

-- 2. Tickets
create table if not exists tickets (
  id text primary key, -- Using text to match current 6-char random ID if preferred, or uuid
  title text not null,
  description text not null,
  from_department text not null,
  to_department text not null,
  created_by_id uuid references profiles(id) on delete cascade,
  assigned_to_id uuid references profiles(id) on delete set null,
  status text not null default 'Aberto',
  priority text not null default 'Média',
  created_at timestamp with time zone default now()
);

-- 3. Ticket Messages
create table if not exists ticket_messages (
  id uuid default uuid_generate_v4() primary key,
  ticket_id text references tickets(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  text text not null,
  created_at timestamp with time zone default now()
);

-- 4. Announcements
create table if not exists announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  image_url text,
  department text not null,
  author_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- 5. Promotions
create table if not exists promotions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  image_url text,
  department text not null,
  status text not null default 'Ativa',
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- 6. Department Metrics
create table if not exists dept_metrics (
  id uuid default uuid_generate_v4() primary key,
  department text not null,
  label text not null,
  value text not null,
  trend text,
  is_positive boolean default true,
  updated_at timestamp with time zone default now()
);

-- Row Level Security (RLS) - Basic Example
alter table profiles enable row level security;
alter table tickets enable row level security;
alter table ticket_messages enable row level security;

-- Policies (Simplified for setup)
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
create policy "Tickets are viewable by everyone." on tickets for select using (true);
create policy "Messages are viewable by everyone." on ticket_messages for select using (true);
