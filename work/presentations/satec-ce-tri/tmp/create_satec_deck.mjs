import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT = String.raw`C:\Users\yolep\OneDrive\Documentos\Método TRI e IA\outputs\SATEC-CE_TRI_apresentacao_projeto.pptx`;
const QA = String.raw`C:\Users\yolep\OneDrive\Documentos\Método TRI e IA\work\presentations\satec-ce-tri\tmp\qa`;

const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });

const colors = {
  ink: "#111827",
  text: "#374151",
  mute: "#6B7280",
  line: "#D1D5DB",
  pale: "#F3F4F6",
  pale2: "#EEF6F3",
  green: "#0F766E",
  blue: "#1D4ED8",
  amber: "#B45309",
  red: "#B91C1C",
  white: "#FFFFFF",
};

function box(slide, { left, top, width, height, fill = "none", line = "none", radius = 0 }) {
  return slide.shapes.add({
    geometry: radius ? "roundRect" : "rect",
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill: line, width: line === "none" ? 0 : 1 },
    ...(radius ? { borderRadius: "rounded" } : {}),
  });
}

function text(slide, value, pos, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: pos,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    fontFace: "Aptos",
    fontSize: 22,
    color: colors.text,
    ...style,
  };
  return shape;
}

function title(slide, value, eyebrow) {
  if (eyebrow) {
    text(slide, eyebrow.toUpperCase(), { left: 70, top: 44, width: 760, height: 28 }, {
      fontSize: 13, bold: true, color: colors.green,
    });
  }
  text(slide, value, { left: 70, top: 82, width: 1070, height: 78 }, {
    fontSize: 36, bold: true, color: colors.ink,
  });
  box(slide, { left: 70, top: 166, width: 1140, height: 1, fill: colors.line, line: colors.line });
}

function footer(slide, n) {
  text(slide, "SATEC-CE/TRI | Avaliação da Educação Profissional do Ceará", { left: 70, top: 676, width: 650, height: 24 }, {
    fontSize: 11, color: colors.mute,
  });
  text(slide, String(n).padStart(2, "0"), { left: 1166, top: 672, width: 44, height: 24 }, {
    fontSize: 12, bold: true, color: colors.mute,
  });
}

function bullet(slide, items, x, y, w, gap = 44, style = {}) {
  items.forEach((item, i) => {
    box(slide, { left: x, top: y + i * gap + 8, width: 7, height: 7, fill: style.dot || colors.green, line: style.dot || colors.green, radius: 2 });
    text(slide, item, { left: x + 22, top: y + i * gap, width: w - 22, height: 38 }, {
      fontSize: style.fontSize || 20, color: style.color || colors.text,
    });
  });
}

function sectionLabel(slide, value, x, y, color = colors.green) {
  text(slide, value, { left: x, top: y, width: 330, height: 30 }, {
    fontSize: 16, bold: true, color,
  });
}

function card(slide, x, y, w, h, heading, body, accent = colors.green) {
  box(slide, { left: x, top: y, width: w, height: h, fill: colors.white, line: colors.line });
  box(slide, { left: x, top: y, width: 7, height: h, fill: accent, line: accent });
  text(slide, heading, { left: x + 24, top: y + 20, width: w - 42, height: 28 }, {
    fontSize: 20, bold: true, color: colors.ink,
  });
  text(slide, body, { left: x + 24, top: y + 58, width: w - 42, height: h - 72 }, {
    fontSize: 16, color: colors.text,
  });
}

