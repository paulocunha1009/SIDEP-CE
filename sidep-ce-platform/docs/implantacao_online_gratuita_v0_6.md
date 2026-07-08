# SIDEP-CE - Implantacao online gratuita v0.7

Data: 08/07/2026

## Objetivo

Colocar o SIDEP-CE em operacao online inicial sem custo, preservando o modo local que ja funciona.

## Estrategia gratuita

Stack recomendada para o piloto:

- Frontend: React + Vite.
- Deploy: Vercel Free.
- Banco/Auth inicial: Supabase Free.
- Repositorio: GitHub Free.
- Dominio inicial: subdominio gratuito da Vercel.

## Escopo do piloto

Cenario estimado:

- 2 escolas;
- 2 professores;
- 2 gestoes escolares;
- cerca de 400 acessos/envios de avaliacao por semana;
- avaliacoes com 20 a 80 questoes;
- relatorios por aluno, turma, descritor, componente e competencia.

Esse volume e adequado para um piloto gratuito, desde que as respostas sejam armazenadas de forma consolidada e os relatorios sejam calculados sob demanda.

## Melhorias implementadas

### Atualizacao v0.7 - qualidade, rastreabilidade e exportacao

Em 08/07/2026, foram consolidadas melhorias importantes para o piloto online:

- codigo de avaliacao randomico, unico e imutavel apos abertura;
- codigo usado ou excluido permanece bloqueado e nao pode ser reaproveitado;
- avaliacao criada por engano pode ser excluida apenas quando nao possui respostas;
- gerador de prova impede questoes duplicadas dentro da mesma avaliacao;
- gerador de prova evita questoes com contexto muito semelhante dentro da mesma avaliacao;
- ordem das questoes e embaralhada por estudante;
- banco de itens recebeu rotina de bloqueio de duplicidade na criacao;
- textos das questoes foram normalizados para reduzir erros de acentuacao e caracteres quebrados;
- banco de itens passou a exportar componentes, competencias e descritores em Markdown e PDF;
- manual de uso operacional foi criado em `docs/manual_uso_sidep_ce.md`.

Essas melhorias nao exigem nova tabela obrigatoria para funcionar quando o schema v0.6 ja esta aplicado, mas exigem que o deploy da Vercel esteja atualizado com o codigo mais recente.

### 0. MVP online em piloto controlado

Em 07/07/2026, o SIDEP-CE passou a operar em arquitetura hibrida:

- modo local preservado para continuidade do desenvolvimento;
- Supabase configurado como banco online do piloto;
- Vercel configurado para deploy publico inicial;
- GitHub usado como repositorio fonte;
- rotina de migracao da base local para Supabase adicionada na area de Relatorios.

Essa decisao permite iniciar aplicacoes reais em pequena escala sem perder os dados ja criados no navegador durante a fase de prototipo.

### 1. Resposta consolidada em JSON por aluno

O sistema nao grava uma linha por alternativa marcada. Cada envio de prova gera um registro consolidado por aluno e avaliacao.

Campos principais:

- codigo da avaliacao;
- nome/chave normalizada do estudante;
- ordem das questoes sorteadas;
- respostas em JSON;
- acertos;
- total de questoes;
- percentual bruto;
- desempenho por descritor em JSON;
- desempenho por componente em JSON.

Vantagem:

- reduz volume de linhas no banco;
- facilita backup;
- preserva a ordem da prova aplicada ao aluno;
- mantem base suficiente para relatorios e futura analise pre-TRI/TRI.

### 2. Relatorios calculados sob demanda

O MVP nao cria varias tabelas de relatorio. Os relatorios sao calculados a partir das respostas consolidadas.

Relatorios atuais:

- aluno;
- avaliacao/turma;
- descritor;
- componente;
- competencia.

Vantagem:

- reduz consumo do banco gratuito;
- evita duplicacao de dados;
- simplifica manutencao;
- mantem consistencia entre resposta e relatorio.

### 3. Backup semanal em JSON

Foi adicionado na area de Relatorios um botao para baixar backup semanal em JSON.

O backup inclui:

- escopo do usuario;
- escolas visiveis;
- professores visiveis;
- avaliacoes visiveis;
- respostas do escopo;
- competencias;
- descritores;
- questoes;
- metadados da estrategia tecnica.

Uso recomendado:

- baixar 1 vez por semana;
- guardar em pasta institucional;
- manter copia em nuvem e copia local;
- usar em caso de falha do plano gratuito ou restauracao manual.

### 4. Avaliacoes online com fallback local

O repositorio agora foi preparado para operar assim:

- se Supabase estiver configurado: salvar e carregar avaliacoes online;
- se Supabase nao estiver configurado: continuar usando localStorage.

Isso preserva o sistema local e inicia a migracao online sem quebrar o MVP.

### 5. Codigos bloqueados online

Foi criada a tabela `avaliacao_codigo_bloqueado`.

Regra:

- codigo de avaliacao aberta fica bloqueado;
- codigo de avaliacao excluida tambem fica bloqueado;
- codigo bloqueado nao pode ser reaproveitado.

### 6. Migracao da base local para Supabase

Foi criada uma rotina administrativa para enviar a base local do navegador para o Supabase.

O botao fica na area **Relatorios** e deve ser usado pelo perfil **Administrador**.

A rotina envia, em ordem:

1. regionais CREDE/SEFOR;
2. escolas;
3. professores;
4. competencias;
5. descritores;
6. questoes;
7. avaliacoes;
8. codigos de avaliacao bloqueados;
9. respostas consolidadas dos estudantes.

