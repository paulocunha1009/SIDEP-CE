import { supabase, supabaseConfigured } from "../lib/supabase";

export async function registrarAuditoria({
  usuarioTipo,
  acao,
  entidade,
  entidadeId,
  metadados = {},
}: {
  usuarioTipo: string;
  acao: string;
  entidade: string;
  entidadeId?: string;
  metadados?: Record<string, unknown>;
}) {
  if (!supabaseConfigured || !supabase) return;

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const entidadeUuid = entidadeId && uuidPattern.test(entidadeId) ? entidadeId : null;

  const { error } = await supabase.from("log_auditoria").insert({
    usuario_tipo: usuarioTipo,
    acao,
    entidade,
    entidade_id: entidadeUuid,
    metadados: {
      ...metadados,
      ...(entidadeId && !entidadeUuid ? { entidade_referencia: entidadeId } : {}),
    },
  });

  if (error) {
    console.warn("Falha ao registrar auditoria.", error.message);
  }
}