// 1
{
  const s = deck.slides.add();
  s.background.fill = colors.white;
  box(s, { left: 0, top: 0, width: 1280, height: 720, fill: colors.pale2, line: colors.pale2 });
  text(s, "SATEC-CE/TRI", { left: 72, top: 70, width: 520, height: 70 }, { fontSize: 54, bold: true, color: colors.ink });
  text(s, "Sistema de Avaliação Técnica da Educação Profissional do Ceará baseado em TRI", { left: 74, top: 154, width: 720, height: 92 }, { fontSize: 28, color: colors.text });
  text(s, "Projeto de avaliação diagnóstica, formativa e final para cursos técnicos da rede estadual", { left: 76, top: 286, width: 650, height: 70 }, { fontSize: 20, color: colors.mute });
  box(s, { left: 790, top: 96, width: 360, height: 430, fill: colors.white, line: colors.line });
  text(s, "Entrada", { left: 835, top: 148, width: 250, height: 34 }, { fontSize: 30, bold: true, color: colors.green });
  text(s, "Percurso", { left: 835, top: 254, width: 250, height: 34 }, { fontSize: 30, bold: true, color: colors.blue });
  text(s, "Saída", { left: 835, top: 360, width: 250, height: 34 }, { fontSize: 30, bold: true, color: colors.amber });
  text(s, "Diagnosticar, acompanhar e aprimorar a aprendizagem profissional.", { left: 835, top: 464, width: 250, height: 54 }, { fontSize: 17, color: colors.text });
  footer(s, 1);
}

// 2
{
  const s = deck.slides.add();
  title(s, "Tema e justificativa", "Por que este projeto importa");
  text(s, "As escolas profissionalizantes do Ceará já possuem matrizes robustas. O desafio é transformar essa organização curricular em diagnóstico contínuo, comparável e útil para a melhoria do ensino.", { left: 70, top: 200, width: 800, height: 94 }, { fontSize: 25, color: colors.ink });
  card(s, 70, 340, 350, 180, "Motivação", "Resultados avaliativos costumam chegar como nota ou percentual. O projeto propõe transformá-los em evidências sobre competências técnicas.", colors.green);
  card(s, 465, 340, 350, 180, "Importância", "A EPT precisa mostrar o que o estudante sabe fazer antes, durante e ao final do curso, com foco no mundo do trabalho.", colors.blue);
  card(s, 860, 340, 350, 180, "Oportunidade", "A TRI permite criar escalas de proficiência e comparar evolução entre turmas, escolas, cursos e eixos tecnológicos.", colors.amber);
  footer(s, 2);
}

// 3
{
  const s = deck.slides.add();
  title(s, "A matriz curricular vira uma matriz avaliativa", "Ideia central");
  box(s, { left: 90, top: 230, width: 190, height: 90, fill: colors.pale, line: colors.line });
  box(s, { left: 340, top: 230, width: 190, height: 90, fill: colors.pale, line: colors.line });
  box(s, { left: 590, top: 230, width: 190, height: 90, fill: colors.pale, line: colors.line });
  box(s, { left: 840, top: 230, width: 190, height: 90, fill: colors.pale, line: colors.line });
  box(s, { left: 1090, top: 230, width: 120, height: 90, fill: colors.pale2, line: colors.green });
  text(s, "Currículo", { left: 120, top: 256, width: 130, height: 32 }, { fontSize: 24, bold: true, color: colors.ink });
  text(s, "Competências", { left: 360, top: 256, width: 160, height: 32 }, { fontSize: 23, bold: true, color: colors.ink });
  text(s, "Descritores", { left: 618, top: 256, width: 145, height: 32 }, { fontSize: 23, bold: true, color: colors.ink });
  text(s, "Itens", { left: 905, top: 256, width: 70, height: 32 }, { fontSize: 24, bold: true, color: colors.ink });
  text(s, "TRI", { left: 1128, top: 256, width: 60, height: 32 }, { fontSize: 24, bold: true, color: colors.green });
  text(s, "O método parte dos componentes curriculares dos cursos técnicos e cria descritores avaliáveis, capazes de alimentar banco de itens, rubricas práticas e escala de proficiência.", { left: 160, top: 390, width: 930, height: 88 }, { fontSize: 24, color: colors.text });
  footer(s, 3);
}

