# SIDEP-CE

## Documentação Técnica, Pedagógica e de Desenvolvimento

**Projeto:** SIDEP-CE - Sistema de Diagnóstico da Educação Profissional do Ceará  
**Título acadêmico:** Avaliação técnica baseada em TRI e IA Generativa: personalização da aprendizagem na Educação Profissional do Ceará  
**Versão:** 0.4 - Controle de acesso, autenticação MVP e governança por escopo  
**Data:** 06/07/2026  
**Escopo:** transformar o protótipo HTML em uma plataforma estadual robusta, escalável, segura e pedagogicamente aplicável.

---

## 1. Visão Geral

O SIDEP-CE é uma proposta de sistema estadual para avaliação diagnóstica, formativa e final dos cursos técnicos da rede de Educação Profissional do Ceará. O sistema deve permitir que professores criem avaliações por competências e descritores, que estudantes acessem as provas por código de turma, e que professores, coordenações, CREDEs e SEDUC acompanhem relatórios individuais, por turma, escola, curso, eixo tecnológico e rede.

A primeira versão em HTML local foi útil como protótipo conceitual. Porém, para aplicação estadual, o armazenamento no navegador (`localStorage`) é insuficiente. A nova arquitetura precisa operar com banco de dados central, autenticação, controle de permissões, rastreabilidade, segurança, integração com sistemas educacionais e governança de dados conforme a LGPD.

---

## 2. Problema a Resolver

As escolas profissionalizantes possuem matrizes curriculares estruturadas, mas ainda carecem de um sistema contínuo capaz de:

- diagnosticar competências técnicas no início, durante e ao final do curso;
- acompanhar estudantes por descritor;
- gerar relatórios pedagógicos acionáveis;
- apoiar recomposição das aprendizagens;
- organizar banco de itens por matriz, curso, componente e descritor;
- produzir base de dados para futura calibração pela Teoria de Resposta ao Item;
- subsidiar decisões de professores, escolas, CREDEs e SEDUC.

O SIDEP-CE deve responder a essa lacuna, articulando avaliação por competências, análise clássica de itens, base pré-TRI, rubricas práticas, Learning Analytics e IA Generativa supervisionada.

---

## 3. Princípios do Sistema

1. **Finalidade pedagógica**
   O sistema não nasce como exame classificatório. Sua finalidade principal é diagnosticar, acompanhar e orientar intervenções.

2. **Separação de perfis**
   O estudante responde avaliações. O professor analisa diagnóstico, pesos, relatórios e intervenções.

3. **Banco de itens expansível**
   Toda nova avaliação alimenta e melhora o banco, desde que os itens estejam vinculados a matriz, componente, competência e descritor.

4. **Fase pré-TRI**
   No primeiro ciclo, o sistema usa análise clássica de itens e dificuldade inicial. A calibração TRI exige volume de respostas, itens-âncora e validação psicométrica posterior.

5. **Dados protegidos**
   O sistema deve obedecer à LGPD, usando minimização de dados, controle de acesso, consentimento institucional e registros de auditoria.

6. **Escalabilidade estadual**
   A arquitetura deve permitir uso por escola, curso, CREDE e rede estadual.

7. **Matriz avaliativa evolutiva**
   A matriz de competências e descritores deve ser tratada como versão validável. No curso Técnico em Informática, a Matriz SIDEP-CE v0.1 inicia com 10 competências (`C01` a `C10`) e 40 descritores (`D01` a `D40`). Novas competências ou descritores só devem ser criados após análise curricular, validação docente, aplicação em campo e análise dos dados.

---

## 4. Perfis de Usuário

### 4.1 Estudante

Permissões:

- acessar avaliação por código;
- informar nome completo ou autenticar via cadastro institucional;
- responder questões;
- enviar avaliação;
- visualizar apenas mensagem de envio concluído, quando definido pela política pedagógica.

Não deve visualizar:

- peso dos itens;
- parâmetros pré-TRI;
- diagnóstico automático;
- relatório individual bruto;
- intervenção pedagógica;
- análise da turma.

### 4.2 Professor

Permissões:

- criar avaliação diagnóstica;
- selecionar curso, turma, disciplina, componente e descritores;
- definir quantidade de questões, entre 20 e 80;
- cadastrar itens no banco;
- revisar e validar itens;
- acompanhar resultados individuais e por turma;
- gerar trilhas de recomposição;
- exportar relatórios.

### 4.3 Coordenação Escolar

Permissões:

- acompanhar turmas da escola;
- visualizar relatórios por curso, série, turma e descritor;
- acompanhar aplicação das avaliações;
- monitorar planos de recomposição;
- validar calendário de aplicação.

### 4.4 CREDE / Regional

Permissões:

- acompanhar escolas da regional;
- comparar cursos e turmas por descritor;
- identificar gargalos regionais;
- apoiar formação docente;
- gerar relatórios de gestão.

### 4.5 SEDUC / Gestão Estadual

Permissões:

- acompanhar indicadores da rede;
- visualizar dados agregados por eixo tecnológico, curso, CREDE, escola e série;
- monitorar qualidade dos cursos técnicos;
- planejar políticas de formação, infraestrutura e recomposição;
- acompanhar evolução histórica.

