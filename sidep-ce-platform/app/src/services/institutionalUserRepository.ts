import { supabase, supabaseConfigured } from "../lib/supabase";

export type PerfilUsuarioInstitucional = "professor" | "gestao_escolar" | "regional" | "seduc" | "administrador";

export type UsuarioInstitucionalPayload = {
  email: string;
  password?: string;
  nome: string;
  perfil: PerfilUsuarioInstitucional;
  escola_inep?: string;
  regional_codigo?: string;
  professor_matricula?: string;
  ativo?: boolean;
  alterar_senha_primeiro_login?: boolean;
  operacao?: "sincronizar" | "redefinir_senha";
};

export type UsuarioInstitucionalResultado = {
  ok: boolean;
  auth_user_id: string;
  email: string;
  perfil: PerfilUsuarioInstitucional;
  senha_inicial_gerada?: boolean;
  senha_inicial?: string;
};

export type UsuarioRegionalOuSeduc = {
  id: string;
  nome: string;
  email: string;
  perfil: "regional" | "seduc";
  regional_codigo: string | null;
  ativo: boolean;
  alterar_senha_primeiro_login: boolean;
};

export async function sincronizarUsuarioInstitucionalAuth(
  payload: UsuarioInstitucionalPayload,
): Promise<UsuarioInstitucionalResultado | null> {
  if (!supabaseConfigured || !supabase) return null;

  const { data, error } = await supabase.functions.invoke<UsuarioInstitucionalResultado>("admin-create-user", {
    body: payload,
  });

  if (error) {
    let message = error.message;
    const context = (error as { context?: Response }).context;
    if (context) {
      try {
        const body = await context.clone().json();
        if (body?.error) message = body.error;
      } catch {
        // Mantem a mensagem original quando o corpo da resposta nao for JSON.
      }
    }
    throw new Error(message);
  }

  if (!data?.ok) throw new Error("A função administrativa não confirmou a criação ou sincronização do usuário.");

  return data;
}

export async function carregarUsuariosRegionaisSeduc(): Promise<UsuarioRegionalOuSeduc[]> {
  if (!supabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from("sidep_usuario_perfil")
    .select("id,nome,email,perfil,regional_codigo,ativo,alterar_senha_primeiro_login")
    .in("perfil", ["regional", "seduc"])
    .order("perfil", { ascending: true })
    .order("nome", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []) as UsuarioRegionalOuSeduc[];
}
