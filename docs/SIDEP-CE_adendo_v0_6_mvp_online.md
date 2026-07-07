# SIDEP-CE - Adendo v0.6: MVP Online, Supabase e Uso em Piloto Controlado

Data: 07/07/2026

## 1. Mudanca de Estado do Projeto

O SIDEP-CE avancou da fase exclusivamente local para um MVP online em piloto controlado. A plataforma passou a operar com:

- React/Vite como frontend;
- GitHub como repositorio;
- Vercel como ambiente de deploy;
- Supabase/PostgreSQL como banco online;
- fallback local preservado para desenvolvimento e contingencia;
- rotina de migracao da base local para o banco online.

Esse marco transforma o SIDEP-CE de demonstrador local em produto tecnico-tecnologico testavel em contexto escolar.

## 2. Base Online Criada

O banco Supabase recebeu o schema principal do projeto e tabelas MVP para manter compatibilidade com a aplicacao atual:

- `regional`;
- `escola`;
- `professor`;
- `competencia_mvp`;
- `descritor_mvp`;
- `questao_mvp`;
- `avaliacao_mvp`;
- `avaliacao_codigo_bloqueado`;
- `resposta_avaliacao`;
- `log_auditoria`.

## 3. Migracao da Base Local

Foi criada a rotina **Subir base local para Supabase**, disponivel para o perfil Administrador na area de Relatorios.

A rotina envia:

1. regionais CREDE/SEFOR;
2. escolas;
3. professores;
4. competencias;
5. descritores;
6. questoes;
7. avaliacoes;
8. codigos bloqueados;
9. respostas consolidadas.

A migracao deve ser executada a partir do app local em `http://127.0.0.1:5173`, porque os dados historicos do prototipo estavam no `localStorage` do navegador.

## 4. Respostas Consolidadas

Cada envio de prova gera um unico registro por estudante e avaliacao, em JSON. O sistema nao grava uma linha por alternativa.

Esse modelo registra:

- codigo da avaliacao;
- estudante normalizado;
- ordem sorteada das questoes;
- respostas marcadas;
- acertos;
- percentual bruto;
- desempenho por descritor;
- desempenho por componente;
- vinculo com turma, escola e professor.

Essa decisao reduz custo no plano gratuito e preserva informacao suficiente para relatorios e futura analise estatistica.

## 5. Uso Online Permitido

O uso online esta liberado para piloto controlado, preferencialmente com:

- uma ou duas escolas;
- poucas turmas;
- professor acompanhando a aplicacao;
- verificacao dos registros no Supabase;
- backup semanal JSON;
- uso pedagogico dos relatorios.

O sistema ainda nao deve ser apresentado como ambiente institucional definitivo, pois ainda faltam Supabase Auth, RLS, politicas por perfil e revisao LGPD.

## 6. Relevancia para o TCC/Mestrado

A v0.6 fortalece a apresentacao academica porque demonstra que o projeto possui:

- metodo pedagogico;
- matriz inicial de competencias e descritores;
- banco de itens estruturado;
- fluxo real de aplicacao;
- coleta de respostas;
- relatorios pedagogicos;
- banco online;
- possibilidade de uso em campo;
- base inicial para futura calibracao TRI.

Assim, o SIDEP-CE passa a ser apresentado como produto tecnico-tecnologico em desenvolvimento aplicado, e nao apenas como proposta conceitual.

## 7. Proxima Sprint Obrigatoria

Antes de ampliar o uso, a prioridade deve ser:

- implementar Supabase Auth;
- ativar RLS;
- criar politicas por Administrador, SEDUC, CREDE/SEFOR, escola, professor e aluno;
- fortalecer logs de auditoria;
- automatizar backup;
- revisar LGPD, termo de uso e politica de privacidade;
- consolidar paineis de gestao escolar e regional.
