# SIDEP-CE - Metodologia de Mestrado e Regras de Negocio

Versao: 0.5 - Rastreabilidade de aplicacoes, codigo unico e exclusao segura  
Atualizado em: 07/07/2026

## 1. Tese Central

O SIDEP-CE nao deve ser entendido apenas como um sistema de prova online. A proposta constitui um metodo de diagnostico, acompanhamento e recomposicao da aprendizagem tecnica na Educacao Profissional do Ceara, articulando matriz curricular, competencias, descritores avaliaveis, banco de itens, rubricas praticas, analise pre-TRI/TRI, Learning Analytics e IA Generativa supervisionada.

A tese metodologica e que a avaliacao tecnica so se torna pedagogicamente util quando transforma dados de desempenho em decisao docente, intervencao planejada e melhoria institucional.

## 2. Matriz SIDEP-CE v0.1

A matriz atual deve ser tratada como versao inicial validavel, nao como matriz definitiva. Ela foi organizada para o curso Tecnico em Informatica a partir de quatro fontes principais:

- matriz curricular vigente do curso;
- percurso formativo do curso Tecnico em Informatica;
- fundamentos do TCC SIDEP-CE;
- referencia do CNCT para o eixo Informacao e Comunicacao.

Estrutura atual:

- 10 competencias amplas, codificadas de `C01` a `C10`;
- 40 descritores avaliaveis, codificados de `D01` a `D40`;
- 441 questoes piloto vinculadas ao banco diagnostico inicial;
- 78 questoes inicialmente validadas e 363 questoes em revisao docente;
- evidencias por itens objetivos, situacoes-problema, rubricas praticas, projetos, laboratorio, estagio e tempo comunidade.

## 3. Diferenca Entre Competencia, Descritor e Indicador

Competencia e uma capacidade ampla de mobilizar conhecimentos, habilidades, atitudes, procedimentos e valores em situacoes tecnicas ou profissionais.

Descritor e uma evidencia observavel e avaliavel dessa competencia. Ele traduz a competencia em algo que pode virar item, rubrica, tarefa pratica ou relatorio pedagogico.

Indicador ou subdescritor e uma camada interna de refinamento do descritor. Ele ajuda o professor a planejar intervencoes, mas nao precisa aparecer como codigo principal da matriz estadual.

Exemplo:

- Competencia: `C02 - Resolver problemas computacionais por meio de logica de programacao...`
- Descritor: `D05 - Decompor problemas em etapas, identificar entradas, processamentos e saidas...`
- Indicadores: identificar entradas; reconhecer processamento; definir saidas; representar solucao em pseudocodigo; testar coerencia da solucao.

## 4. Regra de Evolucao da Matriz

A matriz nao deve crescer por intuicao isolada. Novas competencias e novos descritores so devem ser criados apos estudo pedagogico, aplicacao em campo e analise de evidencias.

Uma nova competencia deve ser criada quando:

- a matriz curricular trouxer uma capacidade profissional que nao cabe nas competencias existentes;
- professores especialistas identificarem lacuna estrutural no perfil de conclusao;
- houver componente curricular ou pratica profissional sem representacao adequada;
- os dados de avaliacao mostrarem agrupamento de descritores que nao se encaixa em nenhuma competencia atual.

Um novo descritor deve ser criado quando:

- um descritor atual estiver amplo demais para orientar item ou rubrica;
- houver habilidade tecnica importante sem evidencia observavel;
- os itens de um descritor medirem coisas diferentes entre si;
- professores nao conseguirem planejar recomposicao a partir do descritor existente;
- dados de resposta indicarem que o descritor precisa ser dividido.

Um descritor deve ser revisado, fundido ou removido quando:

- repetir outro descritor;
- nao gerar evidencia avaliavel;
- depender apenas de memorizacao sem valor profissional;
- nao dialogar com matriz curricular, CNCT ou pratica do curso;
- apresentar baixo poder pedagogico ou psicometrico apos aplicacoes.

## 5. Logica Pre-TRI e TRI