### 4.6 Administrador do Sistema

Permissões:

- gerenciar usuários;
- gerenciar escolas, cursos, turmas e matrizes;
- configurar períodos de aplicação;
- auditar acessos;
- parametrizar segurança e integrações.

---

## 5. Jornada do Estudante

1. Acessa o endereço online do SIDEP-CE.
2. Seleciona **Área do Estudante**.
3. Digita o código da turma/avaliação informado pelo professor.
4. Informa nome completo ou autentica via login institucional.
5. Confirma turma e avaliação.
6. Responde as questões em computador, tablet ou celular.
7. Envia a avaliação.
8. Recebe confirmação de envio.

Observação: o estudante não acessa diagnóstico imediato, salvo se a política pedagógica da escola/rede decidir disponibilizar uma devolutiva simplificada e formativa.

---

## 6. Jornada do Professor

1. Acessa o SIDEP-CE com autenticação.
2. Entra na **Área do Professor**.
3. Escolhe curso técnico, turma e componente curricular.
4. Seleciona uma ou mais disciplinas/descritores.
5. Define a quantidade de itens, entre 20 e 80.
6. O sistema monta a avaliação a partir do banco.
7. O professor revisa os itens.
8. O sistema gera um código de acesso para os estudantes.
9. Estudantes respondem.
10. O professor consulta:
    - relatório individual;
    - relatório por turma;
    - relatório por descritor;
    - mapa de prioridades;
    - recomendações de recomposição.
11. O professor registra a intervenção aplicada.
12. O sistema acompanha nova aplicação ou reavaliação.

---

## 7. Arquitetura Recomendada

### 7.1 Arquitetura em Camadas

```text
Interface Web / Mobile
        |
API de Aplicação
        |
Serviços de Avaliação
        |
Serviços de Relatórios e Learning Analytics
        |
Serviços de IA Generativa Supervisionada
        |
Banco de Dados Central
        |
Data Warehouse / Camada Analítica
```

### 7.2 Frontend

Recomendação:

- React, Vue ou Angular;
- design responsivo para computador, tablet e celular;
- PWA para uso com conectividade instável;
- acessibilidade WCAG;
- identidade visual Governo do Ceará / SEDUC.

Funções:

- área do estudante;
- área do professor;
- área da coordenação;
- dashboards;
- editor de itens;
- criador de avaliações;
- relatórios.

### 7.3 Backend

Recomendação:

- Node.js/NestJS, Python/FastAPI ou Java/Spring;
- API REST ou GraphQL;
- autenticação com JWT/OAuth2;
- controle de permissões por perfil;
- logs de auditoria;
- filas para processamento pesado.

### 7.4 Banco de Dados

Recomendação inicial:

- PostgreSQL como banco transacional;
- Redis para cache e sessões;
- armazenamento de arquivos em object storage;
- data warehouse futuro para análises históricas.

Para prototipagem rápida:

- Supabase;
- Firebase;
- PostgreSQL gerenciado.

Para escala estadual:

- PostgreSQL gerenciado em cloud;
- replicação;
- backups automáticos;
- monitoramento;
- políticas de retenção.

---

## 8. Modelo de Dados Inicial

### 8.1 Entidades Principais

```text
Usuario
Escola
CREDE
CursoTecnico
EixoTecnologico
MatrizCurricular
ComponenteCurricular
Competencia
Descritor
Questao
Avaliacao
AvaliacaoQuestao
Turma
Estudante
Aplicacao
Resposta
ResultadoIndividual
ResultadoTurma
IntervencaoPedagogica
Rubrica
EvidenciaPratica
LogAuditoria
```

### 8.2 Questão

Campos mínimos:

- id;
- curso;
- eixo tecnológico;
- componente curricular;
- competência;
- descritor;
- enunciado;
- alternativas;
- gabarito;
- nível esperado;
- dificuldade inicial;
- discriminação estimada;
- origem;
- autor;
- revisor;
- status;
- tags;
- data de criação;
- histórico de uso.

Status possíveis:

- rascunho;
- em revisão;
- validada;
- aplicada;
- revisada;
- suspensa;
- descartada.

### 8.3 Avaliação

Campos mínimos:

- id;
- título;
- curso;
- turma;
- professor;
- código de acesso;
- quantidade de questões;
- descritores avaliados;
- data de início;
- data de fim;
- status;
- regras de aplicação.

Status possíveis:

- rascunho;
- publicada;
- em aplicação;
- encerrada;
- analisada.

### 8.4 Resposta

Campos mínimos:

- estudante;
- avaliação;
- questão;
- alternativa marcada;
- correta;
- tempo de resposta;
- dispositivo;
- data/hora;
- tentativa;
- status.

### 8.5 Resultado

Campos mínimos:

- estudante;
- avaliação;
- turma;
- curso;
- percentual bruto;
- escore ponderado pré-TRI;
- nível diagnóstico;
- desempenho por descritor;
- descritores críticos;
- recomendações pedagógicas;
- intervenção registrada;
- evolução em reavaliação.

---

