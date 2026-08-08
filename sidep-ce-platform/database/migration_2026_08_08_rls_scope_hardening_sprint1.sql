-- SIDEP-CE - Sprint 1: fecha gaps de escopo no RLS (WITH CHECK)
-- Data: 08/08/2026
--
-- Contexto:
-- A auditoria de 08/08/2026 encontrou duas policies onde o WITH CHECK (regra
-- de escrita) e mais fraco que o USING (regra de leitura):
--
-- 1. professor_vinculo: WITH CHECK so validava o PAPEL do usuario
--    (administrador/seduc/regional/gestao_escolar), sem confirmar que a
--    escola/regional do vinculo e a mesma do usuario.
-- 2. avaliacao_mvp, avaliacao_codigo_bloqueado, resposta_avaliacao: WITH
--    CHECK liberava a escrita so por "professor_matricula bate com o
--    usuario atual", sem confirmar que o escola_inep gravado na linha e
--    uma escola onde esse professor realmente tem vinculo.
--
-- Pre-requisito ja verificado (ver database/diagnostico_2026_08_08_vinculo_avaliacoes_reais.sql):
-- as 4 avaliacoes reais existentes hoje (2 abertas, 2 encerradas) ja tem
-- vinculo correto entre professor e escola - esta migracao NAO bloqueia
-- nenhuma delas.
--
-- Esta migracao SO altera WITH CHECK (regra de escrita). USING (regra de
-- leitura) fica igual - ninguem perde acesso de leitura que ja tinha.

-- 1. professor_vinculo: escrita exige escopo real, nao so o papel
drop policy if exists sidep_professor_vinculo_scope on professor_vinculo;
create policy sidep_professor_vinculo_scope
on professor_vinculo
for all
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or exists (
    select 1
    from professor p
    join escola e on e.id = professor_vinculo.escola_id
    join regional r on r.id = e.regional_id
    where p.id = professor_vinculo.professor_id
      and (
        p.matricula = (select professor_matricula from sidep_current_profile())
        or e.codigo_inep = (select escola_inep from sidep_current_profile())
        or r.codigo = (select regional_codigo from sidep_current_profile())
      )
  )
)
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or exists (
    select 1
    from escola e
    join regional r on r.id = e.regional_id
    where e.id = professor_vinculo.escola_id
      and (
        (sidep_current_role() = 'gestao_escolar' and e.codigo_inep = (select escola_inep from sidep_current_profile()))
        or (sidep_current_role() = 'regional' and r.codigo = (select regional_codigo from sidep_current_profile()))
      )
  )
);

-- 2a. avaliacao_mvp: escrita de professor exige matricula E escola vinculada
drop policy if exists sidep_avaliacao_write_scope on avaliacao_mvp;
create policy sidep_avaliacao_write_scope
on avaliacao_mvp
for all
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or (
    sidep_current_role() in ('gestao_escolar', 'regional')
    and sidep_can_access_school(escola_inep)
  )
)
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or (
    professor_matricula = (select professor_matricula from sidep_current_profile())
    and sidep_can_access_school(escola_inep)
  )
  or (
    sidep_current_role() in ('gestao_escolar', 'regional')
    and sidep_can_access_school(escola_inep)
  )
);

-- 2b. avaliacao_codigo_bloqueado: mesmo ajuste
drop policy if exists sidep_codigo_bloqueado_staff_scope on avaliacao_codigo_bloqueado;
create policy sidep_codigo_bloqueado_staff_scope
on avaliacao_codigo_bloqueado
for all
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
)
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or (
    professor_matricula = (select professor_matricula from sidep_current_profile())
    and sidep_can_access_school(escola_inep)
  )
  or (
    sidep_current_role() in ('gestao_escolar', 'regional')
    and sidep_can_access_school(escola_inep)
  )
);

-- 2c. resposta_avaliacao: insert e update, mesmo ajuste
drop policy if exists sidep_resposta_staff_insert_update_scope on resposta_avaliacao;
create policy sidep_resposta_staff_insert_update_scope
on resposta_avaliacao
for insert
to authenticated
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or (
    professor_matricula = (select professor_matricula from sidep_current_profile())
    and sidep_can_access_school(escola_inep)
  )
  or (
    sidep_current_role() in ('gestao_escolar', 'regional')
    and sidep_can_access_school(escola_inep)
  )
);

drop policy if exists sidep_resposta_staff_update_scope on resposta_avaliacao;
create policy sidep_resposta_staff_update_scope
on resposta_avaliacao
for update
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
)
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or (
    professor_matricula = (select professor_matricula from sidep_current_profile())
    and sidep_can_access_school(escola_inep)
  )
  or (
    sidep_current_role() in ('gestao_escolar', 'regional')
    and sidep_can_access_school(escola_inep)
  )
);

-- Verificacao pos-migracao: lista as policies recriadas para conferencia visual
select schemaname, tablename, policyname, cmd
from pg_policies
where tablename in ('professor_vinculo', 'avaliacao_mvp', 'avaliacao_codigo_bloqueado', 'resposta_avaliacao')
order by tablename, cmd;
