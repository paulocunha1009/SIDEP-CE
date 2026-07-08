# SIDEP-CE Platform

Plataforma do **Sistema de Diagnostico da Educacao Profissional do Ceara**, proposta para diagnosticar, acompanhar e recompor aprendizagens tecnicas nos cursos da Educacao Profissional.

O projeto deixou de ser apenas um prototipo local e entrou em fase de **MVP online em piloto controlado**, com React/Vite, deploy via Vercel e persistencia inicial em Supabase/PostgreSQL.

## Finalidade

O SIDEP-CE nao e apenas uma prova online. Ele organiza um metodo de avaliacao diagnostica, formativa e final baseado em:

- matriz curricular do curso tecnico;
- competencias amplas;
- descritores avaliaveis;
- banco de itens com curadoria docente;
- aplicacoes por codigo unico;
- respostas consolidadas por estudante;
- relatorios por aluno, turma, descritor, componente e competencia;
- base pre-TRI para futura calibracao psicometrica;
- apoio futuro de IA Generativa supervisionada.

## Stack Atual

- Frontend: React + Vite.
- Hospedagem: Vercel.
- Banco online: Supabase/PostgreSQL.
- Persistencia local: `localStorage`, mantida como fallback.
- Repositorio: GitHub.
- Banco de itens piloto: curso Tecnico em Informatica.

## Estado Atual do MVP - v0.7

- Login separado para aluno, professor, gestao escolar, CREDE/SEFOR, SEDUC e Administrador.
- Aluno acessa somente por codigo da avaliacao e nome completo.
- Professor e gestao acessam areas institucionais conforme perfil.
- Administrador master possui acesso total.
- Escolas usam codigo INEP como identificador institucional.
- Professores usam matricula, CPF e e-mail institucional no cadastro.
- Banco de itens estruturado por competencia, descritor e questao.
- Nomenclatura pedagogica padronizada: `C01`, `C02`... para competencias e `D01`, `D02`... para descritores.
- Curso Tecnico em Informatica com 10 competencias, 40 descritores e 441 questoes piloto.
- Questao possui status `rascunho`, `em_revisao` ou `validada`.
- Apenas questoes `validada` entram em avaliacoes.
- Criador de avaliacoes monta provas entre 20 e 80 questoes.
- Codigo de avaliacao e gerado automaticamente, com token randomico.
- Codigo aberto ou excluido fica bloqueado e nao pode ser reaproveitado.
- O codigo da avaliacao torna-se imutavel apos abertura e passa a ser a chave de rastreabilidade da aplicacao.
- A montagem da prova bloqueia questoes duplicadas e tambem evita itens com contexto muito semelhante na mesma avaliacao.
- A ordem das questoes e embaralhada individualmente para cada estudante.
- Respostas sao salvas em JSON consolidado por aluno/prova.
- Relatorios sao calculados sob demanda.
- Banco de itens permite exportar componentes, competencias e descritores por curso em Markdown e PDF.
- Migracao da base local para Supabase implementada pela area de Relatorios.

## Tabelas Online Principais

- `regional`
- `escola`
- `professor`
- `competencia_mvp`
- `descritor_mvp`
- `questao_mvp`
- `avaliacao_mvp`
- `avaliacao_codigo_bloqueado`
- `resposta_avaliacao`
- `log_auditoria`

## Uso em Piloto Controlado

O sistema ja pode ser usado online em piloto com turmas pequenas, desde que:

- o projeto esteja conectado ao Supabase;
- as variaveis de ambiente estejam configuradas na Vercel;
- a base local tenha sido migrada para o Supabase;
- a avaliacao esteja com status `aberta`;
- o professor acompanhe relatorios e registre intervencoes pedagogicas.

## Manual de Uso

O manual operacional do MVP esta em:

- `docs/manual_uso_sidep_ce.md`

Ele explica:

- como aluno entra na avaliacao;
- como professor cria e acompanha avaliacoes;
- como gestao escolar, CREDE/SEFOR, SEDUC e Administrador acessam relatorios;
- como validar questoes;
- como exportar componentes e descritores;
- como migrar a base local para o Supabase;
- quais cuidados ainda existem no piloto controlado.

## Variaveis de Ambiente

```text
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel
```

Tambem ha compatibilidade com:

```text
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Proxima Sprint Recomendada

Antes de ampliar para uso institucional, a prioridade tecnica e de governanca deve ser:

1. ativar Supabase Auth;
2. implementar RLS por perfil e escopo;
3. criar politicas por escola, professor, CREDE/SEFOR e Administrador;
4. fortalecer logs de auditoria;
5. criar rotina de backup automatizada;
6. revisar LGPD, termos de uso e politica de acesso;
7. preparar painel de gestao escolar e regional com indicadores agregados.

## Sintese

O SIDEP-CE busca transformar dados de desempenho tecnico em decisao pedagogica. A proposta fortalece a Educacao Profissional do Ceara ao permitir que professores, escolas e gestao identifiquem lacunas por descritor, planejem intervencoes e acompanhem a evolucao da aprendizagem tecnica ao longo do curso.