Na fase inicial, o SIDEP-CE opera como base pre-TRI. Isso significa que os itens possuem dificuldade estimada, vinculo curricular e historico de acertos, mas ainda nao possuem parametros psicometricos calibrados por volume suficiente de respostas.

A passagem para TRI exige:

- banco de itens estavel;
- volume expressivo de respostas;
- itens ancora entre aplicacoes;
- analise de dificuldade e discriminacao;
- revisao de itens ambiguos, muito faceis, muito dificeis ou desalinhados;
- validacao por especialistas e acompanhamento estatistico.

No SIDEP-CE, a questao mede o descritor. O conjunto de descritores interpreta a competencia. O relatorio pedagogico deve priorizar fragilidades por descritor, pois e nesse nivel que o professor consegue intervir.

## 6. Regras de Negocio do Banco de Itens

1. Toda questao deve estar vinculada a curso, componente curricular, competencia e descritor.
2. Nenhuma questao deve ser aplicada sem status `validada`.
3. O estudante nao visualiza peso de item, parametro pre-TRI/TRI, diagnostico bruto ou intervencao automatica.
4. O professor pode criar avaliacao por uma ou mais disciplinas/componentes.
5. A avaliacao deve conter minimo de 20 questoes e maximo de 80 questoes.
6. A montagem da avaliacao deve permitir distribuicao por componente, com opcoes controladas como 2, 5, 10 ou 20 questoes por componente.
7. A quantidade final deve respeitar o limite total e a disponibilidade de itens validados.
8. Quando nao houver itens suficientes para um descritor, o sistema deve sinalizar necessidade de producao ou validacao de novos itens.
9. Cada aplicacao deve gerar codigo de acesso para estudantes.
10. O estudante acessa a prova por codigo, informa nome completo e responde em computador, tablet ou celular.
11. Relatorios devem existir em tres camadas: estudante, turma e escola/gestao.
12. O banco deve registrar historico de aplicacoes para permitir analise longitudinal e futura calibracao TRI.
13. O codigo de acesso da avaliacao deve ser gerado automaticamente pelo sistema, com token randomico e verificacao de unicidade.
14. Apos aberta a avaliacao, o codigo de acesso torna-se chave imutavel da aplicacao, vinculando respostas, auditoria, investigacao pedagogica e relatorios.
15. Avaliacao criada por engano pode ser excluida somente se ainda nao possuir respostas registradas.
16. Ao excluir uma avaliacao sem respostas, o codigo de acesso deve permanecer bloqueado e nao pode ser reaproveitado em nova aplicacao.

### 6.1 Status de Curadoria dos Itens

O MVP do SIDEP-CE passou a operar com tres situacoes principais para as questoes:

- `rascunho`: item em elaboracao ou devolvido para ajuste. Nao pode compor avaliacao.
- `em_revisao`: item aguardando curadoria docente. Nao pode compor avaliacao.
- `validada`: item revisado e liberado para o criador de avaliacoes.

A regra pedagogica central e que apenas questoes `validada` podem ser usadas em avaliacoes. Questao em revisao ou rascunho permanece no banco para estudo, reescrita, validacao posterior ou descarte, mas nao deve chegar ao estudante.

### 6.2 Fluxo de Validacao Docente

O fluxo de validacao implementado no MVP segue a seguinte ordem:

1. O item e criado ou importado no Banco de Itens.
2. O item fica como `rascunho` ou `em_revisao`.
3. O professor/revisor acessa a fila de validacao.
4. O sistema permite abrir o item em uma caixa de leitura, exibindo enunciado, alternativas, gabarito, justificativa pedagogica, descritor, competencia, componente curricular e dificuldade inicial pre-TRI.
5. O revisor decide entre validar, devolver para revisao ou marcar como rascunho.
6. Somente itens validados entram no criador de avaliacoes.

Esse fluxo reforca a governanca pedagogica do banco, pois impede que itens gerados ou importados sejam aplicados sem leitura humana qualificada.

### 6.3 Cobertura por Competencia e Descritor

