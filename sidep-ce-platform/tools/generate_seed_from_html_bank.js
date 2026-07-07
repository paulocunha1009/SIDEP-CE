const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..", "..");
const htmlPath = path.join(root, "norteadores", "SIDEP-CE_Avaliacao_Diagnostica_Online.html");
const outPath = path.join(root, "sidep-ce-platform", "app", "src", "data", "norteadoresSeed.ts");
const reportPath = path.join(root, "sidep-ce-platform", "docs", "banco_html_importado.json");

function extractBanco(source) {
  const start = source.indexOf("var BANCO =");
  if (start < 0) throw new Error("BANCO nao encontrado no HTML.");

  const objectStart = source.indexOf("{", start);
  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = objectStart; i < source.length; i += 1) {
    const char = source[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(objectStart, i + 1);
    }
  }
  throw new Error("Fim do BANCO nao encontrado.");
}

function cleanBlockName(name) {
  return fixText(name)
    .replace(/^Bloco [A-Z]\s*.*?\s/u, "")
    .replace(/^Bloco [A-Z]\s*/u, "")
    .trim();
}

function fixText(value) {
  let text = String(value ?? "");
  return text
    .replace(/Ã¡/g, "á")
    .replace(/Ã /g, "à")
    .replace(/Ã\u00a0/g, "à")
    .replace(/Ã¢/g, "â")
    .replace(/Ã£/g, "ã")
    .replace(/Ã©/g, "é")
    .replace(/Ãª/g, "ê")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ã´/g, "ô")
    .replace(/Ãµ/g, "õ")
    .replace(/Ãº/g, "ú")
    .replace(/Ã§/g, "ç")
    .replace(/Ã/g, "Á")
    .replace(/Ã‰/g, "É")
    .replace(/Ã\u0089/g, "É")
    .replace(/Ã\u008d/g, "Í")
    .replace(/Ã“/g, "Ó")
    .replace(/Ãš/g, "Ú")
    .replace(/â€”/g, "-")
    .replace(/â€“/g, "-")
    .replace(/�/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}

function escapeTs(value) {
  return JSON.stringify(String(value ?? ""));
}

function dificuldade(blockIndex, itemIndex) {
  return Number((1 + (blockIndex % 4) * 0.25 + (itemIndex % 5) * 0.08).toFixed(2));
}

const competencyDefs = {
  "C01": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Operar recursos computacionais, sistemas operacionais e práticas de segurança digital para uso responsável da tecnologia.",
    fonte: "Matrizes curriculares de Informática 2023/2024, 2025 e 2026",
  },
  "C02": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Resolver problemas computacionais por meio de lógica de programação, algoritmos, programação estruturada e orientação a objetos.",
    fonte: "Matrizes curriculares de Informática 2023/2024, 2025 e 2026",
  },
  "C03": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Realizar diagnóstico, montagem, configuração, manutenção e suporte em computadores, periféricos e ambientes de hardware.",
    fonte: "Matrizes curriculares de Informática 2023/2024, 2025 e 2026",
  },
  "C04": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Desenvolver interfaces, páginas e aplicações web com estrutura semântica, estilo, interação, usabilidade e integração com dados.",
    fonte: "Matrizes curriculares de Informática 2023/2024, 2025 e 2026",
  },
  "C05": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Modelar, implementar e consultar bancos de dados, aplicando organização, persistência, integridade e recuperação de informações.",
    fonte: "Matrizes curriculares de Informática 2023/2024, 2025 e 2026",
  },
  "C06": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Compreender, configurar e diagnosticar redes de computadores, serviços de conectividade, endereçamento e compartilhamento de recursos.",
    fonte: "Matrizes curriculares de Informática 2023/2024, 2025 e 2026",
  },
  "C07": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Aplicar tecnologias emergentes, robótica e inteligência artificial em soluções técnicas contextualizadas e eticamente orientadas.",
    fonte: "Matrizes curriculares de Informática 2025/2026 e matriz EEEP 2026",
  },
  "C08": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Produzir artefatos digitais, interfaces e conteúdos visuais com princípios de design, composição, acessibilidade e comunicação.",
    fonte: "Matrizes curriculares de Informática 2023/2024, 2025 e 2026",
  },
  "C09": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Integrar conhecimentos técnicos em laboratórios, projetos integradores e práticas profissionais, documentando soluções e resultados.",
    fonte: "Matrizes curriculares de Informática 2023/2024, 2025 e 2026",
  },
  "C10": {
    curso_tecnico: "Técnico em Informática",
    descricao:
      "Planejar carreira, estágio, organização do trabalho, empreendedorismo e inovação em contextos produtivos e sociais da informática.",
    fonte: "Matrizes curriculares de Informática 2023/2024, 2025 e 2026",
  },
};

