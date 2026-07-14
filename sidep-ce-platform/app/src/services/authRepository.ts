import { supabase, supabaseConfigured } from "../lib/supabase";

export type PerfilInstitucional = {
  id: string;
  auth_user_id: string;
  email: string;
  nome: string;
  perfil: "professor" | "gestao_escolar" | "regional" | "seduc" | "administrador";
  escola_inep?: string | null;
  regional_codigo?: string | null;
  professor_matricula?: string | null;
  ativo: boolean;
  alterar_senha_primeiro_login?: boolean | null;
};

export async function signInInstitucional(email: string, password: string) {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Supabase não configurado para autenticação online.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;
}

export async function signOutInstitucional() {
  if (!supabaseConfigured || !supabase) return;
  await supabase.auth.signOut();
}

export async function carregarPerfilAutenticado(): Promise<PerfilInstitucional | null> {
  if (!supabaseConfigured || !supabase) return null;

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!sessionData.session?.user) return null;

  const { data, error } = await supabase
    .from("sidep_usuario_perfil")
    .select("id,auth_user_id,email,nome,perfil,escola_inep,regional_codigo,professor_matricula,ativo,alterar_senha_primeiro_login")
    .eq("auth_user_id", sessionData.session.user.id)
    .eq("ativo", true)
    .maybeSingle();

  if (error) throw error;
  return data as PerfilInstitucional | null;
}

export async function marcarSenhaInstitucionalAlterada() {
  if (!supabaseConfigured || !supabase) return;

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!sessionData.session?.user) return;

  const { error } = await supabase
    .from("sidep_usuario_perfil")
    .update({ alterar_senha_primeiro_login: false, atualizado_em: new Date().toISOString() })
    .eq("auth_user_id", sessionData.session.user.id);

  if (error) throw error;
}

export async function atualizarSenhaInstitucional(newPassword: string) {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Supabase não configurado para autenticação online.");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  await marcarSenhaInstitucionalAlterada();
}
