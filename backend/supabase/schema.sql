-- ============================================================
--  Rede Social EETEPA-Breves — Esquema do banco (Supabase/Postgres)
--  Cole TODO este conteúdo no SQL Editor do Supabase e clique em "Run".
-- ============================================================

-- Extensão para gerar UUIDs automaticamente
create extension if not exists "pgcrypto";

-- ===================== USUÁRIOS =====================
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,               -- senha guardada com hash (bcrypt)
  name          text not null,
  role          text not null check (role in ('admin','teacher','leader','student')),
  role_label    text not null default '',
  avatar        text not null default '',
  created_at    timestamptz not null default now()
);

-- ===================== PUBLICAÇÕES =====================
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.users(id) on delete cascade,
  content     text not null default '',
  category    text not null default 'Geral' check (category in ('Aviso','Notas','Ajuda','Geral')),
  media_url   text,                          -- caminho da foto/vídeo (ou null)
  media_type  text,                          -- 'image' | 'video' | null
  created_at  timestamptz not null default now()
);
create index if not exists posts_author_id_idx  on public.posts(author_id);
create index if not exists posts_created_at_idx on public.posts(created_at desc);

-- ===================== CURTIDAS =====================
-- Uma linha por (usuário + post). A chave primária composta impede
-- que a mesma pessoa curta o mesmo post duas vezes.
create table if not exists public.likes (
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ===================== COMENTÁRIOS =====================
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  author_id  uuid not null references public.users(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_post_id_idx on public.comments(post_id);

-- ===================== SEGURANÇA (RLS) =====================
-- Ativa Row Level Security. Como NÃO criamos políticas liberais, apenas a
-- "service_role" (a chave secreta usada pelo nosso backend Express) consegue
-- ler/gravar. O frontend nunca fala direto com o banco — sempre passa pela API.
alter table public.users    enable row level security;
alter table public.posts    enable row level security;
alter table public.likes    enable row level security;
alter table public.comments enable row level security;
