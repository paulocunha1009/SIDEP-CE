# Conversa do Projeto SATEC-CE/TRI

Data de referência: 01/07/2026  
Projeto: SATEC-CE/TRI - Sistema de Avaliação Técnica da Educação Profissional do Ceará baseado na Teoria de Resposta ao Item

## Observação

Este arquivo registra a conversa útil e consolidada sobre o projeto. Ele não inclui mensagens internas do sistema, instruções técnicas ocultas, logs completos de ferramentas ou comandos internos. O objetivo é servir como contexto exportável para outro assistente, como Claude, ajudar a refinar o projeto.

---

## 1. Ideia Inicial

### Solicitação do professor

O professor apresentou um artigo chamado `artigo_TRI_IA_EPT.docx` e perguntou:

> Estou pensando em criar um projeto baseado nesse artigo. O que vamos produzir?

### Síntese da resposta

A ideia principal identificada no artigo foi transformar a articulação entre **Teoria de Resposta ao Item (TRI)**, **Inteligência Artificial Generativa**, **Learning Analytics** e **Educação Profissional e Tecnológica (EPT)** em um projeto aplicado.

Foi sugerido criar um projeto com foco em:

- análise de dados de proficiência por descritor;
- identificação de dificuldades individuais e coletivas;
- geração de atividades personalizadas com IA;
- painel diagnóstico para professores;
- acompanhamento da aprendizagem antes, durante e depois do curso.

Nome inicial sugerido:

**TRI-IA Tutor: Personalização da Aprendizagem com Dados de Proficiência e Inteligência Artificial Generativa**

Depois, o nome evoluiu para:

**SATEC-CE/TRI**  
**Sistema de Avaliação Técnica da Educação Profissional do Ceará baseado em TRI**

---

## 2. Ampliação Normativa e Institucional

### Solicitação do professor

O professor explicou que é docente da Educação Profissional e Tecnológica e que o projeto precisa estar alinhado a:

- PNE 15388/2026;
- LC 212/2025;
- Lei 14.945/2024;
- Resolução CNE/CEB 4/2025;
- Decreto 12.603/2025;
- Lei 12.603/2025;
- CNCT;
- Educação híbrida;
- distinção entre EaD e educação híbrida.

Também afirmou que deseja criar um método de avaliação para os cursos técnicos das escolas profissionalizantes do Ceará, usando os parâmetros da TRI e funcionando como ferramenta diagnóstica antes, durante e depois do curso.

### Síntese da resposta

A ideia foi reformulada como um método estadual de avaliação da Educação Profissional.

Tese central:

> O projeto não deve ser apenas uma ferramenta de IA para gerar atividades, mas um método estadual de avaliação diagnóstica, formativa e final para os cursos técnicos da rede profissionalizante do Ceará, inspirado na TRI e alinhado à EPT.

Foi identificado que já existe referência nacional importante:

**Avaliação da Educação Profissional e Tecnológica do Inep**, relacionada ao **Sinaept**, com dimensões como:

- mundo do trabalho;
- condições de oferta;
- permanência e conclusão;
- desenvolvimento dos estudantes;
- impacto social da formação profissional.

O projeto foi posicionado como uma adaptação/aprimoramento estadual dessa lógica para a realidade das escolas profissionalizantes do Ceará.

Nome consolidado:

**SATEC-CE/TRI**  
**Sistema de Avaliação Técnica da Educação Profissional do Ceará baseado em TRI**

### Estrutura proposta

O método teria três momentos:

1. **Diagnóstico de entrada**
   - mede pré-requisitos e conhecimentos iniciais.

2. **Avaliação formativa durante o curso**
   - mede competências ao longo dos semestres/módulos.

3. **Avaliação de saída**
   - mede o perfil profissional de conclusão antes do estágio, TCC ou finalização.

### Diferencial do método

A TRI entra para criar uma escala de proficiência técnica, e não apenas percentual de acertos.

A IA entra como camada de apoio para:

- gerar atividades por descritor frágil;
- montar trilhas por nível de proficiência;
- sugerir grupos de recomposição;
- criar simulados equivalentes;
- produzir relatórios para professor, coordenação e gestão.

---

## 3. Análise das Matrizes Curriculares 2025/2026

### Arquivos enviados pelo professor

1. `CADERNO DE MATRIZES 2026 (1).pdf`
2. `matrizes_curriculares_EC_EFA_compilado (1).pdf`

### Solicitação do professor

