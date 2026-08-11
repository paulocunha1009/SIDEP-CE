import type { IntervencaoPedagogicaDraft, ResultadoAcao } from "../types";
import { supabase, supabaseConfigured } from "../lib/supabase";

const STORAGE_KEY = "sidep-ce:intervencoes-pedagogicas";

function readLocal(): IntervencaoPedagogicaDraft[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as IntervencaoPedagogicaDraft[];
  } catch {
    return [];
  }
}

function writeLocal(value: IntervencaoPedagogicaDraft[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function carregarIntervencoesLocais() {
  return readLocal();
}

export async function carregarIntervencoes(): Promise<IntervencaoPedagogicaDraft[]> {
  if (!supabaseConfigured || !supabase) return carregarIntervencoesLocais();

  const { data, error } = await supabase
    .from("intervencao_pedagogica_mvp")
    .select("id,escola_inep,professor_matricula,turma_codigo,curso_tecnico,descritor_codigo,tipo,status,data_planejada,observacoes")
    .order("criada_em", { ascending: false });

  if (error) throw error;
  return (data ?? []) as IntervencaoPedagogicaDraft[];
}

export async function salvarIntervencao(intervencao: IntervencaoPedagogicaDraft): Promise<ResultadoAcao<IntervencaoPedagogicaDraft>> {
  const comId = { ...intervencao, id: intervencao.id ?? crypto.randomUUID() };

  const locais = readLocal().filter((item) => item.id !== comId.id);
  writeLocal([...locais, comId]);

  if (!supabaseConfigured || !supabase) return { data: comId, modo: "local" };

  const { error } = await supabase.from("intervencao_pedagogica_mvp").upsert(
    { ...comId, atualizada_em: new Date().toISOString() },
    { onConflict: "id" },
  );

  if (error) return { erro: error.message, modo: "supabase" };
  return { data: comId, modo: "supabase" };
}