## 9. Lógica Avaliativa

### 9.1 Fase 1 - Diagnóstico pré-TRI

Na primeira fase, o sistema usa:

- percentual de acerto;
- dificuldade inicial atribuída por especialistas;
- análise por descritor;
- análise por componente;
- análise clássica de itens;
- escala diagnóstica preliminar.

Essa fase permite:

- identificar descritores frágeis;
- montar trilhas de recomposição;
- formar grupos de apoio;
- revisar itens com comportamento inadequado;
- constituir base de dados para futura TRI.

### 9.2 Fase 2 - Análise Clássica dos Itens

Indicadores:

- índice de acerto;
- índice de dificuldade;
- índice de discriminação;
- alternativas distratoras pouco escolhidas;
- itens com erro excessivo;
- itens muito fáceis;
- itens muito difíceis;
- consistência interna.

### 9.3 Fase 3 - Calibração TRI

Requisitos:

- volume suficiente de respostas;
- itens aplicados em diferentes turmas;
- itens-âncora;
- estabilidade de parâmetros;
- análise por curso e eixo;
- validação psicométrica.

Modelos possíveis:

- Rasch / 1PL para fase inicial;
- 2PL quando houver volume;
- modelos politômicos para rubricas;
- modelos multidimensionais em fase avançada.

### 9.4 Importante

O SIDEP-CE não deve afirmar que usa TRI plena na primeira aplicação. A comunicação correta é:

> O sistema organiza avaliações por competências, usa análise diagnóstica e análise clássica de itens na fase inicial, produzindo a base necessária para futura calibração por TRI.

---

## 10. Banco de Itens

### 10.1 Objetivo

Construir um banco estadual de itens técnicos por curso, componente, competência e descritor.

### 10.2 Regras

- cada questão deve estar vinculada a um descritor;
- cada descritor deve estar vinculado à matriz curricular;
- cada item deve ter gabarito e justificativa;
- cada item deve passar por revisão pedagógica;
- itens aplicados devem gerar estatísticas;
- itens ruins devem ser revisados ou removidos;
- itens bons podem virar itens-âncora.

### 10.3 Tipos de Item

- múltipla escolha;
- múltipla resposta;
- associação;
- ordenação;
- estudo de caso;
- situação-problema;
- item com código;
- item com imagem;
- item prático com rubrica;
- evidência de projeto ou estágio.

---

## 11. Relatórios

### 11.1 Relatório Individual

Destinatário: professor e coordenação.

Conteúdo:

- estudante;
- turma;
- avaliação;
- desempenho geral;
- desempenho por descritor;
- descritores críticos;
- nível diagnóstico;
- recomendação pedagógica.

### 11.2 Relatório por Turma

Conteúdo:

- média geral;
- distribuição por níveis;
- descritores mais frágeis;
- grupos de recomposição;
- comparação entre aplicações;
- evolução após intervenção.

### 11.3 Relatório por Escola

Conteúdo:

- resultados por curso;
- resultados por turma;
- descritores críticos recorrentes;
- necessidades de laboratório;
- componentes com maior fragilidade;
- recomendações para planejamento.

### 11.4 Relatório por CREDE / SEDUC

Conteúdo:

- indicadores agregados;
- comparação regional;
- cursos com maior necessidade de apoio;
- descritores críticos por eixo tecnológico;
- impacto de intervenções;
- evolução histórica.

---

## 12. IA Generativa no SIDEP-CE

### 12.1 Funções Permitidas

- sugerir atividades por descritor;
- gerar variações de questões para revisão docente;
- propor trilhas de recomposição;
- resumir relatórios para professores;
- sugerir grupos de intervenção;
- apoiar produção de simulados equivalentes.

### 12.2 Funções Não Permitidas

- decidir nota automaticamente;
- classificar estudante sem revisão humana;
- expor dados pessoais;
- gerar diagnóstico final sem professor;
- substituir a avaliação prática.

### 12.3 Governança

Dados enviados à IA devem ser preferencialmente:

- agregados;
- anonimizados;
- sem nome do estudante;
- sem matrícula;
- sem dados sensíveis;
- baseados em descritor e nível de desempenho.

---

## 13. LGPD e Segurança

### 13.1 Dados Pessoais

O sistema poderá tratar:

- nome;
- turma;
- escola;
- curso;
- respostas;
- resultados pedagógicos.

### 13.2 Cuidados Obrigatórios

- base legal institucional;
- política de privacidade;
- controle de acesso por perfil;
- logs de auditoria;
- criptografia em trânsito;
- criptografia em repouso;
- backups seguros;
- retenção limitada;
- anonimização para pesquisa;
- termo de uso para professores.

### 13.3 Estudantes Menores de Idade

Como parte dos estudantes da EPT integrada ao Ensino Médio é menor de idade, a governança deve ser reforçada.

O sistema deve evitar:

- exposição pública de ranking;
- relatórios comparativos nominais para terceiros;
- uso de IA com dados identificáveis;
- exportações sem controle.

---

## 14. Integrações Futuras

### 14.1 Sistemas Educacionais

Possíveis integrações:

