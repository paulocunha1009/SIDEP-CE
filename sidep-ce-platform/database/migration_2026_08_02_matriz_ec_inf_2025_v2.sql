-- SIDEP-CE - Matriz EC-INF-2025 v2
-- Gerado a partir de Matrizes_Descritores_Todas_Disciplinas_Tecnicas_SIDEP_CE_2025.md.
-- Migracao aditiva/idempotente: nao altera nem remove dados das tabelas MVP atuais.

create table if not exists matriz_curricular_v2 (
  codigo varchar(40) primary key,
  curso_codigo varchar(40) not null,
  curso_nome varchar(220) not null,
  modalidade varchar(120) not null,
  ano_matriz integer not null,
  carga_horaria_total integer not null,
  carga_horaria_tecnica integer not null,
  versao varchar(20) not null default '2.0',
  status varchar(20) not null default 'ativa' check (status in ('rascunho', 'ativa', 'inativa', 'substituida')),
  fonte text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists matriz_componente_v2 (
  codigo varchar(60) primary key,
  matriz_codigo varchar(40) not null references matriz_curricular_v2(codigo) on delete cascade,
  nome varchar(220) not null,
  sigla varchar(20) not null,
  carga_horaria integer not null,
  ordem integer not null,
  status varchar(20) not null default 'ativo' check (status in ('ativo', 'inativo')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (matriz_codigo, sigla),
  unique (matriz_codigo, nome)
);

create table if not exists competencia_curricular_v2 (
  codigo varchar(80) primary key,
  matriz_codigo varchar(40) not null references matriz_curricular_v2(codigo) on delete cascade,
  componente_codigo varchar(60) not null references matriz_componente_v2(codigo) on delete cascade,
  codigo_pedagogico varchar(40) not null,
  descricao text not null,
  versao varchar(20) not null default '2.0',
  status varchar(20) not null default 'ativa' check (status in ('rascunho', 'ativa', 'inativa')),
  fonte text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (matriz_codigo, componente_codigo, codigo_pedagogico)
);

create table if not exists descritor_curricular_v2 (
  codigo varchar(80) primary key,
  matriz_codigo varchar(40) not null references matriz_curricular_v2(codigo) on delete cascade,
  componente_codigo varchar(60) not null references matriz_componente_v2(codigo) on delete cascade,
  competencia_codigo varchar(80) not null references competencia_curricular_v2(codigo) on delete cascade,
  codigo_pedagogico varchar(40) not null,
  codigo_curto varchar(20) not null,
  descricao text not null,
  nivel_cognitivo varchar(10) not null check (nivel_cognitivo in ('N1', 'N2', 'N3')),
  nivel_tri_inicial varchar(40) not null check (nivel_tri_inicial in ('basico', 'intermediario', 'avancado')),
  tipo_evidencia text,
  referencia_ementa text,
  versao varchar(20) not null default '2.0',
  status varchar(20) not null default 'ativo' check (status in ('ativo', 'inativo', 'substituido')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (matriz_codigo, codigo_pedagogico),
  unique (matriz_codigo, componente_codigo, codigo_curto)
);

create table if not exists historico_migracao_curricular_v2 (
  id uuid primary key default gen_random_uuid(),
  matriz_codigo varchar(40) not null references matriz_curricular_v2(codigo),
  versao varchar(20) not null,
  acao varchar(80) not null,
  descricao text not null,
  metadados jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

create index if not exists matriz_componente_v2_matriz_idx on matriz_componente_v2 (matriz_codigo);
create index if not exists competencia_curricular_v2_matriz_idx on competencia_curricular_v2 (matriz_codigo);
create index if not exists competencia_curricular_v2_componente_idx on competencia_curricular_v2 (componente_codigo);
create index if not exists descritor_curricular_v2_matriz_idx on descritor_curricular_v2 (matriz_codigo);
create index if not exists descritor_curricular_v2_componente_idx on descritor_curricular_v2 (componente_codigo);
create index if not exists descritor_curricular_v2_competencia_idx on descritor_curricular_v2 (competencia_codigo);

alter table matriz_curricular_v2 enable row level security;
alter table matriz_curricular_v2 force row level security;
drop policy if exists sidep_matriz_curricular_v2_staff_select on matriz_curricular_v2;
create policy sidep_matriz_curricular_v2_staff_select on matriz_curricular_v2
for select to authenticated
using (sidep_current_role() in ('professor', 'professor_tecnico', 'coordenador_professor_tecnico', 'gestao_escolar', 'coordenador_escolar', 'regional', 'crede', 'seduc', 'administrador'));
drop policy if exists sidep_matriz_curricular_v2_staff_write on matriz_curricular_v2;
create policy sidep_matriz_curricular_v2_staff_write on matriz_curricular_v2
for all to authenticated
using (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'))
with check (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'));

alter table matriz_componente_v2 enable row level security;
alter table matriz_componente_v2 force row level security;
drop policy if exists sidep_matriz_componente_v2_staff_select on matriz_componente_v2;
create policy sidep_matriz_componente_v2_staff_select on matriz_componente_v2
for select to authenticated
using (sidep_current_role() in ('professor', 'professor_tecnico', 'coordenador_professor_tecnico', 'gestao_escolar', 'coordenador_escolar', 'regional', 'crede', 'seduc', 'administrador'));
drop policy if exists sidep_matriz_componente_v2_staff_write on matriz_componente_v2;
create policy sidep_matriz_componente_v2_staff_write on matriz_componente_v2
for all to authenticated
using (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'))
with check (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'));

alter table competencia_curricular_v2 enable row level security;
alter table competencia_curricular_v2 force row level security;
drop policy if exists sidep_competencia_curricular_v2_staff_select on competencia_curricular_v2;
create policy sidep_competencia_curricular_v2_staff_select on competencia_curricular_v2
for select to authenticated
using (sidep_current_role() in ('professor', 'professor_tecnico', 'coordenador_professor_tecnico', 'gestao_escolar', 'coordenador_escolar', 'regional', 'crede', 'seduc', 'administrador'));
drop policy if exists sidep_competencia_curricular_v2_staff_write on competencia_curricular_v2;
create policy sidep_competencia_curricular_v2_staff_write on competencia_curricular_v2
for all to authenticated
using (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'))
with check (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'));

alter table descritor_curricular_v2 enable row level security;
alter table descritor_curricular_v2 force row level security;
drop policy if exists sidep_descritor_curricular_v2_staff_select on descritor_curricular_v2;
create policy sidep_descritor_curricular_v2_staff_select on descritor_curricular_v2
for select to authenticated
using (sidep_current_role() in ('professor', 'professor_tecnico', 'coordenador_professor_tecnico', 'gestao_escolar', 'coordenador_escolar', 'regional', 'crede', 'seduc', 'administrador'));
drop policy if exists sidep_descritor_curricular_v2_staff_write on descritor_curricular_v2;
create policy sidep_descritor_curricular_v2_staff_write on descritor_curricular_v2
for all to authenticated
using (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'))
with check (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'));

alter table historico_migracao_curricular_v2 enable row level security;
alter table historico_migracao_curricular_v2 force row level security;
drop policy if exists sidep_historico_migracao_curricular_v2_staff_select on historico_migracao_curricular_v2;
create policy sidep_historico_migracao_curricular_v2_staff_select on historico_migracao_curricular_v2
for select to authenticated
using (sidep_current_role() in ('professor', 'professor_tecnico', 'coordenador_professor_tecnico', 'gestao_escolar', 'coordenador_escolar', 'regional', 'crede', 'seduc', 'administrador'));
drop policy if exists sidep_historico_migracao_curricular_v2_staff_write on historico_migracao_curricular_v2;
create policy sidep_historico_migracao_curricular_v2_staff_write on historico_migracao_curricular_v2
for all to authenticated
using (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'))
with check (sidep_current_role() in ('coordenador_professor_tecnico', 'regional', 'crede', 'seduc', 'administrador'));

grant select on matriz_curricular_v2, matriz_componente_v2, competencia_curricular_v2, descritor_curricular_v2, historico_migracao_curricular_v2 to authenticated;
grant insert, update on matriz_curricular_v2, matriz_componente_v2, competencia_curricular_v2, descritor_curricular_v2, historico_migracao_curricular_v2 to authenticated;

insert into matriz_curricular_v2 (codigo, curso_codigo, curso_nome, modalidade, ano_matriz, carga_horaria_total, carga_horaria_tecnica, versao, status, fonte, atualizado_em)
values ('EC-INF-2025', 'TEC-INF-EC', 'Tecnico em Informatica - Escolas do Campo - 2025', 'Escolas do Campo', 2025, 5000, 1500, '2.0', 'ativa', 'Matrizes_Descritores_Todas_Disciplinas_Tecnicas_SIDEP_CE_2025.md', now())
on conflict (codigo) do update set curso_codigo = excluded.curso_codigo, curso_nome = excluded.curso_nome, modalidade = excluded.modalidade, ano_matriz = excluded.ano_matriz, carga_horaria_total = excluded.carga_horaria_total, carga_horaria_tecnica = excluded.carga_horaria_tecnica, versao = excluded.versao, status = excluded.status, fonte = excluded.fonte, atualizado_em = now();

insert into matriz_componente_v2 (codigo, matriz_codigo, nome, sigla, carga_horaria, ordem, status, atualizado_em) values
  ('EC-INF-2025-IB', 'EC-INF-2025', 'INFORMÁTICA BÁSICA', 'IB', 100, 1, 'ativo', now()),
  ('EC-INF-2025-LP1', 'EC-INF-2025', 'LÓGICA DE PROGRAMAÇÃO I', 'LP1', 60, 2, 'ativo', now()),
  ('EC-INF-2025-LP2', 'EC-INF-2025', 'LÓGICA DE PROGRAMAÇÃO II', 'LP2', 40, 3, 'ativo', now()),
  ('EC-INF-2025-AMC', 'EC-INF-2025', 'ARQUITETURA E MANUTENÇÃO DE COMPUTADORES', 'AMC', 60, 4, 'ativo', now()),
  ('EC-INF-2025-POO', 'EC-INF-2025', 'PROGRAMAÇÃO ORIENTADA A OBJETOS', 'POO', 60, 5, 'ativo', now()),
  ('EC-INF-2025-SO', 'EC-INF-2025', 'SISTEMAS OPERACIONAIS', 'SO', 60, 6, 'ativo', now()),
  ('EC-INF-2025-HTML', 'EC-INF-2025', 'HTML/CSS', 'HTML', 60, 7, 'ativo', now()),
  ('EC-INF-2025-DG', 'EC-INF-2025', 'DESIGN GRÁFICO', 'DG', 40, 8, 'ativo', now()),
  ('EC-INF-2025-PWEB', 'EC-INF-2025', 'PROGRAMAÇÃO WEB', 'PWEB', 60, 9, 'ativo', now()),
  ('EC-INF-2025-PI', 'EC-INF-2025', 'PROJETO INTEGRADOR', 'PI', 20, 10, 'ativo', now()),
  ('EC-INF-2025-BD', 'EC-INF-2025', 'BANCO DE DADOS', 'BD', 80, 11, 'ativo', now()),
  ('EC-INF-2025-LS', 'EC-INF-2025', 'LABORATÓRIO DE SOFTWARE', 'LS', 60, 12, 'ativo', now()),
  ('EC-INF-2025-LH', 'EC-INF-2025', 'LABORATÓRIO DE HARDWARE', 'LH', 80, 13, 'ativo', now()),
  ('EC-INF-2025-RED', 'EC-INF-2025', 'REDE DE COMPUTADORES', 'RED', 60, 14, 'ativo', now()),
  ('EC-INF-2025-GC', 'EC-INF-2025', 'GERENCIADOR DE CONTEÚDO', 'GC', 40, 15, 'ativo', now()),
  ('EC-INF-2025-PC', 'EC-INF-2025', 'PLANEJAMENTO DE CARREIRA', 'PC', 40, 16, 'ativo', now()),
  ('EC-INF-2025-ROB', 'EC-INF-2025', 'NOÇÕES DE ROBÓTICA', 'ROB', 40, 17, 'ativo', now())
on conflict (codigo) do update set nome = excluded.nome, sigla = excluded.sigla, carga_horaria = excluded.carga_horaria, ordem = excluded.ordem, status = excluded.status, atualizado_em = now();

insert into competencia_curricular_v2 (codigo, matriz_codigo, componente_codigo, codigo_pedagogico, descricao, versao, status, fonte, atualizado_em) values
  ('EC-INF-2025-C-IB', 'EC-INF-2025', 'EC-INF-2025-IB', 'C-IB', 'utilizar recursos computacionais, sistema operacional, ferramentas de produtividade, serviços digitais e internet com organização, autonomia e segurança.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-LP1', 'EC-INF-2025', 'EC-INF-2025-LP1', 'C-LP1', 'representar problemas e construir algoritmos e programas básicos em Python utilizando sequência, dados, expressões e decisões.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-LP2', 'EC-INF-2025', 'EC-INF-2025-LP2', 'C-LP2', 'construir, testar e integrar algoritmos com decisões, repetições, funções, vetores e matrizes.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-AMC', 'EC-INF-2025', 'EC-INF-2025-AMC', 'C-AMC', 'identificar, montar, conservar, testar e diagnosticar sistemas computacionais com segurança e documentação técnica.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-POO', 'EC-INF-2025', 'EC-INF-2025-POO', 'C-POO', 'projetar, implementar e testar programas em Python utilizando objetos, exceções, interface e persistência.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-SO', 'EC-INF-2025', 'EC-INF-2025-SO', 'C-SO', 'instalar, configurar, operar e administrar sistemas Windows e Linux, seus arquivos, usuários, dispositivos, redes e comandos.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-HTML', 'EC-INF-2025', 'EC-INF-2025-HTML', 'C-HTML', 'estruturar páginas semânticas, acessíveis e estilizadas com HTML5 e CSS3.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-DG', 'EC-INF-2025', 'EC-INF-2025-DG', 'C-DG', 'planejar e produzir comunicação visual coerente, criativa e adequada ao público e ao meio digital.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-PWEB', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'C-PWEB', 'desenvolver e publicar aplicações web dinâmicas com PHP, formulários, arquivos, banco de dados e controle de versão.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-PI', 'EC-INF-2025', 'EC-INF-2025-PI', 'C-PI', 'planejar, integrar, aplicar e comunicar conhecimentos técnicos em uma entrega vinculada às trilhas formativas definidas para o curso.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-BD', 'EC-INF-2025', 'EC-INF-2025-BD', 'C-BD', 'modelar, implementar, consultar e manter bancos relacionais com integridade, segurança e documentação.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-LS', 'EC-INF-2025', 'EC-INF-2025-LS', 'C-LS', 'planejar, modelar, implementar, testar, documentar e apresentar uma aplicação web integrada.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-LH', 'EC-INF-2025', 'EC-INF-2025-LH', 'C-LH', 'prestar suporte integrado, diagnosticar e reparar computadores, administrar sistemas e implementar redes locais com segurança.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-RED', 'EC-INF-2025', 'EC-INF-2025-RED', 'C-RED', 'compreender, endereçar, configurar e diagnosticar redes locais, seus protocolos, serviços, meios e mecanismos básicos de segurança.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-GC', 'EC-INF-2025', 'EC-INF-2025-GC', 'C-GC', 'instalar, configurar, produzir, proteger, migrar e publicar sites com WordPress.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-PC', 'EC-INF-2025', 'EC-INF-2025-PC', 'C-PC', 'analisar o mercado de TI, reconhecer o próprio perfil e construir estratégias éticas e realistas de formação, inserção profissional e carreira.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now()),
  ('EC-INF-2025-C-ROB', 'EC-INF-2025', 'EC-INF-2025-ROB', 'C-ROB', 'projetar e testar protótipos com Arduino, programação, eletrônica, sensores e atuadores para automatizar situações reais.', '2.0', 'ativa', 'Catalogo tecnico SIDEP-CE 2025', now())
on conflict (codigo) do update set componente_codigo = excluded.componente_codigo, codigo_pedagogico = excluded.codigo_pedagogico, descricao = excluded.descricao, versao = excluded.versao, status = excluded.status, fonte = excluded.fonte, atualizado_em = now();

insert into descritor_curricular_v2 (codigo, matriz_codigo, componente_codigo, competencia_codigo, codigo_pedagogico, codigo_curto, descricao, nivel_cognitivo, nivel_tri_inicial, tipo_evidencia, referencia_ementa, versao, status, atualizado_em) values
  ('EC-INF-2025-IB-D01', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D01', 'D01', 'Distinguir tecnologia, computação, informática, hardware e software em situações cotidianas.', 'N1', 'basico', 'Item objetivo ou classificação.', '1.1 e 1.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D02', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D02', 'D02', 'Identificar dispositivos de entrada, saída e armazenamento e explicar suas funções.', 'N1', 'basico', 'Imagem, associação ou inspeção.', '1.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D03', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D03', 'D03', 'Utilizar área de trabalho, menu, barra de tarefas, ícones, atalhos e lixeira do Windows.', 'N2', 'intermediario', 'Checklist prático.', 'Módulo 2', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D04', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D04', 'D04', 'Organizar janelas e utilizar o Explorador de Arquivos para localizar e selecionar itens.', 'N2', 'intermediario', 'Tarefa prática.', 'Módulo 3', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D05', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D05', 'D05', 'Criar, copiar, mover, renomear e excluir arquivos e pastas, reconhecendo diretórios e extensões.', 'N2', 'intermediario', 'Simulação ou prática.', 'Módulo 4', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D06', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D06', 'D06', 'Produzir e formatar documentos no Writer, utilizando recursos de estrutura, imagem, tabela, revisão e exportação.', 'N3', 'avancado', 'Produto digital e rubrica.', 'Módulo 6', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D07', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D07', 'D07', 'Aplicar normas básicas de organização acadêmica, cabeçalho, rodapé, notas, paginação e impressão.', 'N2', 'intermediario', 'Documento orientado.', '6.18 a 6.28', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D08', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D08', 'D08', 'Organizar dados em planilhas, formatar células, linhas, colunas e planilhas e realizar cálculos simples.', 'N2', 'intermediario', 'Planilha prática.', 'Módulo 7', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D09', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D09', 'D09', 'Aplicar funções matemáticas, estatísticas, lógicas, condicionais, de data e de busca em planilhas.', 'N3', 'avancado', 'Planilha ou análise de fórmula.', 'Módulo 8', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D10', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D10', 'D10', 'Criar gráficos e interpretar representações visuais produzidas a partir de dados.', 'N2', 'intermediario', 'Gráfico ou situação-problema.', '8.19', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D11', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D11', 'D11', 'Criar apresentações com organização visual, mídias, hiperlinks, transições e controle de exibição.', 'N3', 'avancado', 'Apresentação e rubrica.', 'Módulo 9', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D12', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D12', 'D12', 'Utilizar Gmail, Drive, Docs, Forms, Classroom, Agenda e Meet em atividades colaborativas.', 'N2', 'intermediario', 'Tarefa digital ou checklist.', 'Módulo 10', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D13', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D13', 'D13', 'Pesquisar e navegar na internet, avaliando links, buscadores e fontes de informação.', 'N2', 'intermediario', 'Pesquisa orientada.', '11.1 a 11.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D14', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D14', 'D14', 'Compactar e converter arquivos, selecionando formato e ferramenta adequados.', 'N2', 'intermediario', 'Procedimento prático.', '11.4 e 11.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-IB-D15', 'EC-INF-2025', 'EC-INF-2025-IB', 'EC-INF-2025-C-IB', 'IB-D15', 'D15', 'Aplicar proteção de dados, segurança na internet, netiqueta e cuidados básicos de desempenho.', 'N2', 'intermediario', 'Estudo de caso.', '11.6 a 11.9', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP1-D01', 'EC-INF-2025', 'EC-INF-2025-LP1', 'EC-INF-2025-C-LP1', 'LP1-D01', 'D01', 'Aplicar raciocínio lógico para decompor problemas em passos ordenados.', 'N2', 'intermediario', 'Sequenciamento ou situação-problema.', '1 e 2.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP1-D02', 'EC-INF-2025', 'EC-INF-2025-LP1', 'EC-INF-2025-C-LP1', 'LP1-D02', 'D02', 'Representar algoritmos por descrição narrativa e fluxograma.', 'N2', 'intermediario', 'Produção ou interpretação.', '2.2 e 2.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP1-D03', 'EC-INF-2025', 'EC-INF-2025-LP1', 'EC-INF-2025-C-LP1', 'LP1-D03', 'D03', 'Distinguir linguagem estruturada, orientação a objetos, compilação, interpretação e execução.', 'N1', 'basico', 'Comparação ou item objetivo.', '2.4 a 2.6', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP1-D04', 'EC-INF-2025', 'EC-INF-2025-LP1', 'EC-INF-2025-C-LP1', 'LP1-D04', 'D04', 'Reconhecer sintaxe básica, tipos primitivos, variáveis, constantes e comentários em Python.', 'N1', 'basico', 'Análise de código.', '3.1 a 3.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP1-D05', 'EC-INF-2025', 'EC-INF-2025-LP1', 'EC-INF-2025-C-LP1', 'LP1-D05', 'D05', 'Aplicar atribuição, entrada, saída e conversão de dados em programas simples.', 'N2', 'intermediario', 'Código ou previsão de saída.', '3.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP1-D06', 'EC-INF-2025', 'EC-INF-2025-LP1', 'EC-INF-2025-C-LP1', 'LP1-D06', 'D06', 'Construir e interpretar expressões aritméticas respeitando operadores e precedência.', 'N2', 'intermediario', 'Cálculo ou análise de código.', '3.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP1-D07', 'EC-INF-2025', 'EC-INF-2025-LP1', 'EC-INF-2025-C-LP1', 'LP1-D07', 'D07', 'Interpretar operadores relacionais, lógicos e valores booleanos.', 'N2', 'intermediario', 'Tabela-verdade ou item de código.', '4.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP1-D08', 'EC-INF-2025', 'EC-INF-2025-LP1', 'EC-INF-2025-C-LP1', 'LP1-D08', 'D08', 'Construir decisões com `if`, `else` e `elif` para resolver situações simples.', 'N2', 'intermediario', 'Código ou fluxograma.', '4.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP1-D09', 'EC-INF-2025', 'EC-INF-2025-LP1', 'EC-INF-2025-C-LP1', 'LP1-D09', 'D09', 'Testar algoritmos e prever o fluxo e a saída de programas básicos.', 'N3', 'avancado', 'Teste de mesa ou depuração.', 'Integração 2 a 4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D01', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D01', 'D01', 'Revisar e integrar variáveis, entradas, saídas, conversões e operações em programas.', 'N2', 'intermediario', 'Análise de código.', '3', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D02', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D02', 'D02', 'Comparar valores e determinar resultados de expressões relacionais e booleanas.', 'N1', 'basico', 'Previsão ou tabela.', '4.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D03', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D03', 'D03', 'Aplicar `and`, `or` e `not` em regras compostas.', 'N2', 'intermediario', 'Regra contextualizada.', '4.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D04', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D04', 'D04', 'Analisar decisões com `if`, `elif`, `else` e condições aninhadas.', 'N2', 'intermediario', 'Código ou teste de mesa.', '4.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D05', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D05', 'D05', 'Aplicar `for` com contadores, acumuladores e percursos definidos.', 'N2', 'intermediario', 'Código ou rastreamento.', '5.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D06', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D06', 'D06', 'Aplicar `while` com condições adequadas de continuidade e parada.', 'N2', 'intermediario', 'Código ou análise de loop.', '5.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D07', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D07', 'D07', 'Validar entradas utilizando decisões e repetições.', 'N3', 'avancado', 'Correção ou situação-problema.', 'Integração 4 e 5', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D08', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D08', 'D08', 'Criar, consultar e alterar vetores ou listas.', 'N2', 'intermediario', 'Código prático.', '7.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D09', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D09', 'D09', 'Percorrer, buscar, filtrar, contar e resumir dados em vetores ou listas.', 'N3', 'avancado', 'Algoritmo contextualizado.', '7.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D10', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D10', 'D10', 'Representar e processar dados em matrizes.', 'N2', 'intermediario', 'Mapa, tabela ou código.', '7.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D11', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D11', 'D11', 'Criar procedimentos e funções com parâmetros e retorno.', 'N3', 'avancado', 'Função ou refatoração.', '6.1, 6.2 e 6.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LP2-D12', 'EC-INF-2025', 'EC-INF-2025-LP2', 'EC-INF-2025-C-LP2', 'LP2-D12', 'D12', 'Reconhecer recursividade e integrar estruturas em uma solução testada.', 'N3', 'avancado', 'Análise, teste ou projeto.', '6.3 e integração', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D01', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D01', 'D01', 'Aplicar segurança, organização de bancada e inventário.', 'N2', 'intermediario', 'Checklist.', 'Módulos 1 e 4', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D02', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D02', 'D02', 'Relacionar entrada, processamento, saída e armazenamento.', 'N1', 'basico', 'Diagrama.', '2', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D03', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D03', 'D03', 'Identificar componentes, periféricos e conectores.', 'N1', 'basico', 'Imagem ou inspeção.', '2.1 e 2.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D04', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D04', 'D04', 'Interpretar ULA, UC, registradores, clock, arquiteturas e sockets.', 'N1', 'basico', 'Comparação.', '3', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D05', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D05', 'D05', 'Relacionar refrigeração e temperatura.', 'N2', 'intermediario', 'Caso de aquecimento.', '3.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D06', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D06', 'D06', 'Distinguir RAM, ROM, cache, flash e VRAM.', 'N1', 'basico', 'Classificação.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D07', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D07', 'D07', 'Comparar HD, SSD, RAID e tecnologias de armazenamento.', 'N2', 'intermediario', 'Escolha justificada.', '4.8 e 4.9', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D08', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D08', 'D08', 'Identificar placa-mãe, chipset, slots, barramentos e expansão.', 'N1', 'basico', 'Diagrama.', '5', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D09', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D09', 'D09', 'Interpretar BIOS, SETUP, POST e boot.', 'N2', 'intermediario', 'Situação-problema.', '5.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D10', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D10', 'D10', 'Analisar fontes, potência, tensões, conectores e proteção.', 'N2', 'intermediario', 'Caso técnico.', '6', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D11', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D11', 'D11', 'Identificar gabinetes, painel frontal e organização interna.', 'N1', 'basico', 'Inspeção.', '7', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D12', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D12', 'D12', 'Selecionar ferramentas e executar desmontagem segura.', 'N2', 'intermediario', 'Rubrica prática.', '9 e 10', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D13', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D13', 'D13', 'Executar higienização e troca de materiais térmicos.', 'N2', 'intermediario', 'Protocolo prático.', '10.1 a 10.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D14', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D14', 'D14', 'Executar montagem e conexão dos componentes.', 'N3', 'avancado', 'Rubrica ou simulador.', '11', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D15', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D15', 'D15', 'Realizar checagem final e testes de hardware.', 'N3', 'avancado', 'Checklist técnico.', '12', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D16', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D16', 'D16', 'Diagnosticar falhas e propor manutenção.', 'N3', 'avancado', 'Ordem de serviço.', '8 e 12', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D17', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D17', 'D17', 'Aplicar manutenção de software, drivers, licenças e segurança.', 'N2', 'intermediario', 'Caso ou prática.', '13 e 14', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D18', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D18', 'D18', 'Planejar backup, formatação e recuperação de sistema.', 'N3', 'avancado', 'Plano de serviço.', '13.10 e 15', '2.0', 'ativo', now()),
  ('EC-INF-2025-AMC-D19', 'EC-INF-2025', 'EC-INF-2025-AMC', 'EC-INF-2025-C-AMC', 'AMC-D19', 'D19', 'Produzir laudo técnico completo.', 'N3', 'avancado', 'Laudo e rubrica.', '16', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D01', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D01', 'D01', 'Preparar ambiente e organizar scripts e módulos Python.', 'N2', 'intermediario', 'Checklist.', '2.1 e 2.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D02', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D02', 'D02', 'Prever saídas, testar e depurar programas.', 'N2', 'intermediario', 'Análise de código.', 'Objetivos e teste', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D03', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D03', 'D03', 'Aplicar entradas, operadores e condicionais.', 'N2', 'intermediario', 'Código interativo.', '3.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D04', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D04', 'D04', 'Aplicar `for` e `while` em menus e percursos.', 'N2', 'intermediario', 'Programa.', '3.2 e 3.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D05', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D05', 'D05', 'Criar funções e módulos reutilizáveis.', 'N2', 'intermediario', 'Código.', '2.2 e 3.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D06', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D06', 'D06', 'Manipular listas, tuplas e dicionários.', 'N2', 'intermediario', 'Situação-problema.', '3.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D07', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D07', 'D07', 'Explicar abstração, classe, objeto, atributo e método.', 'N1', 'basico', 'Modelagem.', '1.1 a 1.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D08', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D08', 'D08', 'Definir classes, construtores, atributos e métodos.', 'N2', 'intermediario', 'Classe Python.', '1.2 e 1.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D09', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D09', 'D09', 'Modelar interação, associação e composição entre objetos.', 'N3', 'avancado', 'Diagrama ou código.', 'Objetivos', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D10', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D10', 'D10', 'Aplicar encapsulamento e controle de acesso.', 'N3', 'avancado', 'Análise de classe.', '1.6', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D11', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D11', 'D11', 'Tratar e lançar exceções de forma controlada.', 'N2', 'intermediario', 'Código ou fluxo.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D12', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D12', 'D12', 'Aplicar herança e reutilização.', 'N2', 'intermediario', 'Hierarquia.', '1.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D13', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D13', 'D13', 'Implementar polimorfismo.', 'N3', 'avancado', 'Código ou previsão.', '1.7', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D14', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D14', 'D14', 'Criar interface Tkinter com componentes, layout e eventos.', 'N2', 'intermediario', 'Protótipo.', '5', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D15', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D15', 'D15', 'Levantar requisitos e organizar classes de uma solução real.', 'N3', 'avancado', 'Modelo e requisitos.', '6.1 a 6.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-POO-D16', 'EC-INF-2025', 'EC-INF-2025-POO', 'EC-INF-2025-C-POO', 'POO-D16', 'D16', 'Integrar classes, interface, banco, testes e documentação.', 'N3', 'avancado', 'Projeto funcional.', '6.5 e 7', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D01', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D01', 'D01', 'Explicar funções, tipos, licenças e evolução dos sistemas operacionais.', 'N1', 'basico', 'Comparação.', '1, 2 e 16', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D02', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D02', 'D02', 'Selecionar sistema e edição conforme necessidade e hardware.', 'N2', 'intermediario', 'Estudo de caso.', '3, 4 e 17', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D03', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D03', 'D03', 'Preparar mídia inicializável e planejar instalação.', 'N2', 'intermediario', 'Sequência/checklist.', '5 e 18', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D04', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D04', 'D04', 'Instalar e configurar Windows com partições, sistema de arquivos e usuário.', 'N3', 'avancado', 'Rubrica prática.', '6', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D05', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D05', 'D05', 'Gerenciar dispositivos e drivers no Windows.', 'N2', 'intermediario', 'Prática/caso.', '7', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D06', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D06', 'D06', 'Instalar, remover e definir aplicativos padrão.', 'N2', 'intermediario', 'Checklist.', '8', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D07', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D07', 'D07', 'Administrar usuários e permissões no Windows.', 'N2', 'intermediario', 'Situação prática.', '9', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D08', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D08', 'D08', 'Gerenciar discos, partições e sistemas de arquivos.', 'N3', 'avancado', 'Caso ou prática.', '10', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D09', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D09', 'D09', 'Configurar conectividade cabeada, sem fio e Bluetooth.', 'N2', 'intermediario', 'Prática.', '11', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D10', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D10', 'D10', 'Organizar arquivos e executar operações pelo Prompt do Windows.', 'N2', 'intermediario', 'Comandos.', '12 e 13', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D11', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D11', 'D11', 'Diagnosticar rede com `ping`, `ipconfig`, `hostname` e `tracert`.', 'N3', 'avancado', 'Cenário.', '14', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D12', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D12', 'D12', 'Aplicar segurança e proteção básica no Windows.', 'N2', 'intermediario', 'Estudo de caso.', '15', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D13', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D13', 'D13', 'Instalar e configurar Ubuntu, partições, usuário, rede e programas.', 'N3', 'avancado', 'Rubrica prática.', '19 e 20', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D14', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D14', 'D14', 'Interpretar a estrutura de diretórios Linux e navegar pelo terminal.', 'N2', 'intermediario', 'Comandos.', '21 a 23', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D15', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D15', 'D15', 'Criar, copiar, mover, editar e remover arquivos e diretórios no Linux.', 'N2', 'intermediario', 'Prática.', '23 e 24', '2.0', 'ativo', now()),
  ('EC-INF-2025-SO-D16', 'EC-INF-2025', 'EC-INF-2025-SO', 'EC-INF-2025-C-SO', 'SO-D16', 'D16', 'Administrar usuários e diagnosticar rede e hardware por comandos Linux.', 'N3', 'avancado', 'Cenário prático.', '25', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D01', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D01', 'D01', 'Explicar internet, Web, HTML e estrutura básica do documento.', 'N1', 'basico', 'Item ou código.', '1.1 a 1.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D02', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D02', 'D02', 'Estruturar títulos, parágrafos, quebras e texto com semântica adequada.', 'N2', 'intermediario', 'Código.', '1.4 e 1.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D03', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D03', 'D03', 'Inserir imagens, listas e links com atributos corretos.', 'N2', 'intermediario', 'Página prática.', '1.6 a 1.8', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D04', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D04', 'D04', 'Agrupar conteúdos e construir tabelas adequadamente.', 'N2', 'intermediario', 'Código.', '1.9 e 1.10', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D05', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D05', 'D05', 'Construir formulários com campos, seleções, marcações e botões.', 'N3', 'avancado', 'Formulário funcional.', '1.11', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D06', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D06', 'D06', 'Aplicar elementos semânticos `header`, `nav`, `main`, `article`, `section`, `aside` e `footer`.', 'N2', 'intermediario', 'Estrutura de página.', '2.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D07', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D07', 'D07', 'Incorporar tabelas acessíveis, áudio, vídeo e figuras em HTML5.', 'N2', 'intermediario', 'Página ou análise.', '2.4 e 2.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D08', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D08', 'D08', 'Selecionar tipos de campos HTML5 conforme os dados solicitados.', 'N2', 'intermediario', 'Formulário.', '2.6', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D09', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D09', 'D09', 'Aplicar CSS inline, interno e externo e interpretar seletores, propriedades e valores.', 'N2', 'intermediario', 'Código.', '3.1 a 3.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D10', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D10', 'D10', 'Estilizar cores, fundos, tipografia, texto e links.', 'N2', 'intermediario', 'Produto digital.', '3.4 a 3.7', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D11', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D11', 'D11', 'Utilizar classes, identificadores, `div` e `span` com coerência.', 'N2', 'intermediario', 'Análise/código.', '3.8', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D12', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D12', 'D12', 'Aplicar box model, bordas, dimensões e espaçamentos.', 'N2', 'intermediario', 'Layout.', '3.9 a 3.11', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D13', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D13', 'D13', 'Posicionar e controlar exibição e camadas de elementos.', 'N3', 'avancado', 'Correção de layout.', '3.12 a 3.15', '2.0', 'ativo', now()),
  ('EC-INF-2025-HTML-D14', 'EC-INF-2025', 'EC-INF-2025-HTML', 'EC-INF-2025-C-HTML', 'HTML-D14', 'D14', 'Construir layouts com Flexbox, alinhamento e distribuição responsiva.', 'N3', 'avancado', 'Página e rubrica.', 'Flexbox', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D01', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D01', 'D01', 'Reconhecer história, fundamentos, elementos e princípios do design.', 'N1', 'basico', 'Item/análise visual.', '1', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D02', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D02', 'D02', 'Aplicar composição, alinhamento, contraste, proximidade, repetição e hierarquia.', 'N2', 'intermediario', 'Análise ou arte.', '1.2 a 1.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D03', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D03', 'D03', 'Selecionar ferramenta gráfica conforme objetivo e formato do projeto.', 'N2', 'intermediario', 'Estudo de caso.', '2', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D04', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D04', 'D04', 'Utilizar recursos básicos de Canva, Gimp, Inkscape ou Figma.', 'N2', 'intermediario', 'Checklist prático.', '2.1 a 2.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D05', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D05', 'D05', 'Selecionar e combinar tipografias com legibilidade e coerência.', 'N2', 'intermediario', 'Peça gráfica.', '3', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D06', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D06', 'D06', 'Aplicar psicologia das cores e construir paleta adequada.', 'N2', 'intermediario', 'Projeto visual.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D07', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D07', 'D07', 'Organizar fotos, fundos, textos, camadas e alinhamentos no Canva.', 'N2', 'intermediario', 'Produto digital.', '5', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D08', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D08', 'D08', 'Exportar e compartilhar artefatos no formato apropriado.', 'N2', 'intermediario', 'Procedimento.', '5.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D09', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D09', 'D09', 'Construir identidade visual coerente com público e propósito.', 'N3', 'avancado', 'Manual/peças.', '6', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D10', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D10', 'D10', 'Produzir logotipo, cartão, folder, banner e panfleto.', 'N3', 'avancado', 'Portfólio.', '7.1 a 7.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D11', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D11', 'D11', 'Criar conteúdos adequados para redes sociais e diferentes formatos.', 'N3', 'avancado', 'Campanha.', '7.6 e 7.7', '2.0', 'ativo', now()),
  ('EC-INF-2025-DG-D12', 'EC-INF-2025', 'EC-INF-2025-DG', 'EC-INF-2025-C-DG', 'DG-D12', 'D12', 'Projetar e prototipar layout de interface no Figma.', 'N3', 'avancado', 'Protótipo.', '8', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D01', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D01', 'D01', 'Explicar PHP, servidor web, HTTP/HTTPS, GET e POST.', 'N1', 'basico', 'Item/cenário.', '1.1 a 1.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D02', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D02', 'D02', 'Preparar ambiente PHP, Apache e MySQL e organizar o projeto.', 'N2', 'intermediario', 'Checklist.', '1.6', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D03', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D03', 'D03', 'Aplicar variáveis, tipos, constantes, concatenação, operadores e comentários em PHP.', 'N2', 'intermediario', 'Código.', '1.7 e 1.8', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D04', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D04', 'D04', 'Aplicar decisões e repetições em scripts PHP.', 'N2', 'intermediario', 'Código.', '1.9', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D05', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D05', 'D05', 'Manipular arrays simples e multidimensionais.', 'N2', 'intermediario', 'Código/caso.', '1.10', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D06', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D06', 'D06', 'Utilizar funções para strings, matemática, datas e arrays.', 'N2', 'intermediario', 'Código.', '1.11', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D07', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D07', 'D07', 'Receber, validar e processar dados de formulários.', 'N3', 'avancado', 'Formulário funcional.', '1.12', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D08', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D08', 'D08', 'Criar fluxos de cadastro, listagem, edição e remoção.', 'N3', 'avancado', 'Aplicação.', '1.12.3 a 1.12.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D09', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D09', 'D09', 'Ler, escrever, enviar e disponibilizar arquivos com segurança básica.', 'N3', 'avancado', 'Prática.', '2', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D10', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D10', 'D10', 'Configurar conexão PHP-MariaDB/MySQL com PDO.', 'N2', 'intermediario', 'Código/checklist.', '3.1 e 3.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D11', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D11', 'D11', 'Executar CRUD com PHP e SQL.', 'N3', 'avancado', 'Projeto.', '3.3 e 7', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D12', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D12', 'D12', 'Prevenir falhas comuns na entrada e persistência de dados.', 'N3', 'avancado', 'Revisão de código.', 'Integração 1.12 e 3', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D13', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D13', 'D13', 'Gerar relatórios PDF a partir de dados da aplicação.', 'N2', 'intermediario', 'Produto funcional.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D14', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D14', 'D14', 'Reconhecer finalidade de Composer e frameworks PHP.', 'N1', 'basico', 'Comparação.', '5', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D15', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D15', 'D15', 'Utilizar versionamento em plataforma de repositório.', 'N2', 'intermediario', 'Histórico/repositório.', '6.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D16', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D16', 'D16', 'Planejar domínio, hospedagem e publicação por servidor/FTP.', 'N2', 'intermediario', 'Plano de implantação.', '6.1 a 6.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-PWEB-D17', 'EC-INF-2025', 'EC-INF-2025-PWEB', 'EC-INF-2025-C-PWEB', 'PWEB-D17', 'D17', 'Integrar requisitos, interface, lógica, banco, testes e publicação em uma solução web.', 'N3', 'avancado', 'Projeto e rubrica.', '8 e integração', '2.0', 'ativo', now()),
  ('EC-INF-2025-PI-D01', 'EC-INF-2025', 'EC-INF-2025-PI', 'EC-INF-2025-C-PI', 'PI-D01', 'D01', 'Organizar acesso, cronograma e evidências das trilhas formativas.', 'N2', 'intermediario', 'Checklist/portfólio.', 'Orientações gerais', '2.0', 'ativo', now()),
  ('EC-INF-2025-PI-D02', 'EC-INF-2025', 'EC-INF-2025-PI', 'EC-INF-2025-C-PI', 'PI-D02', 'D02', 'Explicar fundamentos e aplicações de conectividade 5G.', 'N1', 'basico', 'Síntese ou atividade.', 'Trilha Huawei', '2.0', 'ativo', now()),
  ('EC-INF-2025-PI-D03', 'EC-INF-2025', 'EC-INF-2025-PI', 'EC-INF-2025-C-PI', 'PI-D03', 'D03', 'Explicar fundamentos de computação em nuvem e serviços básicos.', 'N1', 'basico', 'Estudo de caso.', 'AWS Cloud Foundations', '2.0', 'ativo', now()),
  ('EC-INF-2025-PI-D04', 'EC-INF-2025', 'EC-INF-2025-PI', 'EC-INF-2025-C-PI', 'PI-D04', 'D04', 'Aplicar conhecimentos da especialização escolhida a um problema real.', 'N3', 'avancado', 'Produto/projeto.', 'Trilha Google', '2.0', 'ativo', now()),
  ('EC-INF-2025-PI-D05', 'EC-INF-2025', 'EC-INF-2025-PI', 'EC-INF-2025-C-PI', 'PI-D05', 'D05', 'Integrar conhecimentos de duas ou mais áreas técnicas em uma proposta coerente.', 'N3', 'avancado', 'Projeto.', 'Objetivo integrador', '2.0', 'ativo', now()),
  ('EC-INF-2025-PI-D06', 'EC-INF-2025', 'EC-INF-2025-PI', 'EC-INF-2025-C-PI', 'PI-D06', 'D06', 'Registrar certificados, atividades, decisões e aprendizados em portfólio.', 'N2', 'intermediario', 'Portfólio.', 'Requisitos de conclusão', '2.0', 'ativo', now()),
  ('EC-INF-2025-PI-D07', 'EC-INF-2025', 'EC-INF-2025-PI', 'EC-INF-2025-C-PI', 'PI-D07', 'D07', 'Colaborar, cumprir etapas e responder a dificuldades técnicas com autonomia.', 'N3', 'avancado', 'Rubrica processual.', 'Avaliação contínua', '2.0', 'ativo', now()),
  ('EC-INF-2025-PI-D08', 'EC-INF-2025', 'EC-INF-2025-PI', 'EC-INF-2025-C-PI', 'PI-D08', 'D08', 'Apresentar e defender a entrega final com clareza técnica.', 'N3', 'avancado', 'Apresentação.', 'Avaliação final', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D01', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D01', 'D01', 'Explicar banco de dados, SGBD, vantagens e modelos.', 'N1', 'basico', 'Item/comparação.', 'Módulo 1', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D02', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D02', 'D02', 'Levantar dados, regras e requisitos de informação.', 'N2', 'intermediario', 'Estudo de caso.', 'Objetivos', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D03', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D03', 'D03', 'Identificar entidades e tipos de atributos.', 'N2', 'intermediario', 'Modelagem.', '2.2 e 2.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D04', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D04', 'D04', 'Identificar e representar relacionamentos.', 'N2', 'intermediario', 'Diagrama.', '2.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D05', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D05', 'D05', 'Construir modelo conceitual.', 'N3', 'avancado', 'brModelo/rubrica.', '2.1 a 2.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D06', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D06', 'D06', 'Transformar modelo conceitual em lógico.', 'N3', 'avancado', 'Conversão.', '2.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D07', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D07', 'D07', 'Definir tabelas, tipos, chaves primárias e estrangeiras.', 'N2', 'intermediario', 'Modelo/SQL.', '2.5.1 a 2.5.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D08', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D08', 'D08', 'Aplicar normalização.', 'N3', 'avancado', 'Reestruturação.', '2.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D09', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D09', 'D09', 'Preparar MariaDB e MySQL Workbench.', 'N2', 'intermediario', 'Checklist.', '3', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D10', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D10', 'D10', 'Aplicar DDL.', 'N2', 'intermediario', 'SQL.', '4.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D11', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D11', 'D11', 'Aplicar INSERT, UPDATE e DELETE.', 'N2', 'intermediario', 'SQL.', '4.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D12', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D12', 'D12', 'Consultar com filtros, lógica, ordenação, intervalos e DISTINCT.', 'N2', 'intermediario', 'SQL.', '4.5 e 5.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D13', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D13', 'D13', 'Combinar tabelas com JOIN.', 'N3', 'avancado', 'SQL.', '5.1.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D14', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D14', 'D14', 'Agregar e agrupar dados com funções, GROUP BY e HAVING.', 'N3', 'avancado', 'SQL.', '5.1.4 a 5.1.7', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D15', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D15', 'D15', 'Aplicar COMMIT e ROLLBACK.', 'N2', 'intermediario', 'Fluxo transacional.', '4.4.4 e 4.4.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D16', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D16', 'D16', 'Analisar integridade, concorrência, segurança e recuperação.', 'N3', 'avancado', 'Estudo de caso.', 'Ementa geral', '2.0', 'ativo', now()),
  ('EC-INF-2025-BD-D17', 'EC-INF-2025', 'EC-INF-2025-BD', 'EC-INF-2025-C-BD', 'BD-D17', 'D17', 'Implementar e documentar banco contextualizado.', 'N3', 'avancado', 'Projeto.', 'Trabalho final', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D01', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D01', 'D01', 'Aplicar metodologia, gestão do tempo e organização do trabalho em equipe.', 'N2', 'intermediario', 'Plano/quadro.', '1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D02', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D02', 'D02', 'Elaborar plano do projeto com etapas, responsáveis e entregas.', 'N3', 'avancado', 'Documento.', '2', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D03', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D03', 'D03', 'Interpretar briefing, requisitos e casos de uso.', 'N3', 'avancado', 'Análise/requisitos.', '3', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D04', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D04', 'D04', 'Modelar conceitual e logicamente o banco e produzir dicionário de dados.', 'N3', 'avancado', 'Modelos.', '3', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D05', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D05', 'D05', 'Implementar a base de dados do sistema.', 'N3', 'avancado', 'Banco funcional.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D06', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D06', 'D06', 'Estruturar páginas HTML semânticas.', 'N2', 'intermediario', 'Código.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D07', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D07', 'D07', 'Criar estilos CSS coerentes e responsivos.', 'N2', 'intermediario', 'Interface.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D08', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D08', 'D08', 'Implementar scripts e comportamentos da aplicação.', 'N3', 'avancado', 'Código.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D09', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D09', 'D09', 'Integrar interface, lógica e dados.', 'N3', 'avancado', 'Aplicação.', 'Objetivo geral', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D10', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D10', 'D10', 'Testar funcionalidades, registrar falhas e corrigir defeitos.', 'N3', 'avancado', 'Plano/evidências.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D11', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D11', 'D11', 'Utilizar versionamento e documentação para rastrear evolução.', 'N2', 'intermediario', 'Repositório/portfólio.', 'Processo de projeto', '2.0', 'ativo', now()),
  ('EC-INF-2025-LS-D12', 'EC-INF-2025', 'EC-INF-2025-LS', 'EC-INF-2025-C-LS', 'LS-D12', 'D12', 'Demonstrar e defender a solução perante critérios técnicos e necessidades do usuário.', 'N3', 'avancado', 'Apresentação/rubrica.', 'Projeto final', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D01', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D01', 'D01', 'Receber, registrar e priorizar uma solicitação de suporte.', 'N2', 'intermediario', 'Ordem de serviço.', 'Contexto de suporte', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D02', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D02', 'D02', 'Diagnosticar defeitos físicos e lógicos por processo sistemático.', 'N3', 'avancado', 'Estação prática.', '1.1 e 1.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D03', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D03', 'D03', 'Selecionar e utilizar ferramentas de diagnóstico.', 'N2', 'intermediario', 'Checklist prático.', '1.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D04', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D04', 'D04', 'Aplicar troubleshooting e validar a solução.', 'N3', 'avancado', 'Caso prático.', '1.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D05', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D05', 'D05', 'Instalar, reinstalar e configurar sistemas operacionais.', 'N3', 'avancado', 'Rubrica.', '2.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D06', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D06', 'D06', 'Atualizar sistema, drivers e firmware com segurança.', 'N2', 'intermediario', 'Procedimento.', '2.2 e 4.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D07', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D07', 'D07', 'Administrar contas, grupos e permissões.', 'N2', 'intermediario', 'Cenário.', '2.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D08', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D08', 'D08', 'Automatizar tarefa rotineira por script ou ferramenta.', 'N3', 'avancado', 'Script/demonstração.', '2.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D09', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D09', 'D09', 'Projetar e montar LAN simples conforme requisitos.', 'N3', 'avancado', 'Projeto físico/lógico.', '3.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D10', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D10', 'D10', 'Configurar roteador, switch e conectividade básica.', 'N3', 'avancado', 'Estação prática.', '3.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D11', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D11', 'D11', 'Diagnosticar conectividade, desempenho e segurança da rede.', 'N3', 'avancado', 'Cenário.', '3.3 e 3.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D12', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D12', 'D12', 'Planejar e executar manutenção preventiva integrada.', 'N3', 'avancado', 'Plano/checklist.', '4.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D13', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D13', 'D13', 'Executar backup e recuperação de dados.', 'N3', 'avancado', 'Simulação.', '4.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-LH-D14', 'EC-INF-2025', 'EC-INF-2025-LH', 'EC-INF-2025-C-LH', 'LH-D14', 'D14', 'Planejar, executar, documentar e apresentar projeto integrado de suporte e rede.', 'N3', 'avancado', 'Projeto final.', '5', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D01', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D01', 'D01', 'Explicar finalidade, componentes e classificações de redes.', 'N1', 'basico', 'Item/diagrama.', '1, 1.1 e 1.9', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D02', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D02', 'D02', 'Distinguir equipamentos de rede e suas funções.', 'N1', 'basico', 'Associação.', '1.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D03', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D03', 'D03', 'Interpretar formas e modos de comunicação de dados.', 'N1', 'basico', 'Cenário.', '1.3 e 1.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D04', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D04', 'D04', 'Selecionar meios, cabos, fibras, conectores e tecnologias sem fio.', 'N2', 'intermediario', 'Caso técnico.', '1.5 a 1.8', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D05', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D05', 'D05', 'Reconhecer e analisar topologias de rede.', 'N2', 'intermediario', 'Diagrama.', '1.10', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D06', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D06', 'D06', 'Relacionar camadas e funções dos modelos OSI e TCP/IP.', 'N2', 'intermediario', 'Mapeamento.', '2', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D07', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D07', 'D07', 'Associar protocolos de aplicação, transporte, rede e acesso às suas funções.', 'N2', 'intermediario', 'Caso.', '3', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D08', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D08', 'D08', 'Explicar Ethernet, MAC, ARP, RARP e ICMP.', 'N1', 'basico', 'Item/cenário.', '4 e 6', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D09', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D09', 'D09', 'Interpretar VPN, VLAN, firewall e NAT em redes.', 'N2', 'intermediario', 'Estudo de caso.', '7 a 10', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D10', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D10', 'D10', 'Distinguir IPv4, IPv6 e endereços públicos e privados.', 'N2', 'intermediario', 'Classificação.', '11 e 12', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D11', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D11', 'D11', 'Configurar e interpretar endereço IP, máscara e gateway.', 'N3', 'avancado', 'Exercício/prática.', '13 a 15', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D12', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D12', 'D12', 'Calcular sub-redes conforme necessidade.', 'N3', 'avancado', 'Cálculo.', '20', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D13', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D13', 'D13', 'Configurar compartilhamento de arquivos e impressoras.', 'N2', 'intermediario', 'Prática.', '16', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D14', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D14', 'D14', 'Comparar NAS, DAS, SAN e armazenamento em nuvem.', 'N2', 'intermediario', 'Escolha justificada.', '17 e 18', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D15', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D15', 'D15', 'Distinguir tipos de servidores e serviços fornecidos.', 'N1', 'basico', 'Associação.', '19', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D16', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D16', 'D16', 'Configurar e proteger rede sem fio considerando padrão, canal, frequência e criptografia.', 'N3', 'avancado', 'Plano/prática.', '21', '2.0', 'ativo', now()),
  ('EC-INF-2025-RED-D17', 'EC-INF-2025', 'EC-INF-2025-RED', 'EC-INF-2025-C-RED', 'RED-D17', 'D17', 'Analisar aplicações de IoT no território, casa, produção e serviços.', 'N3', 'avancado', 'Projeto/caso.', '22', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D01', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D01', 'D01', 'Explicar CMS, vantagens, limitações e principais plataformas.', 'N1', 'basico', 'Comparação.', 'Módulo 1', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D02', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D02', 'D02', 'Explicar domínio, hospedagem, site e servidor local.', 'N1', 'basico', 'Item/cenário.', 'Módulo 2.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D03', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D03', 'D03', 'Instalar e utilizar XAMPP e phpMyAdmin para preparar o ambiente.', 'N2', 'intermediario', 'Checklist.', 'Módulo 2.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D04', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D04', 'D04', 'Instalar WordPress e acessar sua administração.', 'N2', 'intermediario', 'Prática.', 'Módulo 3', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D05', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D05', 'D05', 'Criar e organizar posts, páginas e mídias.', 'N2', 'intermediario', 'Site/portfólio.', 'Módulo 3.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D06', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D06', 'D06', 'Selecionar, instalar e configurar temas.', 'N2', 'intermediario', 'Prática.', 'Módulo 3.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D07', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D07', 'D07', 'Selecionar, instalar e avaliar plugins conforme necessidade e risco.', 'N3', 'avancado', 'Estudo de caso.', 'Módulo 3.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D08', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D08', 'D08', 'Construir páginas com Elementor utilizando componentes e organização visual.', 'N3', 'avancado', 'Página funcional.', 'Módulo 4', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D09', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D09', 'D09', 'Configurar identidade, cabeçalho, rodapé, menus e estrutura de navegação.', 'N3', 'avancado', 'Site/rubrica.', 'Módulo 5', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D10', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D10', 'D10', 'Construir página inicial, blog e seções de conteúdo.', 'N3', 'avancado', 'Projeto.', 'Módulo 6', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D11', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D11', 'D11', 'Exportar, importar, migrar e restaurar um site.', 'N3', 'avancado', 'Simulação.', 'Módulo 7.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-GC-D12', 'EC-INF-2025', 'EC-INF-2025-GC', 'EC-INF-2025-C-GC', 'GC-D12', 'D12', 'Aplicar atualização, backup, controle de acesso, plugin de segurança e proteção básica por `.htaccess`.', 'N3', 'avancado', 'Checklist/caso.', 'Módulo 7.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D01', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D01', 'D01', 'Distinguir trabalho, emprego, profissão, carreira e empregabilidade.', 'N1', 'basico', 'Item/reflexão.', '1', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D02', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D02', 'D02', 'Comparar formação técnica, tecnológica, bacharelado, licenciatura e certificações.', 'N2', 'intermediario', 'Plano de formação.', '2', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D03', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D03', 'D03', 'Identificar áreas, funções e possibilidades de atuação em TI.', 'N1', 'basico', 'Mapa de carreira.', '3', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D04', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D04', 'D04', 'Pesquisar exigências, oportunidades e trajetórias de uma área escolhida.', 'N3', 'avancado', 'Pesquisa orientada.', '3 e objetivos', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D05', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D05', 'D05', 'Analisar interesses, valores, habilidades e pontos de desenvolvimento.', 'N3', 'avancado', 'Autoavaliação.', '4.1 a 4.4', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D06', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D06', 'D06', 'Utilizar Kanban, Trello ou PDCA para planejar desenvolvimento pessoal.', 'N2', 'intermediario', 'Quadro/plano.', '4.5', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D07', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D07', 'D07', 'Aplicar postura, ética, comunicação e colaboração em situações profissionais.', 'N3', 'avancado', 'Estudo de caso/rubrica.', '5', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D08', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D08', 'D08', 'Construir e manter rede profissional de forma responsável.', 'N2', 'intermediario', 'Plano/networking.', '5.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D09', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D09', 'D09', 'Produzir currículo e carta de apresentação adequados à oportunidade.', 'N3', 'avancado', 'Documentos.', '6.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D10', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D10', 'D10', 'Organizar presença profissional no LinkedIn e GitHub.', 'N3', 'avancado', 'Perfil/portfólio.', '6.2 e 6.3', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D11', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D11', 'D11', 'Preparar-se para entrevista, seleção, estágio, aprendizagem ou concurso.', 'N3', 'avancado', 'Simulação.', '6.4 a 6.7', '2.0', 'ativo', now()),
  ('EC-INF-2025-PC-D12', 'EC-INF-2025', 'EC-INF-2025-PC', 'EC-INF-2025-C-PC', 'PC-D12', 'D12', 'Elaborar projeto de carreira com metas, ações, prazos e revisão.', 'N3', 'avancado', 'Plano individual.', 'Objetivo final', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D01', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D01', 'D01', 'Explicar robótica, evolução, aplicações e princípios éticos básicos.', 'N1', 'basico', 'Item/debate.', '1', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D02', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D02', 'D02', 'Identificar arquitetura, tipos e aplicações do Arduino.', 'N1', 'basico', 'Imagem/associação.', '2.1', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D03', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D03', 'D03', 'Preparar IDE ou Tinkercad e executar uma simulação.', 'N2', 'intermediario', 'Checklist.', '2.2', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D04', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D04', 'D04', 'Interpretar `setup`, `loop`, variáveis, entradas, saídas e operações em C++ para Arduino.', 'N2', 'intermediario', 'Código/simulação.', '3', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D05', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D05', 'D05', 'Aplicar condições, repetições, funções e bibliotecas em protótipos.', 'N3', 'avancado', 'Código.', '3.1.6 a 3.1.9', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D06', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D06', 'D06', 'Relacionar tensão, corrente, resistência e código de cores com circuitos seguros.', 'N2', 'intermediario', 'Cálculo/caso.', '4', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D07', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D07', 'D07', 'Montar e interpretar circuitos em protoboard respeitando polaridade e organização.', 'N2', 'intermediario', 'Rubrica prática.', '4.1 e componentes', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D08', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D08', 'D08', 'Controlar LEDs, RGB e buzzer por saídas digitais e PWM.', 'N2', 'intermediario', 'Protótipo.', '5, 9 e 11', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D09', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D09', 'D09', 'Utilizar botões, pull-up e pull-down como entradas digitais.', 'N2', 'intermediario', 'Circuito/código.', '7', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D10', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D10', 'D10', 'Ler entradas analógicas e monitorar dados pela serial.', 'N2', 'intermediario', 'Simulação.', '8', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D11', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D11', 'D11', 'Utilizar LDR e potenciômetro em respostas automatizadas.', 'N3', 'avancado', 'Protótipo.', '8 a 10', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D12', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D12', 'D12', 'Controlar servo motor a partir de entradas e regras.', 'N3', 'avancado', 'Protótipo.', '12', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D13', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D13', 'D13', 'Medir distância com sensor ultrassônico e acionar alertas.', 'N3', 'avancado', 'Protótipo.', '13', '2.0', 'ativo', now()),
  ('EC-INF-2025-ROB-D14', 'EC-INF-2025', 'EC-INF-2025-ROB', 'EC-INF-2025-C-ROB', 'ROB-D14', 'D14', 'Integrar sensores, atuadores, circuito e código em projeto de automação documentado.', 'N3', 'avancado', 'Projeto final.', '14 e 15', '2.0', 'ativo', now())
on conflict (codigo) do update set componente_codigo = excluded.componente_codigo, competencia_codigo = excluded.competencia_codigo, codigo_pedagogico = excluded.codigo_pedagogico, codigo_curto = excluded.codigo_curto, descricao = excluded.descricao, nivel_cognitivo = excluded.nivel_cognitivo, nivel_tri_inicial = excluded.nivel_tri_inicial, tipo_evidencia = excluded.tipo_evidencia, referencia_ementa = excluded.referencia_ementa, versao = excluded.versao, status = excluded.status, atualizado_em = now();

insert into historico_migracao_curricular_v2 (matriz_codigo, versao, acao, descricao, metadados)
select 'EC-INF-2025', '2.0', 'catalogo_descritores_importado', 'Catalogo EC-INF-2025 preparado em estrutura versionada, preservando tabelas MVP legadas.', jsonb_build_object('componentes', 17, 'competencias', 17, 'descritores', 236, 'origem', 'Matrizes_Descritores_Todas_Disciplinas_Tecnicas_SIDEP_CE_2025.md')
where not exists (select 1 from historico_migracao_curricular_v2 where matriz_codigo = 'EC-INF-2025' and versao = '2.0' and acao = 'catalogo_descritores_importado');

create or replace view v_matriz_ec_inf_2025_descritores as
select m.codigo as matriz_codigo, m.curso_codigo, m.curso_nome, c.nome as componente, c.sigla, c.carga_horaria, comp.codigo_pedagogico as competencia_codigo, comp.descricao as competencia, d.codigo_pedagogico as descritor_codigo, d.codigo_curto, d.descricao as descritor, d.nivel_cognitivo, d.nivel_tri_inicial, d.tipo_evidencia, d.referencia_ementa
from matriz_curricular_v2 m
join matriz_componente_v2 c on c.matriz_codigo = m.codigo
join competencia_curricular_v2 comp on comp.componente_codigo = c.codigo
join descritor_curricular_v2 d on d.competencia_codigo = comp.codigo
where m.codigo = 'EC-INF-2025';
