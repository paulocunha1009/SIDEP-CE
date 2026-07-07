import type { CompetenciaDraft, DescritorDraft, QuestaoDraft, ResultadoAcao } from "../types";

const STORAGE_KEYS = {
  competencias: "sidep-ce:competencias",
  descritores: "sidep-ce:descritores",
  questoes: "sidep-ce:questoes",
};

function readLocal<T>(key: string): T[] {
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function carregarCompetenciasLocais() {
  return readLocal<CompetenciaDraft>(STORAGE_KEYS.competencias);
}

export function salvarCompetenciaLocal(competencia: CompetenciaDraft): ResultadoAcao<CompetenciaDraft> {
  const competencias = readLocal<CompetenciaDraft>(STORAGE_KEYS.competencias).filter(
    (item) => item.codigo !== competencia.codigo,
  );
  writeLocal(STORAGE_KEYS.competencias, [...competencias, competencia]);
  return { data: competencia, modo: "local" };
}

export function carregarDescritoresLocais() {
  return readLocal<DescritorDraft>(STORAGE_KEYS.descritores);
}

export function salvarDescritorLocal(descritor: DescritorDraft): ResultadoAcao<DescritorDraft> {
  const descritores = readLocal<DescritorDraft>(STORAGE_KEYS.descritores).filter(
    (item) => item.codigo !== descritor.codigo,
  );
  writeLocal(STORAGE_KEYS.descritores, [...descritores, descritor]);
  return { data: descritor, modo: "local" };
}

export function carregarQuestoesLocais() {
  return readLocal<QuestaoDraft>(STORAGE_KEYS.questoes);
}

export function salvarQuestaoLocal(questao: QuestaoDraft): ResultadoAcao<QuestaoDraft> {
  const questoes = readLocal<QuestaoDraft>(STORAGE_KEYS.questoes).filter((item) => item.codigo !== questao.codigo);
  writeLocal(STORAGE_KEYS.questoes, [...questoes, questao]);
  return { data: questao, modo: "local" };
}

export function substituirBancoItensLocal({
  competencias,
  descritores,
  questoes,
}: {
  competencias: CompetenciaDraft[];
  descritores: DescritorDraft[];
  questoes: QuestaoDraft[];
}) {
  writeLocal(STORAGE_KEYS.competencias, competencias);
  writeLocal(STORAGE_KEYS.descritores, descritores);
  writeLocal(STORAGE_KEYS.questoes, questoes);
  return { modo: "local" as const };
}
