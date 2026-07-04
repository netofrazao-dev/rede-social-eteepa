-- ============================================================
--  Migração: adiciona a tabela de COMENTÁRIOS
--  Rode este bloco no SQL Editor do Supabase (só uma vez).
--  (Quem for criar o banco do zero já tem isso no schema.sql)
-- ============================================================

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  author_id  uuid not null references public.users(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_post_id_idx on public.comments(post_id);

alter table public.comments enable row level security;
