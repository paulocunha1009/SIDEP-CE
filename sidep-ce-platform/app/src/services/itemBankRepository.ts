import type { CompetenciaDraft, DescritorDraft, QuestaoDraft, ResultadoAcao } from "../types";
import { supabase, supabaseConfigured } from "../lib/supabase";

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

export async function carregarCompetencias() {
  if (!supabaseConfigured || !supabase) return carregarCompetenciasLocais();

  const { data, error } = await supabase
    .from("competencia_mvp")
    .select("codigo,curso_tecnico,descricao,fonte")
    .order("codigo");

  if (error) throw error;
  if (!data?.length) return carregarCompetenciasLocais();
  return data as CompetenciaDraft[];
}

export function salvarCompetenciaLocal(competencia: CompetenciaDraft): ResultadoAcao<CompetenciaDraft> {
  const competencias = readLocal<CompetenciaDraft>(STORAGE_KEYS.competencias).filter(
    (item) => item.codigo !== competencia.codigo,
  );
  writeLocal(STORAGE_KEYS.competencias, [...competencias, competencia]);
  return { data: competencia, modo: "local" };
}

export async function salvarCompetencia(competencia: CompetenciaDraft): Promise<ResultadoAcao<CompetenciaDraft>> {
  salvarCompetenciaLocal(competencia);

  if (!supabaseConfigured || !supabase) return { data: competencia, modo: "local" };

  const { error } = await supabase.from("competencia_mvp").upsert(
    {
      ...competencia,
      atualizada_em: new Date().toISOString(),
    },
    { onConflict: "codigo" },
  );

  if (error) return { erro: error.message, modo: "supabase" };
  return { data: competencia, modo: "supabase" };
}

export function carregarDescritoresLocais() {
  return readLocal<DescritorDraft>(STORAGE_KEYS.descritores);
}

export async function carregarDescritores() {
  if (!supabaseConfigured || !supabase) return carregarDescritoresLocais();

  const { data, error } = await supabase
    .from("descritor_mvp")
    .select("codigo,competencia_codigo,componente_curricular,descricao,nivel_esperado")
    .order("codigo");

  if (error) throw error;
  if (!data?.length) return carregarDescritoresLocais();
  return data as DescritorDraft[];
}

export function salvarDescritorLocal(descritor: DescritorDraft): ResultadoAcao<DescritorDraft> {
  const descritores = readLocal<DescritorDraft>(STORAGE_KEYS.descritores).filter(
    (item) => item.codigo !== descritor.codigo,
  );
  writeLocal(STORAGE_KEYS.descritores, [...descritores, descritor]);
  return { data: descritor, modo: "local" };
}

export async function salvarDescritor(descritor: DescritorDraft): Promise<ResultadoAcao<DescritorDraft>> {
  salvarDescritorLocal(descritor);

  if (!supabaseConfigured || !supabase) return { data: descritor, modo: "local" };

  const { error } = await supabase.from("descritor_mvp").upsert(
    {
      ...descritor,
      atualizada_em: new Date().toISOString(),
    },
    { onConflict: "codigo" },
  );

  if (error) return { erro: error.message, modo: "supabase" };
  return { data: descritor, modo: "supabase" };
}

export function carregarQuestoesLocais() {
  return readLocal<QuestaoDraft>(STORAGE_KEYS.questoes);
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
  return data as QuestaoDraft[];
}

export function salvarQuestaoLocal(questao: QuestaoDraft): ResultadoAcao<QuestaoDraft> {
  const questoes = readLocal<QuestaoDraft>(STORAGE_KEYS.questoes).filter((item) => item.codigo !== questao.codigo);
  writeLocal(STORAGE_KEYS.questoes, [...questoes, questao]);
  return { data: questao, modo: "local" };
}

export async function salvarQuestao(questao: QuestaoDraft): Promise<ResultadoAcao<QuestaoDraft>> {
  salvarQuestaoLocal(questao);

  if (!supabaseConfigured || !supabase) return { data: questao, modo: "local" };

  const { error } = await supabase.from("questao_mvp").upsert(
    {
      ...questao,
      atualizada_em: new Date().toISOString(),
    },
    { onConflict: "codigo" },
  );

  if (error) return { erro: error.message, modo: "supabase" };
  return { data: questao, modo: "supabase" };
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

export async function sincronizarBancoItensSupabase({
  competencias,
  descritores,
  questoes,
}: {
  competencias: CompetenciaDraft[];
  descritores: DescritorDraft[];
  questoes: QuestaoDraft[];
}) {
  substituirBancoItensLocal({ competencias, descritores, questoes });

  if (!supabaseConfigured || !supabase) {
    return { modo: "local" as const, competencias: competencias.length, descritores: descritores.length, questoes: questoes.length };
  }

  const now = new Date().toISOString();
  const competenciaRows = competencias.map((competencia) => ({ ...competencia, atualizada_em: now }));
  const descritorRows = descritores.map((descritor) => ({ ...descritor, atualizada_em: now }));
  const questaoRows = questoes.map((questao) => ({ ...questao, atualizada_em: now }));

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

  return { modo: "supabase" as const, competencias: competencias.length, descritores: descritores.length, questoes: questoes.length };
}
