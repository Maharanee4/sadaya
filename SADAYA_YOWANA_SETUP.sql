-- Jalankan sekali pada Neon/Postgres sebelum mengaktifkan forum bersama.
create table if not exists yowana_topics (
  id bigserial primary key,
  title varchar(120) not null check (char_length(title) between 8 and 120),
  category varchar(80) not null check (category in ('Hubungan Sehat','Kesiapan Masa Depan','Komunikasi dan Batasan Diri','Budaya dan Nilai Keluarga Bali','Tanya Jawab')),
  author_name varchar(32) not null check (char_length(author_name) between 2 and 32),
  content varchar(2000) not null check (char_length(content) between 20 and 2000),
  created_at timestamptz not null default now(),
  locked boolean not null default false,
  hidden boolean not null default false
);
create index if not exists yowana_topics_recent_idx on yowana_topics (created_at desc) where hidden = false;

create table if not exists yowana_replies (
  id bigserial primary key,
  topic_id bigint not null references yowana_topics(id) on delete cascade,
  author_name varchar(32) not null check (char_length(author_name) between 2 and 32),
  content varchar(1000) not null check (char_length(content) between 2 and 1000),
  created_at timestamptz not null default now(),
  is_moderator boolean not null default false,
  hidden boolean not null default false
);
alter table yowana_replies add column if not exists is_moderator boolean not null default false;
create index if not exists yowana_replies_topic_recent_idx on yowana_replies (topic_id, created_at) where hidden = false;

create table if not exists yowana_reports (
  id bigserial primary key,
  target_type varchar(8) not null check (target_type in ('topic','reply')),
  target_id bigint not null,
  reason varchar(250) not null,
  created_at timestamptz not null default now(),
  resolved boolean not null default false
);
create index if not exists yowana_reports_open_idx on yowana_reports (created_at) where resolved = false;

create table if not exists yowana_events (
  id bigserial primary key,
  title varchar(120) not null check (char_length(title) between 8 and 120),
  speaker_name varchar(80) not null check (char_length(speaker_name) between 2 and 80),
  organizer_name varchar(120) not null check (char_length(organizer_name) between 2 and 120),
  starts_at timestamptz not null,
  description varchar(500) not null check (char_length(description) between 15 and 500),
  created_at timestamptz not null default now(),
  hidden boolean not null default false
);
create index if not exists yowana_events_upcoming_idx on yowana_events (starts_at) where hidden = false;

-- Simpan hash IP saja untuk membatasi spam; alamat IP mentah tidak disimpan.
create table if not exists yowana_rate_limits (
  ip_hash char(64) not null,
  action varchar(16) not null,
  next_allowed_at timestamptz not null,
  primary key (ip_hash, action)
);
