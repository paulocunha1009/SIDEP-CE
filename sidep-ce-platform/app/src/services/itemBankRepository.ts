import type { CompetenciaDraft, DescritorDraft, QuestaoDraft, ResultadoAcao } from "../types";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { sanitizeRecordText } from "../utils/textSanitizer";

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
  return readLocal<CompetenciaDraft>(STORAGE_KEYS.competencias).map(sanitizeCompetencia);
}

export async function carregarCompetencias() {
  if (!supabaseConfigured || !supabase) return carregarCompetenciasLocais();

  const { data, error } = await supabase
    .from("competencia_mvp")
    .select("codigo,curso_tecnico,descricao,fonte")
    .order("codigo");

  if (error) throw error;
  if (!data?.length) return carregarCompetenciasLocais();
  return (data as CompetenciaDraft[]).map(sanitizeCompetencia);
}

export function salvarCompetenciaLocal(competencia: CompetenciaDraft): ResultadoAcao<CompetenciaDraft> {
  const competenciaLimpa = sanitizeCompetencia(competencia);
  const competencias = readLocal<CompetenciaDraft>(STORAGE_KEYS.competencias).filter(
    (item) => item.codigo !== competenciaLimpa.codigo,
  );
  writeLocal(STORAGE_KEYS.competencias, [...competencias, competenciaLimpa]);
  return { data: competenciaLimpa, modo: "local" };
}

export async function salvarCompetencia(competencia: CompetenciaDraft): Promise<ResultadoAcao<CompetenciaDraft>> {
  const competenciaLimpa = sanitizeCompetencia(competencia);
  salvarCompetenciaLocal(competenciaLimpa);

  if (!supabaseConfigured || !supabase) return { data: competenciaLimpa, modo: "local" };

  const { error } = await supabase.from("competencia_mvp").upsert(
    {
      ...competenciaLimpa,
      atualizada_em: new Date().toISOString(),
    },
    { onConflict: "codigo" },
  );

  if (error) return { erro: error.message, modo: "supabase" };
  return { data: competenciaLimpa, modo: "supabase" };
}

export function carregarDescritoresLocais() {
  return readLocal<DescritorDraft>(STORAGE_KEYS.descritores).map(sanitizeDescritor);
}

export async function carregarDescritores() {
  if (!supabaseConfigured || !supabase) return carregarDescritoresLocais();

  const { data, error } = await supabase
    .from("descritor_mvp")
    .select("codigo,competencia_codigo,componente_curricular,descricao,nivel_esperado")
    .order("codigo");

  if (error) throw error;
  if (!data?.length) return carregarDescritoresLocais();
  return (data as DescritorDraft[]).map(sanitizeDescritor);
}

export function salvarDescritorLocal(descritor: DescritorDraft): ResultadoAcao<DescritorDraft> {
  const descritorLimpo = sanitizeDescritor(descritor);
  const descritores = readLocal<DescritorDraft>(STORAGE_KEYS.descritores).filter(
    (item) => item.codigo !== descritorLimpo.codigo,
  );
  writeLocal(STORAGE_KEYS.descritores, [...descritores, descritorLimpo]);
  return { data: descritorLimpo, modo: "local" };
}

export async function salvarDescritor(descritor: DescritorDraft): Promise<ResultadoAcao<DescritorDraft>> {
  const descritorLimpo = sanitizeDescritor(descritor);
  salvarDescritorLocal(descritorLimpo);

  if (!supabaseConfigured || !supabase) return { data: descritorLimpo, modo: "local" };

  const { error } = await supabase.from("descritor_mvp").upsert(
    {
      ...descritorLimpo,
      atualizada_em: new Date().toISOString(),
    },
    { onConflict: "codigo" },
  );

  if (error) return { erro: error.message, modo: "supabase" };
  return { data: descritorLimpo, modo: "supabase" };
}

export function carregarQuestoesLocais() {
  return readLocal<QuestaoDraft>(STORAGE_KEYS.questoes).map(sanitizeQuestao);
}