O MVP tambem passou a exibir a cobertura do banco de itens por competencia e por descritor, com total de questoes, questoes validadas, questoes em revisao e rascunhos.

Essa leitura tem quatro finalidades:

- identificar competencias com baixa cobertura;
- identificar descritores sem quantidade minima de itens validados;
- orientar producao e revisao de novas questoes;
- preparar a futura fase de analise classica e calibracao TRI.

Para fins de aplicacao real, cada descritor prioritario deve possuir quantidade suficiente de itens validados, com diversidade de dificuldade, linguagem contextualizada e aderencia ao componente curricular.

### 6.4 Controle de Acesso e Perfis Institucionais

O SIDEP-CE passou a adotar uma logica de acesso por usuario e senha, substituindo o seletor livre de perfis do prototipo. A regra de negocio do MVP ficou definida da seguinte forma:

- estudante nao possui acesso administrativo; informa apenas codigo da prova e nome completo;
- gestao escolar usa o codigo INEP como usuario;
- senha inicial da gestao escolar e o proprio codigo INEP;
- professor tecnico usa o e-mail institucional como usuario;
- senha inicial do professor e o CPF cadastrado;
- CREDE/SEFOR usa usuario institucional regional, como `CREDE-3` ou `SEFOR-1`;
- SEDUC usa usuario institucional de rede;
- Administrador usa usuario administrativo geral.

No primeiro acesso, escola e professor devem alterar a senha inicial. A redefinicao de senha e uma acao restrita ao Administrador. Quando a senha da escola e redefinida, volta para o INEP. Quando a senha do professor e redefinida, volta para o CPF cadastrado.

### 6.5 Escopo de Permissao

As permissoes seguem o principio do menor acesso necessario:

- aluno acessa somente a avaliacao, por codigo da prova e nome completo;
- professor acessa a area de professor e suas avaliacoes;
- gestao escolar acessa professores, avaliacoes e relatorios da propria escola;
- CREDE/SEFOR acessa escolas, professores, banco de itens, avaliacoes e relatorios de sua regional;
- SEDUC acessa dados agregados da rede;
- Administrador acessa todas as abas e e o unico perfil autorizado a redefinir senhas.

Essa separacao prepara o sistema para uso institucional, reduz exposicao indevida de dados e organiza a futura implementacao com autenticacao real, logs de auditoria e politicas de permissao no banco.

### 6.6 Rastreabilidade da Avaliacao e Codigo de Aplicacao

No SIDEP-CE, o codigo de acesso nao e apenas uma senha temporaria para o estudante. Ele funciona como identificador operacional da aplicacao avaliativa. Por esse motivo, sua governanca precisa ser tratada como requisito metodologico, tecnico e psicometrico.

Regras adotadas no MVP:

- o codigo e gerado automaticamente pelo sistema;
- o professor nao digita o codigo manualmente;
- antes de abrir a avaliacao, o professor pode solicitar novo codigo;
- ao abrir a avaliacao, o codigo fica bloqueado e imutavel;
- o codigo vincula respostas, turma, professor, escola, etapa, status e relatorios;
- o codigo nao pode ser reutilizado, mesmo que a avaliacao seja excluida;
- a exclusao so e permitida quando ainda nao houver respostas de estudantes;
- se houver resposta registrada, a avaliacao nao deve ser excluida, apenas encerrada ou corrigida.

Essa regra fortalece a rastreabilidade da aplicacao, evita colisao de dados entre turmas, impede reaproveitamento indevido de codigos e preserva a integridade dos relatorios pedagogicos. Para a pesquisa de mestrado, esse controle contribui para a confiabilidade da base empirica, pois garante que cada conjunto de respostas esteja associado a uma aplicacao unica, identificavel e auditavel.

## 7. Regras de Governanca Pedagogica

O professor e responsavel por validar o sentido pedagogico dos itens, mas o sistema deve apoiar a consistencia tecnica da matriz. A gestao escolar acompanha relatorios agregados, sem transformar diagnostico em mecanismo de exposicao ou punicao.

