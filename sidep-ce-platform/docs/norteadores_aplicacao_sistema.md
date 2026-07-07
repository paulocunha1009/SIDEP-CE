# SIDEP-CE: aplicação dos norteadores no sistema

Atualizado em 05/07/2026.

## O que foi incorporado agora

- Importação do banco diagnóstico existente no HTML norteador.
- Geração de semente técnica para o Banco de Itens do sistema.
- Estrutura inicial por curso, competência, descritor e questão.
- Separação de acesso por perfil: estudante, professor e gestão escolar.
- Validação visual no fluxo do professor com 10 competências curriculares, 40 descritores avaliáveis e 78 questões validadas.
- Consolidação da Matriz SIDEP-CE v0.1 para o curso Técnico em Informática como matriz inicial validável, não definitiva.
- Criação da documentação metodológica de mestrado com regras de negócio, evolução da matriz, protocolo pré-TRI/TRI e governança pedagógica.

## Fontes analisadas

- Artigo SIDEP-CE e versão revisada.
- TCC SIDEP-CE.
- Resumo do Seminário DoCEntes 2026.
- Arquivos de coorientação do projeto.
- HTML diagnóstico SIDEP-CE e backups.
- Tabelas normativas extraídas dos documentos `.docx`.

## Diretrizes pedagógicas extraídas

- O SIDEP-CE deve ser apresentado como método de avaliação diagnóstica, formativa e final para cursos técnicos.
- A avaliação precisa estar organizada por competências, descritores avaliáveis, banco de itens, rubricas práticas e relatórios pedagógicos.
- O dado de desempenho não deve terminar em nota: ele deve gerar intervenção pedagógica, recomposição e acompanhamento.
- O estudante deve ver somente o ambiente de prova, sem diagnóstico, peso de item, intervenção ou análises psicométricas.
- Professor e gestão escolar devem visualizar relatórios individuais, por turma, escola, curso, competência e descritor.

## Cuidado técnico sobre TRI

Nesta fase, o sistema deve operar como pré-TRI:

- cada questão possui dificuldade inicial estimada;
- os dados de resposta serão acumulados;
- a calibração TRI real depende de volume suficiente de respostas;
- os relatórios iniciais devem deixar claro que usam parâmetros inspirados em TRI, ainda não calibrados estatisticamente.

Essa decisão evita a leitura de "TRI de fachada" e fortalece o projeto para banca, publicação e futura adoção institucional.

## Melhorias priorizadas para as próximas sprints

1. Criar módulo de aplicação real da prova com código de turma/avaliação, nome completo do estudante e responsividade para computador, tablet e celular.
2. Implementar seleção de 20 a 40 questões validadas por avaliação, com filtro por curso, componente curricular, competência e descritor.
3. Registrar respostas por estudante, turma, escola, curso, avaliação, item, alternativa marcada e tempo de resposta.
4. Calcular resultado pré-TRI por estudante e por turma, combinando acerto, dificuldade inicial e descritores críticos.
5. Criar relatórios separados:
   - estudante: devolutiva simples e formativa;
   - professor: diagnóstico por turma, descritor e item;
   - gestão escolar: visão por escola, curso, turma e evolução.
6. Implementar trilhas de recomposição vinculadas aos descritores com menor desempenho.
7. Adicionar rubricas práticas para competências técnicas que não cabem bem em questão objetiva.
8. Preparar o banco para futura calibração TRI com controle de exposição, histórico de respostas e qualidade psicométrica dos itens.
9. Migrar a persistência local para Supabase/PostgreSQL com autenticação e regras de acesso por perfil.
10. Criar painel de governança do banco de itens com status: rascunho, em revisão, validada, aplicada, calibrável e calibrada.

## Competência, descritor e TRI

No SIDEP-CE, competência e descritor não são sinônimos:

- Competência é uma capacidade ampla de mobilizar conhecimentos, habilidades, atitudes e procedimentos em situações técnicas ou profissionais.
- Descritor é uma evidência observável e avaliável dessa competência, escrita de forma mais específica para orientar itens, rubricas e relatórios.
- Questão é o item que mede um descritor. Na fase pré-TRI, cada questão recebe dificuldade inicial e histórico de acertos; na fase TRI, os parâmetros psicométricos passam a ser calibrados com volume suficiente de respostas.

Assim, os relatórios devem apontar fragilidades por descritor, enquanto a interpretação pedagógica mais ampla pode agrupar resultados por competência.

## Matriz SIDEP-CE v0.1 e evolução metodológica

A matriz atual deve ser tratada como uma hipótese pedagógica fundamentada. Ela está suficientemente organizada para aplicação piloto, mas ainda precisa ser validada por professores especialistas, aplicação em campo, análise de resultados e revisão psicométrica progressiva.

O caminho metodológico adotado é:

1. manter `C01` a `C10` como competências amplas iniciais do curso Técnico em Informática;
2. manter `D01` a `D40` como descritores avaliáveis principais;
3. criar indicadores ou subdescritores apenas como camada interna de planejamento pedagógico;
4. produzir novos itens e rubricas vinculados aos descritores;
5. aplicar avaliações diagnósticas, formativas e finais;
6. analisar se algum descritor deve ser dividido, fundido, revisado ou removido;
7. criar novas competências somente quando houver lacuna real na matriz curricular, no perfil profissional ou nos dados de aplicação.

Essa estratégia evita uma matriz grande demais para ser alimentada e, ao mesmo tempo, permite amadurecimento científico do método para uma tese de mestrado.

Regra de nomenclatura:

- Competências usam código curto sequencial: `C01`, `C02`, `C03`...
- Descritores usam código curto sequencial: `D01`, `D02`, `D03`...
- O código deve aparecer no campo `codigo` e também no início da descrição, por exemplo: `C02 - Desenvolver soluções computacionais...`.
- Essa nomenclatura será usada em relatórios, gráficos, filtros, sinalização de trilhas e comunicação pedagógica.

## Banco importado do HTML norteador

- Curso piloto: Técnico em Informática.
- Competências curriculares: 10.
- Descritores avaliáveis: 40.
- Questões: 78.
- Status inicial das questões: validada.
- Origem: `norteadores/SIDEP-CE_Avaliacao_Diagnostica_Online.html`.

## Requisito de comunicação do projeto

Formulação recomendada:

> O SIDEP-CE estrutura a base de dados e a arquitetura pedagógica para avaliação técnica baseada em competências, com parâmetros pré-TRI na fase inicial e possibilidade de calibração TRI à medida que o sistema acumular respostas em escala.
