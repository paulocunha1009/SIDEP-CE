import {
  BarChart3,
  BookOpenCheck,
  Building2,
  ClipboardList,
  GraduationCap,
  KeyRound,
  Layers3,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import logoCentec from "./assets/logo-centec-transparent.png";
import logoCrede03 from "./assets/logo-crede-03-transparent.png";
import logoSeduc from "./assets/logo-seduc-transparent.png";
import { regionaisSeed } from "./data/mock";
import { competenciasNorteadoras, descritoresNorteadores, questoesNorteadoras } from "./data/norteadoresSeed";
import { supabaseConfigured } from "./lib/supabase";
import {
  carregarCompetencias,
  carregarCompetenciasLocais,
  carregarDescritores,
  carregarDescritoresLocais,
  carregarQuestoes,
  carregarQuestoesLocais,
  salvarCompetencia,
  salvarCompetenciaLocal,
  salvarDescritor,
  salvarDescritorLocal,
  salvarQuestao,
  salvarQuestaoLocal,
  sincronizarBancoItensSupabase,
  substituirBancoItensLocal,
} from "./services/itemBankRepository";
import {
  carregarAvaliacoes,
  carregarAvaliacoesLocais,
  carregarCodigosAvaliacaoBloqueados,
  carregarCodigosAvaliacaoBloqueadosOnline,
  carregarRespostasAvaliacao,
  carregarRespostasLocais,
  carregarEscolas,
  carregarEscolasLocais,
  carregarProfessores,
  carregarProfessoresLocais,
  bloquearCodigoAvaliacao,
  excluirAvaliacao as excluirAvaliacaoPersistida,
  salvarAvaliacao,
  salvarAvaliacaoLocal,
  salvarEscola,
  salvarProfessor,
  salvarRespostaAvaliacao,
  sincronizarRegionaisSupabase,
} from "./services/registryRepository";
import type {
  AlternativaKey,
  AvaliacaoDraft,
  CompetenciaDraft,
  DescritorDraft,
  EscolaDraft,
  PerfilAcesso,
  ProfessorDraft,
  QuestaoDraft,
  RespostaAvaliacaoDraft,
  TipoEscola,
} from "./types";

type Role = "student" | "teacher" | "management";
type View = "home" | "student" | "schools" | "teachers" | "items" | "assessments" | "reports";
type ItemBankTab = "competencias" | "descritores" | "questoes";
type QuestaoSubTab = "cadastro" | "curadoria" | "cobertura" | "inventario" | "solicitacoes" | "historico";
type QuestaoStatusFiltro = QuestaoDraft["status"] | "todas";
type AuthRole = "aluno" | "professor" | "gestao_escolar" | "regional" | "seduc" | "administrador";

type AuthUser = {
  id: string;
  usuario: string;
  nome: string;
  email: string;
  role: AuthRole;
  escola_inep?: string;
  regional_codigo?: string;
  professor_matricula?: string;
  senha_acesso: string;
  alterar_senha_primeiro_login?: boolean;
  origem: "sistema" | "escola" | "professor";
};

const tipoEscolaOptions: TipoEscola[] = [
  "EEEP",
  "EEMCP",
  "EEMTI",
  "EEM",
  "EJA",
  "ESCOLA_DO_CAMPO",
  "EFA",
  "OUTRA",
];

const perfilOptions: Array<{ value: PerfilAcesso; label: string; description: string }> = [
  {
    value: "professor_tecnico",
    label: "Professor Técnico",
    description: "Docente da base técnica vinculado a curso, turma e práticas profissionais.",
  },
  {
    value: "coordenador_professor_tecnico",
    label: "Coordenador/Professor Técnico",
    description: "Coordena o curso técnico e também pode atuar como docente/revisor.",
  },
  {
    value: "coordenador_escolar",
    label: "Gestão/Coordenação Escolar",
    description: "Acompanha dados agregados da escola e apoia decisões pedagógicas.",
  },
  { value: "crede", label: "CREDE/SEFOR", description: "Acompanha escolas da regional." },
  { value: "seduc", label: "SEDUC", description: "Acompanha indicadores da rede estadual." },
  { value: "administrador", label: "Administrador", description: "Gerencia parametrizações e permissões do sistema." },
];

type CursoTecnicoOficial = {
  codigo: string;
  nome: string;
  eixo: string;
  matrizAno: number;
  status: "ativo" | "inativo";
};

const cursosTecnicosOficiais: CursoTecnicoOficial[] = [
  { codigo: "TECADM", nome: "Técnico em Administração", eixo: "Gestão e Negócios", matrizAno: 2026, status: "ativo" },
  { codigo: "TECAGR", nome: "Técnico em Agricultura", eixo: "Recursos Naturais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECAGI", nome: "Técnico em Agroindústria", eixo: "Produção Alimentícia", matrizAno: 2026, status: "ativo" },
  { codigo: "TECAGN", nome: "Técnico em Agronegócio", eixo: "Recursos Naturais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECAGP", nome: "Técnico em Agropecuária", eixo: "Recursos Naturais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECAQI", nome: "Técnico em Aquicultura", eixo: "Recursos Naturais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECAUT", nome: "Técnico em Automação Industrial", eixo: "Controle e Processos Industriais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECBIO", nome: "Técnico em Biotecnologia", eixo: "Produção Industrial", matrizAno: 2026, status: "ativo" },
  { codigo: "TECCOM", nome: "Técnico em Comércio", eixo: "Gestão e Negócios", matrizAno: 2026, status: "ativo" },
  { codigo: "TECCG", nome: "Técnico em Computação Gráfica", eixo: "Informação e Comunicação", matrizAno: 2026, status: "ativo" },
  { codigo: "TECCON", nome: "Técnico em Contabilidade", eixo: "Gestão e Negócios", matrizAno: 2026, status: "ativo" },
  { codigo: "TECDCC", nome: "Técnico em Desenho de Construção Civil", eixo: "Infraestrutura", matrizAno: 2026, status: "ativo" },
  { codigo: "TECDS", nome: "Técnico em Desenvolvimento de Sistemas", eixo: "Informação e Comunicação", matrizAno: 2026, status: "ativo" },
  { codigo: "TECDI", nome: "Técnico em Design de Interiores", eixo: "Produção Cultural e Design", matrizAno: 2026, status: "ativo" },
  { codigo: "TECEDF", nome: "Técnico em Edificações", eixo: "Infraestrutura", matrizAno: 2026, status: "ativo" },
  { codigo: "TECELM", nome: "Técnico em Eletromecânica", eixo: "Controle e Processos Industriais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECELT", nome: "Técnico em Eletrotécnica", eixo: "Controle e Processos Industriais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECENF", nome: "Técnico em Enfermagem", eixo: "Ambiente e Saúde", matrizAno: 2026, status: "ativo" },
  { codigo: "TECEST", nome: "Técnico em Estética", eixo: "Ambiente e Saúde", matrizAno: 2026, status: "ativo" },
  { codigo: "TECEVE", nome: "Técnico em Eventos", eixo: "Turismo, Hospitalidade e Lazer", matrizAno: 2026, status: "ativo" },
  { codigo: "TECFM", nome: "Técnico em Fabricação Mecânica", eixo: "Controle e Processos Industriais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECFIN", nome: "Técnico em Finanças", eixo: "Gestão e Negócios", matrizAno: 2026, status: "ativo" },
  { codigo: "TECFRU", nome: "Técnico em Fruticultura", eixo: "Recursos Naturais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECGT", nome: "Técnico em Guia de Turismo", eixo: "Turismo, Hospitalidade e Lazer", matrizAno: 2026, status: "ativo" },
  { codigo: "TECHOS", nome: "Técnico em Hospedagem", eixo: "Turismo, Hospitalidade e Lazer", matrizAno: 2026, status: "ativo" },
  { codigo: "TECINF", nome: "Técnico em Informática", eixo: "Informação e Comunicação", matrizAno: 2026, status: "ativo" },
  { codigo: "TECLOG", nome: "Técnico em Logística", eixo: "Gestão e Negócios", matrizAno: 2026, status: "ativo" },
  { codigo: "TECMA", nome: "Técnico em Manutenção Automotiva", eixo: "Produção Industrial", matrizAno: 2026, status: "ativo" },
  { codigo: "TECMAS", nome: "Técnico em Massoterapia", eixo: "Ambiente e Saúde", matrizAno: 2026, status: "ativo" },
  { codigo: "TECMEC", nome: "Técnico em Mecânica", eixo: "Controle e Processos Industriais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECMAI", nome: "Técnico em Meio Ambiente", eixo: "Ambiente e Saúde", matrizAno: 2026, status: "ativo" },
  { codigo: "TECMV", nome: "Técnico em Modelagem do Vestuário", eixo: "Produção Cultural e Design", matrizAno: 2026, status: "ativo" },
  { codigo: "TECMOV", nome: "Técnico em Móveis", eixo: "Produção Industrial", matrizAno: 2026, status: "ativo" },
  { codigo: "TECMUL", nome: "Técnico em Multimídia", eixo: "Produção Cultural e Design", matrizAno: 2026, status: "ativo" },
  { codigo: "TECND", nome: "Técnico em Nutrição e Dietética", eixo: "Ambiente e Saúde", matrizAno: 2026, status: "ativo" },
  { codigo: "TECPG", nome: "Técnico em Petróleo e Gás", eixo: "Produção Industrial", matrizAno: 2026, status: "ativo" },
  { codigo: "TECPOR", nome: "Técnico em Portos", eixo: "Infraestrutura", matrizAno: 2026, status: "ativo" },
  { codigo: "TECPC", nome: "Técnico em Produção Cultural", eixo: "Produção Cultural e Design", matrizAno: 2026, status: "ativo" },
  { codigo: "TECPAV", nome: "Técnico em Produção de Áudio e Vídeo", eixo: "Produção Cultural e Design", matrizAno: 2026, status: "ativo" },
  { codigo: "TECQUI", nome: "Técnico em Química", eixo: "Controle e Processos Industriais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECRDC", nome: "Técnico em Redes de Computadores", eixo: "Informação e Comunicação", matrizAno: 2026, status: "ativo" },
  { codigo: "TECREG", nome: "Técnico em Regência", eixo: "Produção Cultural e Design", matrizAno: 2026, status: "ativo" },
  { codigo: "TECSAN", nome: "Técnico em Saneamento", eixo: "Infraestrutura", matrizAno: 2026, status: "ativo" },
  { codigo: "TECSB", nome: "Técnico em Saúde Bucal", eixo: "Ambiente e Saúde", matrizAno: 2026, status: "ativo" },
  { codigo: "TECSE", nome: "Técnico em Secretaria Escolar", eixo: "Desenvolvimento Educacional e Social", matrizAno: 2026, status: "ativo" },
  { codigo: "TECSEC", nome: "Técnico em Secretariado", eixo: "Gestão e Negócios", matrizAno: 2026, status: "ativo" },
  { codigo: "TECST", nome: "Técnico em Segurança do Trabalho", eixo: "Segurança", matrizAno: 2026, status: "ativo" },
  { codigo: "TECSER", nome: "Técnico em Sistemas de Energia Renovável", eixo: "Controle e Processos Industriais", matrizAno: 2026, status: "ativo" },
  { codigo: "TECTEX", nome: "Técnico em Têxtil", eixo: "Produção Industrial", matrizAno: 2026, status: "ativo" },
  { codigo: "TECTIL", nome: "Técnico em Tradução e Interpretação de Libras", eixo: "Desenvolvimento Educacional e Social", matrizAno: 2026, status: "ativo" },
  { codigo: "TECTI", nome: "Técnico em Transações Imobiliárias", eixo: "Gestão e Negócios", matrizAno: 2026, status: "ativo" },
  { codigo: "TECVES", nome: "Técnico em Vestuário", eixo: "Produção Industrial", matrizAno: 2026, status: "ativo" },
];

function perfilAcessoLabel(perfil: PerfilAcesso) {
  if (perfil === "professor") return "Professor Técnico";
  return perfilOptions.find((option) => option.value === perfil)?.label ?? perfil;
}

function authRoleLabel(role: AuthRole) {
  const labels: Record<AuthRole, string> = {
    aluno: "Aluno",
    professor: "Professor Técnico",
    gestao_escolar: "Gestão Escolar",
    regional: "CREDE/SEFOR",
    seduc: "SEDUC",
    administrador: "Administrador",
  };

  return labels[role];
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function authRoleFromPerfil(perfil: PerfilAcesso): AuthRole {
  if (perfil === "administrador") return "administrador";
  if (perfil === "seduc") return "seduc";
  if (perfil === "crede") return "regional";
  if (perfil === "coordenador_escolar") return "gestao_escolar";
  return "professor";
}

function normalizeCourseName(value: string) {
  return normalizeKey(value)
    .replace(/\b(tecnico|tecnica|curso|de|do|da|em|nivel|medio)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findOfficialCourse(curso: string) {
  const target = normalizeCourseName(curso);
  return cursosTecnicosOficiais.find((item) => normalizeCourseName(item.nome) === target);
}

function courseCode(curso: string) {
  const official = findOfficialCourse(curso);
  if (official) return official.codigo;
  return normalizeKey(curso).split(" ").map((part) => part.slice(0, 3)).join("").toUpperCase().slice(0, 10) || "CURSO";
}

function isLegacyInformaticaCourse(curso: string) {
  return courseCode(curso) === "TECINF";
}

function visiblePedagogicalCode(codigo: string) {
  const match = codigo.match(/^TEC[A-Z0-9]+-(C\d{2,}|D\d{2,})$/i);
  return match ? match[1].toUpperCase() : codigo.toUpperCase();
}

function scopedPedagogicalCode(curso: string, codigo: string) {
  const normalized = visiblePedagogicalCode(codigo.trim().toUpperCase());
  if (!normalized) return normalized;
  if (codigo.includes("-")) return codigo.trim().toUpperCase();
  if (isLegacyInformaticaCourse(curso)) return normalized;
  return `${courseCode(curso)}-${normalized}`;
}

function questionCodeNumber(codigo: string) {
  const normalized = codigo.trim().toUpperCase();
  const match = normalized.match(/(?:^|-)Q(?:-)?(\d+)$/) ?? normalized.match(/^Q[A-Z]*-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function scopedQuestionCode(curso: string, numero: number) {
  const next = String(Math.max(1, numero)).padStart(4, "0");
  if (isLegacyInformaticaCourse(curso)) return `Q-INF-${next}`;
  return `${courseCode(curso)}-Q${next}`;
}

function nextQuestionCodeForCourse(curso: string, questoesCurso: QuestaoDraft[]) {
  const ultimoNumero = questoesCurso.reduce((maior, questao) => Math.max(maior, questionCodeNumber(questao.codigo)), 0);
  return scopedQuestionCode(curso, ultimoNumero + 1);
}

function questionCodeMatchesCourse(curso: string, codigo: string) {
  const normalized = codigo.trim().toUpperCase();
  const prefix = courseCode(curso);
  if (isLegacyInformaticaCourse(curso)) return normalized.startsWith("Q-INF-") || normalized.startsWith("TECINF-Q");
  return normalized.startsWith(`${prefix}-Q`);
}

function splitCourseList(value?: string) {
  return (value ?? "")
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveCourseName(value: string) {
  return findOfficialCourse(value)?.nome ?? value;
}

const quantidadePorComponenteOptions = [2, 5, 10, 20];
const DEFAULT_ACCESS_PASSWORD = "AGzzcso1$";
const DEFAULT_TEACHER_CPF = "00000000000";
const MASTER_USER_STORAGE_KEY = "sidep-ce:master-user";
const ASSESSMENT_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DEFAULT_MASTER_USER: AuthUser = {
  id: "master-admin",
  usuario: "MASTER",
  nome: "Administrador Master SIDEP-CE",
  email: "master@sidep.ce.gov.br",
  role: "administrador",
  senha_acesso: DEFAULT_ACCESS_PASSWORD,
  alterar_senha_primeiro_login: true,
  origem: "sistema",
};

function carregarMasterUser() {
  if (typeof window === "undefined") return DEFAULT_MASTER_USER;
  const raw = window.localStorage.getItem(MASTER_USER_STORAGE_KEY);
  if (!raw) return DEFAULT_MASTER_USER;

  try {
    return { ...DEFAULT_MASTER_USER, ...JSON.parse(raw) } as AuthUser;
  } catch {
    return DEFAULT_MASTER_USER;
  }
}

function salvarMasterUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MASTER_USER_STORAGE_KEY, JSON.stringify(user));
}


function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeQuestionText(value: string) {
  return normalizeKey(value)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function questionFingerprint(questao: Pick<QuestaoDraft, "enunciado" | "alternativa_a" | "alternativa_b" | "alternativa_c" | "alternativa_d" | "alternativa_e">) {
  return [
    questao.enunciado,
    questao.alternativa_a,
    questao.alternativa_b,
    questao.alternativa_c,
    questao.alternativa_d,
    questao.alternativa_e,
  ]
    .map(normalizeQuestionText)
    .join("|");
}

function questionContextTokens(questao: Pick<QuestaoDraft, "enunciado">) {
  const stopwords = new Set([
    "qual",
    "quais",
    "uma",
    "para",
    "sobre",
    "com",
    "sem",
    "por",
    "que",
    "das",
    "dos",
    "nas",
    "nos",
    "como",
    "quando",
    "onde",
    "abaixo",
    "correta",
    "incorreta",
    "alternativa",
    "opcao",
    "principal",
    "exemplo",
    "codigo",
    "programa",
  ]);
  return new Set(
    normalizeQuestionText(questao.enunciado)
      .split(" ")
      .filter((token) => token.length >= 4 && !stopwords.has(token)),
  );
}

function tokenSimilarity(left: Set<string>, right: Set<string>) {
  if (!left.size || !right.size) return 0;

  let intersection = 0;
  left.forEach((token) => {
    if (right.has(token)) intersection += 1;
  });

  return intersection / (left.size + right.size - intersection);
}

function questionContextSignature(questao: Pick<QuestaoDraft, "enunciado">) {
  return Array.from(questionContextTokens(questao)).sort().join(" ");
}

function getQuestionConflict(
  candidate: QuestaoDraft,
  selected: QuestaoDraft[],
): { item: QuestaoDraft; motivo: "enunciado" | "alternativas" | "contexto" | "similaridade"; similaridade?: number } | null {
  const candidateEnunciado = normalizeQuestionText(candidate.enunciado);
  const candidateFingerprint = questionFingerprint(candidate);
  const candidateSignature = questionContextSignature(candidate);
  const candidateTokens = questionContextTokens(candidate);

  for (const item of selected) {
    if (normalizeQuestionText(item.enunciado) === candidateEnunciado) return { item, motivo: "enunciado" };
    if (questionFingerprint(item) === candidateFingerprint) return { item, motivo: "alternativas" };
    if (questionContextSignature(item) && questionContextSignature(item) === candidateSignature) {
      return { item, motivo: "contexto" };
    }

    const similaridade = tokenSimilarity(candidateTokens, questionContextTokens(item));
    if (similaridade >= 0.72) return { item, motivo: "similaridade", similaridade };
  }

  return null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeFileSegment(value: string) {
  return normalizeQuestionText(value || "sidep-ce")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "sidep-ce";
}

function getCourseDescriptorStructure(competencias: CompetenciaDraft[], descritores: DescritorDraft[]) {
  const competenciasPorCodigo = new Map(competencias.map((competencia) => [competencia.codigo, competencia]));
  const cursos = Array.from(new Set(competencias.map((competencia) => competencia.curso_tecnico).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );

  return cursos.map((curso) => {
    const competenciasDoCurso = competencias
      .filter((competencia) => normalizeKey(competencia.curso_tecnico) === normalizeKey(curso))
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
    const codigosCompetencias = new Set(competenciasDoCurso.map((competencia) => competencia.codigo));
    const descritoresDoCurso = descritores
      .filter((descritor) => codigosCompetencias.has(descritor.competencia_codigo))
      .sort((a, b) => a.componente_curricular.localeCompare(b.componente_curricular) || a.codigo.localeCompare(b.codigo));
    const componentes = Array.from(new Set(descritoresDoCurso.map((descritor) => descritor.componente_curricular))).sort((a, b) =>
      a.localeCompare(b),
    );

    return {
      curso,
      competencias: competenciasDoCurso,
      componentes: componentes.map((componente) => {
        const descritoresDoComponente = descritoresDoCurso.filter(
          (descritor) => normalizeKey(descritor.componente_curricular) === normalizeKey(componente),
        );
        const competenciasDoComponente = Array.from(
          new Set(descritoresDoComponente.map((descritor) => descritor.competencia_codigo)),
        )
          .map((codigo) => competenciasPorCodigo.get(codigo))
          .filter((competencia): competencia is CompetenciaDraft => Boolean(competencia))
          .sort((a, b) => a.codigo.localeCompare(b.codigo));

        return {
          componente,
          competencias: competenciasDoComponente.map((competencia) => ({
            competencia,
            descritores: descritoresDoComponente.filter((descritor) => descritor.competencia_codigo === competencia.codigo),
          })),
        };
      }),
    };
  });
}

function generateCourseDescriptorsMarkdown(competencias: CompetenciaDraft[], descritores: DescritorDraft[]) {
  const estrutura = getCourseDescriptorStructure(competencias, descritores);
  const generatedAt = new Date().toLocaleString("pt-BR");
  const lines = [
    "# SIDEP-CE - Componentes, Competências e Descritores",
    "",
    `Gerado em: ${generatedAt}`,
    "",
    `Total de cursos: ${estrutura.length}`,
    `Total de competências: ${competencias.length}`,
    `Total de descritores: ${descritores.length}`,
    "",
  ];

  estrutura.forEach((curso) => {
    const totalDescritoresCurso = curso.componentes.reduce(
      (total, componente) => total + componente.competencias.reduce((subtotal, item) => subtotal + item.descritores.length, 0),
      0,
    );
    lines.push(`## ${curso.curso}`, "");
    lines.push(`- Competências: ${curso.competencias.length}`);
    lines.push(`- Componentes curriculares: ${curso.componentes.length}`);
    lines.push(`- Descritores: ${totalDescritoresCurso}`, "");

    curso.componentes.forEach((componente) => {
      lines.push(`### ${componente.componente}`, "");
      componente.competencias.forEach(({ competencia, descritores: descritoresDaCompetencia }) => {
        lines.push(`#### ${competencia.codigo} - ${competencia.descricao}`, "");
        descritoresDaCompetencia.forEach((descritor) => {
          lines.push(`- **${descritor.codigo}** (${descritor.nivel_esperado}) - ${descritor.descricao}`);
        });
        lines.push("");
      });
    });
  });

  return lines.join("\n");
}

function generateCourseDescriptorsHtml(competencias: CompetenciaDraft[], descritores: DescritorDraft[]) {
  const estrutura = getCourseDescriptorStructure(competencias, descritores);
  const generatedAt = new Date().toLocaleString("pt-BR");
  const courseSections = estrutura
    .map((curso) => {
      const totalDescritoresCurso = curso.componentes.reduce(
        (total, componente) => total + componente.competencias.reduce((subtotal, item) => subtotal + item.descritores.length, 0),
        0,
      );
      const componentSections = curso.componentes
        .map((componente) => {
          const competencySections = componente.competencias
            .map(({ competencia, descritores: descritoresDaCompetencia }) => `
              <section class="competencia">
                <h4>${escapeHtml(competencia.codigo)} - ${escapeHtml(competencia.descricao)}</h4>
                <ul>
                  ${descritoresDaCompetencia
                    .map(
                      (descritor) => `
                        <li>
                          <strong>${escapeHtml(descritor.codigo)}</strong>
                          <span>${escapeHtml(descritor.descricao)}</span>
                          <em>${escapeHtml(descritor.nivel_esperado)}</em>
                        </li>
                      `,
                    )
                    .join("")}
                </ul>
              </section>
            `)
            .join("");

          return `
            <section class="componente">
              <h3>${escapeHtml(componente.componente)}</h3>
              ${competencySections}
            </section>
          `;
        })
        .join("");

      return `
        <section class="curso">
          <h2>${escapeHtml(curso.curso)}</h2>
          <div class="metrics">
            <span>${curso.competencias.length} competências</span>
            <span>${curso.componentes.length} componentes</span>
            <span>${totalDescritoresCurso} descritores</span>
          </div>
          ${componentSections}
        </section>
      `;
    })
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>SIDEP-CE - Componentes e Descritores</title>
  <style>
    body { font-family: Arial, sans-serif; color: #08295c; margin: 32px; line-height: 1.45; }
    header { border-bottom: 4px solid #0b8f57; margin-bottom: 24px; padding-bottom: 16px; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    h2 { margin-top: 28px; color: #06336f; page-break-after: avoid; }
    h3 { margin-top: 20px; color: #0b6f4f; page-break-after: avoid; }
    h4 { margin: 14px 0 8px; color: #08295c; page-break-after: avoid; }
    .metrics { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0 18px; }
    .metrics span { border: 1px solid #c9d7e8; padding: 6px 10px; border-radius: 4px; background: #f6faf8; }
    .curso { page-break-inside: auto; }
    .componente { border-top: 1px solid #dbe5ef; padding-top: 10px; }
    .competencia { page-break-inside: avoid; }
    li { margin: 6px 0; }
    li strong { display: inline-block; min-width: 48px; color: #06336f; }
    li em { color: #51657d; font-size: 12px; margin-left: 8px; }
    @media print { body { margin: 18mm; } button { display: none; } }
  </style>
</head>
<body>
  <header>
    <h1>SIDEP-CE - Componentes, Competências e Descritores</h1>
    <p>Documento gerado em ${escapeHtml(generatedAt)}.</p>
    <p>${estrutura.length} cursos · ${competencias.length} competências · ${descritores.length} descritores</p>
  </header>
  ${courseSections}
</body>
</html>`;
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function openPrintableHtml(html: string) {
  const printWindow = window.open("", "_blank", "width=1100,height=800");
  if (!printWindow) return false;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 400);
  return true;
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number) {
  let current = seed || 1;
  return () => {
    current += 0x6D2B79F5;
    let value = current;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], seedSource: string) {
  const shuffled = [...items];
  const random = seededRandom(hashString(seedSource));

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }

  return shuffled;
}

function studentAttemptKey(assessmentCode: string, studentName: string) {
  return `${normalizeKey(assessmentCode)}:${normalizeKey(studentName)}`;
}

function randomAssessmentToken(length = 6) {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes)
    .map((byte) => ASSESSMENT_CODE_ALPHABET[byte % ASSESSMENT_CODE_ALPHABET.length])
    .join("");
}

function courseAccessPrefix(cursoTecnico: string) {
  const normalized = normalizeKey(cursoTecnico);
  if (normalized.includes("informatica")) return "INF";
  if (normalized.includes("administracao")) return "ADM";
  if (normalized.includes("enfermagem")) return "ENF";
  if (normalized.includes("agro")) return "AGR";

  const initials = cursoTecnico
    .replace(/^t[eé]cnico\s+em\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => normalizeKey(word).charAt(0).toUpperCase())
    .join("")
    .slice(0, 3);

  return initials || "AV";
}

function stageAccessCode(etapa: AvaliacaoDraft["etapa"]) {
  if (etapa === "formativa") return "F";
  if (etapa === "final") return "N";
  return "D";
}

function generateAssessmentAccessCode(
  assessments: AvaliacaoDraft[],
  cursoTecnico = "Técnico em Informática",
  etapa: AvaliacaoDraft["etapa"] = "diagnostica",
  reservedCodes: string[] = [],
) {
  const year = String(new Date().getFullYear()).slice(-2);
  const prefix = `${courseAccessPrefix(cursoTecnico)}${year}-${stageAccessCode(etapa)}`;
  const existingCodes = new Set([
    ...assessments.map((assessment) => assessment.codigo_acesso.toUpperCase()),
    ...reservedCodes.map((codigo) => codigo.toUpperCase()),
  ]);

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const code = `${prefix}-${randomAssessmentToken()}`;
    if (!existingCodes.has(code)) return code;
  }

  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

function calculateStudentResult(
  assessment: AvaliacaoDraft,
  assessmentQuestions: QuestaoDraft[],
  answers: Record<string, AlternativaKey>,
) {
  const desempenho_por_descritor: RespostaAvaliacaoDraft["desempenho_por_descritor"] = {};
  const desempenho_por_componente: RespostaAvaliacaoDraft["desempenho_por_componente"] = {};
  let acertos = 0;

  assessmentQuestions.forEach((questao) => {
    const correta = answers[questao.codigo] === questao.gabarito;
    if (correta) acertos += 1;

    const descritor = desempenho_por_descritor[questao.descritor_codigo] ?? { acertos: 0, total: 0, percentual: 0 };
    descritor.total += 1;
    if (correta) descritor.acertos += 1;
    descritor.percentual = Math.round((descritor.acertos / descritor.total) * 10000) / 100;
    desempenho_por_descritor[questao.descritor_codigo] = descritor;

    const componente = desempenho_por_componente[questao.componente_curricular] ?? { acertos: 0, total: 0, percentual: 0 };
    componente.total += 1;
    if (correta) componente.acertos += 1;
    componente.percentual = Math.round((componente.acertos / componente.total) * 10000) / 100;
    desempenho_por_componente[questao.componente_curricular] = componente;
  });

  return {
    acertos,
    total_questoes: assessmentQuestions.length,
    percentual_bruto: assessmentQuestions.length ? Math.round((acertos / assessmentQuestions.length) * 10000) / 100 : 0,
    desempenho_por_descritor,
    desempenho_por_componente,
    etapa: assessment.etapa,
  };
}

function getAssessmentQuestions(assessment: AvaliacaoDraft, questoes: QuestaoDraft[]) {
  const codes = assessment.questoes_codigos ?? [];
  const byCode = new Map(questoes.map((questao) => [questao.codigo, questao]));
  return codes
    .map((codigo) => byCode.get(codigo))
    .filter((questao): questao is QuestaoDraft => Boolean(questao));
}

function questaoStatusLabel(status: QuestaoDraft["status"]) {
  const labels: Record<QuestaoDraft["status"], string> = {
    rascunho: "Rascunho",
    em_revisao: "Em revisao",
    validada: "Validada",
  };

  return labels[status];
}

function questaoStatusHint(status: QuestaoDraft["status"]) {
  const hints: Record<QuestaoDraft["status"], string> = {
    rascunho: "Item em elaboração. Ainda não deve entrar na revisão nem nas provas.",
    em_revisao: "Item aguardando curadoria docente. Não entra em avaliação.",
    validada: "Item revisado e liberado para o criador de avaliações.",
  };

  return hints[status];
}

function isCompetenciaLegada(codigo: string) {
  return codigo.startsWith("COMP-INF-");
}

function isDescritorLegado(codigo: string) {
  return codigo.startsWith("D-INF-");
}

function isQuestaoPiloto(codigo: string) {
  return /^Q-INF-\d{4}$/.test(codigo);
}

function montarBancoNorteadorAtualizado(
  competenciasAtuais: CompetenciaDraft[],
  descritoresAtuais: DescritorDraft[],
  questoesAtuais: QuestaoDraft[],
) {
  return {
    competencias: [
      ...competenciasAtuais.filter((item) => (
        !isCompetenciaLegada(item.codigo) &&
        !competenciasNorteadoras.some((seed) => seed.codigo === item.codigo)
      )),
      ...competenciasNorteadoras,
    ],
    descritores: [
      ...descritoresAtuais.filter((item) => (
        !isDescritorLegado(item.codigo) &&
        !descritoresNorteadores.some((seed) => seed.codigo === item.codigo)
      )),
      ...descritoresNorteadores,
    ],
    questoes: [
      ...questoesAtuais.filter((item) => !isQuestaoPiloto(item.codigo) && !questoesNorteadoras.some((seed) => seed.codigo === item.codigo)),
      ...questoesNorteadoras,
    ],
  };
}

function precisaAtualizarBancoNorteador(
  competenciasAtuais: CompetenciaDraft[],
  descritoresAtuais: DescritorDraft[],
  questoesAtuais: QuestaoDraft[],
) {
  const faltamCompetencias = competenciasNorteadoras.some((seed) => !competenciasAtuais.some((item) => item.codigo === seed.codigo));
  const faltamDescritores = descritoresNorteadores.some((seed) => !descritoresAtuais.some((item) => item.codigo === seed.codigo));
  const faltamQuestoes = questoesNorteadoras.some((seed) => !questoesAtuais.some((item) => item.codigo === seed.codigo));

  return competenciasAtuais.some((item) => isCompetenciaLegada(item.codigo)) ||
    descritoresAtuais.some((item) => isDescritorLegado(item.codigo)) ||
    faltamCompetencias ||
    faltamDescritores ||
    faltamQuestoes;
}

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const [view, setView] = useState<View>("home");
  const [schools, setSchools] = useState<EscolaDraft[]>([]);
  const [teachers, setTeachers] = useState<ProfessorDraft[]>([]);
  const [competencias, setCompetencias] = useState<CompetenciaDraft[]>([]);
  const [descritores, setDescritores] = useState<DescritorDraft[]>([]);
  const [questoes, setQuestoes] = useState<QuestaoDraft[]>([]);
  const [assessments, setAssessments] = useState<AvaliacaoDraft[]>([]);
  const [respostas, setRespostas] = useState<RespostaAvaliacaoDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Preparando ambiente do MVP.");
  const [masterUser, setMasterUser] = useState<AuthUser>(() => carregarMasterUser());

  useEffect(() => {
    async function load() {
      try {
        const [escolas, professores, avaliacoesOnline, respostasOnline, competenciasBase, descritoresBase, questoesBase] = await Promise.all([
          carregarEscolas(),
          carregarProfessores(),
          carregarAvaliacoes(),
          carregarRespostasAvaliacao(),
          carregarCompetencias(),
          carregarDescritores(),
          carregarQuestoes(),
        ]);
        const precisaSanearBanco = precisaAtualizarBancoNorteador(competenciasBase, descritoresBase, questoesBase);
        const banco = precisaSanearBanco
          ? montarBancoNorteadorAtualizado(competenciasBase, descritoresBase, questoesBase)
          : { competencias: competenciasBase, descritores: descritoresBase, questoes: questoesBase };

        if (precisaSanearBanco) {
          substituirBancoItensLocal(banco);
        }

        setSchools(escolas);
        setTeachers(professores);
        setCompetencias(banco.competencias);
        setDescritores(banco.descritores);
        setQuestoes(banco.questoes);
        setAssessments(avaliacoesOnline);
        setRespostas(respostasOnline);
        setMessage(
          precisaSanearBanco
            ? "Banco local saneado: removi competências/descritores legados e apliquei a nomenclatura C/D."
            : supabaseConfigured
            ? "Conectado ao Supabase. Cadastros institucionais serão persistidos no banco."
            : "Modo local ativo. Configure o Supabase para persistência estadual online.",
        );
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const authUsers = useMemo<AuthUser[]>(
    () => [
      masterUser,
      ...schools
        .filter((school) => (school.status ?? "ativa") === "ativa")
        .map((school) => ({
          id: `escola-${school.codigo_inep}`,
          usuario: school.codigo_inep,
          nome: school.nome_oficial,
          email: school.email_principal,
          role: "gestao_escolar" as const,
          escola_inep: school.codigo_inep,
          senha_acesso: !school.senha_acesso || school.senha_acesso === DEFAULT_ACCESS_PASSWORD ? school.codigo_inep : school.senha_acesso,
          alterar_senha_primeiro_login: school.alterar_senha_primeiro_login ?? true,
          origem: "escola" as const,
        })),
      ...teachers
        .filter((teacher) => (teacher.status ?? "ativo") === "ativo")
        .map((teacher) => {
          const school = schools.find((item) => item.codigo_inep === teacher.escola_inep);
          const authRole = authRoleFromPerfil(teacher.perfil_acesso);

          return {
            id: `professor-${teacher.matricula}`,
            usuario: teacher.email_institucional,
            nome: teacher.nome_completo,
            email: teacher.email_institucional,
            role: authRole,
            escola_inep: teacher.escola_inep,
            regional_codigo: authRole === "regional" ? school?.regional_codigo : undefined,
            professor_matricula: teacher.matricula,
            senha_acesso: !teacher.senha_acesso || teacher.senha_acesso === DEFAULT_ACCESS_PASSWORD ? teacher.cpf || DEFAULT_TEACHER_CPF : teacher.senha_acesso,
            alterar_senha_primeiro_login: teacher.alterar_senha_primeiro_login ?? true,
            origem: "professor" as const,
          };
        }),
    ],
    [masterUser, schools, teachers],
  );

  const role: Role = currentUser?.role === "aluno" ? "student" : currentUser?.role === "professor" ? "teacher" : "management";
  const canManageSchools = currentUser?.role === "regional" || currentUser?.role === "seduc" || currentUser?.role === "administrador";
  const canManageTeachers = currentUser?.role === "gestao_escolar" || canManageSchools;
  const canUseTeacherArea = currentUser?.role === "professor" || currentUser?.role === "regional" || currentUser?.role === "seduc" || currentUser?.role === "administrador";

  const scopedSchools = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "gestao_escolar") {
      return schools.filter((school) => school.codigo_inep === currentUser.escola_inep);
    }
    if (currentUser.role === "regional") {
      return schools.filter((school) => school.regional_codigo === currentUser.regional_codigo);
    }
    if (currentUser.role === "seduc" || currentUser.role === "administrador") return schools;
    if (currentUser.role === "professor") {
      return schools.filter((school) => school.codigo_inep === currentUser.escola_inep);
    }
    return [];
  }, [currentUser, schools]);

  const scopedTeachers = useMemo(() => {
    if (!currentUser) return [];
    const visibleSchoolIds = new Set(scopedSchools.map((school) => school.codigo_inep));
    if (currentUser.role === "professor") {
      return teachers.filter((teacher) => teacher.matricula === currentUser.professor_matricula || teacher.email_institucional === currentUser.email);
    }
    return teachers.filter((teacher) => !teacher.escola_inep || visibleSchoolIds.has(teacher.escola_inep));
  }, [currentUser, scopedSchools, teachers]);

  const scopedAssessments = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "professor") {
      return assessments.filter((assessment) => assessment.professor_matricula === currentUser.professor_matricula);
    }
    const visibleSchoolIds = new Set(scopedSchools.map((school) => school.codigo_inep));
    if (currentUser.role === "gestao_escolar" || currentUser.role === "regional") {
      return assessments.filter((assessment) => !!assessment.escola_inep && visibleSchoolIds.has(assessment.escola_inep));
    }
    return assessments;
  }, [assessments, currentUser, scopedSchools]);

  function handleLogin(user: AuthUser, password: string) {
    if (password !== user.senha_acesso) {
      setMessage("Senha incorreta. Verifique a senha informada ou solicite redefinicao ao administrador.");
      return;
    }
    setCurrentUser(user);
    setForcePasswordChange(!!user.alterar_senha_primeiro_login);
    setView(user.role === "aluno" ? "student" : "home");
    setMessage(
      user.alterar_senha_primeiro_login
        ? "Primeiro acesso: altere sua senha para continuar."
        : `Sessao iniciada como ${user.nome}.`,
    );
  }

  function logout() {
    setCurrentUser(null);
    setForcePasswordChange(false);
    setView("home");
  }

  async function updateCurrentUserPassword(newPassword: string) {
    if (!currentUser) return;
    if (newPassword.length < 8) {
      setMessage("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (currentUser.origem === "sistema") {
      const updated: AuthUser = { ...currentUser, senha_acesso: newPassword, alterar_senha_primeiro_login: false };
      salvarMasterUser(updated);
      setMasterUser(updated);
      setCurrentUser(updated);
      setForcePasswordChange(false);
      setMessage("Senha do Administrador Master alterada com sucesso.");
      return;
    }

    if (currentUser.origem === "professor" && currentUser.professor_matricula) {
      const teacher = teachers.find((item) => item.matricula === currentUser.professor_matricula);
      if (teacher) {
        const updated: ProfessorDraft = { ...teacher, senha_acesso: newPassword, alterar_senha_primeiro_login: false };
        const result = await salvarProfessor(updated);
        if (result.erro) {
          setMessage(result.erro);
          return;
        }
        setTeachers([...teachers.filter((item) => item.matricula !== updated.matricula), updated]);
      }
    }

    if (currentUser.origem === "escola" && currentUser.escola_inep) {
      const school = schools.find((item) => item.codigo_inep === currentUser.escola_inep);
      if (school) {
        const updated: EscolaDraft = { ...school, senha_acesso: newPassword, alterar_senha_primeiro_login: false };
        const result = await salvarEscola(updated);
        if (result.erro) {
          setMessage(result.erro);
          return;
        }
        setSchools([...schools.filter((item) => item.codigo_inep !== updated.codigo_inep), updated]);
      }
    }

    setCurrentUser({ ...currentUser, senha_acesso: newPassword, alterar_senha_primeiro_login: false });
    setForcePasswordChange(false);
    setMessage("Senha alterada com sucesso.");
  }

  if (!currentUser) {
    return (
      <LoginScreen
        users={authUsers}
        assessments={assessments}
        questoes={questoes}
        respostas={respostas}
        setRespostas={setRespostas}
        onLogin={handleLogin}
        loading={loading}
        message={message}
        setMessage={setMessage}
      />
    );
  }

  if (forcePasswordChange) {
    return <PasswordChangeScreen currentUser={currentUser} onChangePassword={updateCurrentUserPassword} onLogout={logout} message={message} />;
  }

  if (role === "student") {
    return (
      <div className="app role-student">
        <header className="topbar">
          <div className="brand compact-brand">
            <div className="crest">CE</div>
            <div>
              <strong>SIDEP-CE</strong>
              <span>Diagnóstico da Educação Profissional</span>
            </div>
          </div>
          <button className="secondary small" onClick={logout}>Sair</button>
        </header>

        <main className="student-shell">
          <section className="student-hero">
            <div>
              <p className="eyebrow">Acesso do estudante</p>
              <h1>Avaliação diagnóstica online</h1>
              <p className="lead">Informe o código recebido pela turma e seu nome completo para iniciar a prova.</p>
            </div>
            <aside className="student-seal">
              <ShieldCheck size={26} />
              <span>Ambiente do aluno</span>
            </aside>
          </section>
          <StudentAccess
            assessments={scopedAssessments.length ? scopedAssessments : assessments}
            questoes={questoes}
            respostas={respostas}
            setRespostas={setRespostas}
            setMessage={setMessage}
          />
        </main>
      </div>
    );
  }

  return (
    <div className={`app role-${role}`}>
      <header className="topbar">
        <div className="brand compact-brand">
          <div className="crest">CE</div>
          <div>
            <strong>SIDEP-CE</strong>
            <span>Diagnóstico da Educação Profissional</span>
          </div>
        </div>
        <div className="session-box">
          <span>{currentUser.nome}</span>
          <strong>{authRoleLabel(currentUser.role)}</strong>
          <button className="secondary small" onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="workspace-shell">
        <aside className="sidebar">
          <div className="sidebar-title">
            <strong>
              {currentUser.role === "administrador"
                ? "Administrador"
                : role === "teacher"
                ? "Area do professor"
                : "Gestão escolar"}
            </strong>
            <span>{supabaseConfigured ? "Banco online" : "Modo local"}</span>
          </div>
          <nav className="nav vertical" aria-label="Navegacao do ambiente">
            <NavButton active={view === "home"} onClick={() => setView("home")} icon={BarChart3} label="Painel" />
            {canUseTeacherArea && (
              <>
                <NavButton active={view === "items"} onClick={() => setView("items")} icon={Layers3} label="Banco de Itens" />
                <NavButton active={view === "assessments"} onClick={() => setView("assessments")} icon={ClipboardList} label="Avaliacoes" />
              </>
            )}
            {role === "management" && (
              <>
                {canManageSchools && <NavButton active={view === "schools"} onClick={() => setView("schools")} icon={Building2} label="Escolas" />}
                {canManageTeachers && <NavButton active={view === "teachers"} onClick={() => setView("teachers")} icon={UserRoundCog} label="Professores" />}
              </>
            )}
            <NavButton active={view === "reports"} onClick={() => setView("reports")} icon={BookOpenCheck} label="Relatorios" />
          </nav>
          <div className="sidebar-status">
            <span>{loading ? "Carregando..." : message}</span>
          </div>
        </aside>

        <section className="workspace-content">
          <div className="workspace-header">
            <div>
              <p className="eyebrow">{role === "teacher" ? "Operacao pedagogica" : "Acompanhamento institucional"}</p>
              <h1>
                {currentUser.role === "administrador"
                  ? "Controle geral do sistema"
                  : role === "teacher"
                  ? "Planejamento, itens e avaliações"
                  : "Relatorios, cadastros e qualidade da rede"}
              </h1>
            </div>
            <div className="status-chip">{supabaseConfigured ? "Supabase" : "Local"}</div>
          </div>

          {view === "home" && (
            <Home
              schools={scopedSchools}
              teachers={scopedTeachers}
              assessments={scopedAssessments}
              questoes={questoes}
              competencias={competencias}
              descritores={descritores}
              respostas={respostas}
              currentUser={currentUser}
            />
          )}
          {role === "management" && view === "schools" && canManageSchools && (
            <Schools schools={scopedSchools} allSchools={schools} setSchools={setSchools} setMessage={setMessage} currentUser={currentUser} />
          )}
          {role === "management" && view === "teachers" && canManageTeachers && (
            <Teachers teachers={scopedTeachers} allTeachers={teachers} setTeachers={setTeachers} schools={scopedSchools} setMessage={setMessage} currentUser={currentUser} />
          )}
          {canUseTeacherArea && view === "items" && (
            <ItemBank
              competencias={competencias}
              setCompetencias={setCompetencias}
              descritores={descritores}
              setDescritores={setDescritores}
              questoes={questoes}
              setQuestoes={setQuestoes}
              setMessage={setMessage}
            />
          )}
          {canUseTeacherArea && view === "assessments" && (
            <AssessmentsV2
              assessments={assessments}
              setAssessments={setAssessments}
              currentUser={currentUser}
              teachers={scopedTeachers}
              visibleSchoolIds={scopedSchools.map((school) => school.codigo_inep)}
              competencias={competencias}
              descritores={descritores}
              questoes={questoes}
              respostas={respostas}
              setRespostas={setRespostas}
              setMessage={setMessage}
            />
          )}
          {view === "reports" && (
            <Reports
              schools={scopedSchools}
              setSchools={setSchools}
              teachers={scopedTeachers}
              setTeachers={setTeachers}
              assessments={scopedAssessments}
              setAssessments={setAssessments}
              questoes={questoes}
              setQuestoes={setQuestoes}
              respostas={respostas}
              setRespostas={setRespostas}
              competencias={competencias}
              setCompetencias={setCompetencias}
              descritores={descritores}
              setDescritores={setDescritores}
              currentUser={currentUser}
              setMessage={setMessage}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof BarChart3;
  label: string;
}) {
  return (
    <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}>
      <Icon size={18} />
      {label}
    </button>
  );
}

function LoginScreen({
  users,
  assessments,
  questoes,
  respostas,
  setRespostas,
  onLogin,
  loading,
  message,
  setMessage,
}: {
  users: AuthUser[];
  assessments: AvaliacaoDraft[];
  questoes: QuestaoDraft[];
  respostas: RespostaAvaliacaoDraft[];
  setRespostas: (respostas: RespostaAvaliacaoDraft[]) => void;
  onLogin: (user: AuthUser, password: string) => void;
  loading: boolean;
  message: string;
  setMessage: (message: string) => void;
}) {
  const [loginMode, setLoginMode] = useState<"aluno" | "servidor">("aluno");
  const [studentCode, setStudentCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentSession, setStudentSession] = useState<{ assessment: AvaliacaoDraft; name: string } | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const selectedUser = users.find((user) => normalizeKey(user.usuario) === normalizeKey(username));
  const regionalName = selectedUser?.regional_codigo ? ` · ${selectedUser.regional_codigo}` : "";
  const studentAssessment = assessments.find((item) => item.codigo_acesso === studentCode.trim().toUpperCase());
  function submitLogin() {
    if (!selectedUser) return;
    onLogin(selectedUser, password);
  }

  function submitStudentAccess() {
    if (!studentAssessment || studentName.trim().split(" ").length < 2) return;
    if ((studentAssessment.status ?? "rascunho") !== "aberta") {
      setMessage("Esta avaliação não está aberta para aplicação no momento.");
      return;
    }
    if (respostas.some((resposta) => resposta.estudante_chave === studentAttemptKey(studentAssessment.codigo_acesso, studentName))) {
      setMessage("Este aluno já enviou esta avaliação. Uma nova tentativa deve ser liberada pela gestão/professor.");
      return;
    }
    setStudentSession({ assessment: studentAssessment, name: studentName.trim() });
  }

  if (studentSession) {
    return (
      <main className="student-shell">
        <StudentAssessmentRunner
          assessment={studentSession.assessment}
          questoes={questoes}
          studentName={studentSession.name}
          respostas={respostas}
          setRespostas={setRespostas}
          previewMode={false}
          onBack={() => setStudentSession(null)}
        />
      </main>
    );
  }

  return (
    <main className="login-shell">
      <section className="login-hero">
        <div className="login-logo-strip" aria-label="Instituições parceiras">
          <img src={logoSeduc} alt="Governo do Estado do Ceará - Secretaria da Educação" />
          <img src={logoCrede03} alt="CREDE 3 Acaraú" />
          <img src={logoCentec} alt="Instituto Centro de Ensino Tecnológico - CENTEC" />
        </div>
        <div>
          <p className="eyebrow">SIDEP-CE</p>
          <h1>Sistema de Diagnóstico da Educação Profissional</h1>
          <p className="lead">
            Acesso por perfil institucional para estudante, professor técnico, escola, CREDE/SEFOR e SEDUC.
          </p>
        </div>
        <div className="login-partner">
          <strong>SEDUC · CREDE 3 · CENTEC</strong>
          <span>Avaliação diagnóstica, curadoria docente e gestão pedagógica da Educação Profissional.</span>
        </div>
      </section>

      <section className="login-panel" aria-label="Entrar no SIDEP-CE">
        <div className="login-panel-logos" aria-label="Logos institucionais">
          <img src={logoSeduc} alt="SEDUC Ceará" />
          <img src={logoCrede03} alt="CREDE 3" />
          <img src={logoCentec} alt="CENTEC" />
        </div>
        <div>
          <p className="eyebrow">Acesso</p>
          <h2>{loginMode === "aluno" ? "Entrar na avaliação" : "Acesso institucional"}</h2>
          <p>
            {loginMode === "aluno"
              ? "Informe o código da prova e seu nome completo. O aluno não acessa relatórios, pesos ou diagnóstico."
              : "Professor, gestão escolar, CREDE/SEFOR, SEDUC e Administrador Master entram pelo acesso institucional."}
          </p>
        </div>

        <div className="login-mode-switch" role="tablist" aria-label="Tipo de acesso">
          <button className={loginMode === "aluno" ? "active" : ""} onClick={() => setLoginMode("aluno")}>Aluno</button>
          <button className={loginMode === "servidor" ? "active" : ""} onClick={() => setLoginMode("servidor")}>Professor ou Gestão</button>
        </div>

        {loginMode === "aluno" && (
          <div className="student-login-card">
            <label>
              Código da prova
              <input
                className="student-login-input"
                value={studentCode}
                onChange={(event) => setStudentCode(event.target.value.toUpperCase())}
                placeholder="Ex.: TECINF-26-01"
              />
            </label>
            <label>
              Nome completo do aluno
              <input
                className="student-login-input"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Digite o nome completo"
              />
            </label>
            {studentAssessment && (
              <div className="assessment-card">
                <strong>{studentAssessment.titulo}</strong>
                <span>{studentAssessment.turma_codigo} · {studentAssessment.quantidade_questoes} questões · {studentAssessment.etapa}</span>
              </div>
            )}
            <button className="primary" onClick={submitStudentAccess} disabled={!studentAssessment || studentName.trim().split(" ").length < 2}>
              Acessar avaliação
            </button>
          </div>
        )}

        {loginMode === "servidor" && (
          <>
            <label>
              Usuário
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="INEP, e-mail institucional ou MASTER"
              />
            </label>

            <label>
              Senha
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Escola: INEP · Professor: CPF · Master: senha definida" />
            </label>

            <div className="login-scope">
              {selectedUser ? (
                <>
                  <strong>{authRoleLabel(selectedUser.role)}{regionalName}</strong>
                  <span>Usuário: {selectedUser.usuario}</span>
                  <span>{selectedUser.email}</span>
                  {selectedUser.escola_inep && <span>Escola INEP: {selectedUser.escola_inep}</span>}
                </>
              ) : (
                  <>
                    <strong>Informe um usuário válido</strong>
                    <span>Escola: use o INEP. Profissionais, gestão regional e SEDUC: use o e-mail institucional. Administrador Master: use MASTER.</span>
                  </>
              )}
            </div>

            <button className="primary" onClick={submitLogin} disabled={loading || !selectedUser}>
              Entrar no sistema
            </button>
          </>
        )}

        <p className="helper">{loading ? "Carregando dados do MVP..." : message}</p>
      </section>
    </main>
  );
}

function PasswordChangeScreen({
  currentUser,
  onChangePassword,
  onLogout,
  message,
}: {
  currentUser: AuthUser;
  onChangePassword: (newPassword: string) => void;
  onLogout: () => void;
  message: string;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const canSubmit = newPassword.length >= 8 && newPassword === confirmation;

  return (
    <main className="login-shell password-shell">
      <section className="login-hero">
        <div className="login-brand-row">
          <div className="gov-mark">
            <span>CE</span>
          </div>
          <div>
            <strong>SIDEP-CE</strong>
            <small>Segurança de acesso institucional</small>
          </div>
        </div>
        <div>
          <p className="eyebrow">Primeiro acesso</p>
          <h1>Altere sua senha antes de continuar</h1>
          <p className="lead">A senha padrão só serve para o primeiro login. Depois disso, cada usuário deve definir sua senha pessoal.</p>
        </div>
      </section>

      <section className="login-panel">
        <div>
          <p className="eyebrow">{authRoleLabel(currentUser.role)}</p>
          <h2>{currentUser.nome}</h2>
          <p>{currentUser.email}</p>
        </div>
        <label>
          Nova senha
          <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Mínimo de 8 caracteres" />
        </label>
        <label>
          Confirmar nova senha
          <input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Digite novamente" />
        </label>
        <button className="primary" disabled={!canSubmit} onClick={() => onChangePassword(newPassword)}>
          Alterar senha e continuar
        </button>
        <button className="secondary" onClick={onLogout}>Sair</button>
        <p className="helper">{message}</p>
      </section>
    </main>
  );
}

function Home({
  schools,
  teachers,
  assessments,
  questoes,
  competencias,
  descritores,
  respostas,
  currentUser,
}: {
  schools: EscolaDraft[];
  teachers: ProfessorDraft[];
  assessments: AvaliacaoDraft[];
  questoes: QuestaoDraft[];
  competencias: CompetenciaDraft[];
  descritores: DescritorDraft[];
  respostas: RespostaAvaliacaoDraft[];
  currentUser: AuthUser;
}) {
  const visibleAssessmentCodes = new Set(assessments.map((assessment) => assessment.codigo_acesso));
  const visibleResponses = respostas.filter((resposta) => visibleAssessmentCodes.has(resposta.avaliacao_codigo));
  const totalAnswers = visibleResponses.reduce((sum, resposta) => sum + resposta.total_questoes, 0);
  const totalHits = visibleResponses.reduce((sum, resposta) => sum + resposta.acertos, 0);
  const average = totalAnswers ? Math.round((totalHits / totalAnswers) * 100) : 0;
  const validated = questoes.filter((questao) => questao.status === "validada").length;
  const reviewing = questoes.filter((questao) => questao.status === "em_revisao").length;
  const drafts = questoes.filter((questao) => questao.status === "rascunho").length;
  const courses = new Set(competencias.map((competencia) => competencia.curso_tecnico).filter(Boolean));
  const components = new Set(descritores.map((descritor) => descritor.componente_curricular).filter(Boolean));
  const students = new Set(visibleResponses.map((resposta) => resposta.estudante_chave));
  const descriptorByCode = new Map(descritores.map((descritor) => [descritor.codigo, descritor]));
  const questionsByDescriptor = descritores.map((descritor) => {
    const questions = questoes.filter((questao) => questao.descritor_codigo === descritor.codigo);
    return {
      descritor,
      total: questions.length,
      validadas: questions.filter((questao) => questao.status === "validada").length,
    };
  });
  const lowCoverage = questionsByDescriptor.filter((item) => item.validadas < 20).length;

  const levelTotals = descritores.reduce<Record<string, number>>(
    (acc, descritor) => {
      acc[descritor.nivel_esperado] = (acc[descritor.nivel_esperado] ?? 0) + questoes.filter((questao) => questao.descritor_codigo === descritor.codigo).length;
      return acc;
    },
    { basico: 0, intermediario: 0, avancado: 0 },
  );

  const componentPerformance = visibleResponses.reduce<Record<string, { acertos: number; total: number }>>((acc, resposta) => {
    Object.entries(resposta.desempenho_por_componente).forEach(([component, value]) => {
      acc[component] = acc[component] ?? { acertos: 0, total: 0 };
      acc[component].acertos += value.acertos;
      acc[component].total += value.total;
    });
    return acc;
  }, {});

  const descriptorPerformance = visibleResponses.reduce<Record<string, { acertos: number; total: number }>>((acc, resposta) => {
    Object.entries(resposta.desempenho_por_descritor).forEach(([descriptorCode, value]) => {
      acc[descriptorCode] = acc[descriptorCode] ?? { acertos: 0, total: 0 };
      acc[descriptorCode].acertos += value.acertos;
      acc[descriptorCode].total += value.total;
    });
    return acc;
  }, {});

  const componentRows = Object.entries(componentPerformance)
    .map(([component, value]) => ({ component, percentual: value.total ? Math.round((value.acertos / value.total) * 100) : 0, ...value }))
    .sort((a, b) => a.percentual - b.percentual)
    .slice(0, 4);

  const criticalDescriptors = Object.entries(descriptorPerformance)
    .map(([code, value]) => ({
      code,
      descricao: descriptorByCode.get(code)?.descricao ?? "Descritor sem descricao",
      component: descriptorByCode.get(code)?.componente_curricular ?? "Componente nao informado",
      percentual: value.total ? Math.round((value.acertos / value.total) * 100) : 0,
      total: value.total,
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => a.percentual - b.percentual)
    .slice(0, 5);

  const assessmentRows = [...assessments]
    .sort((a, b) => (b.codigo_bloqueado_em ?? b.inicio_em ?? "").localeCompare(a.codigo_bloqueado_em ?? a.inicio_em ?? ""))
    .slice(0, 5)
    .map((assessment) => {
      const assessmentResponses = visibleResponses.filter((resposta) => resposta.avaliacao_codigo === assessment.codigo_acesso);
      const hits = assessmentResponses.reduce((sum, resposta) => sum + resposta.acertos, 0);
      const total = assessmentResponses.reduce((sum, resposta) => sum + resposta.total_questoes, 0);
      return { assessment, respostas: assessmentResponses.length, media: total ? Math.round((hits / total) * 100) : 0 };
    });

  const scopeLabel =
    currentUser.role === "professor"
      ? "Professor técnico"
      : currentUser.role === "gestao_escolar"
      ? "Gestão escolar"
      : currentUser.role === "regional"
      ? "CREDE/SEFOR"
      : currentUser.role === "seduc"
      ? "SEDUC"
      : "Administrador";

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Painel Geral</p>
          <h2>Visão consolidada da avaliação diagnóstica</h2>
          <p>
            Visão consolidada do banco de itens, aplicações, respostas e desempenho pedagógico por curso,
            componente, competência e descritor.
          </p>
        </div>
        <div className="dashboard-scope">
          <span>Escopo</span>
          <strong>{scopeLabel}</strong>
        </div>
      </section>

      <section className="dashboard-kpis">
        <article className="dashboard-kpi">
          <span>Questões no banco</span>
          <strong>{questoes.length}</strong>
          <small>{validated} validadas · {reviewing} em revisão · {drafts} rascunhos</small>
        </article>
        <article className="dashboard-kpi">
          <span>Cobertura curricular</span>
          <strong>{descritores.length}</strong>
          <small>{competencias.length} competências · {components.size} componentes · {courses.size} curso(s)</small>
        </article>
        <article className="dashboard-kpi">
          <span>Participação</span>
          <strong>{visibleResponses.length}</strong>
          <small>{students.size} estudantes · {assessments.length} avaliações · {schools.length} escola(s) · {teachers.length} professor(es)</small>
        </article>
        <article className="dashboard-kpi">
          <span>Média geral pré-TRI</span>
          <strong>{average}%</strong>
          <small>{totalHits} acertos · {Math.max(totalAnswers - totalHits, 0)} erros registrados</small>
        </article>
      </section>

      <section className="dashboard-grid two">
        <article className="dashboard-card">
          <div className="card-heading">
            <h3>Qualidade do banco de itens</h3>
            <span className="tag">{supabaseConfigured ? "Supabase" : "Local"}</span>
          </div>
          <MetricBar label="Validadas" value={validated} total={Math.max(questoes.length, 1)} />
          <MetricBar label="Em revisão" value={reviewing} total={Math.max(questoes.length, 1)} tone="warning" />
          <MetricBar label="Rascunho" value={drafts} total={Math.max(questoes.length, 1)} tone="danger" />
          <MetricBar label="Nível básico" value={levelTotals.basico ?? 0} total={Math.max(questoes.length, 1)} />
          <MetricBar label="Intermediário" value={levelTotals.intermediario ?? 0} total={Math.max(questoes.length, 1)} />
          <MetricBar label="Avançado" value={levelTotals.avancado ?? 0} total={Math.max(questoes.length, 1)} tone="warning" />
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <h3>Alertas de gestão pedagógica</h3>
          </div>
          <div className="dashboard-alerts">
            <DashboardAlert tone="warning" title="Curadoria necessária" text={`${reviewing} questões aguardam revisão docente antes de compor avaliações.`} />
            <DashboardAlert tone="danger" title="Baixa cobertura" text={`${lowCoverage} descritores possuem menos de 20 questões validadas.`} />
            <DashboardAlert title="Aplicações monitoradas" text={`${assessments.filter((assessment) => assessment.status === "aberta").length} avaliação(ões) abertas no escopo atual.`} />
            <DashboardAlert tone="warning" title="Próxima ação sugerida" text="Priorizar validação dos descritores com baixa cobertura antes de novas aplicações formativas." />
          </div>
        </article>
      </section>

      <section className="dashboard-grid two">
        <article className="dashboard-card">
          <div className="card-heading">
            <h3>Componentes com menor desempenho</h3>
          </div>
          {componentRows.length ? (
            componentRows.map((item) => (
              <MetricBar key={item.component} label={item.component} value={item.percentual} total={100} tone={item.percentual < 50 ? "danger" : item.percentual < 70 ? "warning" : "success"} suffix="%" />
            ))
          ) : (
            <p className="empty-state">Ainda não há respostas suficientes para calcular desempenho por componente.</p>
          )}
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <h3>Descritores críticos</h3>
          </div>
          {criticalDescriptors.length ? (
            <div className="critical-list">
              {criticalDescriptors.map((item) => (
                <div className="critical-item" key={item.code}>
                  <strong>{item.code} · {item.percentual}%</strong>
                  <span>{item.component}</span>
                  <p>{item.descricao}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">Os descritores críticos aparecerão após o envio das primeiras avaliações.</p>
          )}
        </article>
      </section>

      <section className="dashboard-card">
        <div className="card-heading">
          <h3>Avaliações recentes</h3>
          <span className="tag">{assessmentRows.length} registros</span>
        </div>
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Turma</th>
                <th>Etapa</th>
                <th>Status</th>
                <th>Questões</th>
                <th>Respostas</th>
                <th>Média</th>
              </tr>
            </thead>
            <tbody>
              {assessmentRows.length ? assessmentRows.map(({ assessment, respostas: totalRespostas, media }) => (
                <tr key={assessment.codigo_acesso}>
                  <td><strong>{assessment.codigo_acesso}</strong></td>
                  <td>{assessment.turma_codigo}</td>
                  <td>{assessment.etapa}</td>
                  <td><span className={`status-pill ${assessment.status ?? "rascunho"}`}>{assessment.status ?? "rascunho"}</span></td>
                  <td>{assessment.quantidade_questoes}</td>
                  <td>{totalRespostas}</td>
                  <td>{media}%</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7}>Nenhuma avaliação no escopo atual.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricBar({
  label,
  value,
  total,
  suffix = "",
  tone = "success",
}: {
  label: string;
  value: number;
  total: number;
  suffix?: string;
  tone?: "success" | "warning" | "danger";
}) {
  const percent = Math.min(100, Math.max(0, total ? Math.round((value / total) * 100) : 0));
  return (
    <div className="metric-row">
      <span>{label}</span>
      <div className={`metric-track ${tone}`}>
        <i style={{ width: `${percent}%` }} />
      </div>
      <strong>{value}{suffix}</strong>
    </div>
  );
}

function DashboardAlert({ title, text, tone = "success" }: { title: string; text: string; tone?: "success" | "warning" | "danger" }) {
  return (
    <div className={`dashboard-alert ${tone}`}>
      <span />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function StudentAccess({
  assessments,
  questoes,
  respostas,
  setRespostas,
  setMessage,
}: {
  assessments: AvaliacaoDraft[];
  questoes: QuestaoDraft[];
  respostas: RespostaAvaliacaoDraft[];
  setRespostas: (respostas: RespostaAvaliacaoDraft[]) => void;
  setMessage: (message: string) => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [studentSession, setStudentSession] = useState<{ assessment: AvaliacaoDraft; name: string } | null>(null);
  const assessment = assessments.find((item) => item.codigo_acesso === code.trim().toUpperCase());

  if (studentSession) {
    return (
      <StudentAssessmentRunner
        assessment={studentSession.assessment}
        questoes={questoes}
        studentName={studentSession.name}
        respostas={respostas}
        setRespostas={setRespostas}
        previewMode={false}
        onBack={() => setStudentSession(null)}
      />
    );
  }

  return (
    <section className="panel compact">
      <h2>Área do Estudante</h2>
      <p>O estudante informa o código da turma/avaliação e o nome completo para iniciar a prova online.</p>
      <div className="form-grid">
        <label>
          Código da avaliação
          <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="Ex.: TECINF-26-01" />
        </label>
        <label>
          Nome completo
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Digite o nome completo" />
        </label>
      </div>
      {assessment && (
        <div className="assessment-card">
          <strong>{assessment.titulo}</strong>
          <span>{assessment.turma_codigo} · {assessment.quantidade_questoes} questões · {assessment.etapa}</span>
        </div>
      )}
      <button
        className="primary"
        disabled={!assessment || name.trim().split(" ").length < 2}
        onClick={() => {
          if (!assessment) return;
          if ((assessment.status ?? "rascunho") !== "aberta") {
            setMessage("Esta avaliação não está aberta para aplicação no momento.");
            return;
          }
          if (respostas.some((resposta) => resposta.estudante_chave === studentAttemptKey(assessment.codigo_acesso, name))) {
            setMessage("Este aluno já enviou esta avaliação. Uma nova tentativa deve ser liberada pela gestão/professor.");
            return;
          }
          setStudentSession({ assessment, name: name.trim() });
        }}
      >
        Iniciar avaliação
      </button>
      <p className="helper">Nenhum diagnóstico ou intervenção aparece para o estudante.</p>
    </section>
  );
}

function StudentAssessmentRunner({
  assessment,
  questoes,
  studentName,
  respostas,
  setRespostas,
  previewMode,
  onBack,
}: {
  assessment: AvaliacaoDraft;
  questoes: QuestaoDraft[];
  studentName: string;
  respostas: RespostaAvaliacaoDraft[];
  setRespostas: (respostas: RespostaAvaliacaoDraft[]) => void;
  previewMode: boolean;
  onBack: () => void;
}) {
  const [attemptSeed] = useState(() => `${assessment.codigo_acesso}-${studentName}-${Date.now()}-${Math.random()}`);
  const assessmentQuestions = useMemo(
    () => shuffleWithSeed(getAssessmentQuestions(assessment, questoes), attemptSeed),
    [assessment, questoes, attemptSeed],
  );
  const [answers, setAnswers] = useState<Record<string, AlternativaKey>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const answeredCount = assessmentQuestions.filter((questao) => answers[questao.codigo]).length;
  const allAnswered = assessmentQuestions.length > 0 && answeredCount === assessmentQuestions.length;

  function setAnswer(questionCode: string, answer: AlternativaKey) {
    setAnswers((current) => ({ ...current, [questionCode]: answer }));
  }

  async function submitAssessment() {
    if (!allAnswered) return;
    if (previewMode) {
      setSubmitted(true);
      return;
    }
    const estudante_chave = studentAttemptKey(assessment.codigo_acesso, studentName);
    if (respostas.some((resposta) => resposta.estudante_chave === estudante_chave)) {
      setSubmitted(true);
      return;
    }
    const result = calculateStudentResult(assessment, assessmentQuestions, answers);
    const submission: RespostaAvaliacaoDraft = {
      id: crypto.randomUUID(),
      avaliacao_codigo: assessment.codigo_acesso,
      avaliacao_titulo: assessment.titulo,
      estudante_nome: studentName,
      estudante_chave,
      turma_codigo: assessment.turma_codigo,
      curso_tecnico: assessment.curso_tecnico,
      escola_inep: assessment.escola_inep,
      professor_matricula: assessment.professor_matricula,
      etapa: assessment.etapa,
      ordem_questoes: assessmentQuestions.map((questao) => questao.codigo),
      respostas: answers,
      acertos: result.acertos,
      total_questoes: result.total_questoes,
      percentual_bruto: result.percentual_bruto,
      desempenho_por_descritor: result.desempenho_por_descritor,
      desempenho_por_componente: result.desempenho_por_componente,
      enviado_em: new Date().toISOString(),
      origem: "local",
    };
    const saved = await salvarRespostaAvaliacao(submission);
    if (saved.erro) {
      setSubmitError(saved.erro);
      return;
    }
    if (saved.data) {
      setRespostas([...respostas.filter((resposta) => resposta.estudante_chave !== estudante_chave), saved.data]);
    }
    setSubmitError("");
    setSubmitted(true);
  }

  if (!assessmentQuestions.length) {
    return (
      <section className="panel compact student-runner">
        <div className="student-runner-header">
          <div>
            <p className="eyebrow">Avaliação indisponível</p>
            <h2>{assessment.titulo}</h2>
            <p>
              Esta avaliação foi localizada pelo código, mas ainda não possui questões publicadas vinculadas.
              O professor precisa republicar a avaliação com itens validados no Banco de Itens.
            </p>
          </div>
        </div>
        <button className="secondary" onClick={onBack}>Voltar ao acesso</button>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="panel compact student-runner">
        <div className="submission-card">
          <ShieldCheck size={34} />
          <p className="eyebrow">Envio registrado</p>
          <h2>{previewMode ? "Pré-visualização finalizada" : "Avaliação finalizada"}</h2>
          <p>
            {previewMode
              ? "Esta simulação não grava respostas nem altera relatórios."
              : `${studentName}, suas respostas foram recebidas. O diagnóstico pedagógico, os relatórios e as intervenções ficam disponíveis apenas para professor e gestão.`}
          </p>
          <strong>{answeredCount}/{assessmentQuestions.length} questões respondidas</strong>
        </div>
        <button className="secondary" onClick={onBack}>Sair da avaliação</button>
      </section>
    );
  }

  return (
    <section className="panel compact student-runner">
      <div className="student-runner-header">
        <div>
          <p className="eyebrow">{previewMode ? "Pré-visualização do professor" : "Prova online"}</p>
          <h2>{assessment.titulo}</h2>
          <p>{studentName} - {assessment.turma_codigo} - {assessment.etapa}</p>
        </div>
        <span className="count-chip">{answeredCount}/{assessmentQuestions.length} respondidas</span>
      </div>

      <div className="notice">
        Prova individual com ordem de questões embaralhada por acesso. Responda todas as questões antes de enviar.
        O estudante não visualiza gabarito, proficiência, TRI, diagnóstico ou trilhas de recomposição.
      </div>

      <div className="question-list">
        {assessmentQuestions.map((questao, index) => (
          <article className="student-question-card" key={questao.codigo}>
            <div className="question-title-row">
              <span>Questão {index + 1}</span>
              <small>{questao.componente_curricular} - {questao.descritor_codigo}</small>
            </div>
            <p>{questao.enunciado}</p>
            {questao.imagem_url && (
              <div className="question-image-box">
                <img src={questao.imagem_url} alt={`Imagem de apoio da questão ${index + 1}`} />
              </div>
            )}
            {(["A", "B", "C", "D", "E"] as AlternativaKey[]).map((option) => {
              const text = questao[`alternativa_${option.toLowerCase()}` as keyof QuestaoDraft] as string;
              return (
                <label className="option-row" key={option}>
                  <input
                    type="radio"
                    name={questao.codigo}
                    checked={answers[questao.codigo] === option}
                    onChange={() => setAnswer(questao.codigo, option)}
                  />
                  <strong>{option}</strong>
                  <span>{text}</span>
                </label>
              );
            })}
          </article>
        ))}
      </div>

      <div className="student-runner-actions">
        <button className="secondary" onClick={onBack}>Voltar</button>
        <button className="primary" disabled={!allAnswered} onClick={submitAssessment}>
          Enviar avaliação
        </button>
      </div>
      {submitError && <p className="notice warning">{submitError}</p>}
      {!allAnswered && <p className="helper">Faltam {assessmentQuestions.length - answeredCount} questões para liberar o envio.</p>}
    </section>
  );
}

function Schools({
  schools,
  allSchools,
  setSchools,
  setMessage,
  currentUser,
}: {
  schools: EscolaDraft[];
  allSchools: EscolaDraft[];
  setSchools: (schools: EscolaDraft[]) => void;
  setMessage: (message: string) => void;
  currentUser: AuthUser;
}) {
  const [draft, setDraft] = useState<EscolaDraft>({
    codigo_inep: "",
    nome_oficial: "",
    tipo: "EEEP",
    regional_codigo: "CREDE-3",
    municipio: "",
    email_principal: "",
    emails_adicionais: "",
    telefone: "",
    diretor_nome: "",
    coordenador_ep_nome: "",
    status: "ativa",
    senha_acesso: "",
    alterar_senha_primeiro_login: true,
  });
  const canChooseRegional = currentUser.role === "seduc" || currentUser.role === "administrador";

  async function save() {
    if (!draft.codigo_inep || !draft.nome_oficial || !draft.email_principal || !draft.municipio) {
      setMessage("Preencha INEP, nome oficial, município e e-mail institucional da escola.");
      return;
    }

    const normalized: EscolaDraft = {
      ...draft,
      regional_codigo: canChooseRegional ? draft.regional_codigo : currentUser.regional_codigo ?? draft.regional_codigo,
      status: draft.status ?? "ativa",
      senha_acesso: draft.senha_acesso || draft.codigo_inep,
      alterar_senha_primeiro_login: draft.alterar_senha_primeiro_login ?? true,
    };

    const result = await salvarEscola(normalized);
    if (result.erro) {
      setMessage(result.erro);
      return;
    }

    setSchools([...allSchools.filter((school) => school.codigo_inep !== normalized.codigo_inep), normalized]);
    setMessage(`Escola salva em modo ${result.modo}.`);
    setDraft({
      ...draft,
      codigo_inep: "",
      nome_oficial: "",
      municipio: "",
      email_principal: "",
      emails_adicionais: "",
      telefone: "",
      senha_acesso: "",
      alterar_senha_primeiro_login: true,
    });
  }

  async function resetSchoolPassword(school: EscolaDraft) {
    const updated: EscolaDraft = {
      ...school,
      senha_acesso: school.codigo_inep,
      alterar_senha_primeiro_login: true,
    };
    const result = await salvarEscola(updated);
    if (result.erro) {
      setMessage(result.erro);
      return;
    }
    setSchools([...allSchools.filter((item) => item.codigo_inep !== updated.codigo_inep), updated]);
    setMessage(`Senha da gestão escolar de ${updated.nome_oficial} redefinida para o INEP da escola.`);
  }

  function editSchool(school: EscolaDraft) {
    setDraft({ ...school, status: school.status ?? "ativa" });
    setMessage(`Editando cadastro de ${school.nome_oficial}.`);
  }

  async function toggleSchoolStatus(school: EscolaDraft) {
    const updated: EscolaDraft = { ...school, status: (school.status ?? "ativa") === "ativa" ? "inativa" : "ativa" };
    const result = await salvarEscola(updated);
    if (result.erro) {
      setMessage(result.erro);
      return;
    }
    setSchools([...allSchools.filter((item) => item.codigo_inep !== updated.codigo_inep), updated]);
    setMessage(`${updated.nome_oficial} marcada como ${updated.status}.`);
  }

  return (
    <section className="panel">
      <h2>Cadastro de Escolas</h2>
      <p>Código INEP como identificador único, com vínculo obrigatório à CREDE/SEFOR e aos e-mails institucionais.</p>
      <div className="form-grid">
        <Field label="Código INEP" value={draft.codigo_inep} onChange={(value) => setDraft({ ...draft, codigo_inep: value })} />
        <Field label="Nome oficial" value={draft.nome_oficial} onChange={(value) => setDraft({ ...draft, nome_oficial: value })} />
        <label>
          Tipo
          <select value={draft.tipo} onChange={(event) => setDraft({ ...draft, tipo: event.target.value as TipoEscola })}>
            {tipoEscolaOptions.map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>
        </label>
        <label>
          CREDE/SEFOR
          <select value={canChooseRegional ? draft.regional_codigo : currentUser.regional_codigo ?? draft.regional_codigo} disabled={!canChooseRegional} onChange={(event) => setDraft({ ...draft, regional_codigo: event.target.value })}>
            {regionaisSeed.map((regional) => (
              <option value={regional.codigo} key={regional.codigo}>{regional.codigo}</option>
            ))}
          </select>
        </label>
        <Field label="Município" value={draft.municipio} onChange={(value) => setDraft({ ...draft, municipio: value })} />
        <Field label="E-mail institucional principal" value={draft.email_principal} onChange={(value) => setDraft({ ...draft, email_principal: value })} />
        <Field label="E-mails adicionais" value={draft.emails_adicionais} onChange={(value) => setDraft({ ...draft, emails_adicionais: value })} />
        <Field label="Telefone" value={draft.telefone ?? ""} onChange={(value) => setDraft({ ...draft, telefone: value })} />
        <Field label="Diretor(a)" value={draft.diretor_nome ?? ""} onChange={(value) => setDraft({ ...draft, diretor_nome: value })} />
        <Field label="Coordenador(a) EP" value={draft.coordenador_ep_nome ?? ""} onChange={(value) => setDraft({ ...draft, coordenador_ep_nome: value })} />
        <Field label="Senha inicial da gestão escolar" value={draft.senha_acesso ?? ""} onChange={(value) => setDraft({ ...draft, senha_acesso: value, alterar_senha_primeiro_login: true })} placeholder="Se vazio, o sistema usa o INEP" />
      </div>
      <div className="notice">
        Regra recomendada: usuário da escola = <strong>código INEP</strong> e senha inicial = <strong>código INEP</strong>. No primeiro acesso, a gestão deverá alterar a senha.
      </div>
      <button className="primary" onClick={save}>Salvar escola</button>
      <DataTable
        headers={["INEP", "Escola", "Tipo", "Regional", "Município", "E-mail", "Status"]}
        rows={schools.map((school) => [
          school.codigo_inep,
          school.nome_oficial,
          school.tipo,
          school.regional_codigo,
          school.municipio,
          school.email_principal,
          school.status ?? "ativa",
        ])}
      />
      {currentUser.role === "administrador" && (
        <div className="reference-list">
          <div className="section-heading compact">
            <h4>Controle administrativo das escolas</h4>
            <span className="count-chip">{schools.length}</span>
          </div>
          <div className="reference-grid">
            {schools.map((school) => (
              <article className="reference-card" key={school.codigo_inep}>
                <div>
                  <strong>{school.nome_oficial}</strong>
                  <em>{school.codigo_inep} · {school.status ?? "ativa"}</em>
                  <span>{school.email_principal}</span>
                  <small>{school.regional_codigo}</small>
                </div>
                <button className="secondary small" onClick={() => editSchool(school)}>
                  Editar
                </button>
                <button className="secondary small" onClick={() => toggleSchoolStatus(school)}>
                  {(school.status ?? "ativa") === "ativa" ? "Inativar" : "Reativar"}
                </button>
                <button className="secondary small" onClick={() => resetSchoolPassword(school)}>
                  Redefinir senha
                </button>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Teachers({
  teachers,
  allTeachers,
  setTeachers,
  schools,
  setMessage,
  currentUser,
}: {
  teachers: ProfessorDraft[];
  allTeachers: ProfessorDraft[];
  setTeachers: (teachers: ProfessorDraft[]) => void;
  schools: EscolaDraft[];
  setMessage: (message: string) => void;
  currentUser: AuthUser;
}) {
  const [draft, setDraft] = useState<ProfessorDraft>({
    matricula: "",
    nome_completo: "",
    cpf: "",
    telefone: "",
    email_institucional: "",
    escola_inep: "",
    curso_responsavel: "",
    componentes_responsaveis: "",
    perfil_acesso: "professor_tecnico",
    status: "ativo",
    senha_acesso: "",
    alterar_senha_primeiro_login: true,
  });
  const forcedSchoolInep = currentUser.role === "gestao_escolar" ? currentUser.escola_inep : undefined;

  async function save() {
    if (!draft.matricula || !draft.nome_completo || !draft.email_institucional || !draft.curso_responsavel) {
      setMessage("Preencha matrícula, nome, e-mail institucional e curso técnico de atuação.");
      return;
    }

    const normalized: ProfessorDraft = {
      ...draft,
      escola_inep: forcedSchoolInep ?? draft.escola_inep,
      status: draft.status ?? "ativo",
      senha_acesso: draft.senha_acesso || draft.cpf || DEFAULT_TEACHER_CPF,
      alterar_senha_primeiro_login: draft.alterar_senha_primeiro_login ?? true,
    };

    const result = await salvarProfessor(normalized);
    if (result.erro) {
      setMessage(result.erro);
      return;
    }

    setTeachers([...allTeachers.filter((teacher) => teacher.matricula !== normalized.matricula), normalized]);
    setMessage(`Profissional salvo em modo ${result.modo}.`);
    setDraft({
      ...draft,
      matricula: "",
      nome_completo: "",
      cpf: "",
      telefone: "",
      email_institucional: "",
      curso_responsavel: "",
      componentes_responsaveis: "",
      senha_acesso: "",
      alterar_senha_primeiro_login: true,
    });
  }

  async function editTeacher(teacher: ProfessorDraft) {
    setDraft({ ...teacher, status: teacher.status ?? "ativo" });
    setMessage(`Editando cadastro de ${teacher.nome_completo}.`);
  }

  async function deactivateTeacher(teacher: ProfessorDraft) {
    const updated: ProfessorDraft = { ...teacher, status: teacher.status === "inativo" ? "ativo" : "inativo" };
    const result = await salvarProfessor(updated);
    if (result.erro) {
      setMessage(result.erro);
      return;
    }
    setTeachers([...allTeachers.filter((item) => item.matricula !== updated.matricula), updated]);
    setMessage(`${updated.nome_completo} marcado como ${updated.status}.`);
  }

  async function resetTeacherPassword(teacher: ProfessorDraft) {
    const updated: ProfessorDraft = {
      ...teacher,
      senha_acesso: teacher.cpf || DEFAULT_TEACHER_CPF,
      alterar_senha_primeiro_login: true,
    };
    const result = await salvarProfessor(updated);
    if (result.erro) {
      setMessage(result.erro);
      return;
    }
    setTeachers([...allTeachers.filter((item) => item.matricula !== updated.matricula), updated]);
    setMessage(`Senha de ${updated.nome_completo} redefinida para o CPF cadastrado.`);
  }

  return (
    <section className="panel">
      <h2>Cadastro de Profissionais Técnicos</h2>
      <p>Matrícula funcional como identificador único, vinculada à escola, ao curso técnico e ao papel de atuação na EPT.</p>
      <div className="form-grid">
        <Field label="Matrícula" value={draft.matricula} onChange={(value) => setDraft({ ...draft, matricula: value })} />
        <Field label="Nome completo" value={draft.nome_completo} onChange={(value) => setDraft({ ...draft, nome_completo: value })} />
        <Field label="CPF" value={draft.cpf ?? ""} onChange={(value) => setDraft({ ...draft, cpf: value.replace(/\D/g, ""), senha_acesso: "" })} placeholder="Somente números" />
        <Field label="Telefone" value={draft.telefone ?? ""} onChange={(value) => setDraft({ ...draft, telefone: value })} />
        <Field label="E-mail institucional" value={draft.email_institucional} onChange={(value) => setDraft({ ...draft, email_institucional: value })} />
        <label>
          Escola de lotação
          <select value={forcedSchoolInep ?? draft.escola_inep} disabled={currentUser.role === "gestao_escolar"} onChange={(event) => setDraft({ ...draft, escola_inep: event.target.value })}>
            <option value="">Selecione</option>
            {forcedSchoolInep && !schools.some((school) => school.codigo_inep === forcedSchoolInep) && (
              <option value={forcedSchoolInep}>Escola vinculada à sessão · INEP {forcedSchoolInep}</option>
            )}
            {schools.map((school) => (
              <option key={school.codigo_inep} value={school.codigo_inep}>{school.nome_oficial}</option>
            ))}
          </select>
        </label>
        <label>
          Perfil
          <select value={draft.perfil_acesso} onChange={(event) => setDraft({ ...draft, perfil_acesso: event.target.value as PerfilAcesso })}>
            {perfilOptions.map((perfil) => (
              <option key={perfil.value} value={perfil.value}>{perfil.label}</option>
            ))}
          </select>
        </label>
        <Field label="Curso técnico de atuação" value={draft.curso_responsavel} onChange={(value) => setDraft({ ...draft, curso_responsavel: value })} />
        <Field
          label="Vínculo na EPT"
          value={draft.componentes_responsaveis}
          onChange={(value) => setDraft({ ...draft, componentes_responsaveis: value })}
          placeholder="Ex.: Coordenação do curso; 1ª, 2ª e 3ª série; Laboratórios; Estágio; Projeto Integrador"
        />
        <Field label="Senha inicial do professor" value={draft.senha_acesso ?? ""} onChange={(value) => setDraft({ ...draft, senha_acesso: value, alterar_senha_primeiro_login: true })} placeholder="Se vazio, o sistema usa o CPF" />
      </div>
      <div className="method-note">
        <strong>Como preencher o vínculo na EPT</strong>
        <p>
          Use este campo para registrar a atuação real do profissional no curso técnico: coordenação do curso, séries/turmas
          acompanhadas, laboratórios, estágio supervisionado, projeto integrador, banco de itens ou revisão técnica.
        </p>
      </div>
      <div className="notice">
        Regra recomendada: usuário do professor = <strong>e-mail institucional</strong> e senha inicial = <strong>CPF</strong>. O professor deverá alterar a senha no primeiro acesso.
      </div>
      <button className="primary" onClick={save}>Salvar profissional</button>
      <DataTable
        headers={["Matrícula", "Nome", "Perfil", "E-mail", "Escola", "Curso", "Vínculo EPT", "Status"]}
        rows={teachers.map((teacher) => [
          teacher.matricula,
          teacher.nome_completo,
          perfilAcessoLabel(teacher.perfil_acesso),
          teacher.email_institucional,
          schools.find((school) => school.codigo_inep === teacher.escola_inep)?.nome_oficial ?? "",
          teacher.curso_responsavel,
          teacher.componentes_responsaveis,
          teacher.status ?? "ativo",
        ])}
      />
      <div className="reference-list">
        <div className="section-heading compact">
          <h4>Ações de usuário</h4>
          <span className="count-chip">{teachers.length}</span>
        </div>
        <div className="reference-grid">
          {teachers.map((teacher) => (
            <article className="reference-card" key={teacher.matricula}>
              <div>
                <strong>{teacher.nome_completo}</strong>
                <em>{perfilAcessoLabel(teacher.perfil_acesso)} · {teacher.status ?? "ativo"}</em>
                <span>{teacher.email_institucional}</span>
                <small>{teacher.curso_responsavel} · {teacher.componentes_responsaveis || "vínculo EPT não informado"}</small>
              </div>
              <button className="secondary small" onClick={() => editTeacher(teacher)}>Editar</button>
              <button className="secondary small" onClick={() => deactivateTeacher(teacher)}>
                {(teacher.status ?? "ativo") === "ativo" ? "Desativar" : "Reativar"}
              </button>
              {currentUser.role === "administrador" && (
                <button className="secondary small" onClick={() => resetTeacherPassword(teacher)}>
                  Redefinir senha
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ItemBank({
  competencias,
  setCompetencias,
  descritores,
  setDescritores,
  questoes,
  setQuestoes,
  setMessage,
}: {
  competencias: CompetenciaDraft[];
  setCompetencias: (competencias: CompetenciaDraft[]) => void;
  descritores: DescritorDraft[];
  setDescritores: (descritores: DescritorDraft[]) => void;
  questoes: QuestaoDraft[];
  setQuestoes: (questoes: QuestaoDraft[]) => void;
  setMessage: (message: string) => void;
}) {
  const [competenciaDraft, setCompetenciaDraft] = useState<CompetenciaDraft>({
    codigo: "C02",
    curso_tecnico: "Técnico em Informática",
    descricao: "C02 - Desenvolver soluções computacionais por meio de raciocínio lógico, algoritmos, programação estruturada e orientação a objetos.",
    fonte: "Matriz curricular 2025/2026 e arquitetura SIDEP-CE",
  });
  const [descritorDraft, setDescritorDraft] = useState<DescritorDraft>({
    codigo: "D03",
    competencia_codigo: "C02",
    componente_curricular: "Lógica de Programação I (Python)",
    descricao: "D03 - Interpretar variáveis, operadores, entrada, saída e conversões de dados em algoritmos e programas Python.",
    nivel_esperado: "basico",
  });
  const [questaoDraft, setQuestaoDraft] = useState<QuestaoDraft>({
    codigo: "Q-INF-0001",
    descritor_codigo: "D03",
    componente_curricular: "Lógica de Programação I (Python)",
    enunciado: "",
    alternativa_a: "",
    alternativa_b: "",
    alternativa_c: "",
    alternativa_d: "",
    alternativa_e: "",
    gabarito: "A",
    justificativa: "",
    imagem_url: "",
    dificuldade_inicial: 1,
    status: "rascunho",
  });
  const [activeTab, setActiveTab] = useState<ItemBankTab>("competencias");
  const [questaoStatusFiltro, setQuestaoStatusFiltro] = useState<QuestaoStatusFiltro>("em_revisao");
  const [questaoEmLeitura, setQuestaoEmLeitura] = useState<QuestaoDraft | null>(null);
  const [cursoExportacao, setCursoExportacao] = useState("todos");
  const [questaoSubTab, setQuestaoSubTab] = useState<QuestaoSubTab>("cadastro");
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewComponentFilter, setReviewComponentFilter] = useState("todos");
  const [reviewDescriptorFilter, setReviewDescriptorFilter] = useState("todos");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<QuestaoStatusFiltro>("todas");
  const [cursoSelecionado, setCursoSelecionado] = useState("Técnico em Informática");
  const cursosDoBanco = Array.from(new Set(competencias.map((competencia) => competencia.curso_tecnico).filter(Boolean)));
  const cursosCadastro = [...cursosTecnicosOficiais.map((curso) => curso.nome), ...cursosDoBanco.filter((curso) => !findOfficialCourse(curso))]
    .sort((a, b) => a.localeCompare(b));
  const cursoAtual = findOfficialCourse(cursoSelecionado);
  const competenciasDoCurso = competencias.filter((competencia) => normalizeCourseName(competencia.curso_tecnico) === normalizeCourseName(cursoSelecionado));
  const codigosCompetenciasDoCurso = new Set(competenciasDoCurso.map((competencia) => competencia.codigo));
  const descritoresDoCurso = descritores.filter((descritor) => codigosCompetenciasDoCurso.has(descritor.competencia_codigo));
  const codigosDescritoresDoCurso = new Set(descritoresDoCurso.map((descritor) => descritor.codigo));
  const questoesDoCurso = questoes.filter((questao) => codigosDescritoresDoCurso.has(questao.descritor_codigo));
  const proximoCodigoQuestao = nextQuestionCodeForCourse(cursoSelecionado, questoesDoCurso);
  const componentesDaQuestao = Array.from(new Set(descritoresDoCurso.map((descritor) => descritor.componente_curricular).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const descritoresDoComponenteDaQuestao = descritoresDoCurso.filter(
    (descritor) => !questaoDraft.componente_curricular || descritor.componente_curricular === questaoDraft.componente_curricular,
  );

  useEffect(() => {
    if (!questaoDraft.codigo || !questionCodeMatchesCourse(cursoSelecionado, questaoDraft.codigo)) {
      setQuestaoDraft((current) => ({ ...current, codigo: proximoCodigoQuestao }));
    }
  }, [cursoSelecionado, proximoCodigoQuestao, questaoDraft.codigo]);

  useEffect(() => {
    if (!componentesDaQuestao.length) return;
    if (questaoDraft.componente_curricular && componentesDaQuestao.includes(questaoDraft.componente_curricular)) return;

    const primeiroComponente = componentesDaQuestao[0];
    const primeiroDescritor = descritoresDoCurso.find((descritor) => descritor.componente_curricular === primeiroComponente);
    setQuestaoDraft((current) => ({
      ...current,
      componente_curricular: primeiroComponente,
      descritor_codigo: primeiroDescritor?.codigo ?? "",
    }));
  }, [componentesDaQuestao, descritoresDoCurso, questaoDraft.componente_curricular]);

  function selecionarComponenteQuestao(componente: string) {
    const primeiroDescritor = descritoresDoCurso.find((descritor) => descritor.componente_curricular === componente);
    setQuestaoDraft({
      ...questaoDraft,
      componente_curricular: componente,
      descritor_codigo: primeiroDescritor?.codigo ?? "",
    });
  }

  function trocarCursoSelecionado(curso: string) {
    const primeiraCompetencia = competencias.find((competencia) => normalizeCourseName(competencia.curso_tecnico) === normalizeCourseName(curso));
    const descritoresDaPrimeiraCompetencia = primeiraCompetencia
      ? descritores.filter((descritor) => descritor.competencia_codigo === primeiraCompetencia.codigo)
      : [];
    const primeiroDescritor = descritoresDaPrimeiraCompetencia[0];
    const codigosCompetenciasNovoCurso = new Set(
      competencias
        .filter((competencia) => normalizeCourseName(competencia.curso_tecnico) === normalizeCourseName(curso))
        .map((competencia) => competencia.codigo),
    );
    const codigosDescritoresNovoCurso = new Set(
      descritores
        .filter((descritor) => codigosCompetenciasNovoCurso.has(descritor.competencia_codigo))
        .map((descritor) => descritor.codigo),
    );
    const questoesNovoCurso = questoes.filter((questao) => codigosDescritoresNovoCurso.has(questao.descritor_codigo));
    setCursoSelecionado(curso);
    setCompetenciaDraft({ ...competenciaDraft, curso_tecnico: curso, codigo: "C01" });
    setDescritorDraft({
      ...descritorDraft,
      codigo: "D01",
      competencia_codigo: primeiraCompetencia?.codigo ?? "",
      componente_curricular: primeiroDescritor?.componente_curricular ?? descritorDraft.componente_curricular,
    });
    setQuestaoDraft({
      ...questaoDraft,
      codigo: nextQuestionCodeForCourse(curso, questoesNovoCurso),
      descritor_codigo: primeiroDescritor?.codigo ?? "",
      componente_curricular: primeiroDescritor?.componente_curricular ?? questaoDraft.componente_curricular,
    });
    setReviewComponentFilter("todos");
    setReviewDescriptorFilter("todos");
  }

  async function saveCompetencia() {
    if (!competenciaDraft.codigo || !competenciaDraft.curso_tecnico || !competenciaDraft.descricao) {
      setMessage("Preencha código, curso técnico e descrição da competência.");
      return;
    }

    const normalized = {
      ...competenciaDraft,
      curso_tecnico: cursoSelecionado,
      codigo: scopedPedagogicalCode(cursoSelecionado, competenciaDraft.codigo),
    };
    const repeatedInCourse = competencias.some(
      (item) =>
        item.codigo !== normalized.codigo &&
        normalizeCourseName(item.curso_tecnico) === normalizeCourseName(normalized.curso_tecnico) &&
        visiblePedagogicalCode(item.codigo) === visiblePedagogicalCode(normalized.codigo),
    );
    if (repeatedInCourse) {
      setMessage(`Já existe a competência ${visiblePedagogicalCode(normalized.codigo)} cadastrada para ${normalized.curso_tecnico}.`);
      return;
    }
    const result = await salvarCompetencia(normalized);
    setCompetencias([...competencias.filter((item) => item.codigo !== normalized.codigo), normalized]);
    setDescritorDraft({ ...descritorDraft, competencia_codigo: normalized.codigo });
    setMessage(result.erro ?? `Competência salva em modo ${result.modo}.`);
  }

  async function saveDescritor() {
    if (!descritorDraft.codigo || !descritorDraft.competencia_codigo || !descritorDraft.descricao) {
      setMessage("Preencha código, competência vinculada e descrição do descritor.");
      return;
    }
    if (!competenciasDoCurso.some((item) => item.codigo === descritorDraft.competencia_codigo)) {
      setMessage("O descritor precisa estar vinculado a uma competência cadastrada no curso em trabalho.");
      return;
    }

    const competenciaVinculada = competencias.find((item) => item.codigo === descritorDraft.competencia_codigo);
    const cursoDoDescritor = competenciaVinculada?.curso_tecnico ?? cursoSelecionado;
    const normalized = { ...descritorDraft, codigo: scopedPedagogicalCode(cursoDoDescritor, descritorDraft.codigo) };
    const competenciasMesmoCurso = new Set(
      competencias
        .filter((competencia) => normalizeCourseName(competencia.curso_tecnico) === normalizeCourseName(cursoDoDescritor))
        .map((competencia) => competencia.codigo),
    );
    const repeatedInCourse = descritores.some(
      (item) =>
        item.codigo !== normalized.codigo &&
        competenciasMesmoCurso.has(item.competencia_codigo) &&
        visiblePedagogicalCode(item.codigo) === visiblePedagogicalCode(normalized.codigo),
    );
    if (repeatedInCourse) {
      setMessage(`Já existe o descritor ${visiblePedagogicalCode(normalized.codigo)} cadastrado para ${cursoDoDescritor}.`);
      return;
    }
    const result = await salvarDescritor(normalized);
    setDescritores([...descritores.filter((item) => item.codigo !== normalized.codigo), normalized]);
    setQuestaoDraft({
      ...questaoDraft,
      descritor_codigo: normalized.codigo,
      componente_curricular: normalized.componente_curricular,
    });
    setMessage(result.erro ?? `Descritor salvo em modo ${result.modo}.`);
  }

  async function saveQuestao() {
    const alternativas = [
      questaoDraft.alternativa_a,
      questaoDraft.alternativa_b,
      questaoDraft.alternativa_c,
      questaoDraft.alternativa_d,
      questaoDraft.alternativa_e,
    ];
    if (!questaoDraft.codigo || !questaoDraft.descritor_codigo || !questaoDraft.enunciado || alternativas.some((item) => !item)) {
      setMessage("Preencha código, descritor, enunciado e todas as alternativas da questão.");
      return;
    }
    if (!descritoresDoCurso.some((item) => item.codigo === questaoDraft.descritor_codigo)) {
      setMessage("A questão precisa estar vinculada a um descritor cadastrado no curso em trabalho.");
      return;
    }
    const descritorDaQuestao = descritoresDoCurso.find((item) => item.codigo === questaoDraft.descritor_codigo);
    if (!descritorDaQuestao || descritorDaQuestao.componente_curricular !== questaoDraft.componente_curricular) {
      setMessage("Selecione um descritor do componente curricular escolhido para esta questão.");
      return;
    }
    if (questaoDraft.dificuldade_inicial < 0.1 || questaoDraft.dificuldade_inicial > 5) {
      setMessage("A dificuldade inicial pré-TRI deve ficar entre 0.1 e 5.");
      return;
    }

    const normalized = { ...questaoDraft, codigo: proximoCodigoQuestao };
    const normalizedEnunciado = normalizeQuestionText(normalized.enunciado);
    const normalizedFingerprint = questionFingerprint(normalized);
    const duplicate = questoes.find((questao) => {
      if (questao.codigo.toUpperCase() === normalized.codigo) return false;

      return normalizeQuestionText(questao.enunciado) === normalizedEnunciado || questionFingerprint(questao) === normalizedFingerprint;
    });

    if (duplicate) {
      setMessage(
        `Duplicidade bloqueada: esta questão parece igual à ${duplicate.codigo}. Revise o enunciado/alternativas antes de salvar.`,
      );
      return;
    }

    const result = await salvarQuestao(normalized);
    const questoesAtualizadas = [...questoes.filter((item) => item.codigo !== normalized.codigo), normalized];
    const questoesAtualizadasDoCurso = questoesAtualizadas.filter((questao) => codigosDescritoresDoCurso.has(questao.descritor_codigo));
    setQuestoes(questoesAtualizadas);
    setQuestaoDraft({
      ...questaoDraft,
      codigo: nextQuestionCodeForCourse(cursoSelecionado, questoesAtualizadasDoCurso),
      enunciado: "",
      alternativa_a: "",
      alternativa_b: "",
      alternativa_c: "",
      alternativa_d: "",
      alternativa_e: "",
      justificativa: "",
      imagem_url: "",
    });
    setMessage(result.erro ?? `Questão salva em modo ${result.modo}. Ela já pode compor avaliações futuras.`);
  }

  function importNorteadores() {
    const banco = montarBancoNorteadorAtualizado(competencias, descritores, questoes);

    substituirBancoItensLocal(banco);
    setCompetencias(banco.competencias);
    setDescritores(banco.descritores);
    setQuestoes(banco.questoes);
    setMessage("Banco v0.3 importado: descritores-base de Informática com meta de 20 questões e itens novos em revisão docente.");
  }

  async function alterarStatusQuestao(codigo: string, status: QuestaoDraft["status"]) {
    const questao = questoes.find((item) => item.codigo === codigo);
    if (!questao) {
      setMessage("Questão não encontrada no banco de itens.");
      return;
    }

    const atualizada = { ...questao, status };
    await salvarQuestao(atualizada);
    setQuestoes(questoes.map((item) => (item.codigo === codigo ? atualizada : item)));
    setMessage(`${codigo} alterada para ${questaoStatusLabel(status)}. ${questaoStatusHint(status)}`);
  }

  const questoesValidadas = questoesDoCurso.filter((questao) => questao.status === "validada").length;
  const questoesEmRevisao = questoesDoCurso.filter((questao) => questao.status === "em_revisao").length;
  const questoesRascunho = questoesDoCurso.filter((questao) => questao.status === "rascunho").length;
  const questoesFiltradas = questoesDoCurso
    .filter((questao) => questaoStatusFiltro === "todas" || questao.status === questaoStatusFiltro)
    .slice(0, 80);
  const reviewComponents = Array.from(new Set(questoesDoCurso.map((questao) => questao.componente_curricular).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
  const reviewDescriptors = descritoresDoCurso
    .filter((descritor) => reviewComponentFilter === "todos" || descritor.componente_curricular === reviewComponentFilter)
    .sort((a, b) => a.codigo.localeCompare(b.codigo));
  const reviewQuestionsAllFiltered = questoesDoCurso
    .filter((questao) => reviewStatusFilter === "todas" || questao.status === reviewStatusFilter)
    .filter((questao) => reviewComponentFilter === "todos" || questao.componente_curricular === reviewComponentFilter)
    .filter((questao) => reviewDescriptorFilter === "todos" || questao.descritor_codigo === reviewDescriptorFilter)
    .filter((questao) => {
      const term = normalizeKey(reviewSearch);
      if (!term) return true;
      const descritor = descritores.find((item) => item.codigo === questao.descritor_codigo);
      return [
        questao.codigo,
        questao.enunciado,
        questao.componente_curricular,
        questao.descritor_codigo,
        descritor?.descricao ?? "",
      ].some((value) => normalizeKey(value).includes(term));
    });
  const reviewQuestionsFiltered = reviewQuestionsAllFiltered.slice(0, 120);
  const coberturaCompetencias = competenciasDoCurso.map((competencia) => {
    const descritoresDaCompetencia = descritores.filter((descritor) => descritor.competencia_codigo === competencia.codigo);
    const codigosDescritores = new Set(descritoresDaCompetencia.map((descritor) => descritor.codigo));
    const questoesDaCompetencia = questoes.filter((questao) => codigosDescritores.has(questao.descritor_codigo));

    return {
      competencia,
      descritores: descritoresDaCompetencia.length,
      total: questoesDaCompetencia.length,
      validadas: questoesDaCompetencia.filter((questao) => questao.status === "validada").length,
      emRevisao: questoesDaCompetencia.filter((questao) => questao.status === "em_revisao").length,
      rascunhos: questoesDaCompetencia.filter((questao) => questao.status === "rascunho").length,
    };
  });
  const coberturaDescritores = descritoresDoCurso.map((descritor) => {
    const questoesDoDescritor = questoes.filter((questao) => questao.descritor_codigo === descritor.codigo);

    return {
      descritor,
      total: questoesDoDescritor.length,
      validadas: questoesDoDescritor.filter((questao) => questao.status === "validada").length,
      emRevisao: questoesDoDescritor.filter((questao) => questao.status === "em_revisao").length,
      rascunhos: questoesDoDescritor.filter((questao) => questao.status === "rascunho").length,
    };
  });
  const competenciaSelecionada = competencias.find((item) => item.codigo === descritorDraft.competencia_codigo);
  const descritorSelecionado = descritores.find((item) => item.codigo === questaoDraft.descritor_codigo);
  const competenciaDaQuestao = descritorSelecionado
    ? competencias.find((item) => item.codigo === descritorSelecionado.competencia_codigo)
    : undefined;
  const cursosDisponiveisExportacao = Array.from(new Set(competencias.map((competencia) => competencia.curso_tecnico))).sort((a, b) =>
    a.localeCompare(b),
  );
  const competenciasExportacao =
    cursoExportacao === "todos"
      ? competencias
      : competencias.filter((competencia) => normalizeKey(competencia.curso_tecnico) === normalizeKey(cursoExportacao));
  const codigosCompetenciasExportacao = new Set(competenciasExportacao.map((competencia) => competencia.codigo));
  const descritoresExportacao =
    cursoExportacao === "todos"
      ? descritores
      : descritores.filter((descritor) => codigosCompetenciasExportacao.has(descritor.competencia_codigo));

  function exportarMatrizMarkdown() {
    if (!competenciasExportacao.length || !descritoresExportacao.length) {
      setMessage("Não há competências e descritores suficientes para exportar a matriz.");
      return;
    }

    const markdown = generateCourseDescriptorsMarkdown(competenciasExportacao, descritoresExportacao);
    const suffix = cursoExportacao === "todos" ? "todos-os-cursos" : safeFileSegment(cursoExportacao);
    downloadTextFile(`sidep-ce-componentes-descritores-${suffix}.md`, markdown, "text/markdown;charset=utf-8");
    setMessage(`Matriz exportada em Markdown: ${cursoExportacao === "todos" ? "todos os cursos" : cursoExportacao}.`);
  }

  function exportarMatrizPdf() {
    if (!competenciasExportacao.length || !descritoresExportacao.length) {
      setMessage("Não há competências e descritores suficientes para exportar a matriz.");
      return;
    }

    const html = generateCourseDescriptorsHtml(competenciasExportacao, descritoresExportacao);
    const opened = openPrintableHtml(html);
    setMessage(
      opened
        ? "Versão de impressão aberta. No navegador, escolha Salvar como PDF."
        : "O navegador bloqueou a janela de impressão. Libere pop-ups para exportar em PDF.",
    );
  }

  function useCompetenciaInDescritor(competencia: CompetenciaDraft) {
    setDescritorDraft({ ...descritorDraft, competencia_codigo: competencia.codigo });
    setActiveTab("descritores");
  }

  function useDescritorInQuestao(descritor: DescritorDraft) {
    setQuestaoDraft({
      ...questaoDraft,
      descritor_codigo: descritor.codigo,
      componente_curricular: descritor.componente_curricular,
    });
    setActiveTab("questoes");
  }

  const questaoSubTabDetails: Record<QuestaoSubTab, { eyebrow: string; title: string; description: string; scope: string }> = {
    cadastro: {
      eyebrow: "Banco de Itens",
      title: "Cadastro qualificado de questões",
      description: "Crie itens vinculados a descritores, componentes e competências, preservando rastreabilidade para o diagnóstico pré-TRI.",
      scope: "Cadastro",
    },
    curadoria: {
      eyebrow: "Curadoria docente",
      title: "Validação técnica e pedagógica dos itens",
      description: "Revise, valide ou devolva questões ao rascunho antes que elas entrem nas avaliações dos estudantes.",
      scope: "Curadoria",
    },
    cobertura: {
      eyebrow: "Cobertura curricular",
      title: "Distribuição do banco por competência e descritor",
      description: "Acompanhe a quantidade de itens por competência, descritor, status e componente curricular.",
      scope: "Cobertura",
    },
    inventario: {
      eyebrow: "Inventário técnico",
      title: "Consulta estruturada do banco de questões",
      description: "Veja código, descritor, competência, componente, gabarito, dificuldade e situação de cada item.",
      scope: "Inventário",
    },
    solicitacoes: {
      eyebrow: "Revisão colaborativa",
      title: "Solicitações de melhoria entre professores",
      description: "Localize qualquer questão do banco, revise itens próprios e solicite ajustes ao criador quando necessário.",
      scope: "Solicitações",
    },
    historico: {
      eyebrow: "Rastreabilidade",
      title: "Histórico de revisão dos itens",
      description: "Acompanhe solicitações, decisões e encaminhamentos para manter auditoria pedagógica do banco.",
      scope: "Histórico",
    },
  };

  return (
    <section className="panel">
      <section className="dashboard-hero page-banner">
        <div>
          <p className="eyebrow">Banco de Itens</p>
          <h2>Matriz avaliativa, descritores e questões</h2>
          <p>
            Cadastre competências, descritores e questões alinhadas às matrizes dos cursos técnicos. Esta camada prepara
            a geração de provas, a curadoria docente e a futura calibração TRI.
          </p>
        </div>
        <div className="dashboard-scope">
          <span>Base</span>
          <strong>{questoesDoCurso.length} itens</strong>
        </div>
      </section>
      <div className="toolbar">
        <label>
          Curso em trabalho
          <select value={cursoSelecionado} onChange={(event) => trocarCursoSelecionado(event.target.value)}>
            {cursosCadastro.map((curso) => (
              <option key={curso} value={curso}>{curso}</option>
            ))}
          </select>
        </label>
        <div className="status-chip course-chip">
          {cursoAtual ? `${cursoAtual.codigo} · ${cursoAtual.eixo}` : "Curso não oficial"}
        </div>
        <button className="secondary" onClick={importNorteadores}>Importar matriz piloto dos norteadores</button>
        <label>
          Exportar curso
          <select value={cursoExportacao} onChange={(event) => setCursoExportacao(event.target.value)}>
            <option value="todos">Todos os cursos</option>
            {cursosDisponiveisExportacao.map((curso) => (
              <option key={curso} value={curso}>{curso}</option>
            ))}
          </select>
        </label>
        <button className="secondary" type="button" onClick={exportarMatrizMarkdown}>Exportar MD</button>
        <button className="secondary" type="button" onClick={exportarMatrizPdf}>Exportar PDF</button>
      </div>
      <div className="kpis">
        <article className="kpi"><span>Cursos oficiais</span><strong>{cursosTecnicosOficiais.length}</strong></article>
        <article className="kpi"><span>Competências do curso</span><strong>{competenciasDoCurso.length}</strong></article>
        <article className="kpi"><span>Descritores do curso</span><strong>{descritoresDoCurso.length}</strong></article>
        <article className="kpi"><span>Questões do curso</span><strong>{questoesDoCurso.length}</strong></article>
        <article className="kpi"><span>Validadas</span><strong>{questoesValidadas}</strong></article>
        <article className="kpi"><span>Em revisão</span><strong>{questoesEmRevisao}</strong></article>
        <article className="kpi"><span>Rascunhos</span><strong>{questoesRascunho}</strong></article>
      </div>

      <div className="dependency-flow">
        <div>
          <strong>1. Competência</strong>
          <span>Define o saber profissional esperado.</span>
        </div>
        <div>
          <strong>2. Descritor</strong>
          <span>Transforma a competência em evidência avaliável.</span>
        </div>
        <div>
          <strong>3. Questão</strong>
          <span>Mede um descritor e alimenta o diagnóstico pré-TRI.</span>
        </div>
      </div>

      <div className="method-note">
        <strong>Como ler esta matriz avaliativa</strong>
        <p>
          <b>Competência</b> é uma capacidade ampla do curso técnico, como desenvolver software ou realizar suporte e manutenção.
          <b> Descritor</b> é a evidência observável dessa competência, escrita de forma específica para virar questão, rubrica e relatório.
          Na lógica pré-TRI/TRI, a questão mede o descritor; depois os resultados dos descritores são agrupados para interpretar a competência.
        </p>
        <p>
          Códigos <b>C01, C02, C03...</b> identificam competências amplas. Códigos <b>D01, D02, D03...</b> identificam
          descritores avaliáveis vinculados a uma competência. Esses códigos serão usados nos relatórios, gráficos e trilhas
          de recomposição.
        </p>
        <p>
          A base exibida agora é uma matriz piloto saneada. A próxima etapa metodológica é construir uma nova matriz oficial:
          primeiro a partir dos componentes e objetivos da matriz curricular do curso, depois desdobrando cada competência em
          descritores observáveis e, por fim, vinculando itens e rubricas.
        </p>
      </div>

      <div className="item-bank-tabs" role="tablist" aria-label="Subtelas do banco de itens">
        <button className={activeTab === "competencias" ? "active" : ""} onClick={() => setActiveTab("competencias")}>
          Competências
        </button>
        <button className={activeTab === "descritores" ? "active" : ""} onClick={() => setActiveTab("descritores")}>
          Descritores
        </button>
        <button className={activeTab === "questoes" ? "active" : ""} onClick={() => setActiveTab("questoes")}>
          Questões
        </button>
      </div>

      {activeTab === "competencias" && (
        <section className="subpanel">
          <div className="section-heading">
            <div>
              <h3>Cadastro de Competências</h3>
              <p>Comece por aqui. A competência é o agrupador maior do banco e será usada pelos descritores.</p>
            </div>
            <span className="count-chip">{competenciasDoCurso.length} cadastradas</span>
          </div>
          <div className="form-grid single">
            <Field label="Código pedagógico da competência" value={visiblePedagogicalCode(competenciaDraft.codigo)} onChange={(value) => setCompetenciaDraft({ ...competenciaDraft, codigo: value.toUpperCase() })} />
            <label>
              Curso técnico
              <select value={cursoSelecionado} onChange={(event) => trocarCursoSelecionado(event.target.value)}>
                {cursosCadastro.map((curso) => (
                  <option key={curso} value={curso}>{curso}</option>
                ))}
              </select>
            </label>
            <TextArea label="Descrição da competência" value={competenciaDraft.descricao} onChange={(value) => setCompetenciaDraft({ ...competenciaDraft, descricao: value })} />
            <Field label="Fonte normativa/matriz" value={competenciaDraft.fonte} onChange={(value) => setCompetenciaDraft({ ...competenciaDraft, fonte: value })} />
          </div>
          <button className="primary" onClick={saveCompetencia}>Salvar competência</button>

          <ReferenceList
            title="Códigos de competências"
            empty="Nenhuma competência cadastrada ainda. Importe os norteadores ou salve a primeira competência."
            kind="competencia"
            items={competenciasDoCurso.map((competencia) => ({
              code: visiblePedagogicalCode(competencia.codigo),
              title: competencia.curso_tecnico,
              description: competencia.descricao,
              meta: `${courseCode(competencia.curso_tecnico)} · ${competencia.fonte}`,
              actionLabel: "Usar no descritor",
              onAction: () => useCompetenciaInDescritor(competencia),
            }))}
          />
        </section>
      )}

      {activeTab === "descritores" && (
        <section className="subpanel">
          <div className="section-heading">
            <div>
              <h3>Cadastro de Descritores</h3>
              <p>O descritor sempre depende de uma competência. Ele diz exatamente o que será observado na avaliação.</p>
            </div>
            <span className="count-chip">{descritoresDoCurso.length} cadastrados</span>
          </div>
          <div className="course-context-panel">
            <label>
              Curso técnico do descritor
              <select value={cursoSelecionado} onChange={(event) => trocarCursoSelecionado(event.target.value)}>
                {cursosCadastro.map((curso) => (
                  <option key={curso} value={curso}>{curso}</option>
                ))}
              </select>
            </label>
            <div>
              <strong>{cursoAtual ? `${cursoAtual.codigo} · ${cursoAtual.eixo}` : "Curso cadastrado localmente"}</strong>
              <span>
                {competenciasDoCurso.length} competências disponíveis para vincular descritores neste curso.
              </span>
            </div>
          </div>
          <div className="link-context">
            <strong>Competência selecionada</strong>
            <span>{competenciaSelecionada ? `${visiblePedagogicalCode(competenciaSelecionada.codigo)} · ${competenciaSelecionada.descricao}` : "Selecione uma competência cadastrada para vincular o descritor."}</span>
          </div>
          <div className="form-grid single">
            <Field label="Código pedagógico do descritor" value={visiblePedagogicalCode(descritorDraft.codigo)} onChange={(value) => setDescritorDraft({ ...descritorDraft, codigo: value.toUpperCase() })} />
            <label>
              Competência vinculada
              <select value={descritorDraft.competencia_codigo} onChange={(event) => setDescritorDraft({ ...descritorDraft, competencia_codigo: event.target.value })}>
                <option value="">Selecione</option>
                {competenciasDoCurso.map((competencia) => (
                  <option key={competencia.codigo} value={competencia.codigo}>{visiblePedagogicalCode(competencia.codigo)} · {competencia.descricao}</option>
                ))}
              </select>
            </label>
            <Field label="Componente curricular" value={descritorDraft.componente_curricular} onChange={(value) => setDescritorDraft({ ...descritorDraft, componente_curricular: value })} />
            <label>
              Nível esperado
              <select value={descritorDraft.nivel_esperado} onChange={(event) => setDescritorDraft({ ...descritorDraft, nivel_esperado: event.target.value as DescritorDraft["nivel_esperado"] })}>
                <option value="basico">Básico</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </label>
            <TextArea label="Descrição avaliável" value={descritorDraft.descricao} onChange={(value) => setDescritorDraft({ ...descritorDraft, descricao: value })} />
          </div>
          <button className="primary" onClick={saveDescritor}>Salvar descritor</button>

          <ReferenceList
            title="Códigos de descritores"
            empty="Nenhum descritor cadastrado ainda. Cadastre um descritor depois de criar/importar competências."
            kind="descritor"
            items={descritoresDoCurso.map((descritor) => {
              const competencia = competencias.find((item) => item.codigo === descritor.competencia_codigo);
              return {
                code: visiblePedagogicalCode(descritor.codigo),
                title: descritor.componente_curricular,
                description: descritor.descricao,
                meta: `Competência: ${competencia ? visiblePedagogicalCode(competencia.codigo) : descritor.competencia_codigo}${competencia ? ` · ${competencia.descricao}` : ""}`,
                actionLabel: "Usar na questão",
                onAction: () => useDescritorInQuestao(descritor),
              };
            })}
          />
        </section>
      )}

      {activeTab === "questoes" && (
      <section className="subpanel wide">
        <section className="dashboard-hero subtab-banner">
          <div>
            <p className="eyebrow">{questaoSubTabDetails[questaoSubTab].eyebrow}</p>
            <h2>{questaoSubTabDetails[questaoSubTab].title}</h2>
            <p>{questaoSubTabDetails[questaoSubTab].description}</p>
          </div>
          <div className="dashboard-scope">
            <span>{questaoSubTabDetails[questaoSubTab].scope}</span>
            <strong>{questoesDoCurso.length} questões</strong>
          </div>
        </section>

        <div className="question-module-tabs" role="tablist" aria-label="Subtelas da aba Questões">
          {[
            ["cadastro", "1. Cadastro"],
            ["curadoria", "2. Curadoria"],
            ["cobertura", "3. Cobertura"],
            ["inventario", "4. Inventário"],
            ["solicitacoes", "5. Solicitações"],
            ["historico", "6. Histórico"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={questaoSubTab === id ? "active" : ""}
              onClick={() => setQuestaoSubTab(id as QuestaoSubTab)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="question-module-kpis">
          <article>
            <span>Total</span>
            <strong>{questoesDoCurso.length}</strong>
            <small>questões cadastradas</small>
          </article>
          <article>
            <span>Validadas</span>
            <strong>{questoesValidadas}</strong>
            <small>liberadas para avaliação</small>
          </article>
          <article>
            <span>Em revisão</span>
            <strong>{questoesEmRevisao}</strong>
            <small>fora das provas</small>
          </article>
          <article>
            <span>Rascunhos</span>
            <strong>{questoesRascunho}</strong>
            <small>em elaboração</small>
          </article>
        </div>

        {questaoSubTab === "cadastro" && (
        <section className="question-module-section">
          <div className="section-heading compact">
            <div>
              <h4>Cadastro de questão</h4>
              <p>A questão deve nascer ligada a um descritor. O sistema puxa o componente curricular e mostra a competência associada.</p>
            </div>
          </div>
        <div className="course-context-panel">
          <label>
            Curso técnico da questão
            <select value={cursoSelecionado} onChange={(event) => trocarCursoSelecionado(event.target.value)}>
              {cursosCadastro.map((curso) => (
                <option key={curso} value={curso}>{curso}</option>
              ))}
            </select>
          </label>
          <div>
            <strong>{cursoAtual ? `${cursoAtual.codigo} · ${cursoAtual.eixo}` : "Curso cadastrado localmente"}</strong>
            <span>
              {descritoresDoCurso.length} descritores e {questoesDoCurso.length} questões cadastradas neste curso.
            </span>
          </div>
        </div>
        <div className="link-context">
          <strong>Caminho da questão</strong>
          <span>
            {descritorSelecionado
              ? `${questaoDraft.codigo} → ${visiblePedagogicalCode(descritorSelecionado.codigo)} · ${descritorSelecionado.descricao} → ${competenciaDaQuestao ? visiblePedagogicalCode(competenciaDaQuestao.codigo) : "competência não encontrada"}`
              : "Selecione um descritor para vincular a questão ao mapa de competências."}
          </span>
        </div>
        <div className="form-grid">
          <Field
            label="Código da questão"
            value={questaoDraft.codigo}
            onChange={() => undefined}
            readOnly
            helper="Gerado automaticamente a partir da última questão cadastrada neste curso."
          />
          <label>
            Componente curricular
            <select value={questaoDraft.componente_curricular} onChange={(event) => selecionarComponenteQuestao(event.target.value)}>
              <option value="">Selecione o componente</option>
              {componentesDaQuestao.map((componente) => (
                <option key={componente} value={componente}>{componente}</option>
              ))}
            </select>
          </label>
          <label>
            Descritor vinculado
            <select value={questaoDraft.descritor_codigo} onChange={(event) => {
              const descritor = descritoresDoComponenteDaQuestao.find((item) => item.codigo === event.target.value);
              setQuestaoDraft({
                ...questaoDraft,
                descritor_codigo: event.target.value,
                componente_curricular: descritor?.componente_curricular ?? questaoDraft.componente_curricular,
              });
            }}>
              <option value="">Selecione</option>
              {descritoresDoComponenteDaQuestao.map((descritor) => (
                <option key={descritor.codigo} value={descritor.codigo}>{visiblePedagogicalCode(descritor.codigo)} · {descritor.componente_curricular} · {descritor.descricao}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={questaoDraft.status} onChange={(event) => setQuestaoDraft({ ...questaoDraft, status: event.target.value as QuestaoDraft["status"] })}>
              <option value="rascunho">Rascunho</option>
              <option value="em_revisao">Em revisão</option>
              <option value="validada">Validada</option>
            </select>
          </label>
          <TextArea label="Enunciado" value={questaoDraft.enunciado} onChange={(value) => setQuestaoDraft({ ...questaoDraft, enunciado: value })} />
          <Field
            label="Imagem da questão (opcional)"
            value={questaoDraft.imagem_url ?? ""}
            placeholder="Cole uma URL pública ou base64 da imagem"
            onChange={(value) => setQuestaoDraft({ ...questaoDraft, imagem_url: value })}
            helper="Use quando o item precisar de figura, diagrama, tabela ou captura de tela."
          />
          {questaoDraft.imagem_url && (
            <div className="question-image-preview">
              <span>Prévia da imagem</span>
              <img src={questaoDraft.imagem_url} alt="Prévia da imagem vinculada à questão" />
            </div>
          )}
          <TextArea label="Justificativa pedagógica" value={questaoDraft.justificativa} onChange={(value) => setQuestaoDraft({ ...questaoDraft, justificativa: value })} />
          <Field label="Alternativa A" value={questaoDraft.alternativa_a} onChange={(value) => setQuestaoDraft({ ...questaoDraft, alternativa_a: value })} />
          <Field label="Alternativa B" value={questaoDraft.alternativa_b} onChange={(value) => setQuestaoDraft({ ...questaoDraft, alternativa_b: value })} />
          <Field label="Alternativa C" value={questaoDraft.alternativa_c} onChange={(value) => setQuestaoDraft({ ...questaoDraft, alternativa_c: value })} />
          <Field label="Alternativa D" value={questaoDraft.alternativa_d} onChange={(value) => setQuestaoDraft({ ...questaoDraft, alternativa_d: value })} />
          <Field label="Alternativa E" value={questaoDraft.alternativa_e} onChange={(value) => setQuestaoDraft({ ...questaoDraft, alternativa_e: value })} />
          <label>
            Gabarito
            <select value={questaoDraft.gabarito} onChange={(event) => setQuestaoDraft({ ...questaoDraft, gabarito: event.target.value as AlternativaKey })}>
              {(["A", "B", "C", "D", "E"] as AlternativaKey[]).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Dificuldade inicial pré-TRI
            <input
              type="number"
              min={0.1}
              max={5}
              step={0.1}
              value={questaoDraft.dificuldade_inicial}
              onChange={(event) => setQuestaoDraft({ ...questaoDraft, dificuldade_inicial: Number(event.target.value) })}
            />
          </label>
        </div>
        <button className="primary" onClick={saveQuestao}>Salvar questão</button>
        </section>
        )}

        {questaoSubTab === "curadoria" && (
        <section className="review-panel" aria-label="Validação docente das questões">
          <div className="section-heading">
            <div>
              <h3>Validação docente das questões</h3>
              <p>
                Esta área é exclusiva do professor, coordenação e gestão. Questões em revisão ou rascunho ficam fora das
                avaliações dos estudantes; apenas itens validados entram no criador de avaliações.
              </p>
            </div>
            <label className="inline-filter">
              Situação
              <select value={questaoStatusFiltro} onChange={(event) => setQuestaoStatusFiltro(event.target.value as QuestaoStatusFiltro)}>
                <option value="em_revisao">Em revisão</option>
                <option value="validada">Validadas</option>
                <option value="rascunho">Rascunhos</option>
                <option value="todas">Todas</option>
              </select>
            </label>
          </div>

          <div className="status-legend">
            {(["rascunho", "em_revisao", "validada"] as QuestaoDraft["status"][]).map((status) => (
              <div key={status}>
                <strong>{questaoStatusLabel(status)}</strong>
                <span>{questaoStatusHint(status)}</span>
              </div>
            ))}
          </div>

          <div className="review-list">
            {!questoesFiltradas.length && <p className="empty">Nenhuma questão encontrada para este filtro.</p>}
            {questoesFiltradas.map((questao) => {
              const descritor = descritores.find((item) => item.codigo === questao.descritor_codigo);
              const competencia = descritor ? competencias.find((item) => item.codigo === descritor.competencia_codigo) : undefined;

              return (
                <article className="review-card" key={questao.codigo}>
                  <div className="review-card-main">
                    <div className="review-card-title">
                      <strong>{questao.codigo}</strong>
                      <span className={`status-badge ${questao.status}`}>{questaoStatusLabel(questao.status)}</span>
                    </div>
                    <p>{questao.enunciado}</p>
                    <small>
                      {visiblePedagogicalCode(questao.descritor_codigo)} · {descritor?.descricao ?? "Descritor não encontrado"} · {competencia ? visiblePedagogicalCode(competencia.codigo) : "sem competência"}
                    </small>
                    <small>
                      {questao.componente_curricular} · Gabarito {questao.gabarito} · dificuldade pré-TRI {questao.dificuldade_inicial}
                    </small>
                  </div>
                  <div className="review-actions" aria-label={`Alterar situação da questão ${questao.codigo}`}>
                    <button className="secondary small" onClick={() => setQuestaoEmLeitura(questao)}>
                      Ver questão
                    </button>
                    <button className="secondary small" disabled={questao.status === "validada"} onClick={() => alterarStatusQuestao(questao.codigo, "validada")}>
                      Validar
                    </button>
                    <button className="secondary small" disabled={questao.status === "em_revisao"} onClick={() => alterarStatusQuestao(questao.codigo, "em_revisao")}>
                      Voltar para revisão
                    </button>
                    <button className="secondary small" disabled={questao.status === "rascunho"} onClick={() => alterarStatusQuestao(questao.codigo, "rascunho")}>
                      Marcar rascunho
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          {questoesFiltradas.length < questoesDoCurso.filter((questao) => questaoStatusFiltro === "todas" || questao.status === questaoStatusFiltro).length && (
            <p className="helper">Mostrando as primeiras 80 questões do filtro para manter a tela leve.</p>
          )}
        </section>
        )}

        {questaoSubTab === "cobertura" && (
        <section className="coverage-panel" aria-label="Cobertura do banco de itens por competência e descritor">
          <div className="section-heading">
            <div>
              <h3>Cobertura do banco de itens</h3>
              <p>
                Use esta leitura para saber quantas questões existem no total, quantas já foram validadas e quantas ainda
                estão em revisão ou rascunho por competência e por descritor.
              </p>
            </div>
          </div>

          <div className="coverage-grid">
            <div>
              <h4>Por competência</h4>
              <DataTable
                headers={["Competência", "Descritores", "Total", "Validadas", "Em revisão", "Rascunhos"]}
                rows={coberturaCompetencias.map((item) => [
                  `${visiblePedagogicalCode(item.competencia.codigo)} · ${item.competencia.descricao}`,
                  String(item.descritores),
                  String(item.total),
                  String(item.validadas),
                  String(item.emRevisao),
                  String(item.rascunhos),
                ])}
              />
            </div>

            <div>
              <h4>Por descritor</h4>
              <DataTable
                headers={["Descritor", "Componente", "Total", "Validadas", "Em revisão", "Rascunhos"]}
                rows={coberturaDescritores.map((item) => [
                  `${visiblePedagogicalCode(item.descritor.codigo)} · ${item.descritor.descricao}`,
                  item.descritor.componente_curricular,
                  String(item.total),
                  String(item.validadas),
                  String(item.emRevisao),
                  String(item.rascunhos),
                ])}
              />
            </div>
          </div>
        </section>
        )}

        {questaoSubTab === "inventario" && (
        <section className="question-module-section">
          <div className="section-heading">
            <div>
              <h3>Inventário técnico de questões</h3>
              <p>Consulta técnica preservada com código, descritor, competência, componente, gabarito, dificuldade e status.</p>
            </div>
            <label className="inline-filter">
              Situação
              <select value={questaoStatusFiltro} onChange={(event) => setQuestaoStatusFiltro(event.target.value as QuestaoStatusFiltro)}>
                <option value="todas">Todas</option>
                <option value="validada">Validadas</option>
                <option value="em_revisao">Em revisão</option>
                <option value="rascunho">Rascunhos</option>
              </select>
            </label>
          </div>
        <DataTable
          headers={["Código", "Descritor", "Competência", "Componente", "Gabarito", "Dificuldade", "Status"]}
          rows={questoesFiltradas.map((questao) => {
            const descritor = descritores.find((item) => item.codigo === questao.descritor_codigo);
            return [
              questao.codigo,
              visiblePedagogicalCode(questao.descritor_codigo),
              descritor?.competencia_codigo ? visiblePedagogicalCode(descritor.competencia_codigo) : "",
              questao.componente_curricular,
              questao.gabarito,
              String(questao.dificuldade_inicial),
              questaoStatusLabel(questao.status),
            ];
          })}
        />
        </section>
        )}

        {questaoSubTab === "solicitacoes" && (
          <QuestionReviewRequestsPreview
            questoes={reviewQuestionsFiltered}
            totalQuestoes={questoesDoCurso.length}
            totalFiltrado={reviewQuestionsAllFiltered.length}
            componentes={reviewComponents}
            descritores={descritores}
            descritoresFiltrados={reviewDescriptors}
            competencias={competencias}
            search={reviewSearch}
            setSearch={setReviewSearch}
            componentFilter={reviewComponentFilter}
            setComponentFilter={(value) => {
              setReviewComponentFilter(value);
              setReviewDescriptorFilter("todos");
            }}
            descriptorFilter={reviewDescriptorFilter}
            setDescriptorFilter={setReviewDescriptorFilter}
            statusFilter={reviewStatusFilter}
            setStatusFilter={setReviewStatusFilter}
            setMessage={setMessage}
          />
        )}

        {questaoSubTab === "historico" && (
          <QuestionReviewHistoryPreview />
        )}
      </section>
      )}

      {questaoEmLeitura && (
        <div className="modal-backdrop" role="presentation" onClick={() => setQuestaoEmLeitura(null)}>
          <section className="question-modal" role="dialog" aria-modal="true" aria-labelledby="question-modal-title" onClick={(event) => event.stopPropagation()}>
            {(() => {
              const descritor = descritores.find((item) => item.codigo === questaoEmLeitura.descritor_codigo);
              const competencia = descritor ? competencias.find((item) => item.codigo === descritor.competencia_codigo) : undefined;
              const alternativas: Array<[AlternativaKey, string]> = [
                ["A", questaoEmLeitura.alternativa_a],
                ["B", questaoEmLeitura.alternativa_b],
                ["C", questaoEmLeitura.alternativa_c],
                ["D", questaoEmLeitura.alternativa_d],
                ["E", questaoEmLeitura.alternativa_e],
              ];

              return (
                <>
                  <div className="modal-header">
                    <div>
                      <span className={`status-badge ${questaoEmLeitura.status}`}>{questaoStatusLabel(questaoEmLeitura.status)}</span>
                      <h3 id="question-modal-title">{questaoEmLeitura.codigo}</h3>
                      <p>{questaoEmLeitura.componente_curricular}</p>
                    </div>
                    <button className="icon-close" type="button" onClick={() => setQuestaoEmLeitura(null)} aria-label="Fechar leitura da questão">
                      ×
                    </button>
                  </div>

                  <div className="modal-context">
                    <div>
                      <strong>Competência</strong>
                      <span>{competencia ? `${visiblePedagogicalCode(competencia.codigo)} · ${competencia.descricao}` : "Competência não encontrada"}</span>
                    </div>
                    <div>
                      <strong>Descritor</strong>
                      <span>{descritor ? `${visiblePedagogicalCode(descritor.codigo)} · ${descritor.descricao}` : visiblePedagogicalCode(questaoEmLeitura.descritor_codigo)}</span>
                    </div>
                    <div>
                      <strong>Dificuldade pré-TRI</strong>
                      <span>{questaoEmLeitura.dificuldade_inicial}</span>
                    </div>
                  </div>

                  <div className="question-reading">
                    <strong>Enunciado</strong>
                    <p>{questaoEmLeitura.enunciado}</p>
                    {questaoEmLeitura.imagem_url && (
                      <div className="question-image-box">
                        <img src={questaoEmLeitura.imagem_url} alt={`Imagem de apoio da questão ${questaoEmLeitura.codigo}`} />
                      </div>
                    )}
                  </div>

                  <div className="alternatives-list">
                    {alternativas.map(([letra, texto]) => (
                      <div className={letra === questaoEmLeitura.gabarito ? "correct" : ""} key={letra}>
                        <strong>{letra}</strong>
                        <span>{texto}</span>
                      </div>
                    ))}
                  </div>

                  <div className="question-reading">
                    <strong>Justificativa pedagógica</strong>
                    <p>{questaoEmLeitura.justificativa || "Sem justificativa cadastrada."}</p>
                  </div>

                  <div className="modal-actions">
                    <button className="secondary" type="button" onClick={() => setQuestaoEmLeitura(null)}>Fechar</button>
                    <button className="secondary" type="button" disabled={questaoEmLeitura.status === "rascunho"} onClick={() => {
                      alterarStatusQuestao(questaoEmLeitura.codigo, "rascunho");
                      setQuestaoEmLeitura({ ...questaoEmLeitura, status: "rascunho" });
                    }}>
                      Marcar rascunho
                    </button>
                    <button className="secondary" type="button" disabled={questaoEmLeitura.status === "em_revisao"} onClick={() => {
                      alterarStatusQuestao(questaoEmLeitura.codigo, "em_revisao");
                      setQuestaoEmLeitura({ ...questaoEmLeitura, status: "em_revisao" });
                    }}>
                      Voltar para revisão
                    </button>
                    <button className="primary" type="button" disabled={questaoEmLeitura.status === "validada"} onClick={() => {
                      alterarStatusQuestao(questaoEmLeitura.codigo, "validada");
                      setQuestaoEmLeitura({ ...questaoEmLeitura, status: "validada" });
                    }}>
                      Validar questão
                    </button>
                  </div>
                </>
              );
            })()}
          </section>
        </div>
      )}
    </section>
  );
}

function QuestionReviewRequestsPreview({
  questoes,
  totalQuestoes,
  totalFiltrado,
  componentes,
  descritores,
  descritoresFiltrados,
  competencias,
  search,
  setSearch,
  componentFilter,
  setComponentFilter,
  descriptorFilter,
  setDescriptorFilter,
  statusFilter,
  setStatusFilter,
  setMessage,
}: {
  questoes: QuestaoDraft[];
  totalQuestoes: number;
  totalFiltrado: number;
  componentes: string[];
  descritores: DescritorDraft[];
  descritoresFiltrados: DescritorDraft[];
  competencias: CompetenciaDraft[];
  search: string;
  setSearch: (value: string) => void;
  componentFilter: string;
  setComponentFilter: (value: string) => void;
  descriptorFilter: string;
  setDescriptorFilter: (value: string) => void;
  statusFilter: QuestaoStatusFiltro;
  setStatusFilter: (value: QuestaoStatusFiltro) => void;
  setMessage: (message: string) => void;
}) {
  return (
    <section className="question-module-section">
      <div className="section-heading">
        <div>
          <h3>Solicitar revisão de questões</h3>
          <p>
            Use esta área quando encontrar uma questão que precisa de ajuste, mas que não foi criada por você.
            A solicitação vai para o responsável pelo item, sem alterar automaticamente a questão.
          </p>
        </div>
        <span className="count-chip">Fluxo guiado</span>
      </div>

      <div className="review-explain-grid">
        <article>
          <strong>1. Consulte o banco</strong>
          <span>Você pode ler todas as questões para comparar contexto, gabarito, descritor e qualidade pedagógica.</span>
        </article>
        <article>
          <strong>2. Solicite revisão</strong>
          <span>Se a questão não for sua, registre o motivo e escreva uma sugestão objetiva para o criador.</span>
        </article>
        <article>
          <strong>3. O criador decide</strong>
          <span>O responsável aceita, edita, recusa com justificativa ou encaminha para curadoria.</span>
        </article>
      </div>

      <div className="guided-callout">
        <strong>Regra simples para o professor</strong>
        <p>
          Se a questão é sua, use a curadoria normal para revisar, validar ou devolver para rascunho. Se a questão é de
          outro professor, use <b>Solicitar revisão</b> e explique o motivo. Assim o banco melhora sem perder autoria,
          rastreabilidade e responsabilidade pedagógica.
        </p>
        <p>
          <b>Regra multcurso:</b> cada curso pode ter seus próprios códigos C01, C02, D01 e D02. Para evitar choque no banco,
          cursos novos usam um identificador técnico interno composto pela sigla do curso e pelo código pedagógico, como
          <b> TECADM-C01</b>. Na tela, o professor continua lendo apenas <b>C01</b> e <b>D01</b>.
        </p>
      </div>

      <div className="section-heading compact">
        <div>
          <h4>Questões disponíveis para revisão colaborativa</h4>
          <p>
            Use os filtros para localizar qualquer questão do banco por código, texto, componente, descritor ou status.
            Mostrando {questoes.length} de {totalFiltrado} encontradas no banco de {totalQuestoes} questões.
          </p>
        </div>
      </div>

      <div className="review-filter-panel">
        <label>
          Buscar questão
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Código, trecho do enunciado, componente ou descritor"
          />
        </label>
        <label>
          Componente
          <select value={componentFilter} onChange={(event) => setComponentFilter(event.target.value)}>
            <option value="todos">Todos os componentes</option>
            {componentes.map((component) => (
              <option key={component} value={component}>{component}</option>
            ))}
          </select>
        </label>
        <label>
          Descritor
          <select value={descriptorFilter} onChange={(event) => setDescriptorFilter(event.target.value)}>
            <option value="todos">Todos os descritores</option>
            {descritoresFiltrados.map((descritor) => (
              <option key={descritor.codigo} value={descritor.codigo}>
                {visiblePedagogicalCode(descritor.codigo)} · {descritor.componente_curricular}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as QuestaoStatusFiltro)}>
            <option value="todas">Todos os status</option>
            <option value="validada">Validadas</option>
            <option value="em_revisao">Em revisão</option>
            <option value="rascunho">Rascunhos</option>
          </select>
        </label>
      </div>

      <div className="table-wrap review-request-table">
        <table>
          <thead>
            <tr>
              <th>Questão</th>
              <th>Descritor</th>
              <th>Competência</th>
              <th>Componente</th>
              <th>O que você pode fazer</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {!questoes.length && (
              <tr>
                <td colSpan={6}>Nenhuma questão encontrada com os filtros atuais.</td>
              </tr>
            )}
            {questoes.map((questao, index) => {
              const descritor = descritores.find((item) => item.codigo === questao.descritor_codigo);
              const competencia = descritor ? competencias.find((item) => item.codigo === descritor.competencia_codigo) : undefined;
              const ownItem = index % 3 === 0;

              return (
                <tr key={questao.codigo}>
                  <td><strong>{questao.codigo}</strong><br />{questao.enunciado.slice(0, 90)}...</td>
                  <td>{visiblePedagogicalCode(questao.descritor_codigo)}</td>
                  <td>{competencia ? visiblePedagogicalCode(competencia.codigo) : "-"}</td>
                  <td>{questao.componente_curricular}</td>
                  <td>
                    <span className={`status-badge ${ownItem ? "validada" : "em_revisao"}`}>
                      {ownItem ? "Revisar diretamente" : "Pedir revisão ao criador"}
                    </span>
                  </td>
                  <td>
                    <button className={ownItem ? "secondary small" : "secondary small inline-action"} type="button" onClick={() => setMessage(ownItem ? "Esta questão pode ser revisada diretamente pelo responsável." : "Prévia local: abriria o popup de solicitação de revisão.")}>
                      {ownItem ? "Revisar item" : "Solicitar revisão"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalFiltrado > questoes.length && (
        <p className="helper">Mostrando as primeiras 120 questões filtradas para manter a tela leve. Refine por componente, descritor ou busca para chegar ao item desejado.</p>
      )}

      <div className="review-request-grid clearer">
        <article className="review-request-modal">
          <h4>Formulário que abre ao solicitar revisão</h4>
          <p>O professor informa o problema de forma objetiva para ajudar o criador a decidir.</p>
          <label>
            Motivo da solicitação
            <select defaultValue="contexto">
              <option value="contexto">Contexto repetido ou muito semelhante</option>
              <option value="gabarito">Problema de gabarito</option>
              <option value="ambiguidade">Enunciado ambíguo</option>
              <option value="descritor">Descritor desalinhado</option>
              <option value="linguagem">Linguagem inadequada</option>
            </select>
          </label>
          <label>
            Sugestão para o criador
            <textarea defaultValue="A questão usa contexto semelhante a outro item e pode reduzir a diversidade diagnóstica. Sugiro reescrever o cenário mantendo vínculo com o descritor." />
          </label>
          <div className="modal-actions">
            <button className="secondary" type="button">Cancelar</button>
            <button className="primary" type="button" onClick={() => setMessage("Solicitação de revisão simulada. No fluxo definitivo, ela ficará registrada para o criador da questão.")}>
              Enviar solicitação
            </button>
          </div>
        </article>

        <article className="review-request-modal">
          <h4>Área do criador/curador</h4>
          <p>Quem criou ou recebeu curadoria da questão registra a decisão e mantém o histórico do item.</p>
          <label>
            Decisão
            <select defaultValue="aceitar-revisao">
              <option value="aceitar-revisao">Aceitar e colocar questão em revisão</option>
              <option value="editar">Aceitar e editar agora</option>
              <option value="recusar">Recusar com justificativa</option>
              <option value="curadoria">Encaminhar para curadoria</option>
            </select>
          </label>
          <label>
            Parecer para o solicitante
            <textarea defaultValue="Solicitação pertinente. O item será reescrito para reduzir repetição de contexto e manter alinhamento ao descritor." />
          </label>
          <div className="modal-actions">
            <button className="secondary" type="button">Responder depois</button>
            <button className="primary" type="button" onClick={() => setMessage("Decisão simulada. No fluxo definitivo, o histórico ficará vinculado à questão.")}>
              Registrar decisão
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function QuestionReviewHistoryPreview() {
  return (
    <section className="question-module-section">
      <div className="section-heading">
        <div>
          <h3>Histórico de revisão</h3>
          <p>Prévia da trilha de auditoria: quem solicitou, quem decidiu, quando e qual providência foi tomada.</p>
        </div>
        <span className="count-chip warning">Prévia local</span>
      </div>

      <div className="review-history-list">
        <article>
          <strong>Solicitação enviada</strong>
          <span>08/07/2026 · Q-INF-0144 · Motivo: contexto repetido</span>
          <p>Professor solicitou reescrita do cenário para preservar diversidade diagnóstica no descritor D05.</p>
        </article>
        <article>
          <strong>Decisão registrada</strong>
          <span>08/07/2026 · Criador aceitou a solicitação</span>
          <p>Item voltaria para revisão e ficaria fora das avaliações até nova validação docente.</p>
        </article>
        <article>
          <strong>Encaminhamento para curadoria</strong>
          <span>Futuro · coordenação/professor técnico</span>
          <p>Solicitações sensíveis podem ser encaminhadas para curadoria compartilhada antes da decisão final.</p>
        </article>
      </div>
    </section>
  );
}

function Assessments({
  assessments,
  setAssessments,
  setMessage,
}: {
  assessments: AvaliacaoDraft[];
  setAssessments: (assessments: AvaliacaoDraft[]) => void;
  setMessage: (message: string) => void;
}) {
  const [draft, setDraft] = useState<AvaliacaoDraft>({
    titulo: "Diagnóstico Técnico em Informática",
    codigo_acesso: "TECINF-26-01",
    curso_tecnico: "Técnico em Informática",
    componentes: "Programação; Banco de Dados; Redes",
    quantidade_questoes: 20,
    turma_codigo: "2ª TEC. INF.",
    etapa: "diagnostica",
  });

  function save() {
    if (!draft.titulo || !draft.codigo_acesso || !draft.curso_tecnico || !draft.componentes) {
      setMessage("Preencha título, código, curso técnico e componentes avaliados.");
      return;
    }
    if (draft.quantidade_questoes < 20 || draft.quantidade_questoes > 40) {
      setMessage("A avaliação precisa ter no mínimo 20 e no máximo 40 questões.");
      return;
    }

    const result = salvarAvaliacaoLocal(draft);
    setAssessments([...assessments.filter((item) => item.codigo_acesso !== draft.codigo_acesso), draft]);
    setMessage(`Avaliação criada em modo ${result.modo}; próxima fase: vincular itens do banco e descritores.`);
  }

  return (
    <section className="panel">
      <h2>Criador de Avaliações</h2>
      <p>A avaliação pode integrar uma ou mais disciplinas, sempre vinculada à matriz, competências e descritores.</p>
      <div className="form-grid">
        <Field label="Título" value={draft.titulo} onChange={(value) => setDraft({ ...draft, titulo: value })} />
        <Field label="Código para estudantes" value={draft.codigo_acesso} onChange={(value) => setDraft({ ...draft, codigo_acesso: value.toUpperCase() })} />
        <Field label="Curso técnico" value={draft.curso_tecnico} onChange={(value) => setDraft({ ...draft, curso_tecnico: value })} />
        <Field label="Componentes avaliados" value={draft.componentes} onChange={(value) => setDraft({ ...draft, componentes: value })} />
        <Field label="Turma" value={draft.turma_codigo} onChange={(value) => setDraft({ ...draft, turma_codigo: value })} />
        <label>
          Etapa
          <select value={draft.etapa} onChange={(event) => setDraft({ ...draft, etapa: event.target.value as AvaliacaoDraft["etapa"] })}>
            <option value="diagnostica">Diagnóstica</option>
            <option value="formativa">Formativa</option>
            <option value="final">Final</option>
          </select>
        </label>
        <label>
          Quantidade de questões
          <input
            type="number"
            min={20}
            max={40}
            value={draft.quantidade_questoes}
            onChange={(event) => setDraft({ ...draft, quantidade_questoes: Number(event.target.value) })}
          />
        </label>
      </div>
      <button className="primary" onClick={save}>Criar avaliação</button>
      <DataTable
        headers={["Código", "Título", "Curso", "Turma", "Questões", "Etapa"]}
        rows={assessments.map((assessment) => [
          assessment.codigo_acesso,
          assessment.titulo,
          assessment.curso_tecnico,
          assessment.turma_codigo,
          String(assessment.quantidade_questoes),
          assessment.etapa,
        ])}
      />
    </section>
  );
}

function AssessmentsV2({
  assessments,
  setAssessments,
  currentUser,
  teachers,
  visibleSchoolIds,
  competencias,
  descritores,
  questoes,
  respostas,
  setRespostas,
  setMessage,
}: {
  assessments: AvaliacaoDraft[];
  setAssessments: (assessments: AvaliacaoDraft[]) => void;
  currentUser: AuthUser;
  teachers: ProfessorDraft[];
  visibleSchoolIds: string[];
  competencias: CompetenciaDraft[];
  descritores: DescritorDraft[];
  questoes: QuestaoDraft[];
  respostas: RespostaAvaliacaoDraft[];
  setRespostas: (respostas: RespostaAvaliacaoDraft[]) => void;
  setMessage: (message: string) => void;
}) {
  const [blockedAssessmentCodes, setBlockedAssessmentCodes] = useState<string[]>(() => carregarCodigosAvaliacaoBloqueados());
  const cursosDoBanco = Array.from(new Set(competencias.map((competencia) => competencia.curso_tecnico).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const professorLogado = teachers.find(
    (teacher) => teacher.matricula === currentUser.professor_matricula || teacher.email_institucional === currentUser.email,
  );
  const cursosProfessorLogado = splitCourseList(professorLogado?.curso_responsavel).map(resolveCourseName);
  const cursosDaEscola = Array.from(new Set([
    ...teachers.flatMap((teacher) => splitCourseList(teacher.curso_responsavel).map(resolveCourseName)),
    ...assessments
      .filter((assessment) => !currentUser.escola_inep || assessment.escola_inep === currentUser.escola_inep)
      .map((assessment) => resolveCourseName(assessment.curso_tecnico))
      .filter(Boolean),
  ])).sort((a, b) => a.localeCompare(b));
  const cursosPermitidos = (() => {
    if (currentUser.role === "professor" && cursosProfessorLogado.length) return cursosProfessorLogado;
    if (currentUser.role === "gestao_escolar" && cursosDaEscola.length) return cursosDaEscola;
    if (currentUser.role === "regional" && cursosDaEscola.length) return cursosDaEscola;
    if (currentUser.role === "seduc" || currentUser.role === "administrador") return cursosDoBanco.length ? cursosDoBanco : cursosTecnicosOficiais.map((curso) => curso.nome);
    return cursosDoBanco.length ? cursosDoBanco : ["Técnico em Informática"];
  })();
  const visibleSchoolSet = new Set(visibleSchoolIds);
  const avaliacoesVisiveis = assessments.filter((assessment) => {
    if (currentUser.role === "professor") return assessment.professor_matricula === currentUser.professor_matricula;
    if (currentUser.role === "gestao_escolar") return assessment.escola_inep === currentUser.escola_inep;
    if (currentUser.role === "regional") return !!assessment.escola_inep && visibleSchoolSet.has(assessment.escola_inep);
    if (currentUser.role === "seduc" || currentUser.role === "administrador") return true;
    return true;
  });
  const scopeLabel = currentUser.role === "professor"
    ? "Minhas provas"
    : currentUser.role === "gestao_escolar"
      ? "Provas da escola"
      : currentUser.role === "regional"
        ? "Provas das escolas da CREDE/SEFOR"
        : "Todas as provas";
  const cursoInicialPermitido = cursosPermitidos[0] ?? "Técnico em Informática";
  const [draft, setDraft] = useState<AvaliacaoDraft>(() => ({
    titulo: `Diagnóstico ${cursoInicialPermitido}`,
    codigo_acesso: generateAssessmentAccessCode(assessments, cursoInicialPermitido, "diagnostica", blockedAssessmentCodes),
    curso_tecnico: cursoInicialPermitido,
    componentes: "",
    quantidade_questoes: 20,
    turma_codigo: "2ª TEC. INF.",
    etapa: "diagnostica",
    questoes_por_componente: {},
    descritores_selecionados: [],
    questoes_codigos: [],
    status: "rascunho",
  }));
  const [previewAssessment, setPreviewAssessment] = useState<AvaliacaoDraft | null>(null);

  useEffect(() => {
    carregarCodigosAvaliacaoBloqueadosOnline()
      .then(setBlockedAssessmentCodes)
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Não foi possível carregar códigos bloqueados.");
      });
  }, [setMessage]);

  useEffect(() => {
    if (cursosPermitidos.some((curso) => normalizeCourseName(curso) === normalizeCourseName(draft.curso_tecnico))) return;
    const nextCurso = cursosPermitidos[0] ?? draft.curso_tecnico;
    setDraft((current) => ({
      ...current,
      titulo: current.titulo || `Diagnóstico ${nextCurso}`,
      curso_tecnico: nextCurso,
      codigo_acesso: generateAssessmentAccessCode(assessments, nextCurso, current.etapa, blockedAssessmentCodes),
      componentes: "",
      quantidade_questoes: 20,
      questoes_por_componente: {},
      descritores_selecionados: [],
      questoes_codigos: [],
    }));
  }, [assessments, blockedAssessmentCodes, cursosPermitidos, draft.curso_tecnico]);

  const descritorPorCodigo = new Map(descritores.map((descritor) => [descritor.codigo, descritor]));
  const competenciaPorCodigo = new Map(competencias.map((competencia) => [competencia.codigo, competencia]));
  const questoesPorComponente = draft.questoes_por_componente ?? {};
  const componentesSelecionados = Object.entries(questoesPorComponente)
    .filter(([, quantidade]) => quantidade > 0)
    .map(([componente]) => componente);
  const componentesTexto = componentesSelecionados.join("; ");
  const descritoresSelecionados = draft.descritores_selecionados ?? [];
  const totalPlanejado = componentesSelecionados.reduce((total, componente) => total + (questoesPorComponente[componente] ?? 0), 0);

  function isQuestaoValidadaDoCurso(questao: QuestaoDraft) {
    const descritor = descritorPorCodigo.get(questao.descritor_codigo);
    if (questao.status !== "validada" || !descritor) return false;
    const competencia = competenciaPorCodigo.get(descritor.competencia_codigo);
    return !competencia || normalizeCourseName(competencia.curso_tecnico) === normalizeCourseName(draft.curso_tecnico);
  }

  const componentesDisponiveis = Array.from(
    new Set(questoes.filter(isQuestaoValidadaDoCurso).map((questao) => questao.componente_curricular)),
  ).sort((a, b) => a.localeCompare(b));

  const descritoresElegiveis = descritores.filter((descritor) => {
    if (!componentesSelecionados.length) return false;
    const competencia = competenciaPorCodigo.get(descritor.competencia_codigo);
    const mesmoCurso = !competencia || normalizeCourseName(competencia.curso_tecnico) === normalizeCourseName(draft.curso_tecnico);
    const mesmoComponente =
      componentesSelecionados.length === 0 ||
      componentesSelecionados.some((componente) => normalizeKey(componente) === normalizeKey(descritor.componente_curricular));
    return mesmoCurso && mesmoComponente;
  });
  const questoesValidadasPorDescritor = questoes.reduce<Record<string, number>>((acc, questao) => {
    if (!isQuestaoValidadaDoCurso(questao)) return acc;
    acc[questao.descritor_codigo] = (acc[questao.descritor_codigo] ?? 0) + 1;
    return acc;
  }, {});

  function isQuestaoElegivel(questao: QuestaoDraft) {
    if (!componentesSelecionados.length) return false;
    const descritor = descritorPorCodigo.get(questao.descritor_codigo);
    if (questao.status !== "validada") return false;
    if (!descritor) return false;
    if (descritoresSelecionados.length > 0 && !descritoresSelecionados.includes(questao.descritor_codigo)) return false;

    const competencia = competenciaPorCodigo.get(descritor.competencia_codigo);
    const mesmoCurso = !competencia || normalizeCourseName(competencia.curso_tecnico) === normalizeCourseName(draft.curso_tecnico);
    const mesmoComponente =
      componentesSelecionados.length === 0 ||
      componentesSelecionados.some((componente) => normalizeKey(componente) === normalizeKey(questao.componente_curricular));
    return mesmoCurso && mesmoComponente;
  }

  const questoesElegiveis = questoes.filter(isQuestaoElegivel);
  const componentesComEstoque = componentesDisponiveis.map((componente) => ({
    componente,
    disponiveis: questoes.filter((questao) => {
      if (!isQuestaoValidadaDoCurso(questao)) return false;
      if (descritoresSelecionados.length > 0 && !descritoresSelecionados.includes(questao.descritor_codigo)) return false;
      return normalizeKey(questao.componente_curricular) === normalizeKey(componente);
    }).length,
    solicitadas: questoesPorComponente[componente] ?? 0,
  }));

  const selecaoAvaliacao = componentesSelecionados.reduce(
    (acc, componente) => {
      const quantidade = questoesPorComponente[componente] ?? 0;
      const candidatas = questoesElegiveis
        .filter((questao) => normalizeKey(questao.componente_curricular) === normalizeKey(componente))
        .slice()
        .sort((a, b) => a.dificuldade_inicial - b.dificuldade_inicial || a.codigo.localeCompare(b.codigo));
      const selecionadasDoComponente: QuestaoDraft[] = [];

      for (const questao of candidatas) {
        if (selecionadasDoComponente.length >= quantidade) break;

        const conflict = getQuestionConflict(questao, acc.questoes);
        if (conflict) {
          acc.conflitosIgnorados.push({ questao, conflitoCom: conflict.item, motivo: conflict.motivo, componente });
          continue;
        }

        acc.questoes.push(questao);
        selecionadasDoComponente.push(questao);
      }

      if (selecionadasDoComponente.length < quantidade) {
        acc.componentesSemEstoqueContextual.push({
          componente,
          solicitadas: quantidade,
          selecionadas: selecionadasDoComponente.length,
        });
      }

      return acc;
    },
    {
      questoes: [] as QuestaoDraft[],
      conflitosIgnorados: [] as Array<{
        questao: QuestaoDraft;
        conflitoCom: QuestaoDraft;
        motivo: "enunciado" | "alternativas" | "contexto" | "similaridade";
        componente: string;
      }>,
      componentesSemEstoqueContextual: [] as Array<{ componente: string; solicitadas: number; selecionadas: number }>,
    },
  );
  const questoesSelecionadas = selecaoAvaliacao.questoes;
  const componentesInsuficientes = componentesComEstoque.filter((item) => item.solicitadas > item.disponiveis);
  const questoesSelecionadasDuplicadas = questoesSelecionadas.filter((questao, index, lista) => {
    const previousItems = lista.slice(0, index);
    return Boolean(getQuestionConflict(questao, previousItems));
  });
  const quantidadeValida = totalPlanejado >= 20 && totalPlanejado <= 80;
  const podePublicar =
    quantidadeValida &&
    totalPlanejado > 0 &&
    !componentesInsuficientes.length &&
    !selecaoAvaliacao.componentesSemEstoqueContextual.length &&
    !questoesSelecionadasDuplicadas.length &&
    questoesSelecionadas.length === totalPlanejado;

  function toggleDescritor(codigo: string) {
    const selected = new Set(draft.descritores_selecionados ?? []);
    if (selected.has(codigo)) selected.delete(codigo);
    else selected.add(codigo);
    setDraft({ ...draft, descritores_selecionados: Array.from(selected) });
  }

  function toggleComponente(componente: string) {
    const next = { ...questoesPorComponente };
    if (next[componente]) delete next[componente];
    else next[componente] = 2;
    const selected = Object.entries(next).filter(([, quantidade]) => quantidade > 0).map(([item]) => item);
    setDraft({
      ...draft,
      componentes: selected.join("; "),
      quantidade_questoes: selected.reduce((total, item) => total + (next[item] ?? 0), 0),
      questoes_por_componente: next,
      descritores_selecionados: [],
    });
  }

  function setQuantidadeComponente(componente: string, quantidade: number) {
    const next = { ...questoesPorComponente, [componente]: quantidade };
    const selected = Object.entries(next).filter(([, value]) => value > 0).map(([item]) => item);
    setDraft({
      ...draft,
      componentes: selected.join("; "),
      quantidade_questoes: selected.reduce((total, item) => total + (next[item] ?? 0), 0),
      questoes_por_componente: next,
    });
  }

  function trocarCursoAvaliacao(curso: string) {
    setDraft({
      ...draft,
      curso_tecnico: curso,
      codigo_acesso: generateAssessmentAccessCode(assessments, curso, draft.etapa, blockedAssessmentCodes),
      componentes: "",
      quantidade_questoes: 20,
      questoes_por_componente: {},
      descritores_selecionados: [],
      questoes_codigos: [],
    });
  }

  function regenerateAccessCode() {
    setDraft({
      ...draft,
      codigo_acesso: generateAssessmentAccessCode(assessments, draft.curso_tecnico, draft.etapa, blockedAssessmentCodes),
    });
  }

  async function save() {
    if (!draft.titulo || !draft.curso_tecnico) {
      setMessage("Preencha título e curso técnico.");
      return;
    }
    if (!componentesSelecionados.length) {
      setMessage("Selecione pelo menos um componente curricular para montar a avaliação.");
      return;
    }
    if (!quantidadeValida) {
      setMessage("A avaliação precisa ter no mínimo 20 e no máximo 80 questões no total.");
      return;
    }
    if (!podePublicar) {
      if (questoesSelecionadasDuplicadas.length > 0) {
        setMessage(
          `Duplicidade/contexto repetido bloqueado na avaliação: revise os itens ${questoesSelecionadasDuplicadas.map((questao) => questao.codigo).join(", ")}.`,
        );
        return;
      }
      if (selecaoAvaliacao.componentesSemEstoqueContextual.length > 0) {
        setMessage(
          `Banco insuficiente após filtro de contexto: ${selecaoAvaliacao.componentesSemEstoqueContextual
            .map((item) => `${item.componente} (${item.selecionadas}/${item.solicitadas})`)
            .join("; ")}. Reduza a quantidade ou valide mais itens diferentes.`,
        );
        return;
      }
      setMessage(
        `Banco insuficiente: ${questoesSelecionadas.length} questões validadas selecionáveis para ${totalPlanejado} necessárias.`,
      );
      return;
    }

    const codigoAcesso = draft.codigo_acesso.toUpperCase();
    if (
      assessments.some((item) => item.codigo_acesso.toUpperCase() === codigoAcesso) ||
      blockedAssessmentCodes.some((codigo) => codigo.toUpperCase() === codigoAcesso)
    ) {
      setMessage("Código já vinculado a uma avaliação criada. Gere um novo código antes de abrir outra aplicação.");
      return;
    }

    const createdAt = new Date().toISOString();

    const avaliacao: AvaliacaoDraft = {
      ...draft,
      codigo_acesso: codigoAcesso,
      componentes: componentesTexto,
      quantidade_questoes: totalPlanejado,
      questoes_por_componente: questoesPorComponente,
      questoes_codigos: questoesSelecionadas.map((questao) => questao.codigo),
      status: "aberta",
      inicio_em: createdAt,
      codigo_bloqueado_em: createdAt,
      professor_matricula: currentUser.professor_matricula,
      escola_inep: currentUser.escola_inep,
    };
    const result = await salvarAvaliacao(avaliacao);
    if (result.erro) {
      setMessage(result.erro);
      return;
    }
    const blockResult = await bloquearCodigoAvaliacao(avaliacao.codigo_acesso, {
      motivo: "avaliacao_aberta",
      avaliacao_codigo: avaliacao.codigo_acesso,
      escola_inep: avaliacao.escola_inep,
      professor_matricula: avaliacao.professor_matricula,
    });
    if ("erro" in blockResult && blockResult.erro) {
      setMessage(blockResult.erro);
      return;
    }
    const nextBlockedCodes = Array.from(new Set([...blockedAssessmentCodes, avaliacao.codigo_acesso]));
    const nextAssessments = [...assessments.filter((item) => item.codigo_acesso !== avaliacao.codigo_acesso), avaliacao];
    setBlockedAssessmentCodes(nextBlockedCodes);
    setAssessments(nextAssessments);
    setDraft({
      ...draft,
      codigo_acesso: generateAssessmentAccessCode(nextAssessments, draft.curso_tecnico, draft.etapa, nextBlockedCodes),
      status: "rascunho",
    });
    setMessage(`Avaliação ${avaliacao.codigo_acesso} aberta em modo ${result.modo} com ${questoesSelecionadas.length} questões validadas.`);
  }

  async function alterarStatusAvaliacao(assessment: AvaliacaoDraft, status: NonNullable<AvaliacaoDraft["status"]>) {
    const updated: AvaliacaoDraft = {
      ...assessment,
      status,
      inicio_em: status === "aberta" && !assessment.inicio_em ? new Date().toISOString() : assessment.inicio_em,
      fim_em: status === "encerrada" || status === "corrigida" ? new Date().toISOString() : assessment.fim_em,
    };
    const result = await salvarAvaliacao(updated);
    if (result.erro) {
      setMessage(result.erro);
      return;
    }
    setAssessments([...assessments.filter((item) => item.codigo_acesso !== updated.codigo_acesso), updated]);
    setMessage(`Status da avaliação ${updated.codigo_acesso} alterado para ${status} em modo ${result.modo}.`);
  }

  async function excluirAvaliacao(assessment: AvaliacaoDraft) {
    const respostasDaAvaliacao = respostas.filter((resposta) => resposta.avaliacao_codigo === assessment.codigo_acesso);
    if (respostasDaAvaliacao.length > 0) {
      setMessage(`Exclusão bloqueada: a avaliação ${assessment.codigo_acesso} já possui ${respostasDaAvaliacao.length} resposta(s). Encerre a aplicação para preservar relatórios e auditoria.`);
      return;
    }

    const confirmed = window.confirm(
      `Excluir a avaliação ${assessment.codigo_acesso}? O código será bloqueado definitivamente e não poderá ser reaproveitado.`,
    );
    if (!confirmed) return;

    const result = await excluirAvaliacaoPersistida(assessment.codigo_acesso);
    if (result.erro) {
      setMessage(result.erro);
      return;
    }
    const nextAssessments = assessments.filter((item) => item.codigo_acesso !== assessment.codigo_acesso);
    const nextBlockedCodes = Array.from(new Set([...blockedAssessmentCodes, assessment.codigo_acesso.toUpperCase()]));
    setAssessments(nextAssessments);
    setBlockedAssessmentCodes(nextBlockedCodes);
    setDraft({
      ...draft,
      codigo_acesso: generateAssessmentAccessCode(nextAssessments, draft.curso_tecnico, draft.etapa, nextBlockedCodes),
    });
    setMessage(`Avaliação ${assessment.codigo_acesso} excluída em modo ${result.modo}. O código foi bloqueado e não será reutilizado.`);
  }

  if (previewAssessment) {
    return (
      <section className="panel">
        <button className="secondary" onClick={() => setPreviewAssessment(null)}>Voltar ao criador</button>
        <StudentAssessmentRunner
          assessment={previewAssessment}
          questoes={questoes}
          studentName="Pré-visualização do professor"
          respostas={respostas}
          setRespostas={setRespostas}
          previewMode
          onBack={() => setPreviewAssessment(null)}
        />
      </section>
    );
  }

  return (
    <section className="panel">
      <section className="dashboard-hero page-banner">
        <div>
          <p className="eyebrow">Avaliações</p>
          <h2>Criação segura de aplicações diagnósticas</h2>
          <p>
            Gere avaliações a partir de questões validadas do Banco de Itens, com vínculo por curso, componente,
            descritor e regra de bloqueio contra duplicidade de código e repetição de contexto.
          </p>
        </div>
        <div className="dashboard-scope">
          <span>Código</span>
          <strong>{draft.codigo_acesso}</strong>
        </div>
      </section>

      <section className="dashboard-kpis assessment-kpis">
        <article className="dashboard-kpi">
          <span>Planejadas</span>
          <strong>{totalPlanejado}</strong>
          <small>mínimo 20 · máximo 80 questões</small>
        </article>
        <article className="dashboard-kpi">
          <span>Selecionáveis</span>
          <strong>{questoesElegiveis.length}</strong>
          <small>itens validados dentro do filtro atual</small>
        </article>
        <article className="dashboard-kpi">
          <span>Componentes</span>
          <strong>{componentesSelecionados.length}</strong>
          <small>{componentesDisponiveis.length} componentes disponíveis no banco</small>
        </article>
        <article className="dashboard-kpi">
          <span>Pronto para abrir</span>
          <strong>{podePublicar ? "Sim" : "Não"}</strong>
          <small>{podePublicar ? "sem conflito de estoque ou contexto" : "ajuste quantidade, estoque ou filtros"}</small>
        </article>
      </section>

      <section className="subpanel wide assessment-setup-panel">
        <div className="section-heading compact">
          <div>
            <h3>Dados da aplicação</h3>
            <p>Defina título, curso, turma e etapa. O código do estudante é gerado pelo sistema e não deve ser reutilizado.</p>
          </div>
          <span className="count-chip">{cursosPermitidos.length} curso(s) permitido(s)</span>
        </div>
      <div className="form-grid assessment-form-grid">
        <Field label="Título" value={draft.titulo} onChange={(value) => setDraft({ ...draft, titulo: value })} />
        <label>
          Código para estudantes
          <div className="code-generator">
            <input value={draft.codigo_acesso} readOnly aria-label="Código gerado automaticamente para estudantes" />
            <button className="secondary" type="button" onClick={regenerateAccessCode}>Gerar novo</button>
          </div>
          <small>O código é gerado pelo sistema. Depois que a avaliação for aberta, ele fica bloqueado para investigação, auditoria e relatórios.</small>
        </label>
        <label>
          Curso técnico
          <select value={draft.curso_tecnico} onChange={(event) => trocarCursoAvaliacao(event.target.value)}>
            {cursosPermitidos.map((curso) => (
              <option key={curso} value={curso}>{curso}</option>
            ))}
          </select>
          <small>
            {currentUser.role === "professor"
              ? "Professor visualiza apenas o curso vinculado ao seu cadastro."
              : currentUser.role === "gestao_escolar"
                ? "Gestão visualiza os cursos vinculados à escola."
                : "Acesso institucional com visão ampliada dos cursos disponíveis."}
          </small>
        </label>
        <Field label="Turma" value={draft.turma_codigo} onChange={(value) => setDraft({ ...draft, turma_codigo: value })} />
        <label>
          Etapa
          <select
            value={draft.etapa}
            onChange={(event) => {
              const etapa = event.target.value as AvaliacaoDraft["etapa"];
              setDraft({
                ...draft,
                etapa,
                codigo_acesso: generateAssessmentAccessCode(assessments, draft.curso_tecnico, etapa, blockedAssessmentCodes),
              });
            }}
          >
            <option value="diagnostica">Diagnóstica</option>
            <option value="formativa">Formativa</option>
            <option value="final">Final</option>
          </select>
        </label>
        <label>
          Total planejado
          <input
            type="number"
            min={20}
            max={80}
            value={totalPlanejado}
            readOnly
          />
        </label>
      </div>
      </section>

      <section className="subpanel wide">
        <div className="section-heading">
          <div>
            <h3>Componentes da avaliação</h3>
            <p>Selecione os componentes disponíveis no Banco de Itens e defina quantas questões entrarão de cada um.</p>
          </div>
          <span className={quantidadeValida ? "count-chip" : "count-chip warning"}>{totalPlanejado}/80 questões</span>
        </div>
        <div className="component-builder">
          {componentesDisponiveis.map((componente) => {
            const estoque = componentesComEstoque.find((item) => item.componente === componente)?.disponiveis ?? 0;
            const selected = (questoesPorComponente[componente] ?? 0) > 0;
            return (
              <article className={selected ? "component-card selected" : "component-card"} key={componente}>
                <label className="check-row compact">
                  <input type="checkbox" checked={selected} onChange={() => toggleComponente(componente)} />
                  <span>{componente}</span>
                </label>
                <small>{estoque} questões validadas no banco</small>
                <label>
                  Questões deste componente
                  <select
                    value={questoesPorComponente[componente] ?? 0}
                    disabled={!selected}
                    onChange={(event) => setQuantidadeComponente(componente, Number(event.target.value))}
                  >
                    <option value={0}>Não usar</option>
                    {quantidadePorComponenteOptions.map((quantidade) => (
                      <option key={quantidade} value={quantidade}>{quantidade}</option>
                    ))}
                  </select>
                </label>
              </article>
            );
          })}
        </div>
        {!componentesDisponiveis.length && <p className="empty">Nenhum componente com questões validadas foi encontrado para este curso.</p>}
        <div className="notice">
          Regra da avaliação: mínimo de <strong>20</strong> e máximo de <strong>80</strong> questões no total. Opções por componente:
          <strong> 2, 5, 10 ou 20</strong>.
        </div>
      </section>

      <section className="subpanel wide">
        <h3>Descritores elegíveis</h3>
        <p className="helper">Selecione descritores específicos ou deixe todos desmarcados para usar todos os descritores elegíveis dos componentes escolhidos.</p>
        <div className="check-grid">
          {descritoresElegiveis.map((descritor) => (
            <label className="check-row" key={descritor.codigo}>
              <input
                type="checkbox"
                checked={descritoresSelecionados.includes(descritor.codigo)}
                onChange={() => toggleDescritor(descritor.codigo)}
              />
              <span>
                {visiblePedagogicalCode(descritor.codigo)} - {descritor.componente_curricular}
                <small>{questoesValidadasPorDescritor[descritor.codigo] ?? 0} questões validadas neste descritor</small>
              </span>
            </label>
          ))}
        </div>
        {!descritoresElegiveis.length && <p className="empty">Nenhum descritor elegível para o curso e componentes selecionados.</p>}
      </section>

      <div className={podePublicar ? "notice" : "notice warning"}>
        Questões validadas elegíveis: <strong>{questoesElegiveis.length}</strong>. Questões que entrarão na avaliação:
        <strong> {questoesSelecionadas.length}</strong> de <strong>{totalPlanejado}</strong>.
        {componentesInsuficientes.length > 0 && (
          <span> Componentes insuficientes: {componentesInsuficientes.map((item) => `${item.componente} (${item.disponiveis}/${item.solicitadas})`).join(", ")}.</span>
        )}
        {selecaoAvaliacao.componentesSemEstoqueContextual.length > 0 && (
          <span>
            {" "}Filtro de contexto impediu repetição: {selecaoAvaliacao.componentesSemEstoqueContextual
              .map((item) => `${item.componente} (${item.selecionadas}/${item.solicitadas})`)
              .join(", ")}.
          </span>
        )}
        {questoesSelecionadasDuplicadas.length > 0 && (
          <span> Duplicidade ou mesmo contexto detectado: {questoesSelecionadasDuplicadas.map((questao) => questao.codigo).join(", ")}.</span>
        )}
        {selecaoAvaliacao.conflitosIgnorados.length > 0 && (
          <span>
            {" "}Candidatas parecidas ignoradas automaticamente: {selecaoAvaliacao.conflitosIgnorados.slice(0, 6)
              .map((item) => `${item.questao.codigo}/${item.conflitoCom.codigo}`)
              .join(", ")}
            {selecaoAvaliacao.conflitosIgnorados.length > 6 ? "..." : ""}.
          </span>
        )}
      </div>

      <button className="primary" onClick={save} disabled={!podePublicar}>Abrir avaliação</button>
      <DataTable
        headers={["Código", "Título", "Curso", "Turma", "Questões", "Status"]}
        rows={avaliacoesVisiveis.map((assessment) => [
          assessment.codigo_acesso,
          assessment.titulo,
          assessment.curso_tecnico,
          assessment.turma_codigo,
          String(assessment.questoes_codigos?.length ?? assessment.quantidade_questoes),
          assessment.status ?? "rascunho",
        ])}
      />
      <section className="subpanel wide">
        <div className="section-heading">
          <div>
            <h3>Aplicações criadas</h3>
            <p>{scopeLabel}. Controle o ciclo da aplicação e visualize a prova sem gravar resposta de aluno.</p>
          </div>
          <span className="count-chip">{avaliacoesVisiveis.length} prova(s)</span>
        </div>
        <div className="reference-grid">
          {avaliacoesVisiveis.map((assessment) => (
            <article className="reference-card" key={assessment.codigo_acesso}>
              <div>
                <strong>{assessment.codigo_acesso} - {assessment.titulo}</strong>
                <em>{assessment.turma_codigo} - {assessment.status ?? "rascunho"} - {assessment.questoes_codigos?.length ?? assessment.quantidade_questoes} questões</em>
                <span>{assessment.curso_tecnico}</span>
                <span>{assessment.componentes}</span>
                <small>
                  Escola: {assessment.escola_inep ?? "não informada"} · Professor: {assessment.professor_matricula ?? "não informado"} · Código bloqueado para relatórios.
                </small>
              </div>
              <button className="secondary small" onClick={() => setPreviewAssessment(assessment)}>Pré-visualizar como aluno</button>
              <button className="secondary small" onClick={() => alterarStatusAvaliacao(assessment, "agendada")}>Agendar</button>
              <button className="secondary small" onClick={() => alterarStatusAvaliacao(assessment, "aberta")}>Abrir</button>
              <button className="secondary small" onClick={() => alterarStatusAvaliacao(assessment, "encerrada")}>Encerrar</button>
              <button className="secondary small" onClick={() => alterarStatusAvaliacao(assessment, "corrigida")}>Marcar corrigida</button>
              <button className="secondary danger small" onClick={() => excluirAvaliacao(assessment)}>Excluir avaliação</button>
            </article>
          ))}
          {!avaliacoesVisiveis.length && <p className="empty">Nenhuma avaliação criada dentro do seu escopo de acesso.</p>}
        </div>
      </section>
    </section>
  );
}

function Reports({
  schools,
  setSchools,
  teachers,
  setTeachers,
  assessments,
  setAssessments,
  questoes,
  setQuestoes,
  respostas,
  setRespostas,
  competencias,
  setCompetencias,
  descritores,
  setDescritores,
  currentUser,
  setMessage,
}: {
  schools: EscolaDraft[];
  setSchools: (schools: EscolaDraft[]) => void;
  teachers: ProfessorDraft[];
  setTeachers: (teachers: ProfessorDraft[]) => void;
  assessments: AvaliacaoDraft[];
  setAssessments: (assessments: AvaliacaoDraft[]) => void;
  questoes: QuestaoDraft[];
  setQuestoes: (questoes: QuestaoDraft[]) => void;
  respostas: RespostaAvaliacaoDraft[];
  setRespostas: (respostas: RespostaAvaliacaoDraft[]) => void;
  competencias: CompetenciaDraft[];
  setCompetencias: (competencias: CompetenciaDraft[]) => void;
  descritores: DescritorDraft[];
  setDescritores: (descritores: DescritorDraft[]) => void;
  currentUser: AuthUser;
  setMessage: (message: string) => void;
}) {
  const [syncing, setSyncing] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<"geral" | "avaliacao" | "individual" | "pedagogico" | "exportacoes">("geral");
  const [selectedAssessmentCode, setSelectedAssessmentCode] = useState("");
  const [selectedResponseId, setSelectedResponseId] = useState("");
  const assessmentCodes = new Set(assessments.map((assessment) => assessment.codigo_acesso));
  const respostasEscopo = respostas.filter((resposta) => assessmentCodes.has(resposta.avaliacao_codigo));
  const mediaGeral = respostasEscopo.length
    ? Math.round((respostasEscopo.reduce((total, resposta) => total + resposta.percentual_bruto, 0) / respostasEscopo.length) * 100) / 100
    : 0;
  const avaliacaoPorCodigo = new Map(assessments.map((assessment) => [assessment.codigo_acesso, assessment]));
  const questaoPorCodigo = new Map(questoes.map((questao) => [questao.codigo, questao]));
  const descritorPorCodigo = new Map(descritores.map((descritor) => [descritor.codigo, descritor]));
  const competenciaPorCodigo = new Map(competencias.map((competencia) => [competencia.codigo, competencia]));
  const questionCodesInScope = new Set(respostasEscopo.flatMap((resposta) => resposta.ordem_questoes));
  const questoesEscopo = questoes.filter((questao) => questionCodesInScope.has(questao.codigo));
  const descriptorCodesInScope = new Set(questoesEscopo.map((questao) => questao.descritor_codigo));
  const descritoresEscopo = descritores.filter((descritor) => descriptorCodesInScope.has(descritor.codigo));
  const competenciaCodesInScope = new Set(descritoresEscopo.map((descritor) => descritor.competencia_codigo));
  const competenciasEscopo = competencias.filter((competencia) => competenciaCodesInScope.has(competencia.codigo));
  const canExportFullPedagogicalBase = currentUser.role === "administrador" || currentUser.role === "seduc";
  const selectedAssessment = assessments.find((assessment) => assessment.codigo_acesso === selectedAssessmentCode) ?? assessments[0];
  const selectedStudentResponse = respostasEscopo.find((resposta) => resposta.id === selectedResponseId) ?? respostasEscopo[0];
  const respostasDaAvaliacaoSelecionada = selectedAssessment
    ? respostasEscopo.filter((resposta) => resposta.avaliacao_codigo === selectedAssessment.codigo_acesso)
    : [];
  const selectedStudentAssessment = selectedStudentResponse ? avaliacaoPorCodigo.get(selectedStudentResponse.avaliacao_codigo) : undefined;
  const mediaAvaliacaoSelecionada = respostasDaAvaliacaoSelecionada.length
    ? Math.round((respostasDaAvaliacaoSelecionada.reduce((total, resposta) => total + resposta.percentual_bruto, 0) / respostasDaAvaliacaoSelecionada.length) * 100) / 100
    : 0;
  const scopeLabel =
    currentUser.role === "administrador"
      ? "rede completa, cadastros, avaliações, respostas e manutenção técnica"
      : currentUser.role === "seduc"
        ? "rede estadual completa, com relatórios consolidados"
        : currentUser.role === "regional"
          ? "somente escolas vinculadas à sua CREDE/SEFOR"
          : currentUser.role === "gestao_escolar"
            ? "somente dados da escola do usuário"
            : "somente avaliações criadas pelo professor logado";
  const avaliacoesSemTurma = assessments.filter((assessment) => !assessment.turma_codigo.trim()).length;
  const respostasSemVinculo = respostasEscopo.filter((resposta) => !avaliacaoPorCodigo.has(resposta.avaliacao_codigo)).length;

  const linhasAlunos = respostasEscopo
    .slice()
    .sort((a, b) => b.enviado_em.localeCompare(a.enviado_em))
    .map((resposta) => {
      const assessment = avaliacaoPorCodigo.get(resposta.avaliacao_codigo);
      const turma = resposta.turma_codigo || assessment?.turma_codigo || "-";
      return [
        resposta.estudante_nome,
        resposta.avaliacao_codigo,
        turma,
        assessment?.titulo ?? resposta.avaliacao_titulo,
        `${resposta.acertos}/${resposta.total_questoes}`,
        `${resposta.percentual_bruto}%`,
        formatDateTime(assessment?.codigo_bloqueado_em ?? assessment?.inicio_em),
        formatDateTime(resposta.enviado_em),
      ];
    });

  const linhasTurmas = assessments.map((assessment) => {
    const respostasDaAvaliacao = respostasEscopo.filter((resposta) => resposta.avaliacao_codigo === assessment.codigo_acesso);
    const media = respostasDaAvaliacao.length
      ? Math.round((respostasDaAvaliacao.reduce((total, resposta) => total + resposta.percentual_bruto, 0) / respostasDaAvaliacao.length) * 100) / 100
      : 0;
    return [
      assessment.codigo_acesso,
      assessment.turma_codigo,
      assessment.titulo,
      assessment.status ?? "rascunho",
      String(respostasDaAvaliacao.length),
      `${media}%`,
      formatDateTime(assessment.codigo_bloqueado_em ?? assessment.inicio_em),
      formatDateTime(assessment.fim_em),
    ];
  });

  const descritorResumo = new Map<string, { acertos: number; total: number }>();
  const componenteResumo = new Map<string, { acertos: number; total: number }>();
  const competenciaResumo = new Map<string, { acertos: number; total: number }>();
  const descritorResumoAvaliacao = new Map<string, { acertos: number; total: number }>();

  respostasEscopo.forEach((resposta) => {
    resposta.ordem_questoes.forEach((codigoQuestao) => {
      const questao = questaoPorCodigo.get(codigoQuestao);
      if (!questao) return;
      const correta = resposta.respostas[codigoQuestao] === questao.gabarito;

      const descritor = descritorResumo.get(questao.descritor_codigo) ?? { acertos: 0, total: 0 };
      descritor.total += 1;
      if (correta) descritor.acertos += 1;
      descritorResumo.set(questao.descritor_codigo, descritor);

      const componente = componenteResumo.get(questao.componente_curricular) ?? { acertos: 0, total: 0 };
      componente.total += 1;
      if (correta) componente.acertos += 1;
      componenteResumo.set(questao.componente_curricular, componente);

      const competenciaCodigo = descritorPorCodigo.get(questao.descritor_codigo)?.competencia_codigo;
      if (competenciaCodigo) {
        const competencia = competenciaResumo.get(competenciaCodigo) ?? { acertos: 0, total: 0 };
        competencia.total += 1;
        if (correta) competencia.acertos += 1;
        competenciaResumo.set(competenciaCodigo, competencia);
      }
    });
  });

  respostasDaAvaliacaoSelecionada.forEach((resposta) => {
    resposta.ordem_questoes.forEach((codigoQuestao) => {
      const questao = questaoPorCodigo.get(codigoQuestao);
      if (!questao) return;
      const correta = resposta.respostas[codigoQuestao] === questao.gabarito;
      const descritor = descritorResumoAvaliacao.get(questao.descritor_codigo) ?? { acertos: 0, total: 0 };
      descritor.total += 1;
      if (correta) descritor.acertos += 1;
      descritorResumoAvaliacao.set(questao.descritor_codigo, descritor);
    });
  });

  function percent(item: { acertos: number; total: number }) {
    return item.total ? `${Math.round((item.acertos / item.total) * 10000) / 100}%` : "0%";
  }

  function percentNumber(item: { acertos: number; total: number }) {
    return item.total ? Math.round((item.acertos / item.total) * 10000) / 100 : 0;
  }

  function slugReport(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "relatorio";
  }

  function markdownTable(headers: string[], rows: string[][]) {
    if (!rows.length) return "_Nenhum registro encontrado._";
    const clean = (value: string) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
    return [
      `| ${headers.map(clean).join(" | ")} |`,
      `| ${headers.map(() => "---").join(" | ")} |`,
      ...rows.map((row) => `| ${row.map(clean).join(" | ")} |`),
    ].join("\n");
  }

  function htmlTable(headers: string[], rows: string[][]) {
    if (!rows.length) return "<p><em>Nenhum registro encontrado.</em></p>";
    return `
      <table>
        <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    `;
  }

  function reportHtml(title: string, sections: string[]) {
    const generatedAt = formatDateTime(new Date().toISOString());
    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #08295c; margin: 28px; line-height: 1.45; }
    header { border-bottom: 4px solid #0b8f57; margin-bottom: 22px; padding-bottom: 14px; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    h2 { margin-top: 26px; color: #06336f; page-break-after: avoid; }
    h3 { margin: 18px 0 8px; color: #0b6f4f; page-break-after: avoid; }
    p { margin: 6px 0; }
    .metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 14px 0; }
    .metric { border: 1px solid #c9d7e8; background: #f6faf8; padding: 10px; }
    .metric strong { display: block; font-size: 22px; color: #06336f; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0 22px; font-size: 12px; }
    th, td { border: 1px solid #dbe5ef; padding: 7px; text-align: left; vertical-align: top; }
    th { background: #f0f7f3; color: #06336f; }
    .question { border: 1px solid #dbe5ef; border-left: 5px solid #0b8f57; padding: 12px; margin: 12px 0; page-break-inside: avoid; }
    .question.wrong { border-left-color: #f97316; }
    @media print { body { margin: 15mm; } }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(title)}</h1>
    <p>SIDEP-CE · ${escapeHtml(authRoleLabel(currentUser.role))} · gerado em ${escapeHtml(generatedAt)}</p>
    <p>${escapeHtml(scopeLabel)}</p>
  </header>
  ${sections.join("\n")}
</body>
</html>`;
  }

  function exportReport(filename: string, title: string, markdown: string, htmlSections: string[], format: "md" | "pdf") {
    const suffix = new Date().toISOString().slice(0, 10);
    if (format === "md") {
      downloadTextFile(`${filename}-${suffix}.md`, markdown, "text/markdown;charset=utf-8");
      return;
    }
    const opened = openPrintableHtml(reportHtml(title, htmlSections));
    setMessage(opened ? "Relatório aberto para impressão/PDF." : "O navegador bloqueou a janela de impressão. Libere pop-ups para exportar em PDF.");
  }

  const statusResumo = ["rascunho", "agendada", "aberta", "encerrada", "corrigida"].map((status) => ({
    label: status,
    total: assessments.filter((assessment) => (assessment.status ?? "rascunho") === status).length,
  }));
  const componentesChart = Array.from(componenteResumo.entries())
    .map(([componente, resumo]) => ({ label: componente, value: percentNumber(resumo), detalhe: `${resumo.acertos}/${resumo.total}` }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  const descritoresCriticos = Array.from(descritorResumo.entries())
    .map(([codigo, resumo]) => ({
      codigo,
      descricao: descritorPorCodigo.get(codigo)?.descricao ?? "",
      value: percentNumber(resumo),
      detalhe: `${resumo.acertos}/${resumo.total}`,
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 8);
  const descritoresFortes = Array.from(descritorResumo.entries())
    .map(([codigo, resumo]) => ({
      codigo,
      descricao: descritorPorCodigo.get(codigo)?.descricao ?? "",
      value: percentNumber(resumo),
      detalhe: `${resumo.acertos}/${resumo.total}`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  const competenciasChart = Array.from(competenciaResumo.entries())
    .map(([codigo, resumo]) => ({
      codigo,
      descricao: competenciaPorCodigo.get(codigo)?.descricao ?? "",
      value: percentNumber(resumo),
      detalhe: `${resumo.acertos}/${resumo.total}`,
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 8);
  const prioridadePedagogica = descritoresCriticos[0];
  const componenteMaisFragil = componentesChart.slice().sort((a, b) => a.value - b.value)[0];
  const competenciaMaisFragil = competenciasChart[0];
  const descritoresCriticosAvaliacao = Array.from(descritorResumoAvaliacao.entries())
    .map(([codigo, resumo]) => ({
      codigo,
      descricao: descritorPorCodigo.get(codigo)?.descricao ?? "",
      value: percentNumber(resumo),
      detalhe: `${resumo.acertos}/${resumo.total}`,
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 8);
  const linhasAlunosAvaliacao = linhasAlunos.filter((linha) => selectedAssessment && linha[1] === selectedAssessment.codigo_acesso);
  const linhasAvaliacoesRecentes = linhasTurmas.slice(0, 8);
  const componentesAluno = selectedStudentResponse
    ? Object.entries(selectedStudentResponse.desempenho_por_componente)
      .map(([componente, resumo]) => ({ label: componente, value: resumo.percentual, detalhe: `${resumo.acertos}/${resumo.total}` }))
      .sort((a, b) => b.value - a.value)
    : [];
  const descritoresAluno = selectedStudentResponse
    ? Object.entries(selectedStudentResponse.desempenho_por_descritor)
      .map(([codigo, resumo]) => ({
        codigo,
        label: `${codigo} - ${descritorPorCodigo.get(codigo)?.descricao ?? "Descritor não localizado"}`,
        value: resumo.percentual,
        detalhe: `${resumo.acertos}/${resumo.total}`,
      }))
      .sort((a, b) => a.value - b.value)
    : [];
  const melhorComponenteAluno = componentesAluno[0];
  const maiorDificuldadeAluno = descritoresAluno[0];
  const questoesCorrigidasAluno = selectedStudentResponse
    ? selectedStudentResponse.ordem_questoes.map((codigoQuestao, index) => {
      const questao = questaoPorCodigo.get(codigoQuestao);
      if (!questao) return null;
      const respostaAluno = selectedStudentResponse.respostas[codigoQuestao];
      const acertou = respostaAluno === questao.gabarito;
      const descritor = descritorPorCodigo.get(questao.descritor_codigo);
      const alternativaTexto: Record<AlternativaKey, string> = {
        A: questao.alternativa_a,
        B: questao.alternativa_b,
        C: questao.alternativa_c,
        D: questao.alternativa_d,
        E: questao.alternativa_e,
      };
      return {
        index: index + 1,
        questao,
        descritor,
        respostaAluno,
        acertou,
        alternativaTexto,
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null)
    : [];

  function exportarVisaoGeral(format: "md" | "pdf") {
    const title = "SIDEP-CE - Relatório Geral";
    const metrics = [
      ["Escolas", String(schools.length)],
      ["Professores", String(teachers.length)],
      ["Avaliações", String(assessments.length)],
      ["Respostas", String(respostasEscopo.length)],
      ["Média geral", `${mediaGeral}%`],
    ];
    const statusRows = statusResumo.map((item) => [item.label, String(item.total)]);
    const componentRows = componentesChart.map((item) => [item.label, item.detalhe, `${item.value}%`]);
    const criticalRows = descritoresCriticos.map((item) => [item.codigo, item.descricao, item.detalhe, `${item.value}%`]);
    const markdown = [
      `# ${title}`,
      "",
      `Gerado em ${formatDateTime(new Date().toISOString())}.`,
      "",
      `**Escopo:** ${scopeLabel}`,
      "",
      "## Indicadores",
      markdownTable(["Indicador", "Valor"], metrics),
      "",
      "## Status das avaliações",
      markdownTable(["Status", "Total"], statusRows),
      "",
      "## Desempenho por componente",
      markdownTable(["Componente", "Acertos", "Resultado"], componentRows),
      "",
      "## Descritores críticos",
      markdownTable(["Descritor", "Descrição", "Acertos", "Resultado"], criticalRows),
      "",
      "## Avaliações recentes",
      markdownTable(["Avaliação", "Turma", "Título", "Status", "Respostas", "Média", "Criada/Aberta", "Encerrada/Corrigida"], linhasAvaliacoesRecentes),
    ].join("\n");
    const htmlSections = [
      `<section><h2>Indicadores</h2><div class="metrics">${metrics.map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div></section>`,
      `<section><h2>Status das avaliações</h2>${htmlTable(["Status", "Total"], statusRows)}</section>`,
      `<section><h2>Desempenho por componente</h2>${htmlTable(["Componente", "Acertos", "Resultado"], componentRows)}</section>`,
      `<section><h2>Descritores críticos</h2>${htmlTable(["Descritor", "Descrição", "Acertos", "Resultado"], criticalRows)}</section>`,
      `<section><h2>Avaliações recentes</h2>${htmlTable(["Avaliação", "Turma", "Título", "Status", "Respostas", "Média", "Criada/Aberta", "Encerrada/Corrigida"], linhasAvaliacoesRecentes)}</section>`,
    ];
    exportReport("sidep-ce-relatorio-geral", title, markdown, htmlSections, format);
  }

  function exportarAvaliacao(format: "md" | "pdf") {
    if (!selectedAssessment) {
      setMessage("Selecione uma avaliação para exportar.");
      return;
    }
    const title = `SIDEP-CE - Relatório da Avaliação ${selectedAssessment.codigo_acesso}`;
    const metrics = [
      ["Código", selectedAssessment.codigo_acesso],
      ["Turma", selectedAssessment.turma_codigo],
      ["Status", selectedAssessment.status ?? "rascunho"],
      ["Respostas", String(respostasDaAvaliacaoSelecionada.length)],
      ["Média", `${mediaAvaliacaoSelecionada}%`],
      ["Criada/Aberta", formatDateTime(selectedAssessment.codigo_bloqueado_em ?? selectedAssessment.inicio_em)],
    ];
    const criticalRows = descritoresCriticosAvaliacao.map((item) => [item.codigo, item.descricao, item.detalhe, `${item.value}%`]);
    const markdown = [
      `# ${title}`,
      "",
      `**Título:** ${selectedAssessment.titulo}`,
      `**Curso:** ${selectedAssessment.curso_tecnico}`,
      `**Componentes:** ${selectedAssessment.componentes}`,
      "",
      "## Indicadores",
      markdownTable(["Campo", "Valor"], metrics),
      "",
      "## Descritores críticos da avaliação",
      markdownTable(["Descritor", "Descrição", "Acertos", "Resultado"], criticalRows),
      "",
      "## Alunos da avaliação",
      markdownTable(["Aluno", "Avaliação", "Turma", "Título", "Acertos", "Resultado", "Criada/Aberta", "Envio do aluno"], linhasAlunosAvaliacao),
    ].join("\n");
    const htmlSections = [
      `<section><h2>Dados da avaliação</h2><p><strong>Título:</strong> ${escapeHtml(selectedAssessment.titulo)}</p><p><strong>Curso:</strong> ${escapeHtml(selectedAssessment.curso_tecnico)}</p><p><strong>Componentes:</strong> ${escapeHtml(selectedAssessment.componentes)}</p><div class="metrics">${metrics.map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div></section>`,
      `<section><h2>Descritores críticos da avaliação</h2>${htmlTable(["Descritor", "Descrição", "Acertos", "Resultado"], criticalRows)}</section>`,
      `<section><h2>Alunos da avaliação</h2>${htmlTable(["Aluno", "Avaliação", "Turma", "Título", "Acertos", "Resultado", "Criada/Aberta", "Envio do aluno"], linhasAlunosAvaliacao)}</section>`,
    ];
    exportReport(`sidep-ce-avaliacao-${slugReport(selectedAssessment.codigo_acesso)}`, title, markdown, htmlSections, format);
  }

  function exportarIndividual(format: "md" | "pdf") {
    if (!selectedStudentResponse) {
      setMessage("Selecione uma resposta de aluno para exportar.");
      return;
    }
    const title = `SIDEP-CE - Relatório Individual - ${selectedStudentResponse.estudante_nome}`;
    const metrics = [
      ["Aluno", selectedStudentResponse.estudante_nome],
      ["Turma", selectedStudentResponse.turma_codigo],
      ["Avaliação", selectedStudentResponse.avaliacao_codigo],
      ["Resultado", `${selectedStudentResponse.percentual_bruto}%`],
      ["Acertos", `${selectedStudentResponse.acertos}/${selectedStudentResponse.total_questoes}`],
      ["Envio", formatDateTime(selectedStudentResponse.enviado_em)],
    ];
    const componentRows = componentesAluno.map((item) => [item.label, item.detalhe, `${item.value}%`]);
    const descriptorRows = descritoresAluno.map((item) => [item.codigo, item.label.replace(`${item.codigo} - `, ""), item.detalhe, `${item.value}%`]);
    const questionRows = questoesCorrigidasAluno.map((item) => [
      String(item.index),
      item.questao.codigo,
      item.questao.componente_curricular,
      item.questao.descritor_codigo,
      item.respostaAluno,
      item.questao.gabarito,
      item.acertou ? "Acertou" : "Errou",
    ]);
    const questionsMarkdown = questoesCorrigidasAluno.map((item) => [
      `### ${item.index}. ${item.questao.codigo} - ${item.acertou ? "Acertou" : "Errou"}`,
      item.questao.enunciado,
      "",
      `- A) ${item.alternativaTexto.A}`,
      `- B) ${item.alternativaTexto.B}`,
      `- C) ${item.alternativaTexto.C}`,
      `- D) ${item.alternativaTexto.D}`,
      `- E) ${item.alternativaTexto.E}`,
      `- Resposta do aluno: ${item.respostaAluno}`,
      `- Gabarito: ${item.questao.gabarito}`,
      `- Descritor: ${item.descritor?.descricao ?? item.questao.descritor_codigo}`,
    ].join("\n")).join("\n\n");
    const questionsHtml = questoesCorrigidasAluno.map((item) => `
      <article class="question ${item.acertou ? "" : "wrong"}">
        <h3>${item.index}. ${escapeHtml(item.questao.codigo)} - ${item.acertou ? "Acertou" : "Errou"}</h3>
        <p>${escapeHtml(item.questao.enunciado)}</p>
        <p><strong>A)</strong> ${escapeHtml(item.alternativaTexto.A)}</p>
        <p><strong>B)</strong> ${escapeHtml(item.alternativaTexto.B)}</p>
        <p><strong>C)</strong> ${escapeHtml(item.alternativaTexto.C)}</p>
        <p><strong>D)</strong> ${escapeHtml(item.alternativaTexto.D)}</p>
        <p><strong>E)</strong> ${escapeHtml(item.alternativaTexto.E)}</p>
        <p><strong>Resposta do aluno:</strong> ${escapeHtml(item.respostaAluno)} · <strong>Gabarito:</strong> ${escapeHtml(item.questao.gabarito)}</p>
        <p><strong>Descritor:</strong> ${escapeHtml(item.descritor?.descricao ?? item.questao.descritor_codigo)}</p>
      </article>
    `).join("");
    const markdown = [
      `# ${title}`,
      "",
      "## Síntese",
      markdownTable(["Campo", "Valor"], metrics),
      "",
      "## Melhor desempenho por componente",
      markdownTable(["Componente", "Acertos", "Resultado"], componentRows),
      "",
      "## Dificuldades por descritor",
      markdownTable(["Descritor", "Descrição", "Acertos", "Resultado"], descriptorRows),
      "",
      "## Prova corrigida",
      markdownTable(["Nº", "Questão", "Componente", "Descritor", "Resposta", "Gabarito", "Situação"], questionRows),
      "",
      questionsMarkdown,
    ].join("\n");
    const htmlSections = [
      `<section><h2>Síntese</h2><div class="metrics">${metrics.map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div></section>`,
      `<section><h2>Melhor desempenho por componente</h2>${htmlTable(["Componente", "Acertos", "Resultado"], componentRows)}</section>`,
      `<section><h2>Dificuldades por descritor</h2>${htmlTable(["Descritor", "Descrição", "Acertos", "Resultado"], descriptorRows)}</section>`,
      `<section><h2>Prova corrigida</h2>${htmlTable(["Nº", "Questão", "Componente", "Descritor", "Resposta", "Gabarito", "Situação"], questionRows)}${questionsHtml}</section>`,
    ];
    exportReport(`sidep-ce-individual-${slugReport(selectedStudentResponse.estudante_nome)}`, title, markdown, htmlSections, format);
  }

  function exportarPedagogico(format: "md" | "pdf") {
    const title = "SIDEP-CE - Relatório Pedagógico";
    const priorityRows = [
      ["Prioridade imediata", prioridadePedagogica ? `${prioridadePedagogica.codigo} - ${prioridadePedagogica.descricao}` : "Sem dado suficiente"],
      ["Componente mais frágil", componenteMaisFragil ? `${componenteMaisFragil.label} (${componenteMaisFragil.value}%)` : "Sem dado suficiente"],
      ["Competência crítica", competenciaMaisFragil ? `${competenciaMaisFragil.codigo} - ${competenciaMaisFragil.descricao}` : "Sem dado suficiente"],
      ["Descritores analisados", String(descritorResumo.size)],
    ];
    const criticalRows = descritoresCriticos.map((item) => [item.codigo, item.descricao, item.detalhe, `${item.value}%`]);
    const strongRows = descritoresFortes.map((item) => [item.codigo, item.descricao, item.detalhe, `${item.value}%`]);
    const componentRows = componentesChart.map((item) => [item.label, item.detalhe, `${item.value}%`]);
    const competenceRows = competenciasChart.map((item) => [item.codigo, item.descricao, item.detalhe, `${item.value}%`]);
    const markdown = [
      `# ${title}`,
      "",
      `**Escopo:** ${scopeLabel}`,
      "",
      "## Síntese pedagógica",
      markdownTable(["Leitura", "Resultado"], priorityRows),
      "",
      "## Ação sugerida",
      "1. Reensinar com foco no descritor de menor desempenho.",
      "2. Aplicar prática curta no componente mais frágil.",
      "3. Reavaliar evidência com novos itens do mesmo descritor.",
      "",
      "## Descritores que exigem intervenção",
      markdownTable(["Descritor", "Descrição", "Acertos", "Resultado"], criticalRows),
      "",
      "## Descritores consolidados",
      markdownTable(["Descritor", "Descrição", "Acertos", "Resultado"], strongRows),
      "",
      "## Componentes curriculares",
      markdownTable(["Componente", "Acertos", "Resultado"], componentRows),
      "",
      "## Competências amplas",
      markdownTable(["Competência", "Descrição", "Acertos", "Resultado"], competenceRows),
    ].join("\n");
    const htmlSections = [
      `<section><h2>Síntese pedagógica</h2>${htmlTable(["Leitura", "Resultado"], priorityRows)}</section>`,
      `<section><h2>Ação sugerida</h2><ol><li>Reensinar com foco no descritor de menor desempenho.</li><li>Aplicar prática curta no componente mais frágil.</li><li>Reavaliar evidência com novos itens do mesmo descritor.</li></ol></section>`,
      `<section><h2>Descritores que exigem intervenção</h2>${htmlTable(["Descritor", "Descrição", "Acertos", "Resultado"], criticalRows)}</section>`,
      `<section><h2>Descritores consolidados</h2>${htmlTable(["Descritor", "Descrição", "Acertos", "Resultado"], strongRows)}</section>`,
      `<section><h2>Componentes curriculares</h2>${htmlTable(["Componente", "Acertos", "Resultado"], componentRows)}</section>`,
      `<section><h2>Competências amplas</h2>${htmlTable(["Competência", "Descrição", "Acertos", "Resultado"], competenceRows)}</section>`,
    ];
    exportReport("sidep-ce-relatorio-pedagogico", title, markdown, htmlSections, format);
  }

  function exportarBackupSemanal() {
    const geradoEm = new Date();
    const payload = {
      tipo: "backup_semanal_sidep_ce",
      versao: "mvp-online-json-por-aluno",
      gerado_em: geradoEm.toISOString(),
      escopo: {
        perfil: currentUser.role,
        regional_codigo: currentUser.regional_codigo ?? null,
        escola_inep: currentUser.escola_inep ?? null,
        professor_matricula: currentUser.professor_matricula ?? null,
      },
      regra_tecnica: {
        respostas: "uma linha/objeto por aluno e avaliacao, com alternativas em JSON",
        relatorios: "calculados sob demanda a partir das respostas consolidadas",
      },
      totais: {
        escolas: schools.length,
        professores: teachers.length,
        avaliacoes: assessments.length,
        respostas: respostasEscopo.length,
        questoes: canExportFullPedagogicalBase ? questoes.length : questoesEscopo.length,
      },
      dados: {
        escolas: schools,
        professores: teachers,
        avaliacoes: assessments,
        respostas: respostasEscopo,
        competencias: canExportFullPedagogicalBase ? competencias : competenciasEscopo,
        descritores: canExportFullPedagogicalBase ? descritores : descritoresEscopo,
        questoes: canExportFullPedagogicalBase ? questoes : questoesEscopo,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const datePart = geradoEm.toISOString().slice(0, 10);
    link.href = url;
    link.download = `backup-sidep-ce-${datePart}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function subirBaseLocalParaSupabase() {
    if (!supabaseConfigured) {
      setMessage("Configure o Supabase antes de subir a base local.");
      return;
    }
    if (currentUser.role !== "administrador") {
      setMessage("Somente o administrador master pode subir a base local completa para o Supabase.");
      return;
    }

    setSyncing(true);
    try {
      const competenciasLocais = carregarCompetenciasLocais();
      const descritoresLocais = carregarDescritoresLocais();
      const questoesLocais = carregarQuestoesLocais();
      const banco = montarBancoNorteadorAtualizado(competenciasLocais, descritoresLocais, questoesLocais);
      const escolasLocais = carregarEscolasLocais();
      const professoresLocais = carregarProfessoresLocais();
      const avaliacoesLocais = carregarAvaliacoesLocais();
      const respostasLocais = carregarRespostasLocais();
      const codigosBloqueados = carregarCodigosAvaliacaoBloqueados();

      await sincronizarRegionaisSupabase(regionaisSeed);

      for (const escola of escolasLocais) {
        const result = await salvarEscola(escola);
        if (result.erro) throw new Error(`Escola ${escola.codigo_inep}: ${result.erro}`);
      }

      for (const professor of professoresLocais) {
        const result = await salvarProfessor(professor);
        if (result.erro) throw new Error(`Professor ${professor.matricula}: ${result.erro}`);
      }

      const syncBanco = await sincronizarBancoItensSupabase(banco);

      for (const avaliacao of avaliacoesLocais) {
        const result = await salvarAvaliacao(avaliacao);
        if (result.erro) throw new Error(`Avaliação ${avaliacao.codigo_acesso}: ${result.erro}`);
      }

      for (const codigo of codigosBloqueados) {
        const result = await bloquearCodigoAvaliacao(codigo, { motivo: "migracao_local", avaliacao_codigo: codigo });
        if ("erro" in result && result.erro) throw new Error(`Código ${codigo}: ${result.erro}`);
      }

      for (const resposta of respostasLocais) {
        const result = await salvarRespostaAvaliacao(resposta);
        if (result.erro) throw new Error(`Resposta ${resposta.avaliacao_codigo}/${resposta.estudante_nome}: ${result.erro}`);
      }

      setSchools(escolasLocais);
      setTeachers(professoresLocais);
      setCompetencias(banco.competencias);
      setDescritores(banco.descritores);
      setQuestoes(banco.questoes);
      setAssessments(avaliacoesLocais);
      setRespostas(respostasLocais);
      setMessage(
        `Base local enviada ao Supabase: ${escolasLocais.length} escolas, ${professoresLocais.length} professores, ${syncBanco.competencias} competências, ${syncBanco.descritores} descritores, ${syncBanco.questoes} questões, ${avaliacoesLocais.length} avaliações e ${respostasLocais.length} respostas.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao subir a base local para o Supabase.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <section className="panel">
      <div className="dashboard-hero subtab-banner">
        <div>
          <span className="eyebrow">Relatórios e Learning Analytics</span>
          <h2>Indicadores por aluno, turma e percurso formativo</h2>
          <p>Diagnóstico individual e consolidado com recorte automático por professor, escola, CREDE/SEFOR, SEDUC ou administrador.</p>
        </div>
        <div className="dashboard-scope">
          <span>Escopo</span>
          <strong>{authRoleLabel(currentUser.role)}</strong>
        </div>
      </div>
      <div className="notice">
        <strong>Permissão aplicada:</strong> {scopeLabel}
        {currentUser.regional_codigo && <span> · {currentUser.regional_codigo}</span>}
        {currentUser.escola_inep && <span> · INEP {currentUser.escola_inep}</span>}.
        Os números abaixo já respeitam esse recorte de acesso e não misturam dados de outra escola, regional ou professor.
      </div>
      <div className="notice">
        <strong>Como a turma fica vinculada:</strong> a avaliação grava o código da turma no momento da criação.
        Quando o estudante envia a prova, a resposta registra o mesmo código da avaliação, a turma, o estudante e o horário de envio.
        O relatório cruza resposta e avaliação pelo código da prova, preservando rastreabilidade por turma e por aluno.
      </div>
      {(avaliacoesSemTurma > 0 || respostasSemVinculo > 0) && (
        <div className="notice warning">
          <strong>Atenção aos vínculos:</strong> {avaliacoesSemTurma} avaliação(ões) sem turma informada e {respostasSemVinculo} resposta(s) sem avaliação encontrada neste escopo.
          Revise esses registros antes de usar os dados em decisão pedagógica.
        </div>
      )}
      <div className="item-bank-tabs report-tabs" role="tablist" aria-label="Subabas de relatórios">
        <button className={activeReportTab === "geral" ? "active" : ""} onClick={() => setActiveReportTab("geral")}>Visão Geral</button>
        <button className={activeReportTab === "avaliacao" ? "active" : ""} onClick={() => setActiveReportTab("avaliacao")}>Por Avaliação</button>
        <button className={activeReportTab === "individual" ? "active" : ""} onClick={() => setActiveReportTab("individual")}>Individual</button>
        <button className={activeReportTab === "pedagogico" ? "active" : ""} onClick={() => setActiveReportTab("pedagogico")}>Pedagógico</button>
        <button className={activeReportTab === "exportacoes" ? "active" : ""} onClick={() => setActiveReportTab("exportacoes")}>Exportações</button>
      </div>

      {activeReportTab === "geral" && (
        <div className="report-tab-content">
          <div className="dashboard-kpis">
            <article className="dashboard-kpi"><span>Escolas</span><strong>{schools.length}</strong><small>unidades dentro do escopo</small></article>
            <article className="dashboard-kpi"><span>Professores</span><strong>{teachers.length}</strong><small>profissionais vinculados</small></article>
            <article className="dashboard-kpi"><span>Avaliações</span><strong>{assessments.length}</strong><small>aplicações criadas</small></article>
            <article className="dashboard-kpi"><span>Respostas</span><strong>{respostasEscopo.length}</strong><small>envios recebidos</small></article>
            <article className="dashboard-kpi"><span>Média geral</span><strong>{mediaGeral}%</strong><small>resultado bruto consolidado</small></article>
          </div>

          <div className="dashboard-grid two">
            <section className="dashboard-card">
              <div className="card-heading">
                <h3>Desempenho por componente</h3>
                <span className="tag">acertos</span>
              </div>
              <MiniBarList items={componentesChart} empty="Ainda não há respostas para montar o gráfico por componente." />
            </section>
            <section className="dashboard-card">
              <div className="card-heading">
                <h3>Status das avaliações</h3>
                <span className="tag">aplicações</span>
              </div>
              <MiniBarList
                items={statusResumo.map((item) => ({
                  label: item.label,
                  value: assessments.length ? Math.round((item.total / assessments.length) * 10000) / 100 : 0,
                  detalhe: `${item.total} avaliação(ões)`,
                }))}
                empty="Nenhuma avaliação criada neste escopo."
              />
            </section>
          </div>

          <section className="dashboard-card">
            <div className="card-heading">
              <h3>Descritores críticos do escopo</h3>
              <span className="tag">prioridade pedagógica</span>
            </div>
            <MiniBarList
              items={descritoresCriticos.map((item) => ({ label: `${item.codigo} - ${item.descricao}`, value: item.value, detalhe: item.detalhe }))}
              empty="Ainda não há respostas suficientes para apontar descritores críticos."
              inverted
            />
          </section>

          <section className="subpanel wide report-block">
            <div className="section-heading">
              <div>
                <h3>Avaliações recentes</h3>
                <p>Resumo operacional para acompanhar aplicações abertas, encerradas e corrigidas.</p>
              </div>
            </div>
            <DataTable
              headers={["Avaliação", "Turma", "Título", "Status", "Respostas", "Média", "Criada/Aberta", "Encerrada/Corrigida"]}
              rows={linhasAvaliacoesRecentes}
            />
          </section>
        </div>
      )}

      {activeReportTab === "avaliacao" && (
        <div className="report-tab-content">
          <div className="toolbar report-filter">
            <label>
              Avaliação
              <select value={selectedAssessment?.codigo_acesso ?? ""} onChange={(event) => setSelectedAssessmentCode(event.target.value)}>
                {assessments.map((assessment) => (
                  <option key={assessment.codigo_acesso} value={assessment.codigo_acesso}>
                    {assessment.codigo_acesso} - {assessment.turma_codigo} - {assessment.titulo}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedAssessment ? (
            <>
              <div className="dashboard-kpis">
                <article className="dashboard-kpi"><span>Código</span><strong>{selectedAssessment.codigo_acesso}</strong><small>identificador fixo da aplicação</small></article>
                <article className="dashboard-kpi"><span>Turma</span><strong>{selectedAssessment.turma_codigo}</strong><small>{selectedAssessment.curso_tecnico}</small></article>
                <article className="dashboard-kpi"><span>Respostas</span><strong>{respostasDaAvaliacaoSelecionada.length}</strong><small>alunos que enviaram</small></article>
                <article className="dashboard-kpi"><span>Média</span><strong>{mediaAvaliacaoSelecionada}%</strong><small>resultado bruto da aplicação</small></article>
                <article className="dashboard-kpi"><span>Status</span><strong>{selectedAssessment.status ?? "rascunho"}</strong><small>{formatDateTime(selectedAssessment.codigo_bloqueado_em ?? selectedAssessment.inicio_em)}</small></article>
              </div>

              <div className="dashboard-grid two">
                <section className="dashboard-card">
                  <div className="card-heading">
                    <h3>Descritores críticos da avaliação</h3>
                    <span className="tag">intervenção</span>
                  </div>
                  <MiniBarList
                    items={descritoresCriticosAvaliacao.map((item) => ({ label: `${item.codigo} - ${item.descricao}`, value: item.value, detalhe: item.detalhe }))}
                    empty="Esta avaliação ainda não possui respostas suficientes para análise por descritor."
                    inverted
                  />
                </section>
                <section className="dashboard-card">
                  <div className="card-heading">
                    <h3>Dados da aplicação</h3>
                    <span className="tag">auditoria</span>
                  </div>
                  <div className="report-facts">
                    <p><strong>Título:</strong> {selectedAssessment.titulo}</p>
                    <p><strong>Componentes:</strong> {selectedAssessment.componentes}</p>
                    <p><strong>Questões:</strong> {selectedAssessment.questoes_codigos?.length ?? selectedAssessment.quantidade_questoes}</p>
                    <p><strong>Criada/aberta:</strong> {formatDateTime(selectedAssessment.codigo_bloqueado_em ?? selectedAssessment.inicio_em)}</p>
                    <p><strong>Encerrada/corrigida:</strong> {formatDateTime(selectedAssessment.fim_em)}</p>
                  </div>
                </section>
              </div>

              <section className="subpanel wide report-block">
                <div className="section-heading">
                  <div>
                    <h3>Alunos desta avaliação</h3>
                    <p>Lista individual da aplicação selecionada, com envio e resultado bruto.</p>
                  </div>
                </div>
                <DataTable
                  headers={["Aluno", "Avaliação", "Turma", "Título", "Acertos", "Resultado", "Criada/Aberta", "Envio do aluno"]}
                  rows={linhasAlunosAvaliacao}
                />
              </section>
            </>
          ) : (
            <p className="empty">Nenhuma avaliação encontrada neste escopo.</p>
          )}
        </div>
      )}

      {activeReportTab === "individual" && (
        <div className="report-tab-content">
          <div className="toolbar report-filter">
            <label>
              Aluno e avaliação respondida
              <select value={selectedStudentResponse?.id ?? ""} onChange={(event) => setSelectedResponseId(event.target.value)}>
                {respostasEscopo.map((resposta) => (
                  <option key={resposta.id} value={resposta.id}>
                    {resposta.estudante_nome} - {resposta.turma_codigo} - {resposta.avaliacao_codigo} - {formatDateTime(resposta.enviado_em)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedStudentResponse ? (
            <>
              <div className="dashboard-kpis">
                <article className="dashboard-kpi"><span>Aluno</span><strong>{selectedStudentResponse.estudante_nome}</strong><small>{selectedStudentResponse.turma_codigo}</small></article>
                <article className="dashboard-kpi"><span>Avaliação</span><strong>{selectedStudentResponse.avaliacao_codigo}</strong><small>{selectedStudentAssessment?.titulo ?? selectedStudentResponse.avaliacao_titulo}</small></article>
                <article className="dashboard-kpi"><span>Resultado</span><strong>{selectedStudentResponse.percentual_bruto}%</strong><small>{selectedStudentResponse.acertos}/{selectedStudentResponse.total_questoes} acertos</small></article>
                <article className="dashboard-kpi"><span>Melhor desempenho</span><strong>{melhorComponenteAluno?.value ?? 0}%</strong><small>{melhorComponenteAluno?.label ?? "Sem dado suficiente"}</small></article>
                <article className="dashboard-kpi"><span>Maior dificuldade</span><strong>{maiorDificuldadeAluno?.value ?? 0}%</strong><small>{maiorDificuldadeAluno?.codigo ?? "Sem dado suficiente"}</small></article>
              </div>

              <div className="dashboard-grid two">
                <section className="dashboard-card">
                  <div className="card-heading">
                    <h3>Onde o aluno foi melhor</h3>
                    <span className="tag">componentes</span>
                  </div>
                  <MiniBarList items={componentesAluno} empty="Sem dados por componente para este aluno." />
                </section>
                <section className="dashboard-card">
                  <div className="card-heading">
                    <h3>Onde precisa de recomposição</h3>
                    <span className="tag">descritores</span>
                  </div>
                  <MiniBarList items={descritoresAluno} empty="Sem dados por descritor para este aluno." inverted />
                </section>
              </div>

              <section className="subpanel wide report-block">
                <div className="section-heading">
                  <div>
                    <h3>Prova respondida e corrigida</h3>
                    <p>Conferência item a item com resposta marcada, gabarito, descritor e componente curricular.</p>
                  </div>
                </div>
                <div className="corrected-question-list">
                  {questoesCorrigidasAluno.map((item) => (
                    <article className={item.acertou ? "corrected-question correct" : "corrected-question wrong"} key={item.questao.codigo}>
                      <div className="corrected-question-head">
                        <div>
                          <strong>{item.index}. {item.questao.codigo}</strong>
                          <span>{item.questao.componente_curricular} · {item.questao.descritor_codigo}</span>
                        </div>
                        <span className={item.acertou ? "result-chip correct" : "result-chip wrong"}>
                          {item.acertou ? "Acertou" : "Errou"}
                        </span>
                      </div>
                      <p>{item.questao.enunciado}</p>
                      <div className="answer-grid">
                        {(["A", "B", "C", "D", "E"] as AlternativaKey[]).map((alternativa) => (
                          <div
                            className={[
                              "answer-option",
                              alternativa === item.questao.gabarito ? "is-key" : "",
                              alternativa === item.respostaAluno ? "is-selected" : "",
                            ].filter(Boolean).join(" ")}
                            key={alternativa}
                          >
                            <strong>{alternativa}</strong>
                            <span>{item.alternativaTexto[alternativa]}</span>
                          </div>
                        ))}
                      </div>
                      <div className="correction-foot">
                        <span>Resposta do aluno: <strong>{item.respostaAluno}</strong></span>
                        <span>Gabarito: <strong>{item.questao.gabarito}</strong></span>
                        <span>Descritor: <strong>{item.descritor?.descricao ?? item.questao.descritor_codigo}</strong></span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="subpanel wide report-block">
                <div className="section-heading">
                  <div>
                    <h3>Histórico individual no escopo</h3>
                    <p>Lista completa das respostas visíveis para conferência e auditoria.</p>
                  </div>
                </div>
                <DataTable
                  headers={["Aluno", "Avaliação", "Turma", "Título", "Acertos", "Resultado", "Criada/Aberta", "Envio do aluno"]}
                  rows={linhasAlunos}
                />
              </section>
            </>
          ) : (
            <section className="subpanel wide report-block">
              <div className="section-heading">
                <div>
                  <h3>Relatório individual por aluno</h3>
                  <p>Nenhuma resposta foi encontrada neste escopo.</p>
                </div>
              </div>
              <p className="empty">Quando os estudantes enviarem avaliações, a prova corrigida aparecerá aqui.</p>
            </section>
          )}
        </div>
      )}

      {activeReportTab === "pedagogico" && (
        <div className="report-tab-content">
          <div className="dashboard-kpis">
            <article className="dashboard-kpi">
              <span>Prioridade imediata</span>
              <strong>{prioridadePedagogica?.codigo ?? "-"}</strong>
              <small>{prioridadePedagogica?.descricao ?? "Aguardando respostas para análise por descritor."}</small>
            </article>
            <article className="dashboard-kpi">
              <span>Componente mais frágil</span>
              <strong>{componenteMaisFragil?.value ?? 0}%</strong>
              <small>{componenteMaisFragil?.label ?? "Sem dado suficiente"}</small>
            </article>
            <article className="dashboard-kpi">
              <span>Competência crítica</span>
              <strong>{competenciaMaisFragil?.codigo ?? "-"}</strong>
              <small>{competenciaMaisFragil?.descricao ?? "Sem dado suficiente"}</small>
            </article>
            <article className="dashboard-kpi">
              <span>Descritores analisados</span>
              <strong>{descritorResumo.size}</strong>
              <small>com respostas registradas no escopo</small>
            </article>
          </div>

          <section className="dashboard-card pedagogy-action-card">
            <div className="card-heading">
              <h3>Leitura pedagógica sugerida</h3>
              <span className="tag">ação docente</span>
            </div>
            {prioridadePedagogica ? (
              <div className="pedagogy-actions">
                <article>
                  <strong>1. Reensinar com foco</strong>
                  <span>Comece pelo descritor {prioridadePedagogica.codigo}, pois ele apresenta o menor desempenho dentro do escopo atual.</span>
                </article>
                <article>
                  <strong>2. Aplicar prática curta</strong>
                  <span>Use uma atividade contextualizada do componente {componenteMaisFragil?.label ?? "mais frágil"} para verificar se a dificuldade é conceitual ou procedimental.</span>
                </article>
                <article>
                  <strong>3. Reavaliar evidência</strong>
                  <span>Depois da intervenção, aplique novos itens do mesmo descritor para comparar evolução diagnóstica, formativa e final.</span>
                </article>
              </div>
            ) : (
              <p className="empty">Quando houver respostas, o sistema sugerirá prioridades pedagógicas com base nos descritores de menor desempenho.</p>
            )}
          </section>

          <div className="dashboard-grid two">
            <section className="dashboard-card">
              <div className="card-heading">
                <h3>Descritores que exigem intervenção</h3>
                <span className="tag">menor desempenho</span>
              </div>
              <MiniBarList
                items={descritoresCriticos.map((item) => ({ label: `${item.codigo} - ${item.descricao}`, value: item.value, detalhe: item.detalhe }))}
                empty="Ainda não há respostas suficientes para apontar descritores críticos."
                inverted
              />
            </section>
            <section className="dashboard-card">
              <div className="card-heading">
                <h3>Descritores consolidados</h3>
                <span className="tag">pontos fortes</span>
              </div>
              <MiniBarList
                items={descritoresFortes.map((item) => ({ label: `${item.codigo} - ${item.descricao}`, value: item.value, detalhe: item.detalhe }))}
                empty="Ainda não há respostas suficientes para apontar pontos fortes."
              />
            </section>
          </div>

          <div className="dashboard-grid two">
            <section className="dashboard-card">
              <div className="card-heading">
                <h3>Componentes curriculares</h3>
                <span className="tag">planejamento</span>
              </div>
              <MiniBarList items={componentesChart} empty="Ainda não há respostas por componente." />
            </section>
            <section className="dashboard-card">
              <div className="card-heading">
                <h3>Competências amplas</h3>
                <span className="tag">matriz</span>
              </div>
              <MiniBarList
                items={competenciasChart.map((item) => ({ label: `${item.codigo} - ${item.descricao}`, value: item.value, detalhe: item.detalhe }))}
                empty="Ainda não há respostas por competência."
                inverted
              />
            </section>
          </div>

          <section className="subpanel wide report-block">
            <div className="section-heading">
              <div>
                <h3>Detalhamento por descritor</h3>
                <p>Tabela de conferência para auditoria pedagógica e análise fina das habilidades.</p>
              </div>
            </div>
            <DataTable
              headers={["Descritor", "Descrição", "Acertos", "Resultado"]}
              rows={Array.from(descritorResumo.entries()).map(([codigo, resumo]) => [
                codigo,
                descritorPorCodigo.get(codigo)?.descricao ?? "",
                `${resumo.acertos}/${resumo.total}`,
                percent(resumo),
              ])}
            />
          </section>
          <section className="subpanel wide report-block">
            <div className="section-heading">
              <div>
                <h3>Detalhamento por componente</h3>
                <p>Base para planejamento por disciplina/componente técnico.</p>
              </div>
            </div>
            <DataTable
              headers={["Componente", "Acertos", "Resultado"]}
              rows={Array.from(componenteResumo.entries()).map(([componente, resumo]) => [
                componente,
                `${resumo.acertos}/${resumo.total}`,
                percent(resumo),
              ])}
            />
          </section>
          <section className="subpanel wide report-block">
            <div className="section-heading">
              <div>
                <h3>Detalhamento por competência</h3>
                <p>Consolidação curricular para leitura da matriz por competência ampla.</p>
              </div>
            </div>
            <DataTable
              headers={["Competência", "Descrição", "Acertos", "Resultado"]}
              rows={Array.from(competenciaResumo.entries()).map(([codigo, resumo]) => [
                codigo,
                competenciaPorCodigo.get(codigo)?.descricao ?? "",
                `${resumo.acertos}/${resumo.total}`,
                percent(resumo),
              ])}
            />
          </section>
        </div>
      )}

      {activeReportTab === "exportacoes" && (
        <div className="report-tab-content">
          <section className="subpanel wide report-block">
            <div className="section-heading">
              <div>
                <h3>Exportações dos relatórios</h3>
                <p>Gere arquivos em Markdown ou abra a versão imprimível para salvar em PDF. Todas as opções respeitam o escopo e os filtros selecionados.</p>
              </div>
            </div>
            <div className="notice">
              O arquivo exportado respeita o perfil do usuário. Professor, escola e CREDE/SEFOR não exportam dados fora de sua autorização.
            </div>
          </section>

          <div className="export-grid">
            <section className="dashboard-card export-card">
              <div className="card-heading">
                <h3>Visão Geral</h3>
                <span className="tag">escopo atual</span>
              </div>
              <p>Exporta indicadores gerais, status das avaliações, componentes, descritores críticos e avaliações recentes.</p>
              <div className="export-actions">
                <button className="secondary small" type="button" onClick={() => exportarVisaoGeral("md")}>Exportar MD</button>
                <button className="secondary small" type="button" onClick={() => exportarVisaoGeral("pdf")}>Exportar PDF</button>
              </div>
            </section>

            <section className="dashboard-card export-card">
              <div className="card-heading">
                <h3>Por Avaliação</h3>
                <span className="tag">filtro</span>
              </div>
              <label>
                Avaliação
                <select value={selectedAssessment?.codigo_acesso ?? ""} onChange={(event) => setSelectedAssessmentCode(event.target.value)}>
                  {assessments.map((assessment) => (
                    <option key={assessment.codigo_acesso} value={assessment.codigo_acesso}>
                      {assessment.codigo_acesso} - {assessment.turma_codigo} - {assessment.titulo}
                    </option>
                  ))}
                </select>
              </label>
              <p>Exporta dados da aplicação, alunos respondentes e descritores críticos da avaliação selecionada.</p>
              <div className="export-actions">
                <button className="secondary small" type="button" onClick={() => exportarAvaliacao("md")}>Exportar MD</button>
                <button className="secondary small" type="button" onClick={() => exportarAvaliacao("pdf")}>Exportar PDF</button>
              </div>
            </section>

            <section className="dashboard-card export-card">
              <div className="card-heading">
                <h3>Individual</h3>
                <span className="tag">aluno</span>
              </div>
              <label>
                Aluno e avaliação respondida
                <select value={selectedStudentResponse?.id ?? ""} onChange={(event) => setSelectedResponseId(event.target.value)}>
                  {respostasEscopo.map((resposta) => (
                    <option key={resposta.id} value={resposta.id}>
                      {resposta.estudante_nome} - {resposta.turma_codigo} - {resposta.avaliacao_codigo} - {formatDateTime(resposta.enviado_em)}
                    </option>
                  ))}
                </select>
              </label>
              <p>Exporta síntese individual, pontos fortes, dificuldades por descritor e prova corrigida do aluno selecionado.</p>
              <div className="export-actions">
                <button className="secondary small" type="button" onClick={() => exportarIndividual("md")}>Exportar MD</button>
                <button className="secondary small" type="button" onClick={() => exportarIndividual("pdf")}>Exportar PDF</button>
              </div>
            </section>

            <section className="dashboard-card export-card">
              <div className="card-heading">
                <h3>Pedagógico</h3>
                <span className="tag">intervenção</span>
              </div>
              <p>Exporta prioridade pedagógica, ação sugerida, descritores críticos, descritores consolidados, componentes e competências.</p>
              <div className="export-actions">
                <button className="secondary small" type="button" onClick={() => exportarPedagogico("md")}>Exportar MD</button>
                <button className="secondary small" type="button" onClick={() => exportarPedagogico("pdf")}>Exportar PDF</button>
              </div>
            </section>

            <section className="dashboard-card export-card">
              <div className="card-heading">
                <h3>Backup técnico</h3>
                <span className="tag">JSON</span>
              </div>
              <p>Exporta backup semanal em JSON com respostas consolidadas por aluno/prova e dados permitidos pelo escopo.</p>
              <div className="export-actions">
                <button className="secondary small" type="button" onClick={exportarBackupSemanal}>Baixar backup JSON</button>
                {currentUser.role === "administrador" && (
                  <button className="secondary small" type="button" onClick={subirBaseLocalParaSupabase} disabled={syncing}>
                    {syncing ? "Subindo..." : "Subir base local para Supabase"}
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}

function MiniBarList({
  items,
  empty,
  inverted = false,
}: {
  items: Array<{ label: string; value: number; detalhe: string }>;
  empty: string;
  inverted?: boolean;
}) {
  if (!items.length) return <p className="empty">{empty}</p>;

  return (
    <div className="mini-bar-list">
      {items.map((item) => (
        <div className="mini-bar-row" key={item.label}>
          <div className="mini-bar-meta">
            <strong>{item.label}</strong>
            <span>{item.detalhe} · {item.value}%</span>
          </div>
          <div className="mini-bar-track" aria-hidden="true">
            <span
              className={inverted ? "mini-bar-fill warning" : "mini-bar-fill"}
              style={{ width: `${Math.max(4, Math.min(100, item.value))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ReferenceList({
  title,
  empty,
  kind,
  items,
}: {
  title: string;
  empty: string;
  kind: "competencia" | "descritor";
  items: Array<{
    code: string;
    title: string;
    description: string;
    meta: string;
    actionLabel: string;
    onAction: () => void;
  }>;
}) {
  return (
    <div className="reference-list">
      <div className="section-heading compact">
        <h4>{title}</h4>
        <span className="count-chip">{items.length}</span>
      </div>
      {!items.length && <p className="empty">{empty}</p>}
      <div className="reference-grid">
        {items.map((item) => (
          <article className="reference-card" key={item.code}>
            <div>
              <strong>{item.code}</strong>
              <em>{kind === "competencia" ? "Competência ampla" : "Descritor avaliável"}</em>
              <span>{item.title}</span>
            </div>
            <p>{item.description}</p>
            <small>{item.meta}</small>
            <button className="secondary small" onClick={item.onAction}>{item.actionLabel}</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  helper?: string;
}) {
  return (
    <label>
      {label}
      <input value={value} placeholder={placeholder} readOnly={readOnly} onChange={(event) => onChange(event.target.value)} />
      {helper && <small className="field-helper">{helper}</small>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
    </label>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (!rows.length) return <p className="empty">Nenhum registro salvo ainda.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

