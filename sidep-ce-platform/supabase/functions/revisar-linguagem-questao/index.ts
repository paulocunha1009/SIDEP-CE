import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// SIDEP-CE - Sprint 7: revisao linguistica de questoes com IA (supervisionada).
//
// Regras de negocio (confirmadas com o usuario em 10/08/2026):
// - So sugere melhoria de clareza/gramatica; nunca muda o gabarito nem o
//   conteudo tecnico/pedagogico da questao.
// - Nunca aplica a sugestao sozinho: so retorna um rascunho para o professor
//   revisar e decidir aplicar ou nao no formulario (revisao humana obrigatoria).
// - Nao recebe nem envia nenhum dado de aluno - so o texto da questao em si
//   (enunciado/alternativas/justificativa), que e conteudo curricular, nao
//   dado pessoal.
// - Toda chamada fica registrada em log_auditoria, para rastreabilidade.

type Payload = {
  codigo?: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_e: string;
  gabarito: string;
  justificativa?: string;
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

const CAMPOS_TEXTO = ["enunciado", "alternativa_a", "alternativa_b", "alternativa_c", "alternativa_d", "alternativa_e", "justificativa"] as const;

function extrairJson(texto: string): Record<string, string> | null {
  const semCercas = texto.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  try {
    const parsed = JSON.parse(semCercas);
    if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, string>;
    return null;
  } catch {
    return null;
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Metodo nao permitido." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json({ error: "Ambiente Supabase incompleto." }, 500);
  }
  if (!geminiApiKey) {
    return json({ error: "GEMINI_API_KEY nao configurada neste projeto Supabase." }, 500);
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
    .select("perfil,ativo")
    .eq("auth_user_id", authData.user.id)
    .eq("ativo", true)
    .maybeSingle();

  if (actorError) return json({ error: actorError.message }, 500);
  if (!actor) return json({ error: "Perfil institucional nao encontrado." }, 403);

  const perfisPermitidos = ["professor", "gestao_escolar", "regional", "seduc", "administrador"];
  if (!perfisPermitidos.includes(actor.perfil)) {
    return json({ error: "Perfil sem permissao para usar a revisao com IA." }, 403);
  }

  const payload = (await request.json()) as Payload;
  if (!payload.enunciado || !payload.alternativa_a || !payload.alternativa_b || !payload.alternativa_c || !payload.alternativa_d || !payload.alternativa_e || !payload.gabarito) {
    return json({ error: "Enunciado, as 5 alternativas e o gabarito sao obrigatorios." }, 400);
  }

  const questaoOriginal = {
    enunciado: payload.enunciado,
    alternativa_a: payload.alternativa_a,
    alternativa_b: payload.alternativa_b,
    alternativa_c: payload.alternativa_c,
    alternativa_d: payload.alternativa_d,
    alternativa_e: payload.alternativa_e,
    justificativa: payload.justificativa ?? "",
  };

  const systemPrompt = `Você é um revisor de linguagem para questões de múltipla escolha de uma avaliação técnica-profissional em português do Brasil (SIDEP-CE).
Sua única tarefa é sugerir melhorias de clareza, gramática, ortografia e objetividade no texto.
Regras obrigatórias:
- NUNCA mude o conteúdo técnico ou o significado da pergunta.
- NUNCA mude qual alternativa está correta (o gabarito é "${payload.gabarito}" e deve continuar sendo a resposta certa após sua revisão).
- Se o texto já estiver bom, mantenha-o como está e diga isso no campo "comentario".
- Responda SOMENTE com um JSON válido, sem texto fora dele, no formato exato:
{"enunciado": "...", "alternativa_a": "...", "alternativa_b": "...", "alternativa_c": "...", "alternativa_d": "...", "alternativa_e": "...", "justificativa": "...", "comentario": "resumo em 1-2 frases do que foi mudado e por quê"}`;

  const userMessage = `Questão atual:\nEnunciado: ${questaoOriginal.enunciado}\nA) ${questaoOriginal.alternativa_a}\nB) ${questaoOriginal.alternativa_b}\nC) ${questaoOriginal.alternativa_c}\nD) ${questaoOriginal.alternativa_d}\nE) ${questaoOriginal.alternativa_e}\nGabarito: ${payload.gabarito}\nJustificativa: ${questaoOriginal.justificativa || "(nenhuma)"}`;

  let respostaIa: Response;
  try {
    respostaIa = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.3 },
        }),
      },
    );
  } catch (error) {
    return json({ error: "Falha ao conectar com a API de IA: " + (error instanceof Error ? error.message : String(error)) }, 502);
  }

  if (!respostaIa.ok) {
    const detalhe = await respostaIa.text();
    return json({ error: `API de IA retornou erro (${respostaIa.status}): ${detalhe.slice(0, 300)}` }, 502);
  }

  const corpoIa = await respostaIa.json();
  const textoResposta = corpoIa?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const sugestaoBruta = extrairJson(textoResposta);

  await adminClient.from("log_auditoria").insert({
    usuario_tipo: actor.perfil,
    acao: "revisao_linguistica_ia_solicitada",
    entidade: "questao_mvp",
    entidade_id: null,
    metadados: {
      codigo_questao: payload.codigo ?? null,
      solicitado_por: authData.user.id,
      resposta_parseada: Boolean(sugestaoBruta),
    },
  });

  if (!sugestaoBruta) {
    return json({ error: "A IA respondeu em um formato inesperado. Tente novamente." }, 502);
  }

  const sugestao: Record<string, string> = {};
  for (const campo of CAMPOS_TEXTO) {
    sugestao[campo] = typeof sugestaoBruta[campo] === "string" ? sugestaoBruta[campo] : questaoOriginal[campo];
  }

  return json({
    ok: true,
    sugestao,
    comentario: typeof sugestaoBruta.comentario === "string" ? sugestaoBruta.comentario : "",
  });
});
