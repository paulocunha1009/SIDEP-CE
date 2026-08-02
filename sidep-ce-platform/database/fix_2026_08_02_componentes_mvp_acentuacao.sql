-- SIDEP-CE - correcao pontual de acentuacao em componentes da matriz v2 e descritores MVP.
-- Nao altera questoes, avaliacoes, respostas nem descritores. Apenas saneia nomes de componentes.

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
  when 'EC-INF-2025-RED' then 'REDES DE COMPUTADORES'
  when 'EC-INF-2025-GC' then U&'GERENCIADOR DE CONTE\00DADO'
  when 'EC-INF-2025-PC' then 'PLANEJAMENTO DE CARREIRA'
  when 'EC-INF-2025-ROB' then U&'NO\00C7\00D5ES DE ROB\00D3TICA'
  else nome
end
where matriz_codigo = 'EC-INF-2025';

update descritor_mvp
set componente_curricular = case
  when codigo like 'IB-%' then U&'INFORM\00C1TICA B\00C1SICA'
  when codigo like 'LP1-%' then U&'L\00D3GICA DE PROGRAMA\00C7\00C3O I'
  when codigo like 'LP2-%' then U&'L\00D3GICA DE PROGRAMA\00C7\00C3O II'
  when codigo like 'AMC-%' then U&'ARQUITETURA E MANUTEN\00C7\00C3O DE COMPUTADORES'
  when codigo like 'POO-%' then U&'PROGRAMA\00C7\00C3O ORIENTADA A OBJETOS'
  when codigo like 'SO-%' then 'SISTEMAS OPERACIONAIS'
  when codigo like 'HTML-%' then 'HTML/CSS'
  when codigo like 'DG-%' then U&'DESIGN GR\00C1FICO'
  when codigo like 'PWEB-%' then U&'PROGRAMA\00C7\00C3O WEB'
  when codigo like 'PI-%' then 'PROJETO INTEGRADOR'
  when codigo like 'BD-%' then 'BANCO DE DADOS'
  when codigo like 'LS-%' then U&'LABORAT\00D3RIO DE SOFTWARE'
  when codigo like 'LH-%' then U&'LABORAT\00D3RIO DE HARDWARE'
  when codigo like 'RED-%' then 'REDES DE COMPUTADORES'
  when codigo like 'GC-%' then U&'GERENCIADOR DE CONTE\00DADO'
  when codigo like 'PC-%' then 'PLANEJAMENTO DE CARREIRA'
  when codigo like 'ROB-%' then U&'NO\00C7\00D5ES DE ROB\00D3TICA'
  else componente_curricular
end;

select componente_curricular, count(*)::int as descritores
from descritor_mvp
group by componente_curricular
order by componente_curricular;