- SIGE;
- SISEDU;
- SIC-CED;
- sistemas de matrícula;
- sistemas de lotação docente;
- Google Workspace institucional;
- Microsoft 365 institucional.

### 14.2 MCP

Neste documento, MCP será tratado como **Model Context Protocol**, uma camada padronizada para conectar o SIDEP-CE a ferramentas, bancos, arquivos, agentes de IA e sistemas externos.

Uso previsto de MCP:

- conector para banco de itens;
- conector para relatórios;
- conector para documentos curriculares;
- conector para IA generativa supervisionada;
- conector para exportação de dados;
- conector para consulta a matrizes curriculares;
- conector para integração futura com sistemas da SEDUC.

### 14.3 Benefícios do MCP

- padroniza acesso a dados;
- reduz acoplamento entre IA e banco de dados;
- permite auditoria de chamadas;
- separa permissões por ferramenta;
- facilita integração com agentes pedagógicos;
- viabiliza assistente docente controlado.

---

## 15. Arquitetura MCP Proposta

```text
SIDEP-CE Frontend
    |
SIDEP-CE Backend
    |
MCP Gateway
    |
------------------------------------------------
| Banco de Itens | Relatórios | Matrizes | IA   |
------------------------------------------------
```

### 15.1 Servidores MCP Possíveis

1. **mcp-sidep-itens**
   - consultar itens;
   - criar item;
   - revisar item;
   - buscar por descritor.

2. **mcp-sidep-relatorios**
   - gerar relatório individual;
   - gerar relatório por turma;
   - gerar relatório por escola;
   - exportar dados anonimizados.

3. **mcp-sidep-matrizes**
   - consultar matriz curricular;
   - listar descritores;
   - relacionar competência e componente.

4. **mcp-sidep-ia**
   - gerar trilha de recomposição;
   - sugerir atividade;
   - gerar feedback docente;
   - revisar item.

### 15.2 Regras de Segurança do MCP

- nenhum servidor MCP deve retornar dados além da permissão do usuário;
- chamadas devem ser registradas;
- IA não acessa dados nominais sem autorização explícita;
- relatórios para IA devem ser anonimizados;
- toda geração de intervenção deve ser revisada pelo professor.

---

## 16. Metodologia Ágil / Scrum

### 16.1 Papéis

**Product Owner:** representante pedagógico do projeto / professor idealizador.  
**Scrum Master:** responsável por facilitar o processo ágil.  
**Time de Desenvolvimento:** frontend, backend, banco de dados, UX, psicometria, pedagogia e segurança.  
**Stakeholders:** professores, coordenação, estudantes, gestão escolar, CREDE, SEDUC.

### 16.2 Artefatos Scrum

- Product Backlog;
- Sprint Backlog;
- Incremento;
- Definition of Ready;
- Definition of Done;
- Burndown;
- Roadmap;
- Registro de decisões;
- Registro de riscos.

### 16.3 Eventos Scrum

- Sprint Planning;
- Daily Scrum;
- Sprint Review;
- Sprint Retrospective;
- Refinamento do Backlog;
- Reunião pedagógica de validação.

### 16.4 Duração Recomendada

Sprints de 2 semanas.

---

## 17. Product Backlog Inicial

### Épico 1 - Fundação do Sistema

- configurar repositório;
- definir stack;
- criar banco de dados;
- implementar autenticação;
- criar perfis de usuário;
- configurar ambiente de homologação.

### Épico 2 - Banco de Itens

- cadastrar curso;
- cadastrar componente;
- cadastrar competência;
- cadastrar descritor;
- cadastrar questão;
- revisar questão;
- aprovar questão;
- versionar questão.

### Épico 3 - Criador de Avaliações

- criar avaliação;
- selecionar turma;
- selecionar descritores;
- definir quantidade de questões;
- gerar código de acesso;
- publicar avaliação;
- encerrar avaliação.

### Épico 4 - Aplicação do Estudante

- acessar por código;
- preencher identificação;
- responder avaliação;
- salvar progresso;
- enviar respostas;
- funcionar em celular, tablet e computador.

### Épico 5 - Relatórios

- relatório individual;
- relatório por turma;
- relatório por descritor;
- relatório por escola;
- exportação PDF;
- exportação CSV/JSON.

### Épico 6 - Análise pré-TRI

- percentual de acerto;
- dificuldade inicial;
- escore ponderado;
- desempenho por descritor;
- análise clássica dos itens;
- identificação de itens problemáticos.

### Épico 7 - IA Generativa Supervisionada

- gerar trilhas por descritor;
- sugerir atividades;
- revisar linguagem de itens;
- gerar relatório docente;
- registrar revisão humana.

### Épico 8 - Governança e Segurança

- logs de auditoria;
- controle de permissões;
- anonimização;
- termos de uso;
- política de retenção;
- painel administrativo.

### Épico 9 - Integrações e MCP

- desenhar MCP gateway;
- criar conector de itens;
- criar conector de relatórios;
- criar conector de matrizes;
- criar conector de IA;
- preparar integração futura com sistemas educacionais.

---

## 18. Roadmap

### Fase 0 - Protótipo demonstrativo

Status: iniciado.