O professor explicou que esses arquivos trazem os cursos ofertados atualmente na rede estadual e suas matrizes curriculares de 2025/2026. Pediu análise sobre como colocar a ideia em prática.

### Pontos identificados no Caderno de Matrizes 2026

O documento registra a oferta de **52 cursos técnicos nas Escolas Estaduais de Educação Profissional (EEEPs)**.

Os cursos aparecem distribuídos por eixos tecnológicos:

- Ambiente e Saúde;
- Controle e Processos Industriais;
- Desenvolvimento Educacional e Social;
- Gestão e Negócios;
- Informação e Comunicação;
- Infraestrutura;
- Produção Alimentícia;
- Produção Cultural e Design;
- Produção Industrial;
- Recursos Naturais;
- Segurança;
- Turismo, Hospitalidade e Lazer.

O Caderno indica que as matrizes das EEEPs contemplam:

- Formação Geral Básica;
- Formação Profissional;
- Parte Diversificada;
- Estágio Curricular.

Carga horária total:

**5.400 horas/aula** ao longo das três séries do Ensino Médio integrado à Educação Profissional.

Também foi observado que, para turmas ingressantes, a Formação Geral Básica passou a atender à Lei nº 14.945/2024, com **2.880 h/a**, correspondentes às **2.400 horas mínimas**.

### Pontos identificados nas matrizes das Escolas do Campo e EFA

O segundo PDF trouxe matrizes de:

- Ensino Médio Regular do Campo;
- Ensino Médio Integrado em Administração;
- Ensino Médio Integrado em Agroecologia;
- Ensino Médio Integrado em Informática;
- Técnico em Agroecologia em oferta concomitante/subsequente;
- Escola Família Agrícola com Técnico em Agropecuária e Pedagogia da Alternância.

Foram identificadas especificidades como:

- tempo escola;
- tempo comunidade;
- pedagogia da alternância;
- práticas sociais comunitárias;
- organização do trabalho e técnicas produtivas;
- forte ligação com território e produção local.

### Conclusão da análise das matrizes

A matriz curricular deve ser transformada em matriz avaliativa.

Fluxo proposto:

```text
Matriz curricular
-> competências do curso
-> descritores avaliáveis
-> banco de itens
-> escala TRI
-> diagnóstico
-> intervenção com IA
-> nova medição
```

### Cursos-piloto sugeridos

Foi sugerido não começar pelos 52 cursos, mas por cursos-piloto representativos:

- Informação e Comunicação: Informática ou Desenvolvimento de Sistemas;
- Gestão e Negócios: Administração;
- Recursos Naturais: Agropecuária ou Agroecologia;
- Ambiente e Saúde: Enfermagem;
- Controle e Processos Industriais: Eletrotécnica ou Automação Industrial.

### Dimensões do método

Foram propostas seis dimensões avaliativas:

1. Formação geral aplicada ao técnico;
2. Competências técnicas específicas;
3. Prática profissional;
4. Mundo do trabalho;
5. Condições de oferta;
6. Permanência e evolução.

---

## 4. Apresentação de Projeto

### Solicitação do professor

O professor pediu transformar a ideia em uma apresentação de projeto com:

- Tema e justificativa;
- Objetivos;
- DCRC;
- Metodologia;
- Cronograma;
- Produto final e avaliação.

### Produto criado

Foi gerada uma apresentação em PowerPoint:

```text
outputs/SATEC-CE_TRI_apresentacao_projeto.pptx
```

### Estrutura da apresentação

A apresentação foi organizada em 10 slides:

1. Capa - SATEC-CE/TRI;
2. Tema e justificativa;
3. A matriz curricular vira matriz avaliativa;
4. Objetivos do projeto;
5. Alinhamento com DCRC e EPT;
6. Metodologia prática;
7. Como o piloto pode começar;
8. Cronograma de implantação;
9. Produto final e avaliação dos estudantes;
10. Síntese e próximos passos.

### Mensagem central da apresentação

> O SATEC-CE/TRI propõe uma avaliação que mede evolução, orienta intervenção e fortalece a qualidade da Educação Profissional no Ceará.

---

## 5. TCC em Nível de Mestrado

### Solicitação do professor

O professor pediu:

> Gere um TCC desse projeto nível de mestrado.

### Produto criado

Foi gerado um documento Word:

```text
outputs/TCC_Mestrado_SATEC_CE_TRI.docx
```

### Natureza do documento

