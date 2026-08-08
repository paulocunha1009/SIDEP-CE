-- SIDEP-CE - Backup antes da limpeza de senhas legadas (Item 4 da Sprint 0)
-- Data: 08/08/2026
--
-- Rode este arquivo PRIMEIRO, antes de
-- cleanup_2026_07_14_senhas_legadas_pos_auth.sql. Ele so LE dados e cria
-- tabelas de backup - nao apaga nem altera nada.
--
-- Depois de rodar, confira o resultado do SELECT final: se os totais
-- baterem com o que voce espera, siga para o script de limpeza.

create table if not exists backup_20260808_escola_senha_legada as
select codigo_inep, nome_oficial, senha_inicial_hash, atualizado_em
from escola
where senha_inicial_hash is not null;

create table if not exists backup_20260808_professor_senha_legada as
select matricula, nome_completo, senha_inicial_hash, atualizado_em
from professor
where senha_inicial_hash is not null;

select
  'backup_escola_senha_legada' as indicador,
  count(*) as total
from backup_20260808_escola_senha_legada

union all

select
  'backup_professor_senha_legada' as indicador,
  count(*) as total
from backup_20260808_professor_senha_legada;