A IA Generativa pode apoiar:

- sugestao de itens a partir de descritores;
- elaboracao de trilhas de recomposicao;
- organizacao de feedback pedagogico;
- analise preliminar de padroes por turma;
- apoio a redacao de relatorios.

A IA Generativa nao deve:

- substituir validacao docente;
- decidir nota final sozinha;
- expor dados pessoais;
- gerar rotulos fixos para estudantes;
- calibrar TRI sem base estatistica.

## 8. Protocolo de Validacao da Matriz

O ciclo de validacao deve seguir oito etapas:

1. Analise documental da matriz curricular, CNCT, DCRC e normas da EPT.
2. Definicao de competencias amplas por curso.
3. Desdobramento em descritores observaveis.
4. Revisao por professores especialistas e coordenacao tecnica.
5. Elaboracao de itens, rubricas e tarefas praticas.
6. Aplicacao diagnostica piloto.
7. Analise pedagogica e estatistica dos resultados.
8. Revisao da matriz, do banco de itens e das trilhas de recomposicao.

Esse ciclo transforma a matriz em instrumento vivo. A versao v0.1 e uma hipotese pedagogica fundamentada; as versoes futuras devem nascer da aplicacao real.

## 9. Produto Tecnico-Tecnologico

O produto de mestrado deve ser apresentado em duas frentes integradas:

- Caderno Metodologico SIDEP-CE, com matriz de competencias, descritores, regras de avaliacao, criterios de validacao e orientacoes de uso pedagogico.
- Plataforma SIDEP-CE, com area do estudante, professor e gestao escolar, banco de itens, criador de avaliacoes, relatorios, trilhas de recomposicao e base preparada para evolucao pre-TRI/TRI.

### 9.1 Situacao Atual do MVP

A area do professor foi consolidada como nucleo inicial do MVP. Ela ja contempla:

- cadastro e visualizacao de competencias;
- cadastro e visualizacao de descritores;
- cadastro de questoes vinculadas a descritor e competencia;
- importacao da matriz norteadora do curso Tecnico em Informatica;
- banco com 441 questoes piloto;
- fila de validacao docente;
- modal de leitura completa da questao;
- mudanca de status entre rascunho, em revisao e validada;
- visao de cobertura por competencia e descritor;
- criador de avaliacoes usando apenas questoes validadas.
- tela de login institucional;
- acesso do aluno com codigo da prova e nome completo em destaque;
- usuario da escola baseado no INEP;
- usuario do professor baseado no e-mail institucional;
- senha inicial por INEP para escola e CPF para professor;
- troca obrigatoria de senha no primeiro acesso;
- redefinicao de senha restrita ao Administrador;
- acesso total para Administrador e acesso amplo por escopo para CREDE/SEFOR e SEDUC.
- codigo de avaliacao gerado automaticamente pelo sistema;
- bloqueio definitivo do codigo apos abertura da avaliacao;
- exclusao segura de avaliacao sem respostas, mantendo o codigo bloqueado para nao reaproveitamento;
- bloqueio de exclusao quando a avaliacao ja possui respostas, preservando relatorios e auditoria.

Com isso, a proxima sprint deve deslocar o foco para a area da escola/gestao escolar, responsavel por acompanhar relatorios, turmas, professores, aplicacoes, cobertura da escola e indicadores pedagogicos agregados.

## 10. Contribuicao Cientifica

A contribuicao central do projeto e propor uma metodologia aplicavel a rede estadual para transformar matrizes curriculares da EPT em evidencias de aprendizagem tecnica, com apoio de dados e IA, sem reduzir a formacao profissional a uma prova teorica.

O SIDEP-CE se diferencia por articular:

- avaliacao diagnostica, formativa e final;
- competencias e descritores;
- itens objetivos e evidencias praticas;
- analise pre-TRI e possibilidade de TRI futura;
- relatorios acionaveis;
- recomposicao pedagogica;
- governanca de dados;
- uso supervisionado de IA Generativa.
