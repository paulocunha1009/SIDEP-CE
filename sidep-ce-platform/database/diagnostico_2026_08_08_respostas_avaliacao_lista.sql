-- SIDEP-CE - Sprint 2: listar respostas reais para investigar discrepancia
-- Data: 08/08/2026
--
-- Somente leitura. Objetivo: ver nome do aluno, avaliacao, turma e data de
-- envio de cada resposta registrada, para identificar se ha respostas de
-- teste (nomes como "Teste", "Aluno Teste", datas muito antigas, nomes
-- repetidos de forma suspeita) misturadas com respostas reais.

select
  r.avaliacao_codigo,
  a.status as status_avaliacao,
  r.estudante_nome,
  r.turma_codigo,
  r.acertos,
  r.total_questoes,
  r.percentual_bruto,
  r.enviado_em
from resposta_avaliacao r
left join avaliacao_mvp a on a.codigo_acesso = r.avaliacao_codigo
order by r.avaliacao_codigo, r.enviado_em;

-- Contagem por avaliacao, para comparar com o numero de alunos reais que
-- voce sabe que participaram de cada uma.
select
  avaliacao_codigo,
  count(*) as total_respostas
from resposta_avaliacao
group by avaliacao_codigo
order by avaliacao_codigo;