const descriptorDefs = [
  { codigo: "D01", competencia_codigo: "C01", componente_curricular: "Informática Básica", descricao: "Utilizar recursos básicos de computadores, aplicativos, internet e ferramentas de produtividade em situações escolares, profissionais e comunitárias.", nivel_esperado: "basico", keywords: ["computador", "aplicativo", "internet", "produtividade", "editor", "planilha"] },
  { codigo: "D02", competencia_codigo: "C01", componente_curricular: "Informática Básica", descricao: "Distinguir hardware, software, periféricos, arquivos, pastas e recursos de armazenamento local ou em nuvem.", nivel_esperado: "basico", keywords: ["hardware", "software", "perif", "arquivo", "pasta", "nuvem", "armazen"] },
  { codigo: "D03", competencia_codigo: "C01", componente_curricular: "Informática Básica", descricao: "Aplicar práticas de segurança da informação, cidadania digital, proteção de dados, senhas e uso responsável da internet.", nivel_esperado: "basico", keywords: ["senha", "seguran", "download", "e-mail", "email", "digital", "dados"] },
  { codigo: "D04", competencia_codigo: "C01", componente_curricular: "Sistemas Operacionais", descricao: "Reconhecer funções de sistemas operacionais, gerenciamento de arquivos, usuários, permissões, processos e recursos do sistema.", nivel_esperado: "intermediario", keywords: ["sistema operacional", "processo", "permiss", "usu", "linux", "windows", "terminal"] },

  { codigo: "D05", competencia_codigo: "C02", componente_curricular: "Lógica de Programação", descricao: "Decompor problemas em etapas, identificar entradas, processamentos e saídas e representar soluções por algoritmos ou pseudocódigo.", nivel_esperado: "basico", keywords: ["problema", "algoritmo", "pseudoc", "fluxograma", "entrada", "saída", "saida"] },
  { codigo: "D06", competencia_codigo: "C02", componente_curricular: "Lógica de Programação I (Python)", descricao: "Interpretar variáveis, tipos de dados, operadores, entrada, saída e conversões em programas simples.", nivel_esperado: "basico", keywords: ["vari", "operador", "input", "print", "string", "int", "valor", "python"] },
  { codigo: "D07", competencia_codigo: "C02", componente_curricular: "Lógica de Programação I (Python)", descricao: "Analisar estruturas condicionais, estruturas de repetição e fluxo de execução em algoritmos e programas.", nivel_esperado: "basico", keywords: ["if", "else", "condicion", "for", "while", "repeti", "loop", "fluxo"] },
  { codigo: "D08", competencia_codigo: "C02", componente_curricular: "Lógica de Programação II", descricao: "Aplicar listas, funções, modularização, validação de dados e combinação de estruturas na solução de problemas.", nivel_esperado: "intermediario", keywords: ["lista", "fun", "modular", "retorno", "vetor", "array", "valid"] },
  { codigo: "D09", competencia_codigo: "C02", componente_curricular: "Programação Orientada a Objetos", descricao: "Reconhecer classes, objetos, atributos, métodos, encapsulamento e relações básicas da programação orientada a objetos.", nivel_esperado: "intermediario", keywords: ["classe", "objeto", "atributo", "método", "metodo", "encapsul", "inst"] },
  { codigo: "D10", competencia_codigo: "C02", componente_curricular: "Programação Orientada a Objetos", descricao: "Depurar erros, prever saídas, testar comportamentos e justificar decisões em programas estruturados ou orientados a objetos.", nivel_esperado: "intermediario", keywords: ["erro", "saída", "saida", "resultado", "teste", "debug", "depur"] },

  { codigo: "D11", competencia_codigo: "C03", componente_curricular: "Arquitetura e Manutenção de Computadores", descricao: "Identificar componentes internos, periféricos, funções de hardware e relações entre peças do computador.", nivel_esperado: "basico", keywords: ["placa", "mem", "processador", "fonte", "hd", "ssd", "hardware", "componente"] },
  { codigo: "D12", competencia_codigo: "C03", componente_curricular: "Arquitetura e Manutenção de Computadores", descricao: "Executar procedimentos de montagem, configuração inicial, instalação e verificação de equipamentos computacionais.", nivel_esperado: "intermediario", keywords: ["montagem", "config", "instala", "equipamento", "bios", "driver"] },
  { codigo: "D13", competencia_codigo: "C03", componente_curricular: "Laboratório de Hardware", descricao: "Diagnosticar sintomas de falhas, lentidão, superaquecimento e propor manutenção preventiva ou corretiva.", nivel_esperado: "intermediario", keywords: ["diagn", "falha", "lento", "lentid", "trava", "aquec", "manuten", "preventiva"] },
  { codigo: "D14", competencia_codigo: "C03", componente_curricular: "Laboratório de Hardware", descricao: "Aplicar normas de segurança, organização de bancada, registro técnico e qualidade em atividades práticas de hardware.", nivel_esperado: "avancado", keywords: ["segurança", "seguranca", "bancada", "registro", "qualidade", "procedimento"] },

  { codigo: "D15", competencia_codigo: "C04", componente_curricular: "HTML/CSS", descricao: "Reconhecer estrutura semântica de páginas HTML, elementos, atributos, links, imagens e organização do conteúdo.", nivel_esperado: "basico", keywords: ["html", "tag", "elemento", "atributo", "sem", "link", "imagem"] },
  { codigo: "D16", competencia_codigo: "C04", componente_curricular: "HTML/CSS", descricao: "Aplicar seletores, propriedades CSS, cores, responsividade, layout e estilização visual de interfaces web.", nivel_esperado: "intermediario", keywords: ["css", "cor", "layout", "estilo", "seletor", "classe", "display", "flex"] },
  { codigo: "D17", competencia_codigo: "C04", componente_curricular: "Programação Web", descricao: "Implementar interações, validações e comportamentos básicos em páginas e aplicações web.", nivel_esperado: "intermediario", keywords: ["web", "javascript", "valida", "evento", "formul", "intera"] },
  { codigo: "D18", competencia_codigo: "C04", componente_curricular: "Gerenciador de Conteúdo", descricao: "Organizar, publicar e manter conteúdos em plataformas digitais, sites, blogs ou sistemas de gerenciamento de conteúdo.", nivel_esperado: "intermediario", keywords: ["conteúdo", "conteudo", "cms", "site", "blog", "publica", "gerenciador"] },
  { codigo: "D19", competencia_codigo: "C04", componente_curricular: "Programação Web", descricao: "Integrar interface web, lógica de aplicação e persistência de dados em soluções simples voltadas a demandas reais.", nivel_esperado: "avancado", keywords: ["integra", "persist", "dados", "sistema", "aplica", "cadastro"] },

  { codigo: "D20", competencia_codigo: "C05", componente_curricular: "Banco de Dados", descricao: "Modelar entidades, atributos, relacionamentos e cardinalidades para representar problemas contextualizados.", nivel_esperado: "basico", keywords: ["entidade", "atributo", "relacion", "cardinal", "modelo"] },
  { codigo: "D21", competencia_codigo: "C05", componente_curricular: "Banco de Dados", descricao: "Definir tabelas, campos, chaves primárias, chaves estrangeiras e regras básicas de integridade.", nivel_esperado: "intermediario", keywords: ["tabela", "campo", "chave", "prim", "estrangeira", "integridade"] },
  { codigo: "D22", competencia_codigo: "C05", componente_curricular: "Banco de Dados", descricao: "Interpretar e escrever comandos SQL básicos para inserir, consultar, atualizar e excluir dados.", nivel_esperado: "intermediario", keywords: ["sql", "select", "insert", "update", "delete", "consulta"] },
  { codigo: "D23", competencia_codigo: "C05", componente_curricular: "Banco de Dados", descricao: "Aplicar práticas de organização, backup, segurança, consistência e recuperação de informações em bancos de dados.", nivel_esperado: "avancado", keywords: ["backup", "seguran", "consist", "recuper", "banco"] },

  { codigo: "D24", competencia_codigo: "C06", componente_curricular: "Rede de Computadores", descricao: "Identificar topologias, equipamentos, meios de transmissão e funções básicas em redes de computadores.", nivel_esperado: "basico", keywords: ["topologia", "switch", "roteador", "cabo", "rede", "equipamento"] },
  { codigo: "D25", competencia_codigo: "C06", componente_curricular: "Rede de Computadores", descricao: "Configurar endereçamento, conectividade, compartilhamento de recursos e serviços básicos de rede.", nivel_esperado: "intermediario", keywords: ["ip", "endereço", "endereco", "dhcp", "dns", "compartilh", "conect"] },
  { codigo: "D26", competencia_codigo: "C06", componente_curricular: "Rede de Computadores", descricao: "Diagnosticar problemas de conectividade, desempenho, acesso e segurança em ambientes de rede.", nivel_esperado: "intermediario", keywords: ["diagn", "conect", "ping", "latência", "latencia", "acesso", "seguran"] },
  { codigo: "D27", competencia_codigo: "C06", componente_curricular: "Rede de Computadores", descricao: "Planejar soluções simples de rede para escola, comunidade, associação, cooperativa ou pequeno empreendimento.", nivel_esperado: "avancado", keywords: ["planej", "solução", "solucao", "comunidade", "associa", "cooperativa"] },

  { codigo: "D28", competencia_codigo: "C07", componente_curricular: "Noções de Robótica", descricao: "Reconhecer sensores, atuadores, placas, comandos e princípios de automação aplicados a protótipos.", nivel_esperado: "basico", keywords: ["sensor", "atuador", "placa", "rob", "automação", "automacao"] },
  { codigo: "D29", competencia_codigo: "C07", componente_curricular: "Noções de Robótica", descricao: "Aplicar lógica de programação em protótipos de robótica, automação ou monitoramento de situações do território.", nivel_esperado: "intermediario", keywords: ["prot", "rob", "lógica", "logica", "monitor", "territ"] },
  { codigo: "D30", competencia_codigo: "C07", componente_curricular: "Introdução à Inteligência Artificial", descricao: "Compreender conceitos básicos de inteligência artificial, dados, automação, aprendizagem de máquina e IA generativa.", nivel_esperado: "basico", keywords: ["inteligência artificial", "inteligencia artificial", "ia", "dados", "generativa", "máquina", "maquina"] },
  { codigo: "D31", competencia_codigo: "C07", componente_curricular: "Inteligência Artificial Aplicada", descricao: "Avaliar usos éticos, limites, riscos e possibilidades da IA em projetos técnicos, educacionais, produtivos e comunitários.", nivel_esperado: "intermediario", keywords: ["ética", "etica", "risco", "limite", "ia", "projeto", "comunit"] },

  { codigo: "D32", competencia_codigo: "C08", componente_curricular: "Design Gráfico", descricao: "Aplicar princípios de composição visual, cor, tipografia, alinhamento, contraste e hierarquia da informação.", nivel_esperado: "basico", keywords: ["cor", "tipografia", "alinh", "hierarquia", "contraste", "composi"] },
  { codigo: "D33", competencia_codigo: "C08", componente_curricular: "Design Gráfico", descricao: "Selecionar formatos, ferramentas e procedimentos adequados para produção, edição e exportação de artefatos digitais.", nivel_esperado: "intermediario", keywords: ["formato", "export", "imagem", "resolu", "ferramenta", "arquivo"] },
  { codigo: "D34", competencia_codigo: "C08", componente_curricular: "Design Gráfico", descricao: "Produzir materiais digitais acessíveis e comunicativos para escola, comunidade, movimentos, redes sociais ou projetos.", nivel_esperado: "intermediario", keywords: ["acess", "comunica", "rede social", "cartilha", "vídeo", "video", "material"] },

  { codigo: "D35", competencia_codigo: "C09", componente_curricular: "Projeto Integrador", descricao: "Levantar necessidades reais, definir requisitos e propor soluções tecnológicas contextualizadas para escola ou comunidade.", nivel_esperado: "intermediario", keywords: ["necessidade", "requisito", "solução", "solucao", "comunidade", "projeto"] },
  { codigo: "D36", competencia_codigo: "C09", componente_curricular: "Laboratório de Software", descricao: "Planejar, prototipar, testar, documentar e apresentar soluções de software em projetos integradores.", nivel_esperado: "avancado", keywords: ["prot", "teste", "document", "software", "apresent", "projeto"] },
  { codigo: "D37", competencia_codigo: "C09", componente_curricular: "Laboratório de Hardware", descricao: "Executar práticas laboratoriais de hardware ou infraestrutura com registro técnico, segurança, colaboração e qualidade.", nivel_esperado: "avancado", keywords: ["laborat", "hardware", "infra", "registro", "colabora", "qualidade"] },

  { codigo: "D38", competencia_codigo: "C10", componente_curricular: "Organização do Trabalho e Técnicas Produtivas", descricao: "Relacionar organização do trabalho, técnicas produtivas, colaboração, responsabilidade e comunicação profissional.", nivel_esperado: "basico", keywords: ["trabalho", "produt", "colabora", "respons", "comunica"] },
  { codigo: "D39", competencia_codigo: "C10", componente_curricular: "Planejamento de Carreira", descricao: "Planejar carreira, estágio, portfólio, postura profissional e estratégias de inserção no mundo do trabalho.", nivel_esperado: "intermediario", keywords: ["carreira", "estágio", "estagio", "portfólio", "portfolio", "profissional"] },
  { codigo: "D40", competencia_codigo: "C10", componente_curricular: "Gestão de Startup", descricao: "Elaborar propostas de inovação, empreendedorismo, gestão de startup e soluções digitais com impacto social ou produtivo.", nivel_esperado: "intermediario", keywords: ["startup", "empreendedor", "inova", "gestão", "gestao", "impacto"] },
];

