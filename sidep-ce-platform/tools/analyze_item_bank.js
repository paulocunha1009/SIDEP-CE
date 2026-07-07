const fs = require("fs");
const path = require("path");

const seedPath = path.join(__dirname, "..", "app", "src", "data", "norteadoresSeed.ts");
const source = fs.readFileSync(seedPath, "utf8");

function extractArray(name) {
  const marker = `export const ${name}`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Array not found: ${name}`);
  const equals = source.indexOf("=", start);
  const arrayStart = source.indexOf("[", equals);
  if (arrayStart < 0) throw new Error(`Array start not found: ${name}`);
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) return JSON.parse(source.slice(arrayStart, index + 1));
    }
  }
  throw new Error(`Array boundaries not found: ${name}`);
}

const competencias = extractArray("competenciasNorteadoras");
const descritores = extractArray("descritoresNorteadores");
const questoes = extractArray("questoesNorteadoras");

const competenciaPorCodigo = Object.fromEntries(competencias.map((item) => [item.codigo, item]));
const descritorPorCodigo = Object.fromEntries(descritores.map((item) => [item.codigo, item]));

function countBy(items, keyGetter) {
  return items.reduce((acc, item) => {
    const key = keyGetter(item) || "NAO_INFORMADO";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

const porDescritor = countBy(questoes, (item) => item.descritor_codigo);
const porComponente = countBy(questoes, (item) => item.componente_curricular);
const porCompetencia = countBy(questoes, (item) => {
  const descritor = descritorPorCodigo[item.descritor_codigo];
  return descritor?.competencia_codigo || "SEM_COMPETENCIA";
});

const descritoresSemQuestoes = descritores
  .filter((descritor) => !porDescritor[descritor.codigo])
  .map((descritor) => ({
    codigo: descritor.codigo,
    competencia: descritor.competencia_codigo,
    componente: descritor.componente_curricular,
    descricao: descritor.descricao,
  }));

const MIN_QUESTOES_POR_DESCRITOR = 5;

const descritoresComPoucasQuestoes = descritores
  .filter((descritor) => (porDescritor[descritor.codigo] || 0) > 0 && (porDescritor[descritor.codigo] || 0) < MIN_QUESTOES_POR_DESCRITOR)
  .map((descritor) => ({
    codigo: descritor.codigo,
    competencia: descritor.competencia_codigo,
    componente: descritor.componente_curricular,
    quantidade: porDescritor[descritor.codigo] || 0,
    descricao: descritor.descricao,
  }));

const componentesPrevistos = Array.from(new Set(descritores.map((item) => item.componente_curricular))).sort();
const componentesComQuestoes = Object.keys(porComponente).sort();
const componentesSemQuestoes = componentesPrevistos.filter((nome) => !porComponente[nome]);

const questoesSemDescritorValido = questoes
  .filter((questao) => !descritorPorCodigo[questao.descritor_codigo])
  .map((questao) => ({ codigo: questao.codigo, descritor_codigo: questao.descritor_codigo }));

const dificuldade = questoes.map((q) => Number(q.dificuldade_inicial)).filter((n) => Number.isFinite(n));
const temParametrosTri = questoes.some((q) => "parametro_a" in q || "parametro_b" in q || "parametro_c" in q || "tri_a" in q || "tri_b" in q || "tri_c" in q);

const relatorio = {
  totais: {
    competencias: competencias.length,
    descritores: descritores.length,
    questoes: questoes.length,
    componentes_previstos: componentesPrevistos.length,
    componentes_com_questoes: componentesComQuestoes.length,
  },
  tri: {
    fase: temParametrosTri ? "TRI_COM_PARAMETROS_NO_BANCO" : "PRE_TRI",
    tem_dificuldade_inicial: dificuldade.length === questoes.length,
    dificuldade_minima: Math.min(...dificuldade),
    dificuldade_maxima: Math.max(...dificuldade),
    observacao: temParametrosTri
      ? "Ha campos de parametros TRI no banco; verificar se foram calibrados estatisticamente."
      : "O banco possui dificuldade inicial estimada, mas nao possui parametros TRI calibrados por respostas.",
  },
  por_competencia: Object.fromEntries(
    Object.entries(porCompetencia)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([codigo, quantidade]) => [
        codigo,
        {
          quantidade,
          descricao: competenciaPorCodigo[codigo]?.descricao || null,
        },
      ]),
  ),
  por_componente: Object.fromEntries(Object.entries(porComponente).sort(([a], [b]) => a.localeCompare(b))),
  por_descritor: Object.fromEntries(
    descritores.map((descritor) => [
      descritor.codigo,
      {
        quantidade: porDescritor[descritor.codigo] || 0,
        competencia: descritor.competencia_codigo,
        componente: descritor.componente_curricular,
        descricao: descritor.descricao,
      },
    ]),
  ),
  lacunas: {
    descritores_sem_questoes: descritoresSemQuestoes,
    descritores_com_menos_de_5_questoes: descritoresComPoucasQuestoes,
    componentes_sem_questoes: componentesSemQuestoes,
    questoes_sem_descritor_valido: questoesSemDescritorValido,
  },
};

const outputPath = path.join(__dirname, "..", "docs", "diagnostico_banco_questoes_informatica_v0_1.json");
fs.writeFileSync(outputPath, JSON.stringify(relatorio, null, 2), "utf8");

console.log(JSON.stringify(relatorio, null, 2));
