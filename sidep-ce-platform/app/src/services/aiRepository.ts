import { supabase, supabaseConfigured } from "../lib/supabase";

export interface RevisaoLinguisticaPayload {
  codigo?: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_e: string;
  gabarito: string;
  justificativa?: string;
}

export interface RevisaoLinguisticaSugestao {
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_e: string;
  justificativa: string;
}

interface RevisaoLinguisticaResposta {
  ok: boolean;
  sugestao: RevisaoLinguisticaSugestao;
  comentario: string;
}

// So funciona online (Supabase configurado) - a chamada de IA acontece numa
// Edge Function no backend, nunca direto do navegador, para a chave de API
// nunca ficar exposta no bundle do frontend.
export async function solicitarRevisaoLinguistica(
  payload: RevisaoLinguisticaPayload,
): Promise<{ sugestao?: RevisaoLinguisticaSugestao; comentario?: string; erro?: string }> {
  if (!supabaseConfigured || !supabase) {
    return { erro: "Revisão com IA só está disponível no modo online (Supabase configurado)." };
  }

  const { data, error } = await supabase.functions.invoke<RevisaoLinguisticaResposta>("revisar-linguagem-questao", {
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
    return { erro: message };
  }

  if (!data?.sugestao) return { erro: "A IA não retornou uma sugestão válida." };
  return { sugestao: data.sugestao, comentario: data.comentario };
}
