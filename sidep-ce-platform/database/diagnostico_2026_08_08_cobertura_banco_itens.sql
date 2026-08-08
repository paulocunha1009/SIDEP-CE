-- SIDEP-CE - Sprint 2: cobertura do banco de itens por descritor (somente leitura)
-- Data: 08/08/2026
--
-- Objetivo: confirmar se a concentracao em IB-D01/IB-D02 nas 4 avaliacoes
-- reais aconteceu porque so havia questao VALIDADA suficiente nesses dois
-- descritores no momento em que as avaliacoes foram criadas (04 a 07/08),
-- apos o reset do banco de itens pela matriz v2 em 02/08.

select
  d.codigo as descritor,
  d.competencia_codigo,
  count(q.codigo) as total_questoes,
  count(q.codigo) filter (where q.status = 'validada') as validadas,
  count(q.codigo) filter (where q.status = 'em_revisao') as em_revisao,
  count(q.codigo) filter (where q.status = 'rascunho') as rascunho
from descritor_mvp d
left join questao_mvp q on q.descritor_codigo = d.codigo
group by d.codigo, d.competencia_codigo
order by d.competencia_codigo, d.codigo;
