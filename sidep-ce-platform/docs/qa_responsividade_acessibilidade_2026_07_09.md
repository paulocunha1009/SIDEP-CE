# QA de Responsividade e Acessibilidade - SIDEP-CE

Data: 09/07/2026

## Objetivo

Verificar o comportamento responsivo e a acessibilidade basica do SIDEP-CE em celular, tablet, notebook, desktop, tela cheia, janela compartilhada e tela estreita.

## Breakpoints verificados

Foram usados os seguintes tamanhos de viewport no app local:

- celular pequeno: 320 x 740;
- celular comum: 390 x 844;
- tablet: 768 x 1024;
- janela compartilhada: 900 x 720;
- notebook: 1366 x 768;
- desktop: 1600 x 900.

## Resultado da tela inicial

A tela inicial/login foi verificada por auditoria automatizada no navegador interno.

Resultado:

- sem overflow horizontal;
- sem imagens sem texto alternativo;
- sem inputs sem rotulo detectado;
- sem alvos interativos menores que o minimo recomendado;
- layout preservado em celular, tablet, notebook e desktop.

## Telas internas

A tentativa de auditoria visual completa das telas internas encontrou a tela obrigatoria de primeiro acesso. Por seguranca, nenhuma senha administrativa foi alterada durante o QA.

Mesmo sem alterar senha, foi realizada auditoria por codigo e CSS das telas internas, cobrindo:

- Painel Geral;
- Banco de Itens;
- Avaliacoes;
- Relatorios;
- Cadastros institucionais;
- modais de leitura de questao;
- tabelas e listas;
- area do estudante.

## Ajustes aplicados

Foram aplicadas correcoes transversais:

- prevencao global de overflow horizontal;
- `min-width: 0` em cards, paineis, botoes, inputs e grids criticos;
- quebra segura de textos longos em titulos, cards, tabelas e descricoes;
- tabelas com rolagem horizontal controlada em telas pequenas;
- tabelas navegaveis por teclado com `tabIndex`;
- rotulo acessivel para tabelas de dados;
- foco visivel reforcado em botoes, links, inputs, selects, textareas e areas de tabela;
- area minima de toque melhorada para botoes pequenos;
- modais adaptados para celular e telas estreitas;
- cards, filtros, grids de curso/componente/descritor e listas em uma coluna nos breakpoints menores;
- imagens de questao responsivas, sem estourar a viewport.

## Checklist de regressao

Antes de subir nova sprint, validar:

- tela inicial em 320 px, 390 px, 768 px, 900 px, 1366 px e 1600 px;
- login de professor e gestao sem quebra de layout;
- Banco de Itens em Competencias, Descritores e Questoes;
- upload/URL de imagem opcional em questao;
- modal "Ver questao";
- criador de avaliacoes com componentes e descritores;
- lista de aplicacoes criadas por perfil;
- relatorios com tabelas rolando horizontalmente em celular;
- prova do aluno com questoes de texto e com imagem;
- navegacao por teclado em botoes, campos e tabelas.

## Observacao de seguranca

O QA nao alterou senha de usuarios reais. Para auditoria visual completa das telas internas no navegador, usar um usuario de teste sem primeiro acesso pendente ou autorizar previamente uma senha temporaria de homologacao.
