-- SIDEP-CE - Sprint 2: validacao de permissoes dos usuarios reais (somente leitura)
-- Data: 08/08/2026
--
-- Nao substitui um login real, mas confirma estruturalmente que os dados
-- dos dois professores reais (07286 e 06797) estao corretamente vinculados
-- as suas proprias escolas, sem cruzamento. Se tudo aqui bater, a RLS ja
-- validada na Sprint 1 garante que cada um so enxerga o proprio escopo.

-- 1) Perfil Auth de cada professor: precisa existir, estar ativo, e
--    professor_matricula/escola nao podem estar vazios nem trocados.
select
  p.nome,
  p.email,
  p.perfil,
  p.professor_matricula,
  p.escola_inep,
  p.ativo
from sidep_usuario_perfil p
where p.professor_matricula in ('07286', '06797')
order by p.professor_matricula;

-- 2) Vinculo formal professor-escola: cada professor deve aparecer
--    vinculado SOMENTE a escola que ele realmente atua.
select
  pr.matricula,
  pr.nome_completo,
  e.codigo_inep,
  e.nome_oficial,
  pv.papel,
  pv.ativo
from professor_vinculo pv
join professor pr on pr.id = pv.professor_id
join escola e on e.id = pv.escola_id
where pr.matricula in ('07286', '06797')
order by pr.matricula;

-- 3) Confere se alguma avaliacao/resposta desses professores aponta para
--    uma escola diferente da que ele realmente atende (deveria vir vazio).
select
  a.codigo_acesso,
  a.professor_matricula,
  a.escola_inep as escola_na_avaliacao,
  pv_check.escola_inep as escola_do_vinculo_real
from avaliacao_mvp a
left join lateral (
  select e.codigo_inep as escola_inep
  from professor pr
  join professor_vinculo pv on pv.professor_id = pr.id and pv.ativo = true
  join escola e on e.id = pv.escola_id
  where pr.matricula = a.professor_matricula
    and e.codigo_inep = a.escola_inep
  limit 1
) pv_check on true
where a.professor_matricula in ('07286', '06797')
  and pv_check.escola_inep is null;
