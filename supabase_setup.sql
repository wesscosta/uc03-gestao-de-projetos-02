-- Tabela simples para sincronizar a configuração do Portal Nexus entre todos os alunos.
-- Execute no SQL Editor do Supabase.

create table if not exists public.nexus_config (
  id text primary key,
  config jsonb not null,
  updated_at timestamptz default now()
);

alter table public.nexus_config enable row level security;

-- Leitura pública da configuração do portal.
drop policy if exists "nexus_config_select_public" on public.nexus_config;
create policy "nexus_config_select_public"
on public.nexus_config
for select
using (true);

-- Escrita pública permite alterar pelo front-end usando anon key.
-- Use apenas em ambiente didático. Para produção, troque por autenticação.
drop policy if exists "nexus_config_upsert_public" on public.nexus_config;
create policy "nexus_config_upsert_public"
on public.nexus_config
for insert
with check (true);

drop policy if exists "nexus_config_update_public" on public.nexus_config;
create policy "nexus_config_update_public"
on public.nexus_config
for update
using (true)
with check (true);

insert into public.nexus_config (id, config, updated_at)
values (
  'default',
  '{"currentSprint":8,"unlockedSprints":[1,2,3,4,5,6,7,8],"showFutureSprints":true,"showProfessorMode":true,"showEventCards":true,"deliveryChannel":"Microsoft Teams","adminPin":"2026","useSupabase":true,"supabaseConfigTable":"nexus_config"}'::jsonb,
  now()
)
on conflict (id) do update set config = excluded.config, updated_at = now();