// 4
{
  const s = deck.slides.add();
  title(s, "Objetivos do projeto", "O que os estudantes vão alcançar");
  sectionLabel(s, "Objetivo geral", 70, 202);
  text(s, "Desenvolver e aplicar um método de avaliação técnica baseado em competências e parâmetros da TRI para diagnosticar, acompanhar e aprimorar a aprendizagem nos cursos técnicos da rede estadual.", { left: 70, top: 236, width: 1050, height: 74 }, { fontSize: 23, color: colors.ink });
  sectionLabel(s, "Objetivos específicos", 70, 350);
  bullet(s, [
    "Identificar conhecimentos prévios e lacunas de aprendizagem no início do curso.",
    "Acompanhar o desenvolvimento de competências técnicas ao longo dos semestres.",
    "Avaliar o perfil profissional de conclusão com evidências teóricas e práticas.",
    "Gerar relatórios para orientar intervenção pedagógica, planejamento e gestão."
  ], 80, 392, 1050, 46, { fontSize: 20 });
  footer(s, 4);
}

// 5
{
  const s = deck.slides.add();
  title(s, "Alinhamento com o DCRC e a EPT", "Base curricular obrigatória");
  card(s, 70, 210, 340, 250, "DCRC", "O projeto considera a formação integral, as competências gerais, a contextualização das aprendizagens e a articulação entre teoria, prática e território.", colors.green);
  card(s, 470, 210, 340, 250, "Matrizes 2025/2026", "As matrizes das EEEPs organizam formação geral, formação profissional, parte diversificada e estágio em 5.400 h/a.", colors.blue);
  card(s, 870, 210, 340, 250, "CNCT e mundo do trabalho", "Cada curso será analisado por eixo tecnológico, perfil profissional de conclusão, competências técnicas e possibilidades de atuação.", colors.amber);
  text(s, "Nas escolas do campo e EFA, o método também reconhece tempo escola, tempo comunidade, pedagogia da alternância e evidências territoriais de aprendizagem.", { left: 110, top: 520, width: 1000, height: 56 }, { fontSize: 22, color: colors.ink });
  footer(s, 5);
}

// 6
{
  const s = deck.slides.add();
  title(s, "Metodologia prática", "Como as atividades serão feitas");
  const steps = [
    ["1", "Mapear o curso", "Selecionar componentes da matriz e relacionar com competências do CNCT."],
    ["2", "Criar descritores", "Transformar competências em habilidades observáveis e mensuráveis."],
    ["3", "Construir instrumentos", "Elaborar itens objetivos, situações-problema, rubricas e tarefas práticas."],
    ["4", "Aplicar em três momentos", "Entrada, percurso e saída, com devolutiva para professor e estudante."],
    ["5", "Intervir e reavaliar", "Usar IA para trilhas, atividades personalizadas e recomposição por descritor."]
  ];
  steps.forEach((st, i) => {
    const y = 205 + i * 78;
    box(s, { left: 75, top: y, width: 50, height: 50, fill: colors.green, line: colors.green });
    text(s, st[0], { left: 91, top: y + 9, width: 24, height: 26 }, { fontSize: 24, bold: true, color: colors.white });
    text(s, st[1], { left: 150, top: y - 2, width: 320, height: 28 }, { fontSize: 23, bold: true, color: colors.ink });
    text(s, st[2], { left: 150, top: y + 30, width: 900, height: 34 }, { fontSize: 18, color: colors.text });
  });
  footer(s, 6);
}

// 7
{
  const s = deck.slides.add();
  title(s, "Como o piloto pode começar", "Aplicação na rede");
  text(s, "A implantação deve começar pequena, calibrar os instrumentos e depois escalar para os demais cursos.", { left: 70, top: 198, width: 940, height: 40 }, { fontSize: 23, color: colors.ink });
  card(s, 70, 285, 230, 180, "Tecnologia", "Informática ou Desenvolvimento de Sistemas.", colors.blue);
  card(s, 320, 285, 230, 180, "Gestão", "Administração, com foco em processos, dados e projetos.", colors.green);
  card(s, 570, 285, 230, 180, "Campo", "Agroecologia ou Agropecuária, incluindo evidências territoriais.", colors.amber);
  card(s, 820, 285, 230, 180, "Saúde", "Enfermagem, com simulações e protocolos.", colors.red);
  card(s, 1070, 285, 140, 180, "Indústria", "Eletrotécnica ou Automação.", colors.ink);
  text(s, "Cada piloto gera banco de itens, rubricas práticas, relatórios de proficiência e plano de intervenção por turma.", { left: 140, top: 532, width: 1000, height: 54 }, { fontSize: 23, color: colors.text });
  footer(s, 7);
}

