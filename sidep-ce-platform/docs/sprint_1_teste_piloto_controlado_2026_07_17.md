# SIDEP-CE - Sprint 1: Teste Piloto Controlado

Data de abertura: 17/07/2026  
Status: planejada  
Metodologia: Scrum + MCP aplicado ao ciclo de validacao, evidencia e melhoria continua.

## Objetivo da Sprint

Validar o SIDEP-CE em um piloto pequeno, controlado e rastreavel, simulando uma aplicacao real de avaliacao diagnostica da Educacao Profissional. O foco desta sprint nao e ampliar funcionalidades, mas confirmar se o sistema esta seguro, utilizavel, responsivo e coerente com as regras de negocio ja definidas.

## Escopo do Piloto

- 1 escola piloto.
- 1 professor tecnico piloto.
- 1 curso tecnico.
- 1 turma.
- 1 avaliacao diagnostica com 20 questoes.
- 5 a 10 estudantes participantes ou simulados.
- Teste em desktop/notebook e pelo menos 1 celular.

## Dados Necessarios

### Escola Piloto

| Campo | Valor |
|---|---|
| Nome oficial | A definir |
| Codigo INEP | A definir |
| Tipo | A definir |
| CREDE/SEFOR | A definir |
| Municipio | A definir |
| E-mail institucional principal | A definir |
| Diretor(a) | Opcional |
| Coordenador(a) EP | Opcional |

### Professor Piloto

| Campo | Valor |
|---|---|
| Nome completo | A definir |
| Matricula | A definir |
| CPF/senha inicial | A definir |
| E-mail institucional | A definir |
| Escola principal | A definir |
| Curso tecnico de atuacao | Tecnico em Informatica |
| Perfil | Professor Tecnico ou Coordenador/Professor Tecnico |

### Avaliacao Piloto

| Campo | Valor |
|---|---|
| Curso | Tecnico em Informatica |
| Turma | A definir |
| Etapa | Diagnostica |
| Quantidade de questoes | 20 |
| Componentes | A definir |
| Descritores | A definir |
| Status inicial | Rascunho |
| Status para aplicacao | Aberta |

### Estudantes de Teste

| Nº | Nome completo | Dispositivo | Concluiu? | Observacao |
|---|---|---|---|---|
| 1 | A definir | Desktop/Notebook | Nao iniciado |  |
| 2 | A definir | Celular | Nao iniciado |  |
| 3 | A definir | Desktop/Notebook | Nao iniciado |  |
| 4 | A definir | Celular | Nao iniciado |  |
| 5 | A definir | Desktop/Notebook | Nao iniciado |  |

## Checklist de Execucao

### 1. Ambiente e Acesso

- [ ] Confirmar deploy atualizado no Vercel.
- [ ] Confirmar Supabase configurado no Vercel.
- [ ] Confirmar Edge Function `admin-create-user` publicada.
- [ ] Confirmar usuario administrador master acessando normalmente.
- [ ] Confirmar que o painel mostra dados do Supabase, nao modo local.

Evidencia:

- Print/tela:
- Observacao:

### 2. Cadastro da Escola

- [ ] Cadastrar ou revisar escola piloto.
- [ ] Confirmar codigo INEP unico.
- [ ] Confirmar CREDE/SEFOR correta.
- [ ] Confirmar e-mail institucional principal.
- [ ] Confirmar criacao/sincronizacao do usuario Auth da gestao escolar.
- [ ] Testar login da gestao escolar.
- [ ] Confirmar que gestao escolar ve apenas dados da propria escola.

Evidencia:

- Escola:
- INEP:
- Usuario/e-mail:
- Resultado:

### 3. Cadastro do Professor

- [ ] Cadastrar professor tecnico piloto.
- [ ] Vincular professor a escola piloto.
- [ ] Vincular professor ao curso correto.
- [ ] Confirmar criacao/sincronizacao do usuario Auth do professor.
- [ ] Testar login do professor.
- [ ] Testar redefinicao de senha do professor.
- [ ] Confirmar que professor ve apenas suas avaliacoes.

Evidencia:

- Professor:
- Matricula:
- E-mail:
- Resultado:

### 4. Banco de Itens

- [ ] Confirmar competencias do curso disponiveis.
- [ ] Confirmar descritores vinculados as competencias.
- [ ] Confirmar questoes validadas suficientes para 20 itens.
- [ ] Confirmar ausencia de questoes duplicadas na avaliacao.
- [ ] Confirmar que questoes em rascunho/em revisao nao entram na prova.
- [ ] Abrir pelo menos 3 questoes no modal "Ver questao".

Evidencia:

- Curso:
- Componentes testados:
- Descritores testados:
- Total de itens elegiveis:

