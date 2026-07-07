# SIDEP-CE - Implantacao online gratuita v0.6

Data: 07/07/2026

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

## Status tecnico

Build validado em 07/07/2026 com `npm run build`.

O sistema local continua funcionando quando o Supabase nao esta configurado.