O texto foi estruturado como um **TCC/projeto de pesquisa em nível de mestrado profissional**, sem inventar resultados empíricos. O documento propõe o método, descreve a validação e apresenta o produto educacional/técnico-tecnológico.

### Título sugerido

**SATEC-CE/TRI: Sistema de Avaliação Técnica da Educação Profissional do Ceará baseado na Teoria de Resposta ao Item**

### Estrutura do TCC

O documento inclui:

- Capa;
- Resumo;
- Abstract;
- Sumário manual;
- Introdução;
- Problema de pesquisa;
- Justificativa;
- Objetivos;
- Referencial teórico;
- Base curricular e normativa;
- Proposta do método SATEC-CE/TRI;
- Metodologia da pesquisa;
- Estratégia de validação psicométrica;
- Educação híbrida, EaD e evidências práticas;
- Aspectos éticos e governança dos dados;
- Riscos de implementação e medidas de mitigação;
- Produto técnico-tecnológico;
- Cronograma;
- Resultados esperados;
- Considerações finais;
- Referências;
- Apêndices.

### Apêndices incluídos

- Apêndice A - Matriz avaliativa piloto: Técnico em Informática;
- Apêndice B - Modelo de relatório pedagógico;
- Apêndice C - Orientações para uso responsável de IA;
- Apêndice D - Modelo de descritor e item.

### Objetivo geral do TCC

> Desenvolver e validar uma proposta metodológica de avaliação diagnóstica, formativa e final para cursos técnicos da rede estadual do Ceará, baseada em matriz de competências, descritores avaliáveis, banco de itens, rubricas práticas e parâmetros inspirados na Teoria de Resposta ao Item.

### Questão norteadora

> De que modo um sistema de avaliação técnica baseado em matriz de competências, descritores, itens calibráveis e rubricas práticas pode apoiar a melhoria dos cursos técnicos das escolas profissionalizantes do Ceará, gerando dados úteis para estudantes, professores, coordenações escolares e gestão estadual?

---

## 6. Conceito Consolidado do Projeto

### Nome

**SATEC-CE/TRI**

### Nome por extenso

**Sistema de Avaliação Técnica da Educação Profissional do Ceará baseado na Teoria de Resposta ao Item**

### Definição curta

Método de avaliação diagnóstica, formativa e final para cursos técnicos da rede estadual do Ceará, baseado em competências, descritores, banco de itens, rubricas práticas, escala de proficiência inspirada na TRI e apoio de Inteligência Artificial Generativa para intervenção pedagógica.

### Problema que resolve

As escolas profissionalizantes possuem matrizes curriculares robustas, mas ainda carecem de um sistema contínuo, comparável e acionável para avaliar o desenvolvimento das competências técnicas dos estudantes antes, durante e ao final do curso.

### Solução proposta

Criar um sistema/metodologia que transforme:

```text
currículo -> competências -> descritores -> itens/rubricas -> proficiência -> intervenção pedagógica
```

### Três momentos avaliativos

1. **Entrada**
   - diagnóstico inicial;
   - pré-requisitos;
   - conhecimentos gerais aplicados;
   - lacunas antes do avanço técnico.

2. **Percurso**
   - avaliação semestral ou modular;
   - acompanhamento de descritores;
   - recomposição;
   - reagrupamento pedagógico.

3. **Saída**
   - perfil profissional de conclusão;
   - prontidão para estágio/TCC/mundo do trabalho;
   - avaliação prática e teórica integrada.

### Camadas do método

1. Matriz curricular;
2. Matriz de competências;
3. Descritores avaliáveis;
4. Banco de itens;
5. Rubricas práticas;
6. Escala de proficiência;
7. Relatórios;
8. Intervenção com IA;
9. Reavaliação;
10. Indicadores para gestão.

---

## 7. Base Teórica

O projeto articula:

- Teoria de Resposta ao Item;
- avaliação educacional em larga escala;
- avaliação por competências;
- Educação Profissional e Tecnológica;
- Learning Analytics;
- Inteligência Artificial Generativa;
- currículo integrado;
- educação híbrida;
- governança ética dos dados educacionais.

### Autores e referências citadas ou consideradas

- Bloom;
- Pasquali;
- Pasquali e Primi;
- Siemens e Gašević;
- Gašević, Dawson e Siemens;
- Lang, Siemens, Wise e Gašević;
- Luckin, Holmes, Griffiths e Forcier;
- Holmes, Bialik e Fadel;
- documentos do Inep;
- BNCC;
- LDB;
- DCNs da EPT;
- CNCT;
- DCRC;
- matrizes curriculares da SEDUC-CE.