### 5. Criacao da Avaliacao

- [ ] Criar avaliacao diagnostica.
- [ ] Selecionar curso.
- [ ] Selecionar turma.
- [ ] Selecionar componentes.
- [ ] Definir quantidade por componente/descritor.
- [ ] Confirmar minimo de 20 questoes.
- [ ] Confirmar maximo de 80 questoes.
- [ ] Confirmar codigo randomico gerado.
- [ ] Confirmar que codigo nao muda apos avaliacao aberta.
- [ ] Abrir avaliacao.

Evidencia:

- Titulo:
- Codigo:
- Turma:
- Quantidade:
- Status:

### 6. Aplicacao Online com Estudantes

- [ ] Aluno acessa somente com codigo da avaliacao e nome completo.
- [ ] Aluno nao visualiza diagnostico, relatorio, TRI ou intervencao.
- [ ] Questao aparece sem gabarito.
- [ ] Ordem das questoes e embaralhada por estudante.
- [ ] Envio da resposta e concluido.
- [ ] Segunda tentativa do mesmo estudante/codigo e bloqueada.
- [ ] Aplicacao funciona em desktop/notebook.
- [ ] Aplicacao funciona em celular.

Evidencia:

- Codigo da avaliacao:
- Estudantes testados:
- Dispositivos:
- Resultado:

### 7. Avaliacao Impressa e Lancamento Manual

- [ ] Gerar versao impressa da avaliacao.
- [ ] Confirmar cabecalho e rodape.
- [ ] Confirmar duas colunas de questoes.
- [ ] Confirmar legibilidade em PDF/impressao.
- [ ] Abrir lancamento de gabarito impresso.
- [ ] Registrar respostas de um estudante teste.
- [ ] Confirmar entrada no relatorio.

Evidencia:

- Arquivo/print:
- Estudante:
- Resultado:

### 8. Relatorios

- [ ] Ver relatorio geral.
- [ ] Ver relatorio por avaliacao.
- [ ] Ver relatorio individual do aluno.
- [ ] Ver prova respondida/corrigida.
- [ ] Ver leitura pedagogica de dificuldades.
- [ ] Confirmar filtros por curso, turma, avaliacao, componente e descritor.
- [ ] Exportar relatorio em Markdown.
- [ ] Exportar relatorio em PDF.

Evidencia:

- Relatorios testados:
- Exportacoes geradas:
- Resultado:

### 9. Permissoes e Seguranca

- [ ] Administrador ve tudo.
- [ ] SEDUC ve rede geral, se houver usuario SEDUC.
- [ ] CREDE/SEFOR ve apenas escolas da regional, se houver usuario regional.
- [ ] Gestao escolar ve apenas sua escola.
- [ ] Professor ve apenas suas avaliacoes.
- [ ] Aluno nao consegue acessar area interna.
- [ ] Usuario inativo nao consegue acessar.
- [ ] RLS permanece sem alerta critico no Supabase.

Evidencia:

- Perfis testados:
- Resultado:

### 10. Responsividade e Acessibilidade

- [ ] Login em desktop.
- [ ] Login em celular.
- [ ] Area do professor em desktop.
- [ ] Area do professor em tela reduzida.
- [ ] Prova do aluno em celular.
- [ ] Relatorios em desktop.
- [ ] Tabelas nao quebram layout.
- [ ] Textos com acentuacao correta.
- [ ] Botoes com area de clique adequada.

Evidencia:

- Dispositivos:
- Navegadores:
- Problemas encontrados:

## Registro de Incidentes

| Nº | Tela/Modulo | Perfil | Problema encontrado | Severidade | Acao proposta | Status |
|---|---|---|---|---|---|---|
| 1 | A definir | A definir | A definir | Baixa/Media/Alta/Critica | A definir | Aberto |

## Criterios de Aceite da Sprint

- Administrador consegue executar o fluxo completo.
- Escola piloto consegue acessar e visualizar apenas seu escopo.
- Professor piloto consegue criar e abrir avaliacao.
- Aluno consegue responder prova online sem acessar dados internos.
- Relatorio por avaliacao e individual aparecem corretamente.
- Exportacao funciona.
- Redefinicao de senha de professor funciona no Auth.
- Nenhuma falha critica de seguranca aparece no Supabase.
- Problemas encontrados ficam registrados para a Sprint 2.

## Resultado da Sprint

Status final: a preencher apos execucao.

Decisao:

- [ ] Aprovado para piloto real ampliado.
- [ ] Aprovado com ajustes pequenos.
- [ ] Reprovado temporariamente, exige correcao antes de novo teste.

Observacoes finais:

- A preencher.