// 8
{
  const s = deck.slides.add();
  title(s, "Cronograma de implantação", "Tempo estimado");
  const rows = [
    ["Mês 1", "Planejamento", "curso-piloto, equipe, matriz avaliativa"],
    ["Mês 2", "Instrumentos", "descritores, itens, rubricas e formulário diagnóstico"],
    ["Mês 3", "Aplicação inicial", "avaliação de entrada e primeiro relatório"],
    ["Meses 4 e 5", "Intervenção", "atividades por descritor, IA e reagrupamentos"],
    ["Mês 6", "Avaliação final", "comparação, escala preliminar e relatório de melhoria"]
  ];
  rows.forEach((r, i) => {
    const y = 200 + i * 72;
    box(s, { left: 78, top: y, width: 150, height: 48, fill: i % 2 ? colors.pale : colors.pale2, line: colors.line });
    text(s, r[0], { left: 98, top: y + 11, width: 110, height: 22 }, { fontSize: 18, bold: true, color: colors.ink });
    text(s, r[1], { left: 260, top: y + 6, width: 250, height: 26 }, { fontSize: 21, bold: true, color: colors.green });
    text(s, r[2], { left: 525, top: y + 8, width: 620, height: 24 }, { fontSize: 19, color: colors.text });
  });
  footer(s, 8);
}

// 9
{
  const s = deck.slides.add();
  title(s, "Produto final e avaliação dos estudantes", "Entrega pedagógica");
  card(s, 70, 215, 360, 250, "Produto final", "Painel diagnóstico do curso-piloto, relatório por descritor e trilhas de recomposição geradas a partir dos resultados.", colors.green);
  card(s, 460, 215, 360, 250, "Evidências dos estudantes", "Prova diagnóstica, tarefa prática, projeto técnico, portfólio, relatório de estágio ou diário de campo.", colors.blue);
  card(s, 850, 215, 360, 250, "Avaliação docente", "Rubricas por competência, comparação antes/depois, participação, autonomia e aplicação técnica em situações reais.", colors.amber);
  text(s, "A nota deixa de ser o fim do processo. Ela passa a indicar quais competências precisam de reforço, aprofundamento ou nova oportunidade prática.", { left: 112, top: 530, width: 1000, height: 58 }, { fontSize: 23, color: colors.ink });
  footer(s, 9);
}

// 10
{
  const s = deck.slides.add();
  title(s, "O projeto pode virar método estadual", "Síntese e próximos passos");
  text(s, "O SATEC-CE/TRI propõe uma avaliação que mede evolução, orienta intervenção e fortalece a qualidade da Educação Profissional no Ceará.", { left: 70, top: 205, width: 950, height: 76 }, { fontSize: 28, bold: true, color: colors.ink });
  bullet(s, [
    "Escolher o primeiro curso-piloto.",
    "Construir a matriz avaliativa com descritores.",
    "Criar banco inicial de itens e rubricas práticas.",
    "Aplicar diagnóstico, gerar devolutivas e validar o modelo."
  ], 88, 344, 850, 52, { fontSize: 22 });
  box(s, { left: 950, top: 330, width: 210, height: 160, fill: colors.pale2, line: colors.green });
  text(s, "Meta", { left: 990, top: 360, width: 130, height: 28 }, { fontSize: 25, bold: true, color: colors.green });
  text(s, "Melhorar o ensino técnico com dados, prática e intervenção pedagógica.", { left: 985, top: 405, width: 150, height: 70 }, { fontSize: 17, color: colors.text });
  footer(s, 10);
}

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.mkdir(QA, { recursive: true });

for (const [index, slide] of deck.slides.items.entries()) {
  const png = await deck.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(QA, `slide-${String(index + 1).padStart(2, "0")}.png`), new Uint8Array(await png.arrayBuffer()));
}

const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(path.join(QA, "montage.webp"), new Uint8Array(await montage.arrayBuffer()));

const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(OUT);
console.log(OUT);
