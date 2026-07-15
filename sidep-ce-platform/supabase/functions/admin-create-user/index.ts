import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type Perfil = "professor" | "gestao_escolar" | "regional" | "seduc" | "administrador";

type Payload = {
  email: string;
  password?: string;
  nome: string;
  perfil: Perfil;
  escola_inep?: string;
  regional_codigo?: string;
  professor_matricula?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function canCreateProfile(
  actor: { perfil: Perfil; escola_inep?: string | null; regional_codigo?: string | null },
  payload: Payload,
) {
  if (actor.perfil === "administrador" || actor.perfil === "seduc") return true;

  if (actor.perfil === "regional") {
    if (payload.perfil === "administrador" || payload.perfil === "seduc") return false;
    return !payload.regional_codigo || payload.regional_codigo === actor.regional_codigo;
  }

  if (actor.perfil === "gestao_escolar") {
    return payload.perfil === "professor" && payload.escola_inep === actor.escola_inep;
  }

  return false;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Metodo nao permitido." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json({ error: "Ambiente Supabase incompleto." }, 500);
  }

  const authorization = request.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) {
    return json({ error: "Sessao obrigatoria." }, 401);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authData, error: authError } = await userClient.auth.getUser();
  if (authError || !authData.user) return json({ error: "Sessao invalida." }, 401);

  const { data: actor, error: actorError } = await adminClient
    .from("sidep_usuario_perfil")
    .select("perfil,escola_inep,regional_codigo,ativo")
    .eq("auth_user_id", authData.user.id)
    .eq("ativo", true)
    .maybeSingle();

  if (actorError) return json({ error: actorError.message }, 500);
  if (!actor) return json({ error: "Perfil institucional nao encontrado." }, 403);

  const payload = (await request.json()) as Payload;
  payload.email = normalizeEmail(payload.email ?? "");

  if (!payload.email || !payload.nome || !payload.perfil) {
    return json({ error: "E-mail, nome e perfil sao obrigatorios." }, 400);
  }

  if (!canCreateProfile(actor, payload)) {
    return json({ error: "Perfil sem permissao para criar este usuario." }, 403);
  }

  const password = payload.password && payload.password.length >= 8
    ? payload.password
    : crypto.randomUUID().replaceAll("-", "").slice(0, 12) + "Aa1!";

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email: payload.email,
    password,
    email_confirm: true,
    user_metadata: {
      nome: payload.nome,
      perfil: payload.perfil,
      origem: "sidep_admin_create_user",
    },
  });

  if (createError && !createError.message.toLowerCase().includes("already")) {
    return json({ error: createError.message }, 400);
  }

  let authUserId = created.user?.id;
  if (!authUserId) {
    const { data: users, error: listError } = await adminClient.auth.admin.listUsers();
    if (listError) return json({ error: listError.message }, 500);
    authUserId = users.users.find((user) => normalizeEmail(user.email ?? "") === payload.email)?.id;
  }

  if (!authUserId) return json({ error: "Usuario Auth nao localizado apos criacao." }, 500);

  const { error: profileError } = await adminClient.from("sidep_usuario_perfil").upsert(
    {
      auth_user_id: authUserId,
      email: payload.email,
      nome: payload.nome,
      perfil: payload.perfil,
      escola_inep: payload.escola_inep ?? null,
      regional_codigo: payload.regional_codigo ?? null,
      professor_matricula: payload.professor_matricula ?? null,
      ativo: true,
      alterar_senha_primeiro_login: true,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  if (profileError) return json({ error: profileError.message }, 400);

  await adminClient.from("log_auditoria").insert({
    usuario_tipo: actor.perfil,
    acao: "usuario_auth_criado_edge_function",
    entidade: "sidep_usuario_perfil",
    entidade_id: authUserId,
    metadados: {
      email: payload.email,
      perfil: payload.perfil,
      criado_por: authData.user.id,
    },
  });

  return json({
    ok: true,
    auth_user_id: authUserId,
    email: payload.email,
    perfil: payload.perfil,
    senha_inicial_gerada: !payload.password,
    senha_inicial: payload.password ? undefined : password,
  });
});
