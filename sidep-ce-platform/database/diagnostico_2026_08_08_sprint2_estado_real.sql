-- SIDEP-CE - Sprint 2: diagnostico do estado real (somente leitura)
-- Data: 08/08/2026
--
-- Nao grava nada. sidep_obter_avaliacao_publica e uma funcao so de leitura
-- (quem grava resposta e a funcao separada sidep_enviar_resposta_publica,
-- nao usada aqui) - seguro rodar contra uma avaliacao real, mesmo aberta,
-- sem registrar tentativa nem interferir em aluno nenhum.

-- 1. Confirma se a funcao em producao ja tem a correcao de 02/08/2026
--    (regional_codigo virou null porque avaliacao_mvp nao tem essa coluna).
select prosrc ilike '%v_avaliacao.regional_codigo%' as ainda_tem_bug_regional_codigo
from pg_proc
where proname = 'sidep_obter_avaliacao_publica';

-- 2. Lista as avaliacoes reais existentes hoje, com contagem de questoes
--    validadas vinculadas (sem mostrar conteudo de questao nenhuma).
select
  codigo_acesso,
  status,
  escola_inep,
  professor_matricula,
  jsonb_array_length(coalesce(questoes_codigos, '[]'::jsonb)) as questoes_planejadas,
  (
    select count(*)
    from jsonb_array_elements_text(coalesce(a.questoes_codigos, '[]'::jsonb)) codigo
    join questao_mvp q on q.codigo = codigo
    where q.status = 'validada'
  ) as questoes_validadas_disponiveis
from avaliacao_mvp a
order by status, codigo_acesso;

-- 3. Testa a RPC do aluno contra cada avaliacao ABERTA de verdade (troque o
--    codigo abaixo pelos codigos reais que apareceram no passo 2 com status
--    'aberta'). So leitura - nao registra tentativa do aluno de teste.
-- select sidep_obter_avaliacao_publica('TROQUE-PELO-CODIGO-REAL', 'Aluno Teste Diagnostico') as retorno;

-- 4. Confirma que RLS de avaliacao_mvp/resposta_avaliacao segue sem alerta
--    (nenhuma linha aqui deveria ter policies vazias/ausentes).
select tablename, count(*) as total_policies
from pg_policies
where tablename in ('avaliacao_mvp', 'resposta_avaliacao', 'avaliacao_codigo_bloqueado', 'professor_vinculo', 'sidep_usuario_perfil')
group by tablename
order by tablename;
