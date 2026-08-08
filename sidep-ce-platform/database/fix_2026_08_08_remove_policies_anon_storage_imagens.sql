-- SIDEP-CE - Correcao urgente: policies anonimas remanescentes no Storage
-- Data: 08/08/2026
--
-- Achado ao verificar migration_2026_08_08_storage_imagens_por_status.sql:
-- as policies do piloto inicial (sidep_questoes_imagens_select_anon,
-- sidep_questoes_imagens_insert_anon, sidep_questoes_imagens_update_anon)
-- CONTINUAVAM ATIVAS em producao, apesar de migration_2026_07_14_storage_imagens_seguro.sql
-- ja mandar remove-las. Ate agora, qualquer pessoa sem login podia
-- listar/ler, ENVIAR e SOBRESCREVER arquivos no bucket de imagens de
-- questoes. Prioridade maxima - rodar imediatamente.

drop policy if exists sidep_questoes_imagens_select_anon on storage.objects;
drop policy if exists sidep_questoes_imagens_insert_anon on storage.objects;
drop policy if exists sidep_questoes_imagens_update_anon on storage.objects;
drop policy if exists sidep_questoes_imagens_delete_anon on storage.objects;

select policyname, cmd, roles
from pg_policies
where schemaname = 'storage' and tablename = 'objects' and policyname like 'sidep_questoes_imagens%';