Observacao importante: a migracao deve ser feita pelo app local em `http://127.0.0.1:5173`, pois e nesse navegador que esta o `localStorage` com a base criada durante o prototipo. O Vercel nao consegue acessar dados locais do computador do professor/desenvolvedor.

### 7. Banco de itens online

Foram adicionadas tabelas MVP para manter compatibilidade direta com o modelo React atual:

- `competencia_mvp`;
- `descritor_mvp`;
- `questao_mvp`.

Essa camada preserva os codigos pedagogicos `C01`, `D01` e `Q-INF...`, mantendo rastreabilidade entre matriz, banco de itens, avaliacoes e relatorios.

## Tabelas MVP online adicionadas

### `avaliacao_mvp`

Tabela leve para salvar avaliacoes no formato atual do React, sem depender ainda de todos os IDs relacionais do modelo completo.

Principais campos:

- codigo_acesso;
- titulo;
- curso_tecnico;
- componentes;
- turma_codigo;
- quantidade_questoes;
- etapa;
- questoes_por_componente;
- descritores_selecionados;
- questoes_codigos;
- status;
- professor_matricula;
- escola_inep;
- inicio_em;
- fim_em;
- codigo_bloqueado_em.

### `avaliacao_codigo_bloqueado`

Registra codigos usados ou excluidos.

Principais campos:

- codigo;
- motivo;
- avaliacao_codigo;
- escola_inep;
- professor_matricula;
- bloqueado_em;
- metadados.

### `resposta_avaliacao`

Ja existia no schema e permanece como a tabela principal de respostas consolidadas.

### `competencia_mvp`

Tabela de competencias pedagogicas utilizadas no MVP.

Campos principais:

- codigo;
- curso_tecnico;
- descricao;
- fonte;
- atualizada_em.

### `descritor_mvp`

Tabela de descritores avaliaveis vinculados a competencias.

Campos principais:

- codigo;
- competencia_codigo;
- componente_curricular;
- descricao;
- nivel_esperado;
- atualizada_em.

### `questao_mvp`

Tabela de questoes do banco de itens do MVP.

Campos principais:

- codigo;
- descritor_codigo;
- componente_curricular;
- enunciado;
- alternativas A-E;
- gabarito;
- justificativa;
- dificuldade_inicial;
- status;
- atualizada_em.

## Variaveis de ambiente

No arquivo `.env.local` do app e nas variaveis da Vercel:

```text
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel
```

Tambem ha compatibilidade com:

```text
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

## Proximos passos para colocar no ar

1. Criar conta gratuita no GitHub.
2. Subir o projeto para um repositorio.
3. Criar projeto gratuito no Supabase.
4. Executar o arquivo `database/schema.sql` no SQL Editor do Supabase.
5. Copiar `Project URL` e `Publishable Key`.
6. Criar `.env.local` no app para teste local online.
7. Criar conta gratuita na Vercel.
8. Conectar a Vercel ao repositorio GitHub.
9. Configurar as variaveis de ambiente na Vercel.
10. Fazer o primeiro deploy.
11. Testar uma avaliacao completa com aluno, professor e gestao.
12. Executar `database/migration_2026_07_07_banco_itens_mvp.sql` caso o schema inicial tenha sido rodado antes da criacao das tabelas MVP do banco de itens.
13. No app local, entrar como Administrador e clicar em **Subir base local para Supabase**.
14. Conferir no Supabase se as tabelas `competencia_mvp`, `descritor_mvp`, `questao_mvp`, `avaliacao_mvp` e `resposta_avaliacao` possuem registros.
15. Rodar, quando aplicavel, as migracoes de saneamento e politicas piloto:
    - `database/migration_2026_07_08_policies_mvp_piloto.sql`;
    - `database/migration_2026_07_08_limpa_textos_questoes_mvp.sql`;
    - `database/migration_2026_07_08_revisa_duplicidade_questoes_base.sql`.
16. Testar a exportacao de componentes/descritores em Markdown e PDF no Banco de Itens.
17. Criar uma avaliacao teste, abrir, responder como aluno e conferir relatorio.

## Observacao sobre seguranca

O piloto gratuito inicia a migracao para banco real. Para producao institucional, ainda sera necessario:

- Supabase Auth completo;
- RLS por perfil;
- politicas por escola, professor e CREDE/SEFOR;
- logs de auditoria completos;
- rotina de backup automatizada;
- revisao LGPD;
- dominio institucional;
- plano de contingencia.

Enquanto RLS e autenticacao institucional nao estiverem implementadas, o uso online deve ser tratado como **piloto controlado**. O link deve ser compartilhado apenas com professores, gestao e turmas participantes. Dados sensiveis nao devem ser exportados ou expostos fora da finalidade pedagogica.

## Status tecnico

Build validado em 07/07/2026 com `npm run build`.

O sistema local continua funcionando quando o Supabase nao esta configurado.

## Status operacional em 07/07/2026

- Schema principal criado no Supabase.
- Migracao do banco de itens MVP adicionada.
- Variaveis de ambiente preparadas para Vercel.
- Rotina de migracao local para Supabase implementada.
- Base local pode ser enviada ao Supabase pelo perfil Administrador.
- Uso online liberado apenas para piloto controlado.

## Status operacional em 08/07/2026

- Deploy online pode operar com banco Supabase povoado.
- Banco base revisado para reduzir duplicidade e contextos repetidos.
- A criacao de avaliacao possui controle contra repeticao dentro da mesma prova.
- Exportacao curricular em Markdown/PDF disponivel no Banco de Itens.
- Manual de uso do MVP criado.
- Proxima prioridade tecnica: Supabase Auth, RLS real por perfil e auditoria mais forte.
