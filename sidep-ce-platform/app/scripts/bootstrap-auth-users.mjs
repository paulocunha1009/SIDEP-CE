import { createClient } from "@supabase/supabase-js";

const args = new Set(process.argv.slice(2));
const execute = args.has("--execute");
const includeArg = process.argv.find((arg) => arg.startsWith("--include="));
const include = includeArg?.split("=")[1] ?? "all";
const passwordMode = process.env.SIDEP_PASSWORD_MODE ?? "fixed";
const fallbackPassword = process.env.SIDEP_INITIAL_PASSWORD ?? "AGzzcso1$";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY antes de rodar.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safePassword(candidate, fallback) {
  const password = String(candidate ?? "").trim();
  return password.length >= 6 ? password : fallback;
}

function passwordFor(kind, row) {
  if (passwordMode === "legacy") {
    if (kind === "professor") return safePassword(row.senha_inicial_hash ?? row.cpf, fallbackPassword);
    if (kind === "gestao_escolar") return safePassword(row.senha_inicial_hash ?? row.codigo_inep, fallbackPassword);
  }

  return fallbackPassword;
}

async function listExistingUsers() {
  const usersByEmail = new Map();
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    for (const user of data.users ?? []) {
      const email = normalizeEmail(user.email);
      if (email) usersByEmail.set(email, user);
    }

    if (!data.users || data.users.length < perPage) break;
    page += 1;
  }

  return usersByEmail;
}

async function fetchCandidates() {
  const candidates = [];

  if (include === "all" || include === "escolas") {
    const { data, error } = await supabase
      .from("escola")
      .select("codigo_inep,nome_oficial,email_principal,senha_inicial_hash,status")
      .eq("status", "ativa")
      .order("nome_oficial");

    if (error) throw error;

    for (const escola of data ?? []) {
      const email = normalizeEmail(escola.email_principal);
      candidates.push({
        kind: "gestao_escolar",
        email,
        nome: escola.nome_oficial,
        escola_inep: escola.codigo_inep,
        source: escola,
      });
    }
  }

  if (include === "all" || include === "professores") {
    const { data, error } = await supabase
      .from("professor")
      .select("matricula,nome_completo,email_institucional,cpf,senha_inicial_hash,status")
      .eq("status", "ativo")
      .order("nome_completo");

    if (error) throw error;

    for (const professor of data ?? []) {
      const email = normalizeEmail(professor.email_institucional);
      candidates.push({
        kind: "professor",
        email,
        nome: professor.nome_completo,
        professor_matricula: professor.matricula,
        source: professor,
      });
    }
  }

  return candidates.filter((candidate) => validEmail(candidate.email));
}

async function ensureAuthUser(candidate, existingUsers) {
  const existing = existingUsers.get(candidate.email);
  if (existing) return { user: existing, created: false };

  if (!execute) {
    return {
      user: { id: "dry-run", email: candidate.email },
      created: false,
    };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: candidate.email,
    password: passwordFor(candidate.kind, candidate.source),
    email_confirm: true,
    user_metadata: {
      nome: candidate.nome,
      perfil: candidate.kind,
      origem: "script_bootstrap_sidep",
    },
  });

  if (error) throw error;
  existingUsers.set(candidate.email, data.user);
  return { user: data.user, created: true };
}

async function upsertProfile(candidate, authUser) {
  if (!execute) return;

  const payload = {
    auth_user_id: authUser.id,
    email: candidate.email,
    nome: candidate.nome,
    perfil: candidate.kind,
    escola_inep: candidate.kind === "gestao_escolar" ? candidate.escola_inep : null,
    professor_matricula: candidate.kind === "professor" ? candidate.professor_matricula : null,
    regional_codigo: null,
    ativo: true,
    alterar_senha_primeiro_login: true,
    atualizado_em: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("sidep_usuario_perfil")
    .upsert(payload, { onConflict: "auth_user_id" });

  if (error) throw error;
}

async function main() {
  console.log(`SIDEP-CE Auth Bootstrap | modo=${execute ? "EXECUCAO" : "SIMULACAO"} | include=${include} | senha=${passwordMode}`);
  if (!["all", "escolas", "professores"].includes(include)) {
    throw new Error("Use --include=all, --include=escolas ou --include=professores.");
  }

  const existingUsers = await listExistingUsers();
  const candidates = await fetchCandidates();
  const seen = new Set();
  const summary = {
    candidates: candidates.length,
    skippedDuplicateEmail: 0,
    existingAuth: 0,
    createdAuth: 0,
    linkedProfiles: 0,
    errors: 0,
  };

  for (const candidate of candidates) {
    if (seen.has(candidate.email)) {
      summary.skippedDuplicateEmail += 1;
      console.warn(`Email duplicado ignorado: ${candidate.email} (${candidate.nome})`);
      continue;
    }

    seen.add(candidate.email);

    try {
      const result = await ensureAuthUser(candidate, existingUsers);
      if (result.created) summary.createdAuth += 1;
      else if (existingUsers.has(candidate.email)) summary.existingAuth += 1;

      await upsertProfile(candidate, result.user);
      summary.linkedProfiles += 1;
      console.log(`${execute ? "OK" : "SIMULAR"} | ${candidate.kind} | ${candidate.email} | ${candidate.nome}`);
    } catch (error) {
      summary.errors += 1;
      console.error(`ERRO | ${candidate.kind} | ${candidate.email} | ${error.message}`);
    }
  }

  console.log("\nResumo:");
  console.table(summary);

  if (!execute) {
    console.log("\nNada foi gravado. Para executar de verdade, rode novamente com -- --execute");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
