-- SIDEP-CE - Backup manual do piloto real (Sprint 2)
-- Data: 08/08/2026
--
-- Somente leitura. Rode cada consulta separadamente no SQL Editor do
-- Supabase e clique em "Download CSV" no resultado para salvar uma copia
-- local. Guarde os dois arquivos em local seguro (ex.: pasta backups/
-- deste projeto, fora do controle de versao).

-- 1) Avaliacoes reais
select *
from avaliacao_mvp
order by codigo_acesso;

-- 2) Respostas reais dos alunos
select *
from resposta_avaliacao
order by avaliacao_codigo, enviado_em;