Entregas:

- HTML local;
- área do estudante;
- área do professor;
- banco local;
- relatórios básicos.

Limitação:

- dados ficam no navegador;
- não serve para aplicação estadual real.

### Fase 1 - MVP Online

Duração estimada: 8 a 12 semanas.

Entregas:

- aplicação web online;
- login de professor;
- código de avaliação para estudante;
- banco de questões central;
- criação de avaliações;
- aplicação responsiva;
- relatório por turma;
- relatório individual;
- exportação básica.

### Fase 2 - Piloto Escolar

Duração estimada: 1 semestre letivo.

Entregas:

- aplicação em uma ou mais turmas;
- análise clássica dos itens;
- ajuste do banco;
- validação docente;
- relatório pedagógico;
- plano de recomposição.

### Fase 3 - Piloto Regional

Duração estimada: 1 ano.

Entregas:

- ampliação para escolas da CREDE;
- comparação entre turmas;
- descritores críticos por curso;
- formação docente;
- banco de itens ampliado.

### Fase 4 - Escala Estadual

Duração estimada: 2 a 3 anos.

Entregas:

- integração institucional;
- painéis para CREDE e SEDUC;
- base para calibração TRI;
- itens-âncora;
- data warehouse;
- governança estadual.

---

## 19. Plano de Sprints do MVP

### Sprint 1 - Base técnica

Objetivo:

- iniciar aplicação online.

Entregas:

- repositório;
- frontend inicial;
- backend inicial;
- banco PostgreSQL;
- autenticação básica.

### Sprint 2 - Cadastro pedagógico

Entregas:

- cadastro de curso;
- cadastro de componente;
- cadastro de descritor;
- cadastro de questão.

### Sprint 3 - Criação de avaliação

Entregas:

- professor cria avaliação;
- seleciona descritores;
- define 20 a 80 itens;
- sistema gera código.

### Sprint 4 - Aplicação do estudante

Entregas:

- estudante entra por código;
- responde avaliação;
- sistema salva respostas;
- interface responsiva.

### Sprint 5 - Relatórios iniciais

Entregas:

- relatório individual;
- relatório por turma;
- desempenho por descritor.

### Sprint 6 - Análise pré-TRI

Entregas:

- dificuldade inicial;
- escore ponderado;
- análise clássica simples;
- identificação de descritores críticos.

### Sprint 7 - Intervenção pedagógica

Entregas:

- sugestões por descritor;
- trilhas de recomposição;
- registro de intervenção.

### Sprint 8 - Segurança e homologação

Entregas:

- revisão LGPD;
- controle de acesso;
- logs;
- testes;
- piloto com professor.

---

## 20. Definition of Done

Uma funcionalidade só será considerada pronta quando:

- estiver implementada;
- tiver teste básico;
- estiver responsiva;
- respeitar permissões de perfil;
- não expuser dados indevidos;
- tiver texto pedagógico claro;
- estiver documentada;
- tiver sido validada por usuário docente.

---

## 21. Critérios de Sucesso

### Pedagógicos

- professores conseguem criar avaliação sem suporte técnico;
- avaliações respeitam matriz e descritores;
- relatórios geram intervenção real;
- estudantes conseguem responder em celular;
- coordenação usa dados para planejamento.

### Técnicos

- sistema suporta múltiplas turmas simultâneas;
- dados ficam centralizados;
- há backups;
- há controle de acesso;
- relatórios carregam rapidamente.

### Psicométricos

- itens têm histórico de aplicação;
- itens problemáticos são identificados;
- banco cresce por descritor;
- itens-âncora começam a ser definidos;
- base futura para TRI é constituída.

---

## 22. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Tratar pré-TRI como TRI plena | Fragilidade acadêmica | Comunicar fase pré-TRI e plano de calibração |
| Baixo volume de respostas | TRI inviável no curto prazo | Iniciar com análise clássica e ampliar aplicação |
| Dados sensíveis expostos | Risco LGPD | Controle de acesso e anonimização |
| Professor não usar relatório | Baixo impacto pedagógico | Exigir plano de intervenção após diagnóstico |
| Banco de itens fraco | Diagnóstico ruim | Revisão por especialistas e análise estatística |
| Sistema complexo demais | Baixa adesão | MVP simples, UX clara e formação docente |
| Uso inadequado de IA | Recomendações genéricas | Revisão humana obrigatória |

---

## 23. Próximas Decisões

1. Definir stack tecnológica.
2. Escolher banco de dados.
3. Definir se o MVP será local, cloud ou híbrido.
4. Definir primeiro curso-piloto.
5. Criar matriz de descritores do curso.
6. Padronizar cadastro de questões.
7. Criar protótipo online com backend.
8. Validar com professor e turma real.
9. Planejar governança LGPD.
10. Definir estratégia de integração com sistemas estaduais.

---

## 24. Recomendação Técnica Imediata

Para avançar com robustez, recomenda-se abandonar o modelo exclusivamente HTML/local e migrar para:

```text
Frontend: React ou Vue
Backend: FastAPI ou NestJS
Banco: PostgreSQL
Autenticação: JWT/OAuth2
Hospedagem inicial: Supabase, Render, Railway, Vercel ou ambiente institucional
Relatórios: PDF/CSV/JSON
IA: camada separada, com revisão humana
MCP: gateway futuro para integração controlada
```

Para um MVP rápido e funcional, a combinação mais simples seria:

```text
Frontend: React + Vite
Backend/Banco: Supabase
Autenticação: Supabase Auth
Banco: PostgreSQL
Deploy: Vercel
```

Para uma solução institucional mais controlada:

```text
Frontend: React
Backend: FastAPI
Banco: PostgreSQL
Infraestrutura: servidor/cloud institucional
Autenticação: integração futura com login institucional
```

---

## 25. Síntese Executiva

O SIDEP-CE deve evoluir de protótipo HTML para plataforma estadual de diagnóstico da Educação Profissional. A área do estudante deve ser simples: código, identificação e prova. A área do professor deve ser robusta: criação de avaliações, banco de itens, relatórios, análise por descritor e recomposição. A gestão deve ter painéis agregados por turma, escola, curso, CREDE e rede.

A base técnica deve abandonar armazenamento no navegador e adotar banco central, autenticação, permissões, logs e governança LGPD. A base pedagógica deve manter o princípio do projeto: avaliação por competências, fase pré-TRI, construção gradual de banco de itens e futura calibração psicométrica.

O desenvolvimento deve seguir metodologia Ágil/Scrum, com entregas incrementais, validação docente e documentação contínua. O MCP pode ser usado como camada de integração futura entre banco de itens, relatórios, matrizes curriculares, IA generativa e sistemas educacionais.

O objetivo final é claro:

> transformar dados de desempenho técnico em intervenção pedagógica, fortalecendo a qualidade, a equidade e a gestão da Educação Profissional do Ceará.

---

## 26. Cadastros Institucionais Obrigatórios

Para o SIDEP-CE operar em nível estadual, a primeira base do sistema deve ser institucional. Antes de criar avaliações, questões ou relatórios, o sistema precisa conhecer a estrutura da rede: escola, regional, professores, cursos, turmas e vínculos.

### 26.1 Cadastro de Escola

O cadastro de escola deve usar o **código INEP** como identificador institucional principal, pois ele é único para cada escola.

Campos obrigatórios:

- código INEP;
- nome oficial da escola;
- tipo da escola;
- regional;
- município;
- endereço;
- e-mail institucional principal;
- telefone institucional;
- status da escola.

Campos recomendados:

- e-mails institucionais adicionais;
- nome do(a) diretor(a);
- nome do(a) coordenador(a) da Educação Profissional;
- oferta de cursos técnicos;
- turnos de funcionamento;
- modalidade de oferta;
- observações administrativas.

### 26.2 Tipos de Escola

O sistema deve permitir cadastrar e filtrar escolas por tipo, incluindo:

- EEEP - Escola Estadual de Educação Profissional;
- EEMCP - Escola de Ensino Médio em Tempo Integral / Campo ou profissionalizante conforme nomenclatura da rede;
- EEMTI - Escola de Ensino Médio em Tempo Integral;
- EEM - Escola de Ensino Médio;
- EJA - Educação de Jovens e Adultos;
- Escola do Campo;
- EFA - Escola Família Agrícola;
- outra tipologia definida pela SEDUC.

Observação: a lista deve ser parametrizável, pois a nomenclatura oficial da rede pode mudar.

### 26.3 Regional

Cada escola deve estar vinculada a uma regional administrativa:

- SEFOR 1;
- SEFOR 2;
- SEFOR 3;
- CREDE 1;
- CREDE 2;
- CREDE 3;
- CREDE 4;
- CREDE 5;
- CREDE 6;
- CREDE 7;
- CREDE 8;
- CREDE 9;
- CREDE 10;
- CREDE 11;
- CREDE 12;
- CREDE 13;
- CREDE 14;
- CREDE 15;
- CREDE 16;
- CREDE 17;
- CREDE 18;
- CREDE 19;
- CREDE 20;
- outra regional se houver atualização administrativa.

Observação: a semente inicial do sistema deve considerar 20 CREDEs e divisões SEFOR, mas a tabela de regionais deve ser parametrizável para acompanhar alterações administrativas da SEDUC.

Campos da regional:

- código da regional;
- nome da regional;
- tipo: CREDE ou SEFOR;
- município-sede;
- e-mail institucional;
- telefone;
- responsável regional.

### 26.4 Cadastro de Professor

O cadastro de professor deve estar vinculado à escola e aos cursos sob responsabilidade docente.

Campos obrigatórios:

- matrícula funcional;
- nome completo;
- telefone;
- e-mail institucional;
- escola de lotação;
- curso(s) técnico(s) sob responsabilidade;
- componente(s) curricular(es);
- perfil de acesso.

Campos recomendados:

- CPF, se a política institucional permitir;
- vínculo funcional;
- área de formação;
- CREDE/SEFOR;
- status: ativo, afastado, removido, inativo;
- permissões especiais;
- data de cadastro;
- data da última atualização.

### 26.5 Vínculo Professor-Curso