const componentModel = descriptorDefs.reduce((models, descriptor) => {
  if (!models[descriptor.componente_curricular]) {
    models[descriptor.componente_curricular] = {
      competencia: descriptor.competencia_codigo,
      descritores: [],
    };
  }
  models[descriptor.componente_curricular].descritores.push({
    codigo: descriptor.codigo,
    descricao: descriptor.descricao,
    nivel_esperado: descriptor.nivel_esperado,
    keywords: descriptor.keywords,
  });
  return models;
}, {});

function getComponentModel(componente) {
  return componentModel[componente] || {
    competencia: "C09",
    descritores: [
      {
        codigo: `D-INF-${slug(componente).slice(0, 18)}`,
        descricao: `Resolver situações-problema relacionadas a ${componente}, demonstrando domínio técnico observável.`,
        nivel_esperado: "intermediario",
        keywords: [],
      },
    ],
  };
}

function inferDescritor(componente, item, itemIndex) {
  const model = getComponentModel(componente);
  const text = fixText(`${item.q} ${(item.op || []).join(" ")}`).toLowerCase();
  const scored = model.descritores.map((descritor) => ({
    descritor,
    score: descritor.keywords.reduce((total, keyword) => total + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  if (scored[0]?.score > 0) return scored[0].descritor;
  return model.descritores[itemIndex % model.descritores.length];
}

const source = fs.readFileSync(htmlPath, "latin1");
const bancoCode = extractBanco(source);
const context = {};
vm.createContext(context);
vm.runInContext(`BANCO = ${bancoCode};`, context);
const banco = context.BANCO;

const competencias = [];
const descritores = [];
const questoes = [];
const seenCompetencias = new Set();
const seenDescritores = new Set();
const seenQuestions = new Set();

Object.entries(competencyDefs).forEach(([codigo, competencia]) => {
  seenCompetencias.add(codigo);
  competencias.push({
    codigo,
    curso_tecnico: competencia.curso_tecnico,
    descricao: `${codigo} - ${competencia.descricao}`,
    fonte: competencia.fonte,
  });
});

descriptorDefs.forEach((descritor) => {
  seenDescritores.add(descritor.codigo);
  descritores.push({
    codigo: descritor.codigo,
    competencia_codigo: descritor.competencia_codigo,
    componente_curricular: descritor.componente_curricular,
    descricao: `${descritor.codigo} - ${descritor.descricao}`,
    nivel_esperado: descritor.nivel_esperado,
  });
});

Object.entries(banco).forEach(([anoKey, ano]) => {
  ano.blocos.forEach((bloco, blockIndex) => {
    const componente = cleanBlockName(bloco.nome);
    const model = getComponentModel(componente);
    const competenciaCodigo = model.competencia;
    const competencia = competencyDefs[competenciaCodigo];

    if (!seenCompetencias.has(competenciaCodigo)) {
      seenCompetencias.add(competenciaCodigo);
      competencias.push({
        codigo: competenciaCodigo,
        curso_tecnico: competencia.curso_tecnico,
        descricao: `${competenciaCodigo} - ${competencia.descricao}`,
        fonte: competencia.fonte,
      });
    }

    model.descritores.forEach((descritor) => {
      if (!seenDescritores.has(descritor.codigo)) {
        seenDescritores.add(descritor.codigo);
        descritores.push({
          codigo: descritor.codigo,
          competencia_codigo: competenciaCodigo,
          componente_curricular: componente,
          descricao: `${descritor.codigo} - ${descritor.descricao}`,
          nivel_esperado: descritor.nivel_esperado,
        });
      }
    });

    bloco.itens.forEach((item, itemIndex) => {
      const questionKey = `${componente}|${item.q}`;
      if (seenQuestions.has(questionKey)) return;
      seenQuestions.add(questionKey);

      const number = String(questoes.length + 1).padStart(4, "0");
      const answer = ["A", "B", "C", "D", "E"][item.r] || "A";
      const descritor = inferDescritor(componente, item, itemIndex);
      questoes.push({
        codigo: `Q-INF-${number}`,
        descritor_codigo: descritor.codigo,
        componente_curricular: componente,
        enunciado: fixText(item.q),
        alternativa_a: fixText(item.op[0] || ""),
        alternativa_b: fixText(item.op[1] || ""),
        alternativa_c: fixText(item.op[2] || ""),
        alternativa_d: fixText(item.op[3] || ""),
        alternativa_e: fixText(item.op[4] || ""),
        gabarito: answer,
        justificativa: `Item importado do banco diagnóstico HTML do SIDEP-CE; bloco ${componente}; origem ${anoKey}.`,
        dificuldade_inicial: dificuldade(blockIndex, itemIndex),
        status: "validada",
      });
    });
  });
});

function renderArray(name, items) {
  return `export const ${name} = ${JSON.stringify(items, null, 2)};\n`;
}

competencias.sort((a, b) => a.codigo.localeCompare(b.codigo, "pt-BR", { numeric: true }));
descritores.sort((a, b) => a.codigo.localeCompare(b.codigo, "pt-BR", { numeric: true }));

const content = [
  'import type { CompetenciaDraft, DescritorDraft, QuestaoDraft } from "../types";',
  "",
  renderArray("competenciasNorteadoras", competencias).replace(" = [", ": CompetenciaDraft[] = ["),
  renderArray("descritoresNorteadores", descritores).replace(" = [", ": DescritorDraft[] = ["),
  renderArray("questoesNorteadoras", questoes).replace(" = [", ": QuestaoDraft[] = ["),
].join("\n");

fs.writeFileSync(outPath, content, "utf8");
fs.writeFileSync(reportPath, JSON.stringify({ competencias: competencias.length, descritores: descritores.length, questoes: questoes.length }, null, 2), "utf8");
console.log(JSON.stringify({ outPath, reportPath, competencias: competencias.length, descritores: descritores.length, questoes: questoes.length }, null, 2));
