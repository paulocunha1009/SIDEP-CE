import { createClient } from "@supabase/supabase-js";

const args = new Set(process.argv.slice(2));
const execute = args.has("--execute");
const overwriteProfiles = args.has("--overwrite-profiles");
const includeArg = process.argv.find((arg) => arg.startsWith("--include="));
const include = includeArg?.split("=")[1] ?? "all";
const passwordMode = process.env.SIDEP_PASSWORD_MODE ?? "fixed";
const fallbackPassword = process.env.SIDEP_INITIAL_PASSWORD ?? "AGzzcso1$";
const protectedProfiles = new Set(["administrador", "seduc", "regional"]);
const protectedEmails = new Set(
  String(process.env.SIDEP_MASTER_EMAILS ?? "")
    .split(/[;,]/)
    .map((email) => normalizeEmail(email))
    .filter(Boolean),
);

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

async function listExistingProfiles() {
  const profilesByEmail = new Map();
  const profilesByAuthId = new Map();

  const { data, error } = await supabase
    .from("sidep_usuario_perfil")
    .select("id,auth_user_id,email,nome,perfil,escola_inep,regional_codigo,professor_matricula,ativo");

  if (error) throw error;

  for (const profile of data ?? []) {
    const email = normalizeEmail(profile.email);
    if (email) profilesByEmail.set(email, profile);
    if (profile.auth_user_id) profilesByAuthId.set(profile.auth_user_id, profile);
  }

  return { profilesByEmail, profilesByAuthId };
}

async function fetchCandidates() {
  const candidates = [];
  const skippedInvalidEmail = [];

  if (include === "all" || include === "escolas") {
    const { data, error } = await supabase
      .from("escola")
      .select("codigo_inep,nome_oficial,email_principal,senha_inicial_hash,status")
      .eq("status", "ativa")
      .order("nome_oficial");

    if (error) throw error;

    for (const escola of data ?? []) {
      const email = normalizeEmail(escola.email_principal);
      const candidate = {
        kind: "gestao_escolar",
        email,
        nome: escola.nome_oficial,
        escola_inep: escola.codigo_inep,
        source: escola,
      };

      if (validEmail(candidate.email)) candidates.push(candidate);
      else skippedInvalidEmail.push(candidate);
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
      const candidate = {
        kind: "professor",
        email,
        nome: professor.nome_completo,
        professor_matricula: professor.matricula,
        source: professor,
      };

      if (validEmail(candidate.email)) candidates.push(candidate);
      else skippedInvalidEmail.push(candidate);
    }
  }

  return { candidates, skippedInvalidEmail };
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

  if (!execute) return payload;

  const { error } = await supabase
    .from("sidep_usuario_perfil")
    .upsert(payload, { onConflict: "email" });

  if (error) throw error;
  return payload;
}

function shouldSkipProfile(candidate, authUser, existingProfiles) {
  const existingByEmail = existingProfiles.profilesByEmail.get(candidate.email);
  const existingByAuthId = authUser.id === "dry-run" ? null : existingProfiles.profilesByAuthId.get(authUser.id);
  const existing = existingByEmail ?? existingByAuthId;

  if (!existing) return { skip: false, reason: "" };

  if (protectedProfiles.has(existing.perfil) && !overwriteProfiles) {
    return {
      skip: true,
      reason: `perfil protegido existente (${existing.perfil}); use --overwrite-profiles apenas se tiver certeza`,
    };
  }

  if (existing.perfil !== candidate.kind && !overwriteProfiles) {
    return {
      skip: true,
      reason: `perfil existente diferente (${existing.perfil}); revise manualmente ou use --overwrite-profiles`,
    };
  }

  if (existingByEmail && existingByAuthId && existingByEmail.id !== existingByAuthId.id && !overwriteProfiles) {
    return {
      skip: true,
      reason: "e-mail e Auth UID apontam para perfis diferentes; revise manualmente",
    };
  }

  return { skip: false, reason: "" };
}

async function main() {
  console.log(
    `SIDEP-CE Auth Bootstrap | modo=${execute ? "EXECUCAO" : "SIMULACAO"} | include=${include} | senha=${passwordMode} | overwrite=${overwriteProfiles}`,
  );
  if (!["all", "escolas", "professores"].includes(include)) {
    throw new Error("Use --include=all, --include=escolas ou --include=professores.");
  }

  const existingUsers = await listExistingUsers();
  const existingProfiles = await listExistingProfiles();
  const { candidates, skippedInvalidEmail } = await fetchCandidates();
  const seen = new Set();
  const summary = {
    candidates: candidates.length,
    skippedInvalidEmail: skippedInvalidEmail.length,
    skippedDuplicateEmail: 0,
    skippedExistingProfile: 0,
    existingAuth: 0,
    createdAuth: 0,
    linkedProfiles: 0,
    errors: 0,
  };

  for (const candidate of skippedInvalidEmail) {
    console.warn(`Email invalido ignorado: ${candidate.email || "(vazio)"} (${candidate.nome})`);
  }

  for (const candidate of candidates) {
    if (seen.has(candidate.email)) {
      summary.skippedDuplicateEmail += 1;
      console.warn(`Email duplicado em cadastros institucionais ignorado: ${candidate.email} (${candidate.nome})`);
      continue;
    }

    seen.add(candidate.email);

    try {
      if (protectedEmails.has(candidate.email)) {
        summary.skippedExistingProfile += 1;
        console.warn(`EMAIL MASTER PRESERVADO | ${candidate.kind} | ${candidate.email} | tratado fora do bootstrap automatico`);
        continue;
      }

      const existingProfileByEmail = existingProfiles.profilesByEmail.get(candidate.email);
      if (existingProfileByEmail && protectedProfiles.has(existingProfileByEmail.perfil) && !overwriteProfiles) {
        summary.skippedExistingProfile += 1;
        console.warn(
          `PERFIL PRESERVADO | ${candidate.kind} | ${candidate.email} | perfil protegido existente (${existingProfileByEmail.perfil})`,
        );
        continue;
      }

      if (existingProfileByEmail && existingProfileByEmail.perfil !== candidate.kind && !overwriteProfiles) {
        summary.skippedExistingProfile += 1;
        console.warn(
          `PERFIL PRESERVADO | ${candidate.kind} | ${candidate.email} | perfil existente diferente (${existingProfileByEmail.perfil})`,
        );
        continue;
      }

      const result = await ensureAuthUser(candidate, existingUsers);
      if (result.created) summary.createdAuth += 1;
      else if (existingUsers.has(candidate.email)) summary.existingAuth += 1;

      const profileCheck = shouldSkipProfile(candidate, result.user, existingProfiles);
      if (profileCheck.skip) {
        summary.skippedExistingProfile += 1;
        console.warn(`PERFIL PRESERVADO | ${candidate.kind} | ${candidate.email} | ${profileCheck.reason}`);
        continue;
      }

      await upsertProfile(candidate, result.user);
      if (execute && result.user.id !== "dry-run") {
        existingProfiles.profilesByEmail.set(candidate.email, {
          auth_user_id: result.user.id,
          email: candidate.email,
          perfil: candidate.kind,
        });
        existingProfiles.profilesByAuthId.set(result.user.id, {
          auth_user_id: result.user.id,
          email: candidate.email,
          perfil: candidate.kind,
        });
      }
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

  if (!overwriteProfiles) {
    console.log("Perfis existentes sensiveis ou divergentes foram preservados. Use --overwrite-profiles somente com auditoria previa.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
