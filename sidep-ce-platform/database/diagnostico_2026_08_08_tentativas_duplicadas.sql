-- SIDEP-CE - Sprint 2: conferencia de segunda tentativa bloqueada (somente leitura)
-- Data: 08/08/2026
--
-- resposta_avaliacao tem unique(avaliacao_codigo, estudante_chave), entao
-- duplicidade EXATA ja e impossivel no banco. Esta consulta verifica algo
-- um pouco mais sutil: nomes muito parecidos (mesmo aluno digitou o nome
-- de forma levemente diferente) que poderiam indicar tentativa duplicada
-- que escapou do bloqueio por nao bater a chave exatamente.

select
  avaliacao_codigo,
  estudante_nome,
  lower(regexp_replace(estudante_nome, '\s+', ' ', 'g')) as nome_normalizado,
  count(*) over (partition by avaliacao_codigo, lower(regexp_replace(estudante_nome, '\s+', ' ', 'g'))) as ocorrencias_nome_identico
from resposta_avaliacao
order by avaliacao_codigo, nome_normalizado;
