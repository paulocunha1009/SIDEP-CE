# SIDEP-CE: Aplicacao dos Norteadores no Sistema

Atualizado em: 08/07/2026

## 1. O que ja foi incorporado

- Importacao e estudo dos documentos norteadores do projeto SIDEP-CE.
- Estrutura inicial por curso, componente curricular, competencia, descritor e questao.
- Separacao de acesso por perfil: estudante, professor tecnico, coordenador/professor tecnico, gestao escolar, CREDE/SEFOR, SEDUC e Administrador.
- Consolidacao da Matriz SIDEP-CE v0.1 para o curso Tecnico em Informatica.
- Banco piloto com 10 competencias, 40 descritores e 441 questoes.
- Fila de curadoria docente com status `rascunho`, `em_revisao` e `validada`.
- Modal "Ver questao" para leitura completa antes da validacao.
- Criador de avaliacoes com 20 a 80 questoes.
- Codigo de avaliacao gerado automaticamente pelo sistema.
- Codigo imutavel apos abertura da avaliacao.
- Bloqueio de reaproveitamento de codigo usado ou excluido.
- Embaralhamento individual da ordem das questoes por estudante.
- Bloqueio de questoes duplicadas ou de mesmo contexto dentro da mesma prova.
- Respostas consolidadas em JSON por aluno/prova.
- Relatorios por aluno, turma, descritor, componente e competencia.
- Exportacao de cursos, componentes, competencias e descritores em Markdown e PDF.
- Migracao da base local para Supabase/PostgreSQL.
- Manual operacional do MVP.

## 2. Fontes analisadas

- Artigo SIDEP-CE e versao revisada.
- TCC SIDEP-CE.
- Resumo do Seminario DoCEntes 2026.
- Arquivos de coorientacao do projeto.
- HTML diagnostico SIDEP-CE e backups.
- Matrizes curriculares 2025/2026 do curso Tecnico em Informatica.
- Percurso formativo de TI.
- Referencias do CNCT para o eixo Informacao e Comunicacao.

## 3. Diretrizes pedagogicas extraidas

- O SIDEP-CE deve ser apresentado como metodo de avaliacao diagnostica, formativa e final para cursos tecnicos.
- A avaliacao precisa estar organizada por competencias, descritores avaliaveis, banco de itens, rubricas praticas e relatorios pedagogicos.
- O dado de desempenho nao deve terminar em nota: ele deve gerar intervencao pedagogica, recomposicao e acompanhamento.
- O estudante deve ver somente o ambiente de prova, sem diagnostico, peso de item, intervencao ou analises psicometricas.
- Professor, gestao escolar e regional devem visualizar relatorios por aluno, turma, escola, curso, componente, competencia e descritor, respeitando o escopo de acesso.

## 4. Competencia, descritor e questao

No SIDEP-CE, competencia e descritor nao sao sinonimos.

Competencia e uma capacidade ampla de mobilizar conhecimentos, habilidades, atitudes e procedimentos em situacoes tecnicas ou profissionais.

Descritor e uma evidencia observavel e avaliavel dessa competencia, escrita de forma mais especifica para orientar itens, rubricas e relatorios.

Questao e o item que mede um descritor. Na fase pre-TRI, cada questao recebe dificuldade inicial e historico de acertos; na fase TRI, os parametros psicometricos passam a ser calibrados com volume suficiente de respostas.

Assim, os relatorios devem apontar fragilidades por descritor, enquanto a interpretacao pedagogica mais ampla pode agrupar resultados por competencia.

## 5. Cuidado tecnico sobre TRI

Nesta fase, o sistema opera como pre-TRI:

- cada questao possui dificuldade inicial estimada;
- os dados de resposta sao acumulados;
- os relatorios usam acerto bruto, desempenho por descritor, componente e competencia;
- a calibracao TRI real depende de volume suficiente de respostas, itens ancora e analise psicometrica.

Essa decisao evita a leitura de "TRI de fachada" e fortalece o projeto para banca, publicacao e futura adocao institucional.

## 6. Matriz SIDEP-CE v0.1

A matriz atual deve ser tratada como uma hipotese pedagogica fundamentada. Ela esta suficientemente organizada para aplicacao piloto, mas ainda precisa ser validada por professores especialistas, aplicacao em campo, analise de resultados e revisao psicometrica progressiva.

O caminho metodologico adotado e:

1. manter `C01` a `C10` como competencias amplas iniciais do curso Tecnico em Informatica;
2. manter `D01` a `D40` como descritores avaliaveis principais;
3. criar indicadores ou subdescritores apenas como camada interna de planejamento pedagogico;
4. produzir novos itens e rubricas vinculados aos descritores;
5. aplicar avaliacoes diagnosticas, formativas e finais;
6. analisar se algum descritor deve ser dividido, fundido, revisado ou removido;
7. criar novas competencias somente quando houver lacuna real na matriz curricular, no perfil profissional ou nos dados de aplicacao.

## 7. Regra de nomenclatura

- Competencias usam codigo curto sequencial: `C01`, `C02`, `C03`...
- Descritores usam codigo curto sequencial: `D01`, `D02`, `D03`...
- O codigo deve aparecer no campo `codigo` e tambem no inicio da descricao.
- Exemplo: `C02 - Desenvolver solucoes computacionais...`
- Essa nomenclatura deve ser usada em relatorios, filtros, graficos, trilhas de recomposicao e comunicacao pedagogica.

## 8. Banco de itens e qualidade

O banco de itens deve crescer com curadoria. A meta nao e apenas quantidade de questoes, mas qualidade, diversidade e aderencia ao descritor.

Regras atuais:

- questoes duplicadas nao devem ser cadastradas;
- questoes em rascunho ou revisao nao entram em prova;
- somente questoes validadas podem compor avaliacao;
- a mesma prova nao pode conter questoes repetidas;
- a mesma prova nao deve conter questoes com contexto muito semelhante;
- descritores com baixa cobertura devem orientar novas producoes.

## 9. Exportacao curricular

A exportacao em Markdown e PDF permite transformar o banco do sistema em documento pedagogico organizado por:

- curso;
- componente curricular;
- competencia;
- descritores vinculados.

Essa funcao serve para planejamento escolar, estudo de matriz, validacao por especialistas, apresentacao academica e acompanhamento da evolucao do metodo.

## 10. Formulacao recomendada do projeto

O SIDEP-CE estrutura a base de dados e a arquitetura pedagogica para avaliacao tecnica baseada em competencias, com parametros pre-TRI na fase inicial e possibilidade de calibracao TRI a medida que o sistema acumular respostas em escala.

## 11. Proximas evolucoes recomendadas

1. Implementar Supabase Auth e RLS real por perfil.
2. Criar politica de auditoria completa.
3. Ampliar relatorios da escola, CREDE/SEFOR e SEDUC.
4. Produzir rubricas praticas para competencias tecnicas.
5. Criar trilhas de recomposicao por descritor.
6. Definir protocolo de validacao por especialistas.
7. Planejar aplicacoes com itens ancora para futura calibracao TRI.
