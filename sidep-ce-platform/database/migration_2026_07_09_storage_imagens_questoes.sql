-- SIDEP-CE - Imagens opcionais das questoes via Supabase Storage
-- Data: 09/07/2026
--
-- Objetivo:
-- 1. Salvar no banco apenas a URL/caminho da imagem da questao.
-- 2. Armazenar o arquivo no Supabase Storage, preservando a cota do PostgreSQL.
-- 3. Manter o MVP online funcionando com chave publica anon enquanto Supabase Auth/RLS
--    por perfil ainda nao foi implantado.
--
-- ATENCAO:
-- As policies abaixo sao permissivas para piloto controlado. Antes de uso estadual
-- amplo, substituir por policies baseadas em Supabase Auth, perfil, escola, CREDE/SEFOR
-- e autoria docente.

alter table if exists public.questao_mvp
  add column if not exists imagem_url text;

comment on column public.questao_mvp.imagem_url is
  'URL publica ou caminho da imagem opcional da questao. O arquivo deve ficar no Supabase Storage.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sidep-questoes-imagens',
  'sidep-questoes-imagens',
  true,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'sidep_questoes_imagens_select_anon'
  ) then
    create policy sidep_questoes_imagens_select_anon
      on storage.objects
      for select
      to anon
      using (bucket_id = 'sidep-questoes-imagens');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'sidep_questoes_imagens_insert_anon'
  ) then
    create policy sidep_questoes_imagens_insert_anon
      on storage.objects
      for insert
      to anon
      with check (bucket_id = 'sidep-questoes-imagens');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'sidep_questoes_imagens_update_anon'
  ) then
    create policy sidep_questoes_imagens_update_anon
      on storage.objects
      for update
      to anon
      using (bucket_id = 'sidep-questoes-imagens')
      with check (bucket_id = 'sidep-questoes-imagens');
  end if;
end $$;