---

## 8. Pontos que Precisam de Refinamento

Estes pontos foram identificados como importantes para a próxima etapa:

1. Validar oficialmente todas as normas citadas pelo professor:
   - PNE 15388/2026;
   - LC 212/2025;
   - Resolução CNE/CEB 4/2025;
   - Decreto 12.603/2025;
   - Lei 12.603/2025.

2. Conferir se algumas normas são:
   - federais;
   - estaduais;
   - atos do CNE;
   - decretos regulamentadores;
   - documentos internos da SEDUC-CE.

3. Definir o primeiro curso-piloto.

4. Construir a primeira matriz avaliativa completa.

5. Criar banco inicial de itens.

6. Criar rubricas práticas.

7. Definir instrumento para condições de oferta.

8. Definir modelo de dashboard.

9. Definir como será feita a calibração TRI:
   - fase pré-TRI;
   - análise clássica de itens;
   - calibração progressiva;
   - itens âncora;
   - escala por curso/eixo.

10. Refinar a distinção entre:
   - avaliação teórica;
   - avaliação prática;
   - avaliação em laboratório;
   - avaliação em campo;
   - avaliação híbrida;
   - avaliação remota;
   - avaliação supervisionada.

---

## 9. Arquivos Gerados Até Agora

### Apresentação

```text
C:\Users\yolep\OneDrive\Documentos\Método TRI e IA\outputs\SATEC-CE_TRI_apresentacao_projeto.pptx
```

### TCC

```text
C:\Users\yolep\OneDrive\Documentos\Método TRI e IA\outputs\TCC_Mestrado_SATEC_CE_TRI.docx
```

### Este arquivo de conversa

```text
C:\Users\yolep\OneDrive\Documentos\Método TRI e IA\outputs\conversa_projeto_SATEC_CE_TRI.md
```

---

## 10. Prompt Sugerido para Claude

Copie e cole o texto abaixo no Claude junto com este arquivo:

```text
Você é um orientador acadêmico especialista em Educação Profissional e Tecnológica, avaliação educacional, Teoria de Resposta ao Item, currículo integrado e políticas públicas de educação no Brasil.

Estou desenvolvendo o projeto SATEC-CE/TRI: Sistema de Avaliação Técnica da Educação Profissional do Ceará baseado na Teoria de Resposta ao Item.

Quero que você refine este projeto em nível de mestrado profissional, considerando:

1. coerência acadêmica;
2. aderência à Educação Profissional e Tecnológica;
3. relação com DCRC, CNCT, matrizes curriculares do Ceará e legislação educacional;
4. uso adequado da TRI;
5. metodologia de validação;
6. produto técnico-tecnológico;
7. avaliação diagnóstica, formativa e final;
8. educação híbrida, EaD e evidências práticas;
9. governança ética dos dados e uso responsável de IA;
10. possibilidade de aplicação real nas escolas profissionalizantes do Ceará.

Tarefas:

- critique o projeto com rigor acadêmico;
- aponte lacunas conceituais;
- sugira melhorias no problema de pesquisa;
- refine objetivo geral e objetivos específicos;
- proponha uma metodologia mais robusta;
- indique como validar a matriz avaliativa e o banco de itens;
- sugira como estruturar a calibração TRI;
- proponha indicadores de sucesso;
- sugira um plano de implantação piloto;
- ajude a transformar o projeto em uma proposta sólida de mestrado profissional.
```

---

## 11. Versão Curta para Apresentar o Projeto

O **SATEC-CE/TRI** é uma proposta de método de avaliação diagnóstica, formativa e final para os cursos técnicos das escolas profissionalizantes do Ceará. O projeto transforma as matrizes curriculares dos cursos em matrizes avaliativas organizadas por competências, descritores, itens e rubricas práticas. Inspirado na Teoria de Resposta ao Item, o método busca criar uma escala de proficiência técnica que permita acompanhar a evolução dos estudantes antes, durante e ao final do curso. A Inteligência Artificial Generativa entra como apoio à intervenção pedagógica, ajudando professores a produzir atividades personalizadas, trilhas de recomposição e relatórios por descritor. O objetivo final é gerar evidências para melhorar a aprendizagem, fortalecer a formação profissional e apoiar a gestão da Educação Profissional no estado do Ceará.