Como um professor pode atuar em mais de um curso ou componente, o sistema deve ter uma tabela de vínculo:

- professor;
- escola;
- curso técnico;
- componente curricular;
- turma;
- ano letivo;
- papel: professor, coordenador de curso, revisor de itens, gestor pedagógico.

Esse vínculo é essencial para controlar permissões. Um professor só deve criar, aplicar e visualizar avaliações das turmas, cursos e componentes aos quais está vinculado, salvo se tiver perfil de coordenação ou gestão.

### 26.6 Cadastro de Curso Técnico

Campos mínimos:

- código interno;
- nome do curso;
- eixo tecnológico;
- carga horária;
- matriz curricular vigente;
- escola ofertante;
- modalidade;
- status.

Exemplos de eixos:

- Ambiente e Saúde;
- Controle e Processos Industriais;
- Gestão e Negócios;
- Informação e Comunicação;
- Recursos Naturais;
- Turismo, Hospitalidade e Lazer;
- demais eixos do CNCT.

### 26.7 Cadastro de Turma

Campos mínimos:

- código da turma;
- escola;
- curso técnico;
- série;
- turno;
- ano letivo;
- professor responsável;
- quantidade de estudantes;
- status.

### 26.8 Regras de Qualidade dos Cadastros

- código INEP deve ser único;
- matrícula do professor deve ser única;
- e-mail institucional deve seguir domínio aceito pela rede;
- toda turma deve estar vinculada a uma escola e curso;
- toda avaliação deve estar vinculada a turma, professor e matriz;
- toda questão deve estar vinculada a componente, competência e descritor;
- exclusão física deve ser evitada; preferir status inativo para manter histórico.

### 26.9 Impacto na Arquitetura

Com esses cadastros, o SIDEP-CE passa a ter condições de gerar relatórios por:

- estudante;
- turma;
- professor;
- curso;
- escola;
- município;
- CREDE/SEFOR;
- eixo tecnológico;
- rede estadual.

Essa camada institucional é pré-requisito para o sistema deixar de ser um instrumento de sala de aula e se tornar uma plataforma de gestão pedagógica em nível estadual.

---

## 27. Estado Atual do MVP React

Em 06/07/2026, o MVP React consolidou o núcleo da área do professor. A plataforma ainda opera em modo local no navegador, mas já materializa as regras pedagógicas centrais do SIDEP-CE.

### 27.1 Área do Professor Consolidada

Funcionalidades implementadas:

- Banco de Itens separado em Competências, Descritores e Questões;
- codificação padronizada de competências como `C01`, `C02`, `C03` etc.;
- codificação padronizada de descritores como `D01`, `D02`, `D03` etc.;
- vínculo obrigatório da questão a um descritor;
- recuperação automática da competência a partir do descritor;
- cadastro de enunciado, alternativas A-E, gabarito, justificativa pedagógica e dificuldade inicial pré-TRI;
- importação da matriz norteadora do curso Técnico em Informática;
- banco piloto com 441 questões;
- criador de avaliações usando somente questões com status `validada`;
- avaliação com código de acesso para estudante;
- separação entre área do estudante, professor e gestão.

### 27.2 Status de Questão

O banco de itens do MVP trabalha com três status operacionais:

- `rascunho`: item em elaboração ou devolvido para ajuste;
- `em_revisao`: item aguardando curadoria docente;
- `validada`: item revisado e liberado para compor avaliações.

Regra obrigatória: apenas questões com status `validada` podem ser usadas pelo criador de avaliações. Questões em revisão ou rascunho permanecem no banco, mas ficam bloqueadas para aplicação ao estudante.

### 27.3 Curadoria Docente

A fila de validação docente permite:

- filtrar questões por status;
- abrir o item completo em pop-up de leitura;
- visualizar enunciado, alternativas, gabarito, justificativa, competência, descritor, componente e dificuldade pré-TRI;
- validar a questão;
- devolver a questão para revisão;
- marcar a questão como rascunho.

Esse fluxo reduz risco de aplicação de itens sem revisão humana e fortalece a governança pedagógica do banco.

### 27.4 Cobertura do Banco

O sistema exibe cobertura do banco de itens por:

- competência;
- descritor.

Para cada competência e descritor, o sistema mostra:

- total de questões;
- questões validadas;
- questões em revisão;
- rascunhos.

Essa visão orienta a produção de novos itens, indica lacunas de cobertura e apoia a preparação para análise clássica e futura calibração TRI.

---

## 28. Próxima Sprint - Área Escola / Gestão Escolar

A próxima fase do MVP deve concentrar-se na aba Escola, entendida como área da gestão escolar e coordenação pedagógica.

### 28.1 Objetivo da Aba Escola

Permitir que a escola acompanhe a aplicação do SIDEP-CE em nível institucional, sem substituir a atuação do professor. A escola deve enxergar o conjunto de turmas, cursos, professores, avaliações e resultados agregados, respeitando LGPD e permissões.

### 28.2 Regras de Negócio Iniciais

