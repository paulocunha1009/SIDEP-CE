-- SIDEP-CE - Policies seguras para Storage de imagens das questoes
-- Data: 14/07/2026
--
-- Contexto:
-- O MVP permitiu policies anonimas para validar upload de imagens.
-- Em producao, upload/update/delete anonimo nao deve existir.

insert into storage.buckets (id, name, public)
values ('sidep-questoes-imagens', 'sidep-questoes-imagens', true)
on conflict (id) do update set public = true;

drop policy if exists sidep_questoes_imagens_select_anon on storage.objects;
drop policy if exists sidep_questoes_imagens_insert_anon on storage.objects;
drop policy if exists sidep_questoes_imagens_update_anon on storage.objects;
drop policy if exists sidep_questoes_imagens_delete_anon on storage.objects;

drop policy if exists sidep_questoes_imagens_public_read on storage.objects;
create policy sidep_questoes_imagens_public_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'sidep-questoes-imagens');

drop policy if exists sidep_questoes_imagens_authenticated_insert on storage.objects;
create policy sidep_questoes_imagens_authenticated_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'sidep-questoes-imagens');

drop policy if exists sidep_questoes_imagens_authenticated_update on storage.objects;
create policy sidep_questoes_imagens_authenticated_update
on storage.objects
for update
to authenticated
using (bucket_id = 'sidep-questoes-imagens')
with check (bucket_id = 'sidep-questoes-imagens');

drop policy if exists sidep_questoes_imagens_authenticated_delete on storage.objects;
create policy sidep_questoes_imagens_authenticated_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'sidep-questoes-imagens');
