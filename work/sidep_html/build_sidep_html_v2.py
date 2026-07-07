from pathlib import Path

SRC = Path(r"C:\Users\yolep\OneDrive\Desktop\DOCENTES 2026\SIDEP-CE_Avaliacao_Diagnostica_Online.html")
OUT = Path(r"C:\Users\yolep\OneDrive\Documentos\Método TRI e IA\outputs\SIDEP-CE_Avaliacao_Diagnostica_Online_v2.html")

src = SRC.read_text(encoding="utf-8")
start = src.index("var BANCO =")
end = src.index("\n\nvar estado", start)
banco = src[start:end].strip()

html = r'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SIDEP-CE | Avaliação Diagnóstica da Educação Profissional</title>
<style>
  :root {
    --ceara-blue: #062b5f;
    --ceara-blue-2: #0b4f93;
    --ceara-green: #00843d;
    --ceara-green-2: #3fae2a;
    --ceara-orange: #f26a21;
    --ceara-cyan: #009cde;
    --ink: #132033;
    --muted: #607083;
    --line: #d8e0e7;
    --bg: #f4f7f9;
    --panel: #ffffff;
    --soft-blue: #eaf3ff;
    --soft-green: #eaf8ef;
    --soft-orange: #fff1e8;
    --soft-red: #fff0f0;
    --red: #b42318;
    --amber: #a15c00;
    --shadow: 0 18px 45px rgba(6, 43, 95, 0.10);
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    background:
      radial-gradient(circle at top left, rgba(0,132,61,0.12), transparent 32rem),
      radial-gradient(circle at bottom right, rgba(242,106,33,0.14), transparent 34rem),
      var(--bg);
    color: var(--ink);
    line-height: 1.55;
  }
  button, input, select { font: inherit; }
  button { touch-action: manipulation; }
  .gov-strip {
    min-height: 44px;
    background: linear-gradient(90deg, var(--ceara-blue), #073b78 48%, var(--ceara-green));
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 18px;
    text-align: center;
    font-size: 12px;
    letter-spacing: 0.2px;
  }
  .hero {
    background: linear-gradient(135deg, #ffffff 0%, #f8fbfd 55%, #edf7f0 100%);
    border-bottom: 1px solid var(--line);
    position: relative;
    overflow: hidden;
  }
  .hero:before, .hero:after {
    content: "";
    position: absolute;
    border-radius: 999px;
    pointer-events: none;
  }
  .hero:before {
    right: -90px;
    top: -130px;
    width: 360px;
    height: 360px;
    background: conic-gradient(from 180deg, var(--ceara-blue), var(--ceara-green), var(--ceara-orange), var(--ceara-blue));
    opacity: 0.16;
  }
  .hero:after {
    left: -120px;
    bottom: -180px;
    width: 360px;
    height: 360px;
    background: linear-gradient(135deg, var(--ceara-green), var(--ceara-cyan));
    opacity: 0.12;
  }
  .hero-inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 26px 22px 30px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 330px;
    gap: 28px;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  .brand-lockup {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 22px;
  }
  .crest {
    width: 58px;
    height: 58px;
    border-radius: 18px 18px 22px 22px;
    background: linear-gradient(145deg, var(--ceara-green), #0a7040);
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 900;
    box-shadow: inset 0 0 0 3px rgba(255,255,255,.35);
  }
  .brand-text strong { display: block; font-size: 24px; letter-spacing: 0.02em; color: var(--ceara-blue); }
  .brand-text span { display: block; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #075c33;
    background: #e8f6ee;
    border: 1px solid #c9ead5;
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 14px;
  }
  h1 {
    max-width: 820px;
    margin: 0;
    color: var(--ceara-blue);
    font-size: clamp(30px, 4vw, 54px);
    line-height: 1.02;
    letter-spacing: 0;
  }
  .hero-subtitle {
    max-width: 780px;
    margin: 18px 0 0;
    color: #334155;
    font-size: 18px;
  }
  .hero-panel {
    background: rgba(255,255,255,.82);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    padding: 20px;
  }
  .hero-panel h2 {
    margin: 0 0 12px;
    color: var(--ceara-blue);
    font-size: 20px;
  }
  .metric-grid {
    display: grid;
    gap: 10px;
  }
  .metric {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid var(--line);
    background: #fff;
    padding: 12px;
  }
  .metric span { color: var(--muted); font-size: 13px; }
  .metric strong { color: var(--ceara-blue); font-size: 20px; }
  .shell {
    max-width: 1180px;
    margin: 0 auto;
    padding: 22px;
  }
  .stepper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #fff;
    border: 1px solid var(--line);
    box-shadow: 0 10px 24px rgba(15, 23, 42, .06);
    margin-bottom: 18px;
  }
  .step {
    padding: 14px 16px;
    border-right: 1px solid var(--line);
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
  }
  .step:last-child { border-right: 0; }
  .step b {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #e8eef5;
    color: var(--ceara-blue);
    flex: 0 0 auto;
  }
  .step span { font-size: 13px; color: var(--muted); }
  .step strong { display: block; color: var(--ink); font-size: 14px; }
  .step.ativo b { background: var(--ceara-green); color: #fff; }
  .step.ativo { box-shadow: inset 0 -4px 0 var(--ceara-green); }
  .panel {
    background: var(--panel);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    padding: 24px;
    margin-bottom: 18px;
  }
  .panel-title {
    margin: 0 0 8px;
    color: var(--ceara-blue);
    font-size: 24px;
    line-height: 1.16;
  }
  .lead { margin: 0 0 18px; color: var(--muted); max-width: 860px; }
  .notice {
    border-left: 5px solid var(--ceara-blue-2);
    background: var(--soft-blue);
    padding: 14px 16px;
    color: #16324f;
    margin: 16px 0;
  }
  .notice strong { color: var(--ceara-blue); }
  .choice-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .ano-card {
    border: 2px solid var(--line);
    background: #fff;
    text-align: left;
    padding: 18px;
    cursor: pointer;
    transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
  }
  .ano-card:hover {
    transform: translateY(-2px);
    border-color: var(--ceara-green);
    box-shadow: 0 12px 26px rgba(0,132,61,.12);
  }
  .ano-card small { display: block; color: var(--ceara-green); font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
  .ano-card strong { display: block; color: var(--ceara-blue); font-size: 21px; margin: 8px 0; }
  .ano-card span { display: block; color: var(--muted); }
  .form-grid {
    display: grid;
    grid-template-columns: 1.3fr .7fr;
    gap: 16px;
  }
  label.form-label { display: block; color: var(--muted); font-size: 13px; font-weight: 800; margin: 0 0 7px; }
  input[type=text] {
    width: 100%;
    border: 1px solid var(--line);
    padding: 12px 13px;
    min-height: 46px;
    color: var(--ink);
    background: #fff;
  }
  input[type=text]:focus {
    outline: 3px solid rgba(0,156,222,.18);
    border-color: var(--ceara-cyan);
  }
  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 18px; }
  .btn {
    border: 0;
    padding: 12px 16px;
    min-height: 44px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn.primary { background: var(--ceara-blue); color: #fff; }
  .btn.primary:hover { background: #041f48; }
  .btn.green { background: var(--ceara-green); color: #fff; }
  .btn.orange { background: var(--ceara-orange); color: #fff; }
  .btn.ghost { background: #fff; color: var(--ceara-blue); border: 1px solid var(--line); }
  .exam-layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 18px;
    align-items: start;
  }
  .sidebar {
    position: sticky;
    top: 14px;
    background: #fff;
    border: 1px solid var(--line);
    box-shadow: 0 8px 24px rgba(15,23,42,.05);
    padding: 16px;
  }
  .progress-label { display: flex; justify-content: space-between; color: var(--muted); font-size: 13px; margin-bottom: 8px; }
  .progress {
    height: 10px;
    background: #e2e8f0;
    overflow: hidden;
  }
  .progress > div { height: 100%; width: 0%; background: linear-gradient(90deg, var(--ceara-green), var(--ceara-cyan)); }
  .mini-map {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    margin-top: 14px;
  }
  .nav-dot {
    min-width: 0;
    height: 34px;
    border: 1px solid var(--line);
    background: #fff;
    color: var(--muted);
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
  }
  .nav-dot.atual { border-color: var(--ceara-blue); color: var(--ceara-blue); box-shadow: inset 0 0 0 2px var(--ceara-blue); }
  .nav-dot.respondida { background: var(--soft-green); color: var(--ceara-green); border-color: #bfe5ca; }
  .question-card {
    background: #fff;
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    padding: 24px;
  }
  .descriptor-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-bottom: 16px;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 800;
  }
  .pill.blue { background: var(--soft-blue); color: var(--ceara-blue); }
  .pill.green { background: var(--soft-green); color: var(--ceara-green); }
  .pill.orange { background: var(--soft-orange); color: var(--amber); }
  .question-title { margin: 0 0 16px; color: var(--ink); font-size: 20px; }
  .question-text { font-size: 17px; margin-bottom: 16px; white-space: pre-wrap; }
  .question-text pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 14px;
    overflow-x: auto;
    border-left: 5px solid var(--ceara-cyan);
  }
  .option {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 12px;
    align-items: start;
    border: 1px solid var(--line);
    padding: 13px;
    margin-bottom: 10px;
    cursor: pointer;
    background: #fff;
  }
  .option:hover { border-color: var(--ceara-cyan); background: #f8fcff; }
  .option input { position: absolute; opacity: 0; pointer-events: none; }
  .letter {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #edf2f7;
    color: var(--ceara-blue);
    font-weight: 900;
  }
  .option.selected {
    border-color: var(--ceara-green);
    background: #f1fbf5;
    box-shadow: inset 0 0 0 2px rgba(0,132,61,.22);
  }
  .option.selected .letter { background: var(--ceara-green); color: #fff; }
  .results-grid {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    gap: 18px;
  }
  .score-card {
    background: linear-gradient(160deg, var(--ceara-blue), #073c7c);
    color: #fff;
    padding: 24px;
  }
  .score-card .big { font-size: 58px; font-weight: 900; line-height: 1; }
  .score-card .scale { margin-top: 12px; font-size: 14px; opacity: .9; }
  .level {
    display: inline-flex;
    margin-top: 16px;
    background: #fff;
    color: var(--ceara-blue);
    padding: 8px 12px;
    font-weight: 900;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  th, td {
    text-align: left;
    padding: 12px 10px;
    border-bottom: 1px solid var(--line);
    vertical-align: top;
  }
  th {
    color: var(--muted);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .04em;
  }
  .status {
    display: inline-flex;
    padding: 5px 9px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    white-space: nowrap;
  }
  .status.ok { background: var(--soft-green); color: var(--ceara-green); }
  .status.mid { background: var(--soft-orange); color: var(--amber); }
  .status.low { background: var(--soft-red); color: var(--red); }
  .intervention {
    border-left: 5px solid var(--ceara-orange);
    background: #fff8f3;
    padding: 14px 16px;
    margin-top: 12px;
  }
  .print-only { display: none; }
  footer {
    text-align: center;
    color: var(--muted);
    font-size: 12px;
    padding: 22px;
  }
  .modal {
    position: fixed;
    inset: 0;
    background: rgba(6, 43, 95, .55);
    z-index: 50;
    display: grid;
    place-items: center;
    padding: 20px;
  }
  .modal-box {
    background: #fff;
    border: 1px solid var(--line);
    max-width: 460px;
    padding: 22px;
    box-shadow: 0 24px 80px rgba(0,0,0,.24);
  }
  .modal-box p { margin: 0 0 16px; }
  .hidden { display: none !important; }
  @media (max-width: 860px) {
    .hero-inner, .exam-layout, .results-grid, .form-grid { grid-template-columns: 1fr; }
    .choice-grid, .stepper { grid-template-columns: 1fr; }
    .step { border-right: 0; border-bottom: 1px solid var(--line); }
    .sidebar { position: static; }
  }
  @media print {
    body { background: #fff; }
    .gov-strip, .hero, .stepper, .btn-row, .sidebar, footer { display: none !important; }
    .shell { max-width: none; padding: 0; }
    .panel, .question-card, .score-card { box-shadow: none; border: 1px solid #ddd; }
    .print-only { display: block; }
  }
</style>
</head>
<body>
<div class="gov-strip">Governo do Estado do Ceará · Secretaria da Educação · Educação Profissional · SIDEP-CE</div>
<section class="hero">
  <div class="hero-inner">
    <div>
      <div class="brand-lockup">
        <div class="crest">CE</div>
        <div class="brand-text">
          <strong>CEARÁ</strong>
          <span>Governo do Estado · Secretaria da Educação</span>
        </div>
      </div>
      <div class="eyebrow">Colóquio Temático 5 · Inovação pedagógica para o mundo digital</div>
      <h1>SIDEP-CE: Avaliação Diagnóstica da Educação Profissional</h1>
      <p class="hero-subtitle">Instrumento pedagógico para diagnosticar competências técnicas, orientar recomposição e produzir base pré-TRI para calibração futura.</p>
    </div>
    <aside class="hero-panel">
      <h2>Ciclo do método</h2>
      <div class="metric-grid">
        <div class="metric"><span>Entrada</span><strong>Diagnóstico</strong></div>
        <div class="metric"><span>Percurso</span><strong>Intervenção</strong></div>
        <div class="metric"><span>Saída</span><strong>Evidência</strong></div>
      </div>
    </aside>
  </div>
</section>

<main class="shell">
  <nav class="stepper" id="stepper"></nav>
  <div id="app"></div>
</main>
<div id="modal-root"></div>
<footer>SIDEP-CE · Uso pedagógico interno · Resultados diagnósticos sem composição automática de nota bimestral</footer>

<script>
__BANCO__

var estado = {
  etapa: "inicio",
  ano: null,
  nome: "",
  turma: "",
  itemAtual: 0,
  respostas: {},
  iniciadoEm: null,
  finalizadoEm: null
};

var app = document.getElementById("app");
var modalRoot = document.getElementById("modal-root");
var steps = [
  ["1", "Preparação", "curso, turma e finalidade"],
  ["2", "Aplicação", "itens por descritor"],
  ["3", "Diagnóstico", "proficiência pré-TRI"],
  ["4", "Intervenção", "trilhas de recomposição"]
];

function setEtapa(etapa) {
  estado.etapa = etapa;
  renderStepper();
}

function renderStepper() {
  var idx = { inicio: 0, identificacao: 0, quiz: 1, resultado: 2 }[estado.etapa] || 0;
  document.getElementById("stepper").innerHTML = steps.map(function(s, i) {
    return '<div class="step ' + (i === idx ? 'ativo' : '') + '"><b>' + s[0] + '</b><div><strong>' + s[1] + '</strong><span>' + s[2] + '</span></div></div>';
  }).join("");
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderEnunciado(texto) {
  var partes = String(texto).split(/(<pre>[\s\S]*?<\/pre>)/g);
  return partes.map(function(p) {
    if (p.indexOf("<pre>") === 0) {
      var codigo = p.replace(/<\/?pre>/g, "");
      return "<pre>" + escapeHtml(codigo) + "</pre>";
    }
    return escapeHtml(p).replace(/\n/g, "<br>");
  }).join("");
}

function totalItens(ano) {
  var banco = BANCO[ano || estado.ano];
  return banco.blocos.reduce(function(total, bloco) { return total + bloco.itens.length; }, 0);
}

function flattenItens() {
  var banco = BANCO[estado.ano];
  var lista = [];
  banco.blocos.forEach(function(bloco, bIdx) {
    bloco.itens.forEach(function(item, iIdx) {
      lista.push({ bloco: bloco, blocoIndex: bIdx, item: item, itemIndex: iIdx, chave: bIdx + "_" + iIdx });
    });
  });
  return lista;
}

function itemDificuldade(bIdx, iIdx) {
  return 0.65 + ((bIdx % 4) * 0.18) + ((iIdx % 5) * 0.07);
}

function pesoItem(bIdx, iIdx) {
  return 1 + itemDificuldade(bIdx, iIdx);
}

function nivelProficiência(escala) {
  if (escala >= 720) return { nivel: "Nível 5", nome: "Integrador", classe: "ok", texto: "Integra conhecimentos, propõe soluções e comunica decisões técnicas." };
  if (escala >= 620) return { nivel: "Nível 4", nome: "Autônomo", classe: "ok", texto: "Seleciona estratégias e executa procedimentos com segurança." };
  if (escala >= 500) return { nivel: "Nível 3", nome: "Intermediário", classe: "mid", texto: "Resolve problemas previsíveis e justifica procedimentos." };
  if (escala >= 380) return { nivel: "Nível 2", nome: "Básico operacional", classe: "mid", texto: "Executa tarefas simples em situações conhecidas." };
  return { nivel: "Nível 1", nome: "Inicial", classe: "low", texto: "Necessita recomposição de pré-requisitos e acompanhamento próximo." };
}

function classificarBloco(pct) {
  if (pct >= 70) return { classe: "ok", texto: "Consolidado" };
  if (pct >= 40) return { classe: "mid", texto: "Em desenvolvimento" };
  return { classe: "low", texto: "Prioridade" };
}

function mostrarAlerta(msg) {
  modalRoot.innerHTML = '<div class="modal"><div class="modal-box"><p>' + escapeHtml(msg) + '</p><div class="btn-row"><button class="btn primary" id="modal-ok">Entendi</button></div></div></div>';
  document.getElementById("modal-ok").onclick = function() { modalRoot.innerHTML = ""; };
}

function mostrarConfirmacao(msg, confirmar) {
  modalRoot.innerHTML = '<div class="modal"><div class="modal-box"><p>' + escapeHtml(msg) + '</p><div class="btn-row"><button class="btn ghost" id="modal-voltar">Voltar</button><button class="btn orange" id="modal-confirmar">Finalizar</button></div></div></div>';
  document.getElementById("modal-voltar").onclick = function() { modalRoot.innerHTML = ""; };
  document.getElementById("modal-confirmar").onclick = function() { modalRoot.innerHTML = ""; confirmar(); };
}

function renderInicio() {
  setEtapa("inicio");
  app.innerHTML = '<section class="panel">' +
    '<h2 class="panel-title">Avaliação diagnóstica online</h2>' +
    '<p class="lead">Escolha a turma para iniciar a aplicação. O instrumento foi desenhado para uso pedagógico: ele identifica descritores críticos e orienta trilhas de recomposição, sem substituir a decisão docente.</p>' +
    '<div class="notice"><strong>Nota metodológica:</strong> esta versão trabalha com análise diagnóstica e estimativa pré-TRI. A calibração TRI depende de volume amostral, itens-âncora e aplicações futuras.</div>' +
    '<div class="choice-grid">' +
      Object.keys(BANCO).map(function(ano) {
        var b = BANCO[ano];
        return '<button class="ano-card" data-ano="' + ano + '"><small>Curso Técnico em Informática</small><strong>' + escapeHtml(b.label) + '</strong><span>' + totalItens(ano) + ' itens · relatório por bloco · trilha de intervenção</span></button>';
      }).join("") +
    '</div></section>';
  app.querySelectorAll(".ano-card").forEach(function(btn) {
    btn.addEventListener("click", function() {
      estado.ano = btn.dataset.ano;
      estado.turma = BANCO[estado.ano].turmaPadrao || "";
      renderIdentificacao();
    });
  });
}

function renderIdentificacao() {
  setEtapa("identificacao");
  var banco = BANCO[estado.ano];
  app.innerHTML = '<section class="panel">' +
    '<h2 class="panel-title">Identificação da aplicação</h2>' +
    '<p class="lead">' + escapeHtml(banco.label) + '</p>' +
    '<div class="form-grid">' +
      '<div><label class="form-label" for="nome">Nome do(a) estudante</label><input id="nome" type="text" autocomplete="name" placeholder="Digite o nome completo"></div>' +
      '<div><label class="form-label" for="turma">Turma</label><input id="turma" type="text" value="' + escapeHtml(estado.turma) + '"></div>' +
    '</div>' +
    '<div class="notice"><strong>Finalidade:</strong> diagnosticar competências técnicas por descritor, apoiar planejamento docente e produzir evidências para recomposição das aprendizagens.</div>' +
    '<div class="btn-row"><button class="btn ghost" id="voltar">Voltar</button><button class="btn green" id="iniciar">Iniciar avaliação</button></div>' +
  '</section>';
  document.getElementById("voltar").onclick = renderInicio;
  document.getElementById("iniciar").onclick = function() {
    var nome = document.getElementById("nome").value.trim();
    var turma = document.getElementById("turma").value.trim();
    if (!nome) return mostrarAlerta("Informe o nome do(a) estudante antes de iniciar.");
    estado.nome = nome;
    estado.turma = turma || banco.turmaPadrao || "";
    estado.itemAtual = 0;
    estado.respostas = {};
    estado.iniciadoEm = new Date().toISOString();
    renderQuiz();
  };
}

function renderQuiz() {
  setEtapa("quiz");
  var itens = flattenItens();
  var atual = itens[estado.itemAtual];
  var respondidas = Object.keys(estado.respostas).length;
  var pct = Math.round((respondidas / itens.length) * 100);
  var letras = ["A", "B", "C", "D", "E"];
  app.innerHTML = '<div class="exam-layout">' +
    '<aside class="sidebar">' +
      '<div class="progress-label"><span>Progresso</span><strong>' + respondidas + '/' + itens.length + '</strong></div>' +
      '<div class="progress"><div style="width:' + pct + '%"></div></div>' +
      '<div class="mini-map">' + itens.map(function(it, idx) {
        var cls = idx === estado.itemAtual ? "atual" : (estado.respostas[it.chave] !== undefined ? "respondida" : "");
        return '<button class="nav-dot ' + cls + '" data-index="' + idx + '">' + (idx + 1) + '</button>';
      }).join("") + '</div>' +
      '<div class="notice"><strong>Pré-TRI:</strong> cada item recebe peso diagnóstico por dificuldade estimada. A escala exibida é preliminar, não calibrada.</div>' +
    '</aside>' +
    '<section class="question-card">' +
      '<div class="descriptor-row">' +
        '<span class="pill blue">Item ' + (estado.itemAtual + 1) + ' de ' + itens.length + '</span>' +
        '<span class="pill green">' + escapeHtml(atual.bloco.nome.replace(/^Bloco [A-Z] — /, "")) + '</span>' +
        '<span class="pill orange">Peso pré-TRI ' + pesoItem(atual.blocoIndex, atual.itemIndex).toFixed(2) + '</span>' +
      '</div>' +
      '<h2 class="question-title">Descritor em avaliação</h2>' +
      '<div class="question-text">' + renderEnunciado(atual.item.q) + '</div>' +
      '<div class="options">' + atual.item.op.map(function(op, idx) {
        var selected = estado.respostas[atual.chave] === idx;
        return '<label class="option ' + (selected ? 'selected' : '') + '">' +
          '<input type="radio" name="resposta" value="' + idx + '" ' + (selected ? 'checked' : '') + '>' +
          '<span class="letter">' + letras[idx] + '</span><span>' + escapeHtml(op) + '</span>' +
        '</label>';
      }).join("") + '</div>' +
      '<div class="btn-row">' +
        '<button class="btn ghost" id="anterior">← Anterior</button>' +
        '<button class="btn primary" id="proximo">Próximo →</button>' +
        '<button class="btn orange" id="finalizar">Finalizar diagnóstico</button>' +
      '</div>' +
    '</section></div>';

  app.querySelectorAll(".nav-dot").forEach(function(btn) {
    btn.onclick = function() { estado.itemAtual = Number(btn.dataset.index); renderQuiz(); };
  });
  app.querySelectorAll("input[name=resposta]").forEach(function(radio) {
    radio.onchange = function() {
      estado.respostas[atual.chave] = Number(radio.value);
      if (estado.itemAtual < itens.length - 1) estado.itemAtual += 1;
      renderQuiz();
    };
  });
  document.getElementById("anterior").onclick = function() {
    estado.itemAtual = Math.max(0, estado.itemAtual - 1);
    renderQuiz();
  };
  document.getElementById("proximo").onclick = function() {
    estado.itemAtual = Math.min(itens.length - 1, estado.itemAtual + 1);
    renderQuiz();
  };
  document.getElementById("finalizar").onclick = function() {
    var faltam = itens.length - Object.keys(estado.respostas).length;
    if (faltam > 0) return mostrarConfirmacao(faltam + " item(ns) ainda não foram respondidos. Deseja finalizar mesmo assim?", renderResultados);
    renderResultados();
  };
}

function calcularResultados() {
  var banco = BANCO[estado.ano];
  var totalAcertos = 0;
  var total = 0;
  var pesoAcertos = 0;
  var pesoTotal = 0;
  var blocos = [];
  banco.blocos.forEach(function(bloco, bIdx) {
    var acertos = 0;
    var pesoBloco = 0;
    var pesoOk = 0;
    bloco.itens.forEach(function(item, iIdx) {
      var chave = bIdx + "_" + iIdx;
      var peso = pesoItem(bIdx, iIdx);
      pesoBloco += peso;
      pesoTotal += peso;
      total += 1;
      if (estado.respostas[chave] === item.r) {
        acertos += 1;
        totalAcertos += 1;
        pesoOk += peso;
        pesoAcertos += peso;
      }
    });
    var pct = Math.round((acertos / bloco.itens.length) * 100);
    var prof = Math.round(200 + 600 * (pesoOk / pesoBloco));
    blocos.push({ nome: bloco.nome, acertos: acertos, total: bloco.itens.length, pct: pct, prof: prof, status: classificarBloco(pct) });
  });
  var pctGeral = Math.round((totalAcertos / total) * 100);
  var escala = Math.round(200 + 600 * (pesoAcertos / pesoTotal));
  return { totalAcertos: totalAcertos, total: total, pctGeral: pctGeral, escala: escala, nivel: nivelProficiência(escala), blocos: blocos };
}

function recomendacao(bloco) {
  if (bloco.pct >= 70) return "Manter aprofundamento com projeto prático e item-âncora de acompanhamento.";
  if (bloco.pct >= 40) return "Revisar conceitos-chave, propor prática guiada e reaplicar itens equivalentes.";
  return "Prioridade de recomposição: retomar pré-requisitos, formar grupo de apoio e aplicar trilha curta por descritor.";
}

function renderResultados() {
  setEtapa("resultado");
  estado.finalizadoEm = new Date().toISOString();
  var banco = BANCO[estado.ano];
  var r = calcularResultados();
  var linhas = r.blocos.map(function(b) {
    return '<tr><td>' + escapeHtml(b.nome) + '</td><td>' + b.acertos + '/' + b.total + '</td><td>' + b.pct + '%</td><td>' + b.prof + '</td><td><span class="status ' + b.status.classe + '">' + b.status.texto + '</span></td></tr>';
  }).join("");
  var intervencoes = r.blocos.map(function(b) {
    return '<div class="intervention"><strong>' + escapeHtml(b.nome) + '</strong><br>' + recomendacao(b) + '</div>';
  }).join("");
  app.innerHTML = '<section class="panel print-only"><h1>Relatório diagnóstico SIDEP-CE</h1></section>' +
    '<section class="panel">' +
      '<h2 class="panel-title">Boletim diagnóstico por competências</h2>' +
      '<p class="lead">Estudante: <strong>' + escapeHtml(estado.nome) + '</strong> · Turma: <strong>' + escapeHtml(estado.turma) + '</strong> · ' + escapeHtml(banco.label) + '</p>' +
      '<div class="results-grid">' +
        '<div class="score-card"><div class="big">' + r.escala + '</div><div>escala diagnóstica pré-TRI</div><div class="scale">' + r.totalAcertos + ' de ' + r.total + ' itens · ' + r.pctGeral + '% de acerto bruto</div><div class="level">' + r.nivel.nivel + ' · ' + r.nivel.nome + '</div></div>' +
        '<div><div class="notice"><strong>Interpretação:</strong> ' + r.nivel.texto + ' A escala é uma estimativa diagnóstica ponderada, ainda sem calibração TRI oficial.</div><table><thead><tr><th>Bloco / descritor</th><th>Acertos</th><th>%</th><th>Escala</th><th>Situação</th></tr></thead><tbody>' + linhas + '</tbody></table></div>' +
      '</div>' +
    '</section>' +
    '<section class="panel"><h2 class="panel-title">Plano de intervenção pedagógica</h2><p class="lead">Recomendações automáticas para orientar o professor. Devem ser revisadas pela equipe docente antes da aplicação.</p>' + intervencoes +
      '<div class="btn-row"><button class="btn primary" id="imprimir">Imprimir relatório</button><button class="btn green" id="baixar">Baixar dados JSON</button><button class="btn ghost" id="nova">Nova aplicação</button></div>' +
    '</section>';
  document.getElementById("imprimir").onclick = function() { window.print(); };
  document.getElementById("baixar").onclick = baixarRelatorio;
  document.getElementById("nova").onclick = function() {
    estado = { etapa: "inicio", ano: null, nome: "", turma: "", itemAtual: 0, respostas: {}, iniciadoEm: null, finalizadoEm: null };
    renderInicio();
  };
}

function baixarRelatorio() {
  var resultado = calcularResultados();
  var dados = {
    sistema: "SIDEP-CE",
    finalidade: "Avaliação diagnóstica pré-TRI",
    estudante: estado.nome,
    turma: estado.turma,
    curso: BANCO[estado.ano].label,
    iniciadoEm: estado.iniciadoEm,
    finalizadoEm: estado.finalizadoEm,
    resultado: resultado
  };
  var blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "relatorio-sidep-ce-" + estado.turma.replace(/\W+/g, "-").toLowerCase() + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

renderInicio();
</script>
</body>
</html>
'''

html = html.replace("__BANCO__", banco)
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html, encoding="utf-8")
print(OUT)
