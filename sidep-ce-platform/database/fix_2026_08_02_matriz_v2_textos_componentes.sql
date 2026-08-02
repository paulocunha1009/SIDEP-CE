-- SIDEP-CE - saneamento de textos da matriz EC-INF-2025
-- Objetivo: corrigir registros que possam ter sido colados/executados com codificacao quebrada no Supabase.
-- As strings com acentos usam escape Unicode do PostgreSQL para evitar depender da codificacao do navegador.

update matriz_curricular_v2
set curso_nome = U&'T\00E9cnico em Inform\00E1tica - Escolas do Campo - 2025'
where codigo = 'EC-INF-2025';

update matriz_componente_v2
set nome = case codigo
  when 'EC-INF-2025-IB' then U&'INFORM\00C1TICA B\00C1SICA'
  when 'EC-INF-2025-LP1' then U&'L\00D3GICA DE PROGRAMA\00C7\00C3O I'
  when 'EC-INF-2025-LP2' then U&'L\00D3GICA DE PROGRAMA\00C7\00C3O II'
  when 'EC-INF-2025-AMC' then U&'ARQUITETURA E MANUTEN\00C7\00C3O DE COMPUTADORES'
  when 'EC-INF-2025-POO' then U&'PROGRAMA\00C7\00C3O ORIENTADA A OBJETOS'
  when 'EC-INF-2025-SO' then 'SISTEMAS OPERACIONAIS'
  when 'EC-INF-2025-HTML' then 'HTML/CSS'
  when 'EC-INF-2025-DG' then U&'DESIGN GR\00C1FICO'
  when 'EC-INF-2025-PWEB' then U&'PROGRAMA\00C7\00C3O WEB'
  when 'EC-INF-2025-PI' then 'PROJETO INTEGRADOR'
  when 'EC-INF-2025-BD' then 'BANCO DE DADOS'
  when 'EC-INF-2025-LS' then U&'LABORAT\00D3RIO DE SOFTWARE'
  when 'EC-INF-2025-LH' then U&'LABORAT\00D3RIO DE HARDWARE'
  when 'EC-INF-2025-RC' then 'REDE DE COMPUTADORES'
  when 'EC-INF-2025-GC' then U&'GERENCIADOR DE CONTE\00DADO'
  when 'EC-INF-2025-PC' then 'PLANEJAMENTO DE CARREIRA'
  when 'EC-INF-2025-NR' then U&'NO\00C7\00D5ES DE ROB\00D3TICA'
  else nome
end
where matriz_codigo = 'EC-INF-2025';

select codigo, nome
from matriz_componente_v2
where matriz_codigo = 'EC-INF-2025'
order by ordem;