- a escola deve ser identificada pelo código INEP;
- código INEP deve ser único;
- escola deve estar vinculada a uma CREDE ou SEFOR;
- escola deve possuir tipo institucional: EEEP, EEMCP, EEMTI, EEM, EJA, Escola do Campo, EFA ou outra tipologia parametrizada;
- escola deve possuir e-mail institucional principal e pode possuir e-mails adicionais;
- professor deve ser vinculado a escola, curso, componente, turma e ano letivo;
- gestão escolar visualiza apenas dados da própria escola;
- perfis CREDE/SEFOR e SEDUC visualizam dados agregados conforme permissão;
- relatórios nominais devem ficar restritos a perfis autorizados;
- a gestão não deve alterar resposta de estudante, gabarito ou parâmetro de item sem permissão específica;
- a gestão pode acompanhar status das avaliações e cobrar pendências pedagógicas;
- a gestão pode acompanhar cobertura do banco de itens por curso ofertado na escola.

### 28.3 Indicadores da Aba Escola

Indicadores recomendados para a primeira versão:

- total de turmas cadastradas;
- total de professores vinculados;
- total de avaliações criadas;
- avaliações publicadas, em aplicação e encerradas;
- percentual de estudantes participantes;
- desempenho médio por turma;
- descritores críticos por curso;
- competências com maior fragilidade;
- cobertura do banco por curso;
- intervenções pedagógicas registradas;
- evolução entre diagnóstico inicial, formativo e final.

### 28.4 Telas Sugeridas

Subtelas da aba Escola:

1. **Visão Geral**
   - indicadores da escola, cursos, turmas, professores e avaliações.
2. **Turmas e Cursos**
   - lista de turmas, curso técnico, série, turno, professor responsável e status.
3. **Aplicações**
   - acompanhamento das avaliações por código, etapa, status, participantes e prazo.
4. **Relatórios**
   - análise agregada por turma, curso, componente, competência e descritor.
5. **Intervenções**
   - registro e acompanhamento de recomposições planejadas pela escola.

### 28.5 Critério de Pronto da Sprint Escola

A sprint da aba Escola será considerada pronta quando:

- a gestão conseguir visualizar dados institucionais da escola;
- houver painel com indicadores principais;
- houver listagem de turmas, professores e avaliações;
- relatórios agregados por turma, curso e descritor estiverem estruturados;
- a interface respeitar separação entre professor, escola e estudante;
- nenhuma informação sensível for exibida fora do perfil adequado;
- as regras estiverem documentadas para futura migração ao Supabase/PostgreSQL.

---

## 29. Controle de Acesso Implementado no MVP

Em 06/07/2026, o MVP incorporou uma rotina inicial de autenticação local, substituindo o seletor livre de perfil por uma tela de login institucional. Essa rotina ainda não representa autenticação definitiva de produção, mas materializa as regras de negócio que serão migradas para Supabase Auth, OAuth institucional ou camada própria de identidade.

### 29.1 Tela Inicial

A tela inicial passa a separar dois fluxos:

1. **Aluno**
   - campo grande para código da prova;
   - campo grande para nome completo;
   - sem acesso a relatórios, pesos, banco de itens, diagnóstico ou intervenção.
2. **Professor ou Gestão**
   - login institucional por usuário e senha;
   - acesso filtrado por perfil e escopo.

### 29.2 Credenciais Iniciais por Perfil

Regras do MVP:

- escola/gestão escolar:
  - usuário: código INEP;
  - senha inicial: código INEP;
  - troca obrigatória no primeiro acesso.
- professor técnico:
  - usuário: e-mail institucional;
  - senha inicial: CPF cadastrado;
  - troca obrigatória no primeiro acesso.
- CREDE/SEFOR:
  - usuário administrativo regional, como `CREDE-3` ou `SEFOR-1`;
  - acesso ao recorte regional.
- SEDUC:
  - usuário institucional de rede;
  - acesso agregado da rede.
- Administrador:
  - usuário administrativo geral;
  - acesso total ao sistema.

### 29.3 Permissões por Escopo

O controle de acesso segue as regras:

- aluno: apenas prova por código e nome;
- professor: área professor, banco de itens, avaliações e relatórios do próprio escopo;
- gestão escolar: professores, avaliações e relatórios da própria escola;
- CREDE/SEFOR: escolas, professores, banco de itens, avaliações e relatórios da própria regional;
- SEDUC: visão ampla e agregada da rede;
- Administrador: acesso total a escolas, profissionais, banco de itens, avaliações, relatórios e redefinição de senhas.

### 29.4 Redefinição de Senha

Apenas o perfil Administrador pode redefinir senhas.

- redefinição de escola: volta a senha para o código INEP;
- redefinição de professor: volta a senha para o CPF cadastrado;
- após a redefinição, o usuário deve alterar a senha no próximo acesso.

### 29.5 Observação de Segurança

No MVP local, as senhas ficam no armazenamento local do navegador, apenas para validar o fluxo funcional. Em produção, a regra deve ser implementada com:

- senha criptografada/hash;
- autenticação centralizada;
- política de complexidade;
- recuperação auditada;
- logs de acesso;
- bloqueio de usuário inativo;
- RLS/políticas de permissão por escola, regional e perfil no PostgreSQL/Supabase.