export async function carregarQuestoes() {
  if (!supabaseConfigured || !supabase) return carregarQuestoesLocais();

  const { data, error } = await supabase
    .from("questao_mvp")
    .select(
      "codigo,descritor_codigo,componente_curricular,enunciado,alternativa_a,alternativa_b,alternativa_c,alternativa_d,alternativa_e,gabarito,justificativa,dificuldade_inicial,status",
    )
    .order("codigo");

  if (error) throw error;
  if (!data?.length) return carregarQuestoesLocais();
  return (data as QuestaoDraft[]).map(sanitizeQuestao);
}

export function salvarQuestaoLocal(questao: QuestaoDraft): ResultadoAcao<QuestaoDraft> {
  const questaoLimpa = sanitizeQuestao(questao);
  const questoes = readLocal<QuestaoDraft>(STORAGE_KEYS.questoes).filter((item) => item.codigo !== questaoLimpa.codigo);
  writeLocal(STORAGE_KEYS.questoes, [...questoes, questaoLimpa]);
  return { data: questaoLimpa, modo: "local" };
}

export async function salvarQuestao(questao: QuestaoDraft): Promise<ResultadoAcao<QuestaoDraft>> {
  const questaoLimpa = sanitizeQuestao(questao);
  salvarQuestaoLocal(questaoLimpa);

  if (!supabaseConfigured || !supabase) return { data: questaoLimpa, modo: "local" };

  const { error } = await supabase.from("questao_mvp").upsert(
    {
      ...questaoLimpa,
      atualizada_em: new Date().toISOString(),
    },
    { onConflict: "codigo" },
  );

  if (error) return { erro: error.message, modo: "supabase" };
  return { data: questaoLimpa, modo: "supabase" };
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
  writeLocal(STORAGE_KEYS.competencias, competencias.map(sanitizeCompetencia));
  writeLocal(STORAGE_KEYS.descritores, descritores.map(sanitizeDescritor));
  writeLocal(STORAGE_KEYS.questoes, questoes.map(sanitizeQuestao));
  return { modo: "local" as const };
}

export async function sincronizarBancoItensSupabase({
  competencias,
  descritores,
  questoes,
}: {
  competencias: CompetenciaDraft[];
  descritores: DescritorDraft[];
  questoes: QuestaoDraft[];
}) {
  const competenciasLimpas = competencias.map(sanitizeCompetencia);
  const descritoresLimpos = descritores.map(sanitizeDescritor);
  const questoesLimpas = questoes.map(sanitizeQuestao);
  substituirBancoItensLocal({ competencias: competenciasLimpas, descritores: descritoresLimpos, questoes: questoesLimpas });

  if (!supabaseConfigured || !supabase) {
    return { modo: "local" as const, competencias: competenciasLimpas.length, descritores: descritoresLimpos.length, questoes: questoesLimpas.length };
  }

  const now = new Date().toISOString();
  const competenciaRows = competenciasLimpas.map((competencia) => ({ ...competencia, atualizada_em: now }));
  const descritorRows = descritoresLimpos.map((descritor) => ({ ...descritor, atualizada_em: now }));
  const questaoRows = questoesLimpas.map((questao) => ({ ...questao, atualizada_em: now }));

  const competenciaResult = await supabase.from("competencia_mvp").upsert(competenciaRows, { onConflict: "codigo" });
  if (competenciaResult.error) throw competenciaResult.error;

  const descritorResult = await supabase.from("descritor_mvp").upsert(descritorRows, { onConflict: "codigo" });
  if (descritorResult.error) throw descritorResult.error;

  const chunkSize = 100;
  for (let index = 0; index < questaoRows.length; index += chunkSize) {
    const chunk = questaoRows.slice(index, index + chunkSize);
    const questaoResult = await supabase.from("questao_mvp").upsert(chunk, { onConflict: "codigo" });
    if (questaoResult.error) throw questaoResult.error;
  }

  return { modo: "supabase" as const, competencias: competenciasLimpas.length, descritores: descritoresLimpos.length, questoes: questoesLimpas.length };
}

function sanitizeCompetencia(competencia: CompetenciaDraft): CompetenciaDraft {
  return sanitizeRecordText(competencia);
}

function sanitizeDescritor(descritor: DescritorDraft): DescritorDraft {
  return sanitizeRecordText(descritor);
}

function sanitizeQuestao(questao: QuestaoDraft): QuestaoDraft {
  return sanitizeRecordText(questao);
}
