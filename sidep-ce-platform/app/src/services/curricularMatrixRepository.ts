import { supabase, supabaseConfigured } from "../lib/supabase";
import type {
  CatalogoCurricularV2,
  CompetenciaCurricularV2,
  DescritorCurricularV2,
  MatrizComponenteV2,
  MatrizCurricularV2,
} from "../types";
import { sanitizeRecordText } from "../utils/textSanitizer";

const emptyCatalogo: CatalogoCurricularV2 = {
  matrizes: [],
  componentes: [],
  competencias: [],
  descritores: [],
};

function isMissingTableError(message?: string) {
  return Boolean(message?.includes("does not exist") || message?.includes("schema cache") || message?.includes("not found"));
}

function sanitizeCatalogo(catalogo: CatalogoCurricularV2): CatalogoCurricularV2 {
  return {
    matrizes: catalogo.matrizes.map((item) => sanitizeRecordText(item)),
    componentes: catalogo.componentes.map((item) => sanitizeRecordText(item)),
    competencias: catalogo.competencias.map((item) => sanitizeRecordText(item)),
    descritores: catalogo.descritores.map((item) => sanitizeRecordText(item)),
  };
}

export async function carregarCatalogoCurricularV2(): Promise<CatalogoCurricularV2> {
  if (!supabaseConfigured || !supabase) return emptyCatalogo;

  try {
    const [matrizes, componentes, competencias, descritores] = await Promise.all([
      supabase
        .from("matriz_curricular_v2")
        .select("codigo,curso_codigo,curso_nome,modalidade,ano_matriz,carga_horaria_total,carga_horaria_tecnica,versao,status,fonte")
        .order("curso_nome"),
      supabase
        .from("matriz_componente_v2")
        .select("codigo,matriz_codigo,nome,sigla,carga_horaria,ordem,status")
        .order("ordem"),
      supabase
        .from("competencia_curricular_v2")
        .select("codigo,matriz_codigo,componente_codigo,codigo_pedagogico,descricao,versao,status,fonte")
        .order("codigo_pedagogico"),
      supabase
        .from("descritor_curricular_v2")
        .select("codigo,matriz_codigo,componente_codigo,competencia_codigo,codigo_pedagogico,codigo_curto,descricao,nivel_cognitivo,nivel_tri_inicial,tipo_evidencia,referencia_ementa,versao,status")
        .order("codigo_pedagogico"),
    ]);

    const errors = [matrizes.error, componentes.error, competencias.error, descritores.error].filter(Boolean);
    if (errors.length) {
      const firstError = errors[0];
      if (isMissingTableError(firstError?.message)) return emptyCatalogo;
      throw firstError;
    }

    return sanitizeCatalogo({
      matrizes: (matrizes.data ?? []) as MatrizCurricularV2[],
      componentes: (componentes.data ?? []) as MatrizComponenteV2[],
      competencias: (competencias.data ?? []) as CompetenciaCurricularV2[],
      descritores: (descritores.data ?? []) as DescritorCurricularV2[],
    });
  } catch (error) {
    if (isMissingTableError(error instanceof Error ? error.message : undefined)) return emptyCatalogo;
    throw error;
  }
}
