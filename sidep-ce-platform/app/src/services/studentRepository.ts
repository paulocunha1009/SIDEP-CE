import { supabase, supabaseConfigured } from "../lib/supabase";
import type { AlternativaKey, AvaliacaoAlunoPublica, RespostaAvaliacaoDraft } from "../types";

export async function obterAvaliacaoPublicaAluno(codigo: string, nome: string): Promise<AvaliacaoAlunoPublica> {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Acesso seguro online indisponível no modo local.");
  }

  const { data, error } = await supabase.rpc("sidep_obter_avaliacao_publica", {
    p_codigo: codigo.trim().toUpperCase(),
    p_nome: nome.trim(),
  });

  if (error) throw error;
  if (!data) throw new Error("Avaliação não encontrada.");
  return data as AvaliacaoAlunoPublica;
}

export async function enviarRespostaPublicaAluno({
  codigo,
  nome,
  ordemQuestoes,
  respostas,
}: {
  codigo: string;
  nome: string;
  ordemQuestoes: string[];
  respostas: Record<string, AlternativaKey>;
}): Promise<RespostaAvaliacaoDraft> {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Envio seguro online indisponível no modo local.");
  }

  const { data, error } = await supabase.rpc("sidep_enviar_resposta_publica", {
    p_codigo: codigo.trim().toUpperCase(),
    p_nome: nome.trim(),
    p_ordem_questoes: ordemQuestoes,
    p_respostas: respostas,
  });

  if (error) throw error;
  if (!data) throw new Error("Resposta não foi registrada.");
  return data as RespostaAvaliacaoDraft;
}
