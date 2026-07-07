# SIDEP-CE Platform

Plataforma em desenvolvimento para o **Sistema de Diagnóstico da Educação Profissional do Ceará**.

Este diretório registra a transição do protótipo HTML local para uma aplicação estadual com React, banco central futuro, autenticação, perfis e relatórios.

## Objetivo Técnico

Criar uma aplicação web robusta para:

- cadastrar escolas pelo código INEP;
- cadastrar regionais CREDE/SEFOR;
- cadastrar professores por matrícula;
- vincular professores a escolas, cursos, componentes e turmas;
- criar banco de itens por matriz, competência e descritor;
- validar questões por curadoria docente antes da aplicação;
- criar avaliações de 20 a 40 questões;
- permitir acesso do estudante por código de avaliação;
- gerar relatórios individuais e por turma;
- produzir base pré-TRI para futura calibração psicométrica.

## Estrutura Inicial

```text
sidep-ce-platform/
  database/
    schema.sql
    seed_ceara_regionais.sql
  docs/
    backlog.md
  src/
    domain/
      models.ts
```

## Estado Atual do MVP

- Stack adotada para o MVP: React + Vite, preparada para Supabase/PostgreSQL.
- Área do professor consolidada com Banco de Itens, Competências, Descritores e Questões.
- Banco piloto do curso Técnico em Informática com 10 competências, 40 descritores e 441 questões.
- Fluxo de status da questão: `rascunho`, `em_revisao` e `validada`.
- Criador de avaliações usa somente questões validadas.
- Fila de curadoria docente permite ver a questão completa, validar, devolver para revisão ou marcar rascunho.
- Cobertura do banco disponível por competência e por descritor.
- Login institucional em modo MVP local.
- Aluno acessa por código da prova e nome completo.
- Escola usa INEP como usuário e senha inicial.
- Professor usa e-mail institucional como usuário e CPF como senha inicial.
- Administrador, CREDE/SEFOR e SEDUC acessam as abas principais, respeitando escopo.
- Apenas Administrador redefine senhas.

## Próximo Passo Recomendado

Desenvolver a aba **Escola/Gestão Escolar**, com visão institucional por código INEP, cursos, turmas, professores, avaliações, relatórios agregados, descritores críticos e acompanhamento de intervenções pedagógicas.
