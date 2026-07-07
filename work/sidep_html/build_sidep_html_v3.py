from pathlib import Path

SRC = Path(r"C:\Users\yolep\OneDrive\Desktop\DOCENTES 2026\SIDEP-CE_Avaliacao_Diagnostica_Online.backup.html")
OUT = Path(r"C:\Users\yolep\OneDrive\Documentos\Método TRI e IA\outputs\SIDEP-CE_Avaliacao_Diagnostica_Online_v3.html")

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
    --blue: #062b5f;
    --blue2: #0b4f93;
    --green: #00843d;
    --green2: #3fae2a;
    --orange: #f26a21;
    --cyan: #009cde;
    --ink: #132033;
    --muted: #607083;
    --line: #d8e0e7;
    --bg: #f4f7f9;
    --panel: #fff;
    --soft-blue: #eaf3ff;
    --soft-green: #eaf8ef;
    --soft-orange: #fff1e8;
    --soft-red: #fff0f0;
    --red: #b42318;
    --amber: #a15c00;
    --shadow: 0 18px 45px rgba(6, 43, 95, .10);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    background:
      radial-gradient(circle at top left, rgba(0,132,61,.10), transparent 32rem),
      radial-gradient(circle at bottom right, rgba(242,106,33,.14), transparent 34rem),
      var(--bg);
    color: var(--ink);
    line-height: 1.5;
  }
  button, input, select, textarea { font: inherit; }
  .gov-strip {
    background: linear-gradient(90deg, var(--blue), #073b78 48%, var(--green));
    color: #fff;
    min-height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 18px;
    text-align: center;
    font-size: 12px;
    letter-spacing: .2px;
  }
  .hero {
    background: linear-gradient(135deg, #fff 0%, #f8fbfd 55%, #edf7f0 100%);
    border-bottom: 1px solid var(--line);
    position: relative;
    overflow: hidden;
  }
  .hero:after {
    content: "";
    position: absolute;
    right: -120px;
    top: -160px;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: conic-gradient(from 180deg, var(--blue), var(--green), var(--orange), var(--blue));
    opacity: .15;
  }
  .hero-inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 24px 22px 28px;
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0,1fr) 320px;
    gap: 24px;
    align-items: center;
  }
  .brand-lockup { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .crest {
    width: 58px;
    height: 58px;
    border-radius: 18px 18px 22px 22px;
    background: linear-gradient(145deg, var(--green), #0a7040);
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 900;
    box-shadow: inset 0 0 0 3px rgba(255,255,255,.35);
  }
  .brand-text strong { display: block; color: var(--blue); font-size: 24px; letter-spacing: .02em; }
  .brand-text span { display: block; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
  h1 { margin: 0; color: var(--blue); font-size: clamp(30px, 4vw, 50px); line-height: 1.04; letter-spacing: 0; }
  .hero-subtitle { max-width: 780px; margin: 14px 0 0; color: #334155; font-size: 17px; }
  .hero-panel { background: rgba(255,255,255,.86); border: 1px solid var(--line); box-shadow: var(--shadow); padding: 18px; }
  .hero-panel h2 { margin: 0 0 10px; color: var(--blue); font-size: 19px; }
  .metric { display: flex; justify-content: space-between; gap: 10px; border: 1px solid var(--line); background: #fff; padding: 10px 12px; margin-top: 8px; }
  .metric span { color: var(--muted); font-size: 13px; }
  .metric strong { color: var(--blue); }
  .shell { max-width: 1180px; margin: 0 auto; padding: 22px; }
  .panel { background: var(--panel); border: 1px solid var(--line); box-shadow: var(--shadow); padding: 24px; margin-bottom: 18px; }
  .panel-title { margin: 0 0 8px; color: var(--blue); font-size: 24px; line-height: 1.16; }
  .lead { margin: 0 0 18px; color: var(--muted); max-width: 880px; }
  .notice { border-left: 5px solid var(--blue2); background: var(--soft-blue); padding: 13px 15px; color: #16324f; margin: 14px 0; }
  .notice strong { color: var(--blue); }
  .role-grid, .choice-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
  .role-card, .ano-card {
    border: 2px solid var(--line);
    background: #fff;
    text-align: left;
    padding: 18px;
    cursor: pointer;
    min-height: 150px;
    transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
  }
  .role-card:hover, .ano-card:hover { transform: translateY(-2px); border-color: var(--green); box-shadow: 0 12px 26px rgba(0,132,61,.12); }
  .role-card small, .ano-card small { display: block; color: var(--green); font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
  .role-card strong, .ano-card strong { display: block; color: var(--blue); font-size: 22px; margin: 8px 0; }
  .role-card span, .ano-card span { display: block; color: var(--muted); }
  .toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .tab { border: 1px solid var(--line); background: #fff; color: var(--blue); padding: 10px 14px; font-weight: 800; cursor: pointer; }
  .tab.active { background: var(--blue); color: #fff; border-color: var(--blue); }
  .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
  .form-grid.three { grid-template-columns: 1.2fr .8fr .8fr; }
  label.form-label { display: block; color: var(--muted); font-size: 13px; font-weight: 800; margin: 0 0 6px; }
  input[type=text], input[type=number], select, textarea {
    width: 100%;
    border: 1px solid var(--line);
    padding: 11px 12px;
    min-height: 44px;
    color: var(--ink);
    background: #fff;
  }
  textarea { min-height: 84px; resize: vertical; }
  input:focus, select:focus, textarea:focus { outline: 3px solid rgba(0,156,222,.18); border-color: var(--cyan); }
  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 16px; }
  .btn { border: 0; padding: 11px 15px; min-height: 42px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
  .btn.primary { background: var(--blue); color: #fff; }
  .btn.green { background: var(--green); color: #fff; }
  .btn.orange { background: var(--orange); color: #fff; }
  .btn.ghost { background: #fff; color: var(--blue); border: 1px solid var(--line); }
  .btn.danger { background: var(--red); color: #fff; }
  .exam-layout { display: grid; grid-template-columns: 280px minmax(0,1fr); gap: 18px; align-items: start; }
  .sidebar { position: sticky; top: 14px; background: #fff; border: 1px solid var(--line); box-shadow: 0 8px 24px rgba(15,23,42,.05); padding: 16px; }
  .progress-label { display: flex; justify-content: space-between; color: var(--muted); font-size: 13px; margin-bottom: 8px; }
  .progress { height: 10px; background: #e2e8f0; overflow: hidden; }
  .progress > div { height: 100%; width: 0%; background: linear-gradient(90deg, var(--green), var(--cyan)); }
  .mini-map { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-top: 14px; }
  .nav-dot { height: 34px; border: 1px solid var(--line); background: #fff; color: var(--muted); cursor: pointer; font-size: 12px; font-weight: 800; }
  .nav-dot.atual { border-color: var(--blue); color: var(--blue); box-shadow: inset 0 0 0 2px var(--blue); }
  .nav-dot.respondida { background: var(--soft-green); color: var(--green); border-color: #bfe5ca; }
  .question-card { background: #fff; border: 1px solid var(--line); box-shadow: var(--shadow); padding: 24px; }
  .pill { display: inline-flex; align-items: center; border-radius: 999px; padding: 6px 10px; font-size: 12px; font-weight: 800; background: var(--soft-blue); color: var(--blue); margin: 0 6px 10px 0; }
  .pill.green { background: var(--soft-green); color: var(--green); }
  .pill.orange { background: var(--soft-orange); color: var(--amber); }
  .question-text { font-size: 17px; margin-bottom: 16px; white-space: pre-wrap; }
  .question-text pre { background: #0f172a; color: #e2e8f0; padding: 14px; overflow-x: auto; border-left: 5px solid var(--cyan); }
  .option { display: grid; grid-template-columns: 42px minmax(0,1fr); gap: 12px; align-items: start; border: 1px solid var(--line); padding: 13px; margin-bottom: 10px; cursor: pointer; background: #fff; }
  .option:hover { border-color: var(--cyan); background: #f8fcff; }
  .option input { position: absolute; opacity: 0; pointer-events: none; }
  .letter { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: #edf2f7; color: var(--blue); font-weight: 900; }
  .option.selected { border-color: var(--green); background: #f1fbf5; box-shadow: inset 0 0 0 2px rgba(0,132,61,.22); }
  .option.selected .letter { background: var(--green); color: #fff; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 11px 9px; border-bottom: 1px solid var(--line); vertical-align: top; }
  th { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  .status { display: inline-flex; padding: 5px 9px; border-radius: 999px; font-size: 12px; font-weight: 900; white-space: nowrap; }
  .status.ok { background: var(--soft-green); color: var(--green); }
  .status.mid { background: var(--soft-orange); color: var(--amber); }
  .status.low { background: var(--soft-red); color: var(--red); }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; margin: 16px 0; }
  .kpi { border: 1px solid var(--line); background: #fff; padding: 14px; }
  .kpi span { display: block; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  .kpi strong { display: block; color: var(--blue); font-size: 28px; }
  .check-list { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px 14px; margin: 10px 0; }
  .check-item { display: flex; gap: 8px; align-items: start; border: 1px solid var(--line); padding: 9px; }
  .check-item input { margin-top: 4px; }
  .modal { position: fixed; inset: 0; background: rgba(6,43,95,.55); z-index: 50; display: grid; place-items: center; padding: 20px; }
  .modal-box { background: #fff; border: 1px solid var(--line); max-width: 480px; padding: 22px; box-shadow: 0 24px 80px rgba(0,0,0,.24); }
  .hidden { display: none !important; }
  footer { text-align: center; color: var(--muted); font-size: 12px; padding: 22px; }
  @media (max-width: 900px) {
    .hero-inner, .exam-layout, .form-grid, .form-grid.three, .role-grid, .choice-grid, .kpi-grid, .check-list { grid-template-columns: 1fr; }
    .sidebar { position: static; }
  }
  @media print {
    .gov-strip, .hero, .toolbar, .btn-row, footer { display: none !important; }
    body { background: #fff; }
    .shell { max-width: none; padding: 0; }
    .panel { box-shadow: none; }
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
        <div class="brand-text"><strong>CEARÁ</strong><span>Governo do Estado · Secretaria da Educação</span></div>
      </div>
      <h1>SIDEP-CE: Sistema de Diagnóstico da Educação Profissional</h1>
      <p class="hero-subtitle">Ambiente local para criar avaliações diagnósticas, aplicar aos estudantes e gerar relatórios pedagógicos individuais e por turma.</p>
    </div>
    <aside class="hero-panel">
      <h2>Arquitetura pedagógica</h2>
      <div class="metric"><span>Professor</span><strong>cria e analisa</strong></div>
      <div class="metric"><span>Estudante</span><strong>responde</strong></div>
      <div class="metric"><span>Banco</span><strong>cresce por descritor</strong></div>
    </aside>
  </div>
</section>
<main class="shell"><div id="app"></div></main>
<div id="modal-root"></div>
<footer>SIDEP-CE · Protótipo pedagógico local · Dados gravados no navegador deste computador</footer>

<script>
__BANCO__

var STORAGE = {
  questoes: "sidep_ce_questoes_v1",
  avaliacoes: "sidep_ce_avaliacoes_v1",
  resultados: "sidep_ce_resultados_v1"
};

var app = document.getElementById("app");
var modalRoot = document.getElementById("modal-root");
var estadoAluno = { avaliacaoId: null, nome: "", turma: "", itemAtual: 0, respostas: {}, inicio: null };
var professorTab = "painel";

function uid(prefix) {
  return prefix + "_" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}
function getJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e) { return fallback; }
}
function setJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function escapeHtml(s) { return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function renderEnunciado(texto) {
  var partes = String(texto).split(/(<pre>[\s\S]*?<\/pre>)/g);
  return partes.map(function(p) {
    if (p.indexOf("<pre>") === 0) return "<pre>" + escapeHtml(p.replace(/<\/?pre>/g, "")) + "</pre>";
    return escapeHtml(p).replace(/\n/g, "<br>");
  }).join("");
}
function mostrar(msg) {
  modalRoot.innerHTML = '<div class="modal"><div class="modal-box"><p>' + escapeHtml(msg) + '</p><div class="btn-row"><button class="btn primary" id="ok">Entendi</button></div></div></div>';
  document.getElementById("ok").onclick = function(){ modalRoot.innerHTML = ""; };
}
function confirmar(msg, cb) {
  modalRoot.innerHTML = '<div class="modal"><div class="modal-box"><p>' + escapeHtml(msg) + '</p><div class="btn-row"><button class="btn ghost" id="no">Cancelar</button><button class="btn orange" id="yes">Confirmar</button></div></div></div>';
  document.getElementById("no").onclick = function(){ modalRoot.innerHTML = ""; };
  document.getElementById("yes").onclick = function(){ modalRoot.innerHTML = ""; cb(); };
}

function normalizarBancoInicial() {
  var existentes = getJson(STORAGE.questoes, null);
  if (existentes && existentes.length) return existentes;
  var questoes = [];
  Object.keys(BANCO).forEach(function(ano) {
    BANCO[ano].blocos.forEach(function(bloco, bIdx) {
      bloco.itens.forEach(function(item, iIdx) {
        questoes.push({
          id: uid("q"),
          origem: ano,
          disciplina: bloco.nome.replace(/^Bloco [A-Z] — /, ""),
          descritor: bloco.nome.replace(/^Bloco [A-Z] — /, ""),
          matriz: "Curso Técnico em Informática",
          dificuldade: +(1 + (bIdx % 4) * .25 + (iIdx % 5) * .08).toFixed(2),
          enunciado: item.q,
          opcoes: item.op,
          correta: item.r,
          ativa: true
        });
      });
    });
  });
  setJson(STORAGE.questoes, questoes);
  return questoes;
}
function questoes() { return normalizarBancoInicial(); }
function avaliacoes() { return getJson(STORAGE.avaliacoes, []); }
function resultados() { return getJson(STORAGE.resultados, []); }
function salvarQuestoes(q) { setJson(STORAGE.questoes, q); }
function salvarAvaliacoes(a) { setJson(STORAGE.avaliacoes, a); }
function salvarResultados(r) { setJson(STORAGE.resultados, r); }

function disciplinasDisponiveis() {
  var map = {};
  questoes().forEach(function(q){ if(q.ativa) map[q.disciplina] = true; });
  return Object.keys(map).sort();
}
function byId(list, id) { return list.find(function(x){ return x.id === id; }); }
function classificarPct(pct) {
  if (pct >= 70) return { classe: "ok", texto: "Consolidado" };
  if (pct >= 40) return { classe: "mid", texto: "Em desenvolvimento" };
  return { classe: "low", texto: "Prioridade" };
}
function nivelEscala(escala) {
  if (escala >= 720) return "Nível 5 · Integrador";
  if (escala >= 620) return "Nível 4 · Autônomo";
  if (escala >= 500) return "Nível 3 · Intermediário";
  if (escala >= 380) return "Nível 2 · Básico operacional";
  return "Nível 1 · Inicial";
}

function renderHome() {
  app.innerHTML = '<section class="panel"><h2 class="panel-title">Escolha a área de acesso</h2><p class="lead">A visão do estudante mostra apenas a aplicação. Diagnóstico, pesos, relatórios e intervenções ficam na área do professor.</p>' +
    '<div class="role-grid">' +
      '<button class="role-card" id="area-aluno"><small>Área do estudante</small><strong>Responder avaliação</strong><span>Entrar com nome, turma e avaliação liberada pelo professor.</span></button>' +
      '<button class="role-card" id="area-professor"><small>Área do professor</small><strong>Criar, ampliar e analisar</strong><span>Banco de questões, avaliações de 20 a 40 itens e relatórios.</span></button>' +
    '</div></section>';
  document.getElementById("area-aluno").onclick = renderAlunoEntrada;
  document.getElementById("area-professor").onclick = renderProfessor;
}

function renderAlunoEntrada() {
  app.innerHTML = '<section class="panel"><h2 class="panel-title">Área do estudante</h2><p class="lead">Digite o código informado pelo professor para acessar a avaliação da sua turma.</p>' +
    '<div class="form-grid"><div><label class="form-label">Código da turma/avaliação</label><input id="aluno-codigo" type="text" placeholder="Ex.: TECINF-2026" autocapitalize="characters"></div><div><label class="form-label">Nome completo</label><input id="aluno-nome" type="text" autocomplete="name" placeholder="Digite seu nome completo"></div></div>' +
    '<div class="notice"><strong>Uso pedagógico:</strong> o estudante responde a avaliação. Diagnóstico, relatórios, pesos e intervenções ficam disponíveis apenas para o professor.</div>' +
    '<div class="btn-row"><button class="btn ghost" id="voltar">Voltar</button><button class="btn green" id="iniciar">Acessar avaliação</button></div></section>';
  document.getElementById("voltar").onclick = renderHome;
  document.getElementById("iniciar").onclick = function() {
    var codigo = document.getElementById("aluno-codigo").value.trim().toUpperCase();
    var nome = document.getElementById("aluno-nome").value.trim();
    var av = avaliacoes().find(function(a){ return String(a.codigo || "").toUpperCase() === codigo; });
    if (!codigo || !nome) return mostrar("Informe o código da avaliação e seu nome completo.");
    if (!av) return mostrar("Código não encontrado. Confira com o professor e tente novamente.");
    estadoAluno = { avaliacaoId: av.id, codigo: codigo, nome: nome, turma: av.turma, itemAtual: 0, respostas: {}, inicio: new Date().toISOString() };
    renderAvaliacaoAluno();
  };
}

function renderAvaliacaoAluno() {
  var av = byId(avaliacoes(), estadoAluno.avaliacaoId);
  var qs = questoes();
  var itens = av.itens.map(function(id){ return byId(qs, id); }).filter(Boolean);
  var atual = itens[estadoAluno.itemAtual];
  var respondidas = Object.keys(estadoAluno.respostas).length;
  var pct = Math.round(respondidas / itens.length * 100);
  var letras = ["A","B","C","D","E"];
  app.innerHTML = '<div class="exam-layout"><aside class="sidebar"><div class="progress-label"><span>Progresso</span><strong>' + respondidas + '/' + itens.length + '</strong></div><div class="progress"><div style="width:' + pct + '%"></div></div>' +
    '<div class="mini-map">' + itens.map(function(q, i){ var cls = i === estadoAluno.itemAtual ? "atual" : (estadoAluno.respostas[q.id] !== undefined ? "respondida" : ""); return '<button class="nav-dot ' + cls + '" data-i="' + i + '">' + (i+1) + '</button>'; }).join("") + '</div>' +
    '<div class="notice"><strong>Atenção:</strong> responda com calma. O resultado será analisado pelo professor.</div></aside>' +
    '<section class="question-card"><span class="pill">Questão ' + (estadoAluno.itemAtual+1) + ' de ' + itens.length + '</span><span class="pill green">' + escapeHtml(atual.disciplina) + '</span>' +
    '<div class="question-text">' + renderEnunciado(atual.enunciado) + '</div>' +
    atual.opcoes.map(function(op, i){ var sel = estadoAluno.respostas[atual.id] === i; return '<label class="option ' + (sel ? "selected" : "") + '"><input type="radio" name="r" value="' + i + '" ' + (sel ? "checked" : "") + '><span class="letter">' + letras[i] + '</span><span>' + escapeHtml(op) + '</span></label>'; }).join("") +
    '<div class="btn-row"><button class="btn ghost" id="ant">Anterior</button><button class="btn primary" id="prox">Próxima</button><button class="btn green" id="finalizar">Enviar avaliação</button></div></section></div>';
  app.querySelectorAll(".nav-dot").forEach(function(b){ b.onclick = function(){ estadoAluno.itemAtual = +b.dataset.i; renderAvaliacaoAluno(); }; });
  app.querySelectorAll("input[name=r]").forEach(function(r){ r.onchange = function(){ estadoAluno.respostas[atual.id] = +r.value; if (estadoAluno.itemAtual < itens.length - 1) estadoAluno.itemAtual++; renderAvaliacaoAluno(); }; });
  document.getElementById("ant").onclick = function(){ estadoAluno.itemAtual = Math.max(0, estadoAluno.itemAtual - 1); renderAvaliacaoAluno(); };
  document.getElementById("prox").onclick = function(){ estadoAluno.itemAtual = Math.min(itens.length - 1, estadoAluno.itemAtual + 1); renderAvaliacaoAluno(); };
  document.getElementById("finalizar").onclick = function(){
    var faltam = itens.length - Object.keys(estadoAluno.respostas).length;
    if (faltam) return confirmar("Ainda existem " + faltam + " questão(ões) sem resposta. Deseja enviar mesmo assim?", finalizarAluno);
    finalizarAluno();
  };
}

function finalizarAluno() {
  var av = byId(avaliacoes(), estadoAluno.avaliacaoId);
  var qs = questoes();
  var itens = av.itens.map(function(id){ return byId(qs, id); }).filter(Boolean);
  var acertos = 0, pesoOk = 0, pesoTotal = 0;
  var porDisc = {};
  itens.forEach(function(q) {
    var ok = estadoAluno.respostas[q.id] === q.correta;
    var peso = Number(q.dificuldade || 1);
    pesoTotal += peso;
    if (!porDisc[q.disciplina]) porDisc[q.disciplina] = { acertos: 0, total: 0, pesoOk: 0, pesoTotal: 0 };
    porDisc[q.disciplina].total++;
    porDisc[q.disciplina].pesoTotal += peso;
    if (ok) { acertos++; pesoOk += peso; porDisc[q.disciplina].acertos++; porDisc[q.disciplina].pesoOk += peso; }
  });
  var escala = Math.round(200 + 600 * (pesoOk / pesoTotal));
  var res = {
    id: uid("res"),
    avaliacaoId: av.id,
    avaliacaoTitulo: av.titulo,
    aluno: estadoAluno.nome,
    turma: estadoAluno.turma,
    inicio: estadoAluno.inicio,
    fim: new Date().toISOString(),
    respostas: estadoAluno.respostas,
    acertos: acertos,
    total: itens.length,
    percentual: Math.round(acertos / itens.length * 100),
    escalaPreTri: escala,
    nivel: nivelEscala(escala),
    porDisciplina: porDisc
  };
  var rs = resultados(); rs.push(res); salvarResultados(rs);
  app.innerHTML = '<section class="panel"><h2 class="panel-title">Avaliação enviada</h2><p class="lead">Obrigado, ' + escapeHtml(estadoAluno.nome) + '. Suas respostas foram registradas neste computador.</p><div class="notice"><strong>Próximo passo:</strong> o professor analisará o diagnóstico da turma e organizará as intervenções pedagógicas necessárias.</div><div class="btn-row"><button class="btn primary" id="home">Voltar ao início</button></div></section>';
  document.getElementById("home").onclick = renderHome;
}

function renderProfessor() {
  var tabs = [
    ["painel", "Painel"],
    ["criar", "Criar avaliação"],
    ["banco", "Banco de questões"],
    ["relatorios", "Relatórios"]
  ];
  app.innerHTML = '<section class="panel"><h2 class="panel-title">Área do professor</h2><p class="lead">Crie avaliações diagnósticas de 20 a 40 questões, alimente o banco por descritor e acompanhe relatórios individuais e por turma.</p>' +
    '<div class="toolbar">' + tabs.map(function(t){ return '<button class="tab ' + (professorTab === t[0] ? "active" : "") + '" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join("") + '<button class="tab" id="sair">Sair</button></div><div id="prof-content"></div></section>';
  app.querySelectorAll(".tab[data-tab]").forEach(function(b){ b.onclick = function(){ professorTab = b.dataset.tab; renderProfessor(); }; });
  document.getElementById("sair").onclick = renderHome;
  if (professorTab === "painel") renderPainel();
  if (professorTab === "criar") renderCriar();
  if (professorTab === "banco") renderBanco();
  if (professorTab === "relatorios") renderRelatorios();
}

function renderPainel() {
  var qs = questoes(), avs = avaliacoes(), rs = resultados();
  document.getElementById("prof-content").innerHTML = '<div class="kpi-grid"><div class="kpi"><span>Questões no banco</span><strong>' + qs.length + '</strong></div><div class="kpi"><span>Disciplinas</span><strong>' + disciplinasDisponiveis().length + '</strong></div><div class="kpi"><span>Avaliações</span><strong>' + avs.length + '</strong></div><div class="kpi"><span>Resultados</span><strong>' + rs.length + '</strong></div></div>' +
    '<div class="notice"><strong>Regra pedagógica:</strong> para cada avaliação, selecione uma ou mais disciplinas e gere de 20 a 40 questões. A área do estudante não exibe pesos, diagnóstico ou intervenção.</div>';
}

function renderCriar() {
  var disciplinas = disciplinasDisponiveis();
  var codigoSugerido = "TECINF-" + String(new Date().getFullYear()).slice(-2) + "-" + String(avaliacoes().length + 1).padStart(2, "0");
  document.getElementById("prof-content").innerHTML = '<div class="form-grid"><div><label class="form-label">Título da avaliação</label><input id="av-titulo" type="text" value="Diagnóstico Técnico em Informática"></div><div><label class="form-label">Código para os alunos</label><input id="av-codigo" type="text" value="' + codigoSugerido + '" autocapitalize="characters"></div><div><label class="form-label">Turma-alvo</label><input id="av-turma" type="text" value="2ª TEC. INF."></div><div><label class="form-label">Quantidade</label><input id="av-qtd" type="number" min="20" max="40" value="20"></div></div>' +
    '<label class="form-label" style="margin-top:14px">Disciplinas/descritores</label><div class="check-list">' + disciplinas.map(function(d){ return '<label class="check-item"><input type="checkbox" value="' + escapeHtml(d) + '"><span>' + escapeHtml(d) + '</span></label>'; }).join("") + '</div>' +
    '<div class="btn-row"><button class="btn green" id="gerar-av">Criar avaliação</button></div><div id="av-lista" style="margin-top:18px"></div>';
  document.getElementById("gerar-av").onclick = criarAvaliacao;
  renderListaAvaliacoes();
}

function criarAvaliacao() {
  var titulo = document.getElementById("av-titulo").value.trim();
  var turma = document.getElementById("av-turma").value.trim();
  var qtd = Number(document.getElementById("av-qtd").value);
  var codigo = document.getElementById("av-codigo").value.trim().toUpperCase();
  var selecionadas = Array.from(document.querySelectorAll(".check-item input:checked")).map(function(i){ return i.value; });
  if (!titulo || !turma) return mostrar("Informe título e turma-alvo.");
  if (!codigo) return mostrar("Informe um código para os alunos acessarem a avaliação.");
  if (avaliacoes().some(function(a){ return String(a.codigo || "").toUpperCase() === codigo; })) return mostrar("Esse código já está em uso. Escolha outro código.");
  if (qtd < 20 || qtd > 40) return mostrar("A avaliação deve conter no mínimo 20 e no máximo 40 questões.");
  if (!selecionadas.length) return mostrar("Selecione pelo menos uma disciplina/descritor.");
  var candidatas = questoes().filter(function(q){ return q.ativa && selecionadas.indexOf(q.disciplina) >= 0; });
  if (candidatas.length < qtd) return mostrar("O banco possui apenas " + candidatas.length + " questões para essa seleção. Cadastre mais itens ou reduza disciplinas.");
  candidatas = candidatas.slice().sort(function(a,b){ return (a.disciplina > b.disciplina ? 1 : -1) || (a.dificuldade - b.dificuldade); });
  var escolhidas = [];
  var i = 0;
  while (escolhidas.length < qtd) {
    var d = selecionadas[i % selecionadas.length];
    var item = candidatas.find(function(q){ return q.disciplina === d && escolhidas.indexOf(q.id) < 0; });
    if (!item) item = candidatas.find(function(q){ return escolhidas.indexOf(q.id) < 0; });
    if (!item) break;
    escolhidas.push(item.id);
    i++;
  }
  var avs = avaliacoes();
  avs.push({ id: uid("av"), codigo: codigo, titulo: titulo, turma: turma, disciplinas: selecionadas, itens: escolhidas, criadaEm: new Date().toISOString() });
  salvarAvaliacoes(avs);
  mostrar("Avaliação criada com " + escolhidas.length + " questões. Código para os alunos: " + codigo);
  renderCriar();
}

function renderListaAvaliacoes() {
  var avs = avaliacoes();
  var el = document.getElementById("av-lista");
  if (!el) return;
  el.innerHTML = '<h3>Avaliações criadas</h3>' + (avs.length ? '<table><thead><tr><th>Código</th><th>Título</th><th>Turma</th><th>Questões</th><th>Disciplinas</th><th>Ações</th></tr></thead><tbody>' + avs.map(function(a){
    return '<tr><td><strong>' + escapeHtml(a.codigo || "sem código") + '</strong></td><td>' + escapeHtml(a.titulo) + '</td><td>' + escapeHtml(a.turma) + '</td><td>' + a.itens.length + '</td><td>' + escapeHtml(a.disciplinas.join(", ")) + '</td><td><button class="btn danger" data-del="' + a.id + '">Excluir</button></td></tr>';
  }).join("") + '</tbody></table>' : '<p class="lead">Nenhuma avaliação criada.</p>');
  el.querySelectorAll("[data-del]").forEach(function(b){ b.onclick = function(){ confirmar("Excluir esta avaliação?", function(){ salvarAvaliacoes(avaliacoes().filter(function(a){ return a.id !== b.dataset.del; })); renderCriar(); }); }; });
}

function renderBanco() {
  var ds = disciplinasDisponiveis();
  document.getElementById("prof-content").innerHTML = '<div class="notice"><strong>Banco expansível:</strong> cada nova questão precisa estar ligada a disciplina, descritor, matriz e dificuldade inicial. Esses dados sustentam a fase pré-TRI e a futura calibração.</div>' +
    '<div class="form-grid"><div><label class="form-label">Disciplina</label><input id="q-disc" type="text" list="disciplinas"><datalist id="disciplinas">' + ds.map(function(d){ return '<option value="' + escapeHtml(d) + '">'; }).join("") + '</datalist></div><div><label class="form-label">Descritor</label><input id="q-desc" type="text" placeholder="Ex.: Resolver problema com estrutura condicional"></div></div>' +
    '<div class="form-grid"><div><label class="form-label">Matriz/curso</label><input id="q-matriz" type="text" value="Curso Técnico em Informática"></div><div><label class="form-label">Dificuldade inicial pré-TRI</label><input id="q-dif" type="number" min="0.5" max="3" step="0.1" value="1.2"></div></div>' +
    '<label class="form-label" style="margin-top:14px">Enunciado</label><textarea id="q-enun"></textarea>' +
    '<div class="form-grid"><div><label class="form-label">A</label><input id="op0" type="text"></div><div><label class="form-label">B</label><input id="op1" type="text"></div><div><label class="form-label">C</label><input id="op2" type="text"></div><div><label class="form-label">D</label><input id="op3" type="text"></div><div><label class="form-label">E</label><input id="op4" type="text"></div><div><label class="form-label">Gabarito</label><select id="q-certa"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option><option value="4">E</option></select></div></div>' +
    '<div class="btn-row"><button class="btn green" id="add-q">Adicionar questão</button></div><div id="banco-lista" style="margin-top:18px"></div>';
  document.getElementById("add-q").onclick = adicionarQuestao;
  renderListaBanco();
}

function adicionarQuestao() {
  var opcoes = [0,1,2,3,4].map(function(i){ return document.getElementById("op"+i).value.trim(); });
  var q = {
    id: uid("q"),
    origem: "professor",
    disciplina: document.getElementById("q-disc").value.trim(),
    descritor: document.getElementById("q-desc").value.trim(),
    matriz: document.getElementById("q-matriz").value.trim(),
    dificuldade: Number(document.getElementById("q-dif").value || 1),
    enunciado: document.getElementById("q-enun").value.trim(),
    opcoes: opcoes,
    correta: Number(document.getElementById("q-certa").value),
    ativa: true
  };
  if (!q.disciplina || !q.descritor || !q.enunciado || opcoes.some(function(x){ return !x; })) return mostrar("Preencha disciplina, descritor, enunciado e as cinco alternativas.");
  var qs = questoes(); qs.push(q); salvarQuestoes(qs);
  mostrar("Questão adicionada ao banco.");
  renderBanco();
}

function renderListaBanco() {
  var qs = questoes();
  var resumo = {};
  qs.forEach(function(q){ resumo[q.disciplina] = (resumo[q.disciplina] || 0) + 1; });
  document.getElementById("banco-lista").innerHTML = '<h3>Resumo do banco</h3><table><thead><tr><th>Disciplina/descritor</th><th>Questões</th></tr></thead><tbody>' + Object.keys(resumo).sort().map(function(d){ return '<tr><td>' + escapeHtml(d) + '</td><td>' + resumo[d] + '</td></tr>'; }).join("") + '</tbody></table>';
}

function renderRelatorios() {
  var rs = resultados();
  var porTurma = {};
  rs.forEach(function(r){ if(!porTurma[r.turma]) porTurma[r.turma] = []; porTurma[r.turma].push(r); });
  document.getElementById("prof-content").innerHTML = '<div class="btn-row"><button class="btn primary" id="print-rel">Imprimir relatórios</button><button class="btn green" id="json-rel">Exportar JSON</button></div>' +
    '<h3>Relatório por turma</h3>' + (Object.keys(porTurma).length ? '<table><thead><tr><th>Turma</th><th>Estudantes</th><th>Média bruta</th><th>Média escala pré-TRI</th><th>Prioridade</th></tr></thead><tbody>' + Object.keys(porTurma).map(function(t){
      var arr = porTurma[t];
      var media = Math.round(arr.reduce(function(s,r){ return s + r.percentual; },0) / arr.length);
      var escala = Math.round(arr.reduce(function(s,r){ return s + r.escalaPreTri; },0) / arr.length);
      var pior = piorDisciplina(arr);
      return '<tr><td>' + escapeHtml(t) + '</td><td>' + arr.length + '</td><td>' + media + '%</td><td>' + escala + '</td><td>' + escapeHtml(pior) + '</td></tr>';
    }).join("") + '</tbody></table>' : '<p class="lead">Ainda não há resultados enviados.</p>') +
    '<h3>Relatório individual</h3>' + (rs.length ? '<table><thead><tr><th>Estudante</th><th>Turma</th><th>Avaliação</th><th>Acertos</th><th>Escala pré-TRI</th><th>Nível</th></tr></thead><tbody>' + rs.slice().reverse().map(function(r){
      return '<tr><td>' + escapeHtml(r.aluno) + '</td><td>' + escapeHtml(r.turma) + '</td><td>' + escapeHtml(r.avaliacaoTitulo) + '</td><td>' + r.acertos + '/' + r.total + ' (' + r.percentual + '%)</td><td>' + r.escalaPreTri + '</td><td>' + escapeHtml(r.nivel) + '</td></tr>';
    }).join("") + '</tbody></table>' : '') +
    '<div class="notice"><strong>Leitura pedagógica:</strong> estes relatórios são do professor. Eles orientam recomposição por descritor, não classificam o estudante.</div>';
  document.getElementById("print-rel").onclick = function(){ window.print(); };
  document.getElementById("json-rel").onclick = function(){ baixar("resultados-sidep-ce.json", resultados()); };
}
function piorDisciplina(arr) {
  var mapa = {};
  arr.forEach(function(r) {
    Object.keys(r.porDisciplina || {}).forEach(function(d) {
      var x = r.porDisciplina[d];
      if (!mapa[d]) mapa[d] = { a: 0, t: 0 };
      mapa[d].a += x.acertos; mapa[d].t += x.total;
    });
  });
  var pior = "sem dados", pct = 101;
  Object.keys(mapa).forEach(function(d){ var p = mapa[d].a / mapa[d].t * 100; if (p < pct) { pct = p; pior = d; } });
  return pior;
}
function baixar(nome, dados) {
  var blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = nome; a.click();
  URL.revokeObjectURL(url);
}

normalizarBancoInicial();
renderHome();
</script>
</body>
</html>
'''

html = html.replace("__BANCO__", banco)
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html, encoding="utf-8")
print(OUT)
