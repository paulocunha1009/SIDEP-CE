-- SIDEP-CE - Sprint 1: Storage de imagens de questao por status
-- Data: 08/08/2026
--
-- Contexto:
-- O bucket "sidep-questoes-imagens" era publico (public = true), com uma
-- unica policy de select liberada para anon/authenticated sem checar o
-- status da questao nem restringir listagem. Buckets publicos no Supabase
-- servem objetos via um endpoint que IGNORA RLS por completo, entao apenas
-- ajustar a policy nao seria suficiente - o caminho do arquivo
-- (questoes/{codigo_da_questao}/...) e previsivel, e qualquer pessoa sem
-- login podia listar e baixar TODAS as imagens do banco de itens, inclusive
-- rascunhos nunca publicados.
--
-- Confirmado com o usuario em 08/08/2026: nenhuma questao tem imagem em uso
-- hoje, entao esta correcao e segura de aplicar imediatamente (nao quebra
-- nenhuma imagem real ja publicada).
--
-- Correcao: bucket passa a ser PRIVADO. Leitura so via URL assinada, gerada
-- sob demanda pelo frontend (ver resolverUrlImagemQuestao em
-- app/src/services/itemBankRepository.ts). Staff (qualquer perfil
-- institucional autenticado e ativo) le qualquer imagem, independente do
-- status, para poder curar o banco. Leitura anonima (aluno, via RPC publica)
-- so e permitida para questoes com status "validada".

update storage.buckets set public = false where id = 'sidep-questoes-imagens';

drop policy if exists sidep_questoes_imagens_public_read on storage.objects;

drop policy if exists sidep_questoes_imagens_select_staff on storage.objects;
create policy sidep_questoes_imagens_select_staff
on storage.objects
for select
to authenticated
using (
  bucket_id = 'sidep-questoes-imagens'
  and sidep_current_role() is not null
);

drop policy if exists sidep_questoes_imagens_select_validada on storage.objects;
create policy sidep_questoes_imagens_select_validada
on storage.objects
for select
to anon
using (
  bucket_id = 'sidep-questoes-imagens'
  and exists (
    select 1
    from public.questao_mvp q
    where q.codigo = split_part(storage.objects.name, '/', 2)
      and q.status = 'validada'
  )
);

select policyname, cmd, roles
from pg_policies
where schemaname = 'storage' and tablename = 'objects' and policyname like 'sidep_questoes_imagens%';
