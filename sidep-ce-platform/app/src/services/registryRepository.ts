import { supabase, supabaseConfigured } from "../lib/supabase";
import type { AvaliacaoDraft, EscolaDraft, ProfessorDraft, Regional, RespostaAvaliacaoDraft, ResultadoAcao } from "../types";

const STORAGE_KEYS = {
  escolas: "sidep-ce:escolas",
  professores: "sidep-ce:professores",
  avaliacoes: "sidep-ce:avaliacoes",
  respostas: "sidep-ce:respostas-avaliacoes",
  codigosAvaliacoesBloqueados: "sidep-ce:codigos-avaliacoes-bloqueados",
};

function readLocal<T>(key: string): T[] {
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmailList(value: string) {
  return value
    .split(/[;,]/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function findRegionalIdByCodigo(codigo: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("regional")
    .select("id")
    .eq("codigo", codigo)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

async function findEscolaIdByInep(codigoInep?: string) {
  if (!supabase || !codigoInep) return null;

  const { data, error } = await supabase
    .from("escola")
    .select("id")
    .eq("codigo_inep", codigoInep)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

function uniqueNonEmpty(values: Array<string | undefined | null>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))));
}

function normalizeProfessorSchoolIds(professor: ProfessorDraft) {
  return uniqueNonEmpty([professor.escola_inep, ...(professor.escolas_inep ?? [])]);
}

async function carregarVinculosEscolasProfessores() {
  if (!supabaseConfigured || !supabase) return new Map<string, string[]>();

  const { data, error } = await supabase
    .from("professor_vinculo")
    .select("professor:professor_id(matricula),escola:escola_id(codigo_inep),ativo")
    .eq("ativo", true);

  if (error) {
    console.warn("Vinculos professor-escola indisponiveis; usando escola principal.", error.message);
    return new Map<string, string[]>();
  }

  const vinculos = new Map<string, string[]>();
  (data ?? []).forEach((row: any) => {
    const matricula = row.professor?.matricula;
    const codigoInep = row.escola?.codigo_inep;
    if (!matricula || !codigoInep) return;
    const current = vinculos.get(matricula) ?? [];
    vinculos.set(matricula, uniqueNonEmpty([...current, codigoInep]));
  });

  return vinculos;
}

async function sincronizarVinculosProfessorEscolas(professor: ProfessorDraft) {
  if (!supabaseConfigured || !supabase) return;

  try {
    const escolasInep = normalizeProfessorSchoolIds(professor);
    const { data: professorRow, error: professorError } = await supabase
      .from("professor")
      .select("id")
      .eq("matricula", professor.matricula)
      .maybeSingle();

    if (professorError) throw professorError;
    if (!professorRow?.id) return;

    const anoLetivo = new Date().getFullYear();

    const { error: deactivateError } = await supabase
      .from("professor_vinculo")
      .update({ ativo: false })
      .eq("professor_id", professorRow.id)
      .eq("ano_letivo", anoLetivo);

    if (deactivateError) throw deactivateError;

    if (!escolasInep.length) return;

    const { data: escolasRows, error: escolasError } = await supabase
      .from("escola")
      .select("id,codigo_inep")
      .in("codigo_inep", escolasInep);

    if (escolasError) throw escolasError;

    if (!escolasRows?.length) return;

    const papel =
      professor.perfil_acesso === "coordenador_professor_tecnico"
        ? "coordenador_curso"
        : professor.perfil_acesso === "coordenador_escolar"
          ? "gestor_pedagogico"
          : "professor";

    const { error: upsertError } = await supabase.from("professor_vinculo").upsert(
      escolasRows.map((escola: any) => ({
        professor_id: professorRow.id,
        escola_id: escola.id,
        ano_letivo: anoLetivo,
        papel,
        ativo: true,
      })),
      { onConflict: "professor_id,escola_id,ano_letivo,papel" },
    );

    if (upsertError) throw upsertError;
  } catch (error) {
    console.warn(
      "Vinculos professor-escola nao foram sincronizados. Rode a migracao professor_vinculo para habilitar N:N.",
      error instanceof Error ? error.message : error,
    );
  }
}

export async function carregarEscolas(): Promise<EscolaDraft[]> {
  if (!supabaseConfigured || !supabase) return readLocal<EscolaDraft>(STORAGE_KEYS.escolas);

  const { data, error } = await supabase
    .from("escola")
    .select("codigo_inep,nome_oficial,tipo,municipio,email_principal,telefone,diretor_nome,coordenador_ep_nome,senha_inicial_hash,alterar_senha_primeiro_login,status,regional(codigo)")
    .order("nome_oficial");

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    codigo_inep: row.codigo_inep,
    nome_oficial: row.nome_oficial,
    tipo: row.tipo,
    regional_codigo: row.regional?.codigo ?? "",
    municipio: row.municipio,
    email_principal: row.email_principal,
    emails_adicionais: "",
    telefone: row.telefone ?? "",
    diretor_nome: row.diretor_nome ?? "",
    coordenador_ep_nome: row.coordenador_ep_nome ?? "",
    status: row.status === "inativa" ? "inativa" : "ativa",
    senha_acesso: row.senha_inicial_hash ?? "",
    alterar_senha_primeiro_login: row.alterar_senha_primeiro_login ?? true,
  }));
}

export function carregarEscolasLocais() {
  return readLocal<EscolaDraft>(STORAGE_KEYS.escolas);
}

export async function sincronizarRegionaisSupabase(regionais: Regional[]) {
  if (!supabaseConfigured || !supabase) return { modo: "local" as const, total: regionais.length };

  const { error } = await supabase.from("regional").upsert(
    regionais.map((regional) => ({
      codigo: regional.codigo,
      nome: regional.nome,
      tipo: regional.tipo,
      ativa: true,
      atualizado_em: new Date().toISOString(),
    })),
    { onConflict: "codigo" },
  );

  if (error) throw error;
  return { modo: "supabase" as const, total: regionais.length };
}

export async function salvarEscola(escola: EscolaDraft): Promise<ResultadoAcao<EscolaDraft>> {
  if (!supabaseConfigured || !supabase) {
    const escolas = readLocal<EscolaDraft>(STORAGE_KEYS.escolas).filter(
      (item) => item.codigo_inep !== escola.codigo_inep,
    );
    writeLocal(STORAGE_KEYS.escolas, [...escolas, escola]);
    return { data: escola, modo: "local" };
  }

  try {
    const regionalId = await findRegionalIdByCodigo(escola.regional_codigo);
    if (!regionalId) return { erro: "Regional CREDE/SEFOR não encontrada no banco.", modo: "supabase" };

    const { data, error } = await supabase
      .from("escola")
      .upsert(
        {
          codigo_inep: escola.codigo_inep,
          nome_oficial: escola.nome_oficial,
          tipo: escola.tipo,
          regional_id: regionalId,
          municipio: escola.municipio,
          email_principal: escola.email_principal.toLowerCase(),
          telefone: escola.telefone || null,
          diretor_nome: escola.diretor_nome || null,
          coordenador_ep_nome: escola.coordenador_ep_nome || null,
          senha_inicial_hash: escola.senha_acesso || escola.codigo_inep,
          alterar_senha_primeiro_login: escola.alterar_senha_primeiro_login ?? true,
          status: escola.status ?? "ativa",
          atualizado_em: new Date().toISOString(),
        },
        { onConflict: "codigo_inep" },
      )
      .select("id")
      .single();

    if (error) throw error;

    const emails = normalizeEmailList(escola.emails_adicionais);
    if (emails.length) {
      await supabase.from("escola_email").upsert(
        emails.map((email) => ({
          escola_id: data.id,
          email,
          descricao: "E-mail adicional",
          principal: false,
        })),
        { onConflict: "escola_id,email" },
      );
    }

    return { data: escola, modo: "supabase" };
  } catch (error) {
    return { erro: error instanceof Error ? error.message : "Falha ao salvar escola.", modo: "supabase" };
  }
}

export async function carregarProfessores(): Promise<ProfessorDraft[]> {
  if (!supabaseConfigured || !supabase) return readLocal<ProfessorDraft>(STORAGE_KEYS.professores);

  const [vinculosPorMatricula, professoresResult] = await Promise.all([
    carregarVinculosEscolasProfessores(),
    supabase
    .from("professor")
    .select("matricula,nome_completo,cpf,telefone,email_institucional,perfil_acesso,area_formacao,senha_inicial_hash,alterar_senha_primeiro_login,status,escola:escola_lotacao_id(codigo_inep)")
      .order("nome_completo"),
  ]);

  const { data, error } = professoresResult;
  if (error) throw error;

  return (data ?? []).map((row: any) => {
    const escolaPrincipal = row.escola?.codigo_inep ?? "";
    const escolasAtuacao = uniqueNonEmpty([escolaPrincipal, ...(vinculosPorMatricula.get(row.matricula) ?? [])]);

    return {
      matricula: row.matricula,
      nome_completo: row.nome_completo,
      cpf: row.cpf ?? "",
      telefone: row.telefone ?? "",
      email_institucional: row.email_institucional,
      escola_inep: escolaPrincipal || escolasAtuacao[0] || "",
      escolas_inep: escolasAtuacao,
      curso_responsavel: row.area_formacao ?? "",
      componentes_responsaveis: "",
      perfil_acesso: row.perfil_acesso,
      status: row.status === "inativo" || row.status === "removido" || row.status === "afastado" ? "inativo" : "ativo",
      senha_acesso: row.senha_inicial_hash ?? "",
      alterar_senha_primeiro_login: row.alterar_senha_primeiro_login ?? true,
    };
  });
}

export function carregarProfessoresLocais() {
  return readLocal<ProfessorDraft>(STORAGE_KEYS.professores).map((professor) => ({
    ...professor,
    escolas_inep: Array.from(new Set([professor.escola_inep, ...(professor.escolas_inep ?? [])].filter(Boolean) as string[])),
  }));
}

export async function salvarProfessor(professor: ProfessorDraft): Promise<ResultadoAcao<ProfessorDraft>> {
  const normalizedProfessor: ProfessorDraft = {
    ...professor,
    escolas_inep: Array.from(new Set([professor.escola_inep, ...(professor.escolas_inep ?? [])].filter(Boolean) as string[])),
  };

  if (!supabaseConfigured || !supabase) {
    const professores = readLocal<ProfessorDraft>(STORAGE_KEYS.professores).filter(
      (item) => item.matricula !== normalizedProfessor.matricula,
    );
    writeLocal(STORAGE_KEYS.professores, [...professores, normalizedProfessor]);
    return { data: normalizedProfessor, modo: "local" };
  }

  try {
    const escolaId = await findEscolaIdByInep(normalizedProfessor.escola_inep);
    const { error } = await supabase.from("professor").upsert(
      {
        matricula: normalizedProfessor.matricula,
        nome_completo: normalizedProfessor.nome_completo,
        cpf: normalizedProfessor.cpf || null,
        telefone: normalizedProfessor.telefone || null,
        email_institucional: normalizedProfessor.email_institucional.toLowerCase(),
        escola_lotacao_id: escolaId,
        perfil_acesso: normalizedProfessor.perfil_acesso,
        area_formacao: normalizedProfessor.curso_responsavel || null,
        senha_inicial_hash: normalizedProfessor.senha_acesso || normalizedProfessor.cpf || null,
        alterar_senha_primeiro_login: normalizedProfessor.alterar_senha_primeiro_login ?? true,
        status: normalizedProfessor.status ?? "ativo",
        atualizado_em: new Date().toISOString(),
      },
      { onConflict: "matricula" },
    );

    if (error) throw error;
    await sincronizarVinculosProfessorEscolas(normalizedProfessor);
    return { data: normalizedProfessor, modo: "supabase" };
  } catch (error) {
    return { erro: error instanceof Error ? error.message : "Falha ao salvar professor.", modo: "supabase" };
  }
}

export function carregarAvaliacoesLocais() {
  if (supabaseConfigured || supabase) {
    // Mantido como fallback sincrono para o MVP local. Use carregarAvaliacoes() para Supabase.
  }
  return readLocal<AvaliacaoDraft>(STORAGE_KEYS.avaliacoes);
}

export async function carregarAvaliacoes(): Promise<AvaliacaoDraft[]> {
  if (!supabaseConfigured || !supabase) return carregarAvaliacoesLocais();

  const { data, error } = await supabase
    .from("avaliacao_mvp")
    .select("*")
    .order("criada_em", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    titulo: row.titulo,
    codigo_acesso: row.codigo_acesso,
    curso_tecnico: row.curso_tecnico,
    componentes: row.componentes ?? "",
    turma_codigo: row.turma_codigo,
    quantidade_questoes: row.quantidade_questoes,
    etapa: row.etapa,
    questoes_por_componente: row.questoes_por_componente ?? {},
    descritores_selecionados: row.descritores_selecionados ?? [],
    questoes_codigos: row.questoes_codigos ?? [],
    status: row.status,
    professor_matricula: row.professor_matricula ?? undefined,
    escola_inep: row.escola_inep ?? undefined,
    regional_codigo: row.regional_codigo ?? undefined,
    inicio_em: row.inicio_em ?? undefined,
    fim_em: row.fim_em ?? undefined,
    codigo_bloqueado_em: row.codigo_bloqueado_em ?? undefined,
  }));
}

export function salvarAvaliacaoLocal(avaliacao: AvaliacaoDraft): ResultadoAcao<AvaliacaoDraft> {
  const avaliacoes = readLocal<AvaliacaoDraft>(STORAGE_KEYS.avaliacoes).filter(
    (item) => item.codigo_acesso !== avaliacao.codigo_acesso,
  );
  writeLocal(STORAGE_KEYS.avaliacoes, [...avaliacoes, avaliacao]);
  return { data: avaliacao, modo: "local" };
}

export async function salvarAvaliacao(avaliacao: AvaliacaoDraft): Promise<ResultadoAcao<AvaliacaoDraft>> {
  if (!supabaseConfigured || !supabase) return salvarAvaliacaoLocal(avaliacao);

  try {
    const { error } = await supabase.from("avaliacao_mvp").upsert(
      {
        codigo_acesso: avaliacao.codigo_acesso,
        titulo: avaliacao.titulo,
        curso_tecnico: avaliacao.curso_tecnico,
        componentes: avaliacao.componentes,
        turma_codigo: avaliacao.turma_codigo,
        quantidade_questoes: avaliacao.quantidade_questoes,
        etapa: avaliacao.etapa,
        questoes_por_componente: avaliacao.questoes_por_componente ?? {},
        descritores_selecionados: avaliacao.descritores_selecionados ?? [],
        questoes_codigos: avaliacao.questoes_codigos ?? [],
        status: avaliacao.status ?? "rascunho",
        professor_matricula: avaliacao.professor_matricula ?? null,
        escola_inep: avaliacao.escola_inep ?? null,
        inicio_em: avaliacao.inicio_em ?? null,
        fim_em: avaliacao.fim_em ?? null,
        codigo_bloqueado_em: avaliacao.codigo_bloqueado_em ?? null,
        atualizada_em: new Date().toISOString(),
      },
      { onConflict: "codigo_acesso" },
    );

    if (error) throw error;
    return { data: avaliacao, modo: "supabase" };
  } catch (error) {
    return { erro: error instanceof Error ? error.message : "Falha ao salvar avaliação.", modo: "supabase" };
  }
}

export function carregarCodigosAvaliacaoBloqueados() {
  return readLocal<string>(STORAGE_KEYS.codigosAvaliacoesBloqueados);
}

export async function carregarCodigosAvaliacaoBloqueadosOnline(): Promise<string[]> {
  if (!supabaseConfigured || !supabase) return carregarCodigosAvaliacaoBloqueados();

  const { data, error } = await supabase.from("avaliacao_codigo_bloqueado").select("codigo");
  if (error) throw error;
  return (data ?? []).map((row: any) => row.codigo);
}

export function bloquearCodigoAvaliacaoLocal(codigo: string) {
  const normalizedCode = codigo.trim().toUpperCase();
  const codigos = new Set(carregarCodigosAvaliacaoBloqueados().map((item) => item.toUpperCase()));
  codigos.add(normalizedCode);
  writeLocal(STORAGE_KEYS.codigosAvaliacoesBloqueados, Array.from(codigos));
  return { data: normalizedCode, modo: "local" as const };
}

export async function bloquearCodigoAvaliacao(codigo: string, metadados: Record<string, unknown> = {}) {
  if (!supabaseConfigured || !supabase) return bloquearCodigoAvaliacaoLocal(codigo);

  const normalizedCode = codigo.trim().toUpperCase();
  const { error } = await supabase.from("avaliacao_codigo_bloqueado").upsert(
    {
      codigo: normalizedCode,
      motivo: String(metadados.motivo ?? "codigo_usado"),
      avaliacao_codigo: String(metadados.avaliacao_codigo ?? normalizedCode),
      escola_inep: metadados.escola_inep ? String(metadados.escola_inep) : null,
      professor_matricula: metadados.professor_matricula ? String(metadados.professor_matricula) : null,
      metadados,
    },
    { onConflict: "codigo" },
  );

  if (error) return { erro: error.message, modo: "supabase" as const };
  return { data: normalizedCode, modo: "supabase" as const };
}

export function excluirAvaliacaoLocal(codigo: string): ResultadoAcao<string> {
  const normalizedCode = codigo.trim().toUpperCase();
  const avaliacoes = readLocal<AvaliacaoDraft>(STORAGE_KEYS.avaliacoes).filter(
    (item) => item.codigo_acesso.toUpperCase() !== normalizedCode,
  );
  writeLocal(STORAGE_KEYS.avaliacoes, avaliacoes);
  bloquearCodigoAvaliacaoLocal(normalizedCode);
  return { data: normalizedCode, modo: "local" };
}

export async function excluirAvaliacao(codigo: string): Promise<ResultadoAcao<string>> {
  if (!supabaseConfigured || !supabase) return excluirAvaliacaoLocal(codigo);

  const normalizedCode = codigo.trim().toUpperCase();
  const { error } = await supabase.from("avaliacao_mvp").delete().eq("codigo_acesso", normalizedCode);
  if (error) return { erro: error.message, modo: "supabase" };

  const bloqueio = await bloquearCodigoAvaliacao(normalizedCode, {
    motivo: "avaliacao_excluida",
    avaliacao_codigo: normalizedCode,
  });
  if ("erro" in bloqueio && bloqueio.erro) return { erro: bloqueio.erro, modo: "supabase" };

  return { data: normalizedCode, modo: "supabase" };
}

export function carregarRespostasLocais() {
  return readLocal<RespostaAvaliacaoDraft>(STORAGE_KEYS.respostas);
}

export async function carregarRespostasAvaliacao(): Promise<RespostaAvaliacaoDraft[]> {
  if (!supabaseConfigured || !supabase) return carregarRespostasLocais();

  const { data, error } = await supabase
    .from("resposta_avaliacao")
    .select("*")
    .order("enviado_em", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    avaliacao_codigo: row.avaliacao_codigo,
    avaliacao_titulo: row.avaliacao_titulo,
    estudante_nome: row.estudante_nome,
    estudante_chave: row.estudante_chave,
    turma_codigo: row.turma_codigo,
    curso_tecnico: row.curso_tecnico,
    escola_inep: row.escola_inep ?? undefined,
    professor_matricula: row.professor_matricula ?? undefined,
    etapa: row.etapa,
    ordem_questoes: row.ordem_questoes ?? [],
    respostas: row.respostas ?? {},
    acertos: row.acertos,
    total_questoes: row.total_questoes,
    percentual_bruto: Number(row.percentual_bruto),
    desempenho_por_descritor: row.desempenho_por_descritor ?? {},
    desempenho_por_componente: row.desempenho_por_componente ?? {},
    enviado_em: row.enviado_em,
    origem: "supabase",
  }));
}

export async function salvarRespostaAvaliacao(resposta: RespostaAvaliacaoDraft): Promise<ResultadoAcao<RespostaAvaliacaoDraft>> {
  if (!supabaseConfigured || !supabase) {
    const respostas = readLocal<RespostaAvaliacaoDraft>(STORAGE_KEYS.respostas).filter(
      (item) => item.id !== resposta.id,
    );
    writeLocal(STORAGE_KEYS.respostas, [...respostas, { ...resposta, origem: "local" }]);
    return { data: { ...resposta, origem: "local" }, modo: "local" };
  }

  try {
    const { error } = await supabase.from("resposta_avaliacao").upsert(
      {
        id: resposta.id,
        avaliacao_codigo: resposta.avaliacao_codigo,
        avaliacao_titulo: resposta.avaliacao_titulo,
        estudante_nome: resposta.estudante_nome,
        estudante_chave: resposta.estudante_chave,
        turma_codigo: resposta.turma_codigo,
        curso_tecnico: resposta.curso_tecnico,
        escola_inep: resposta.escola_inep || null,
        professor_matricula: resposta.professor_matricula || null,
        etapa: resposta.etapa,
        ordem_questoes: resposta.ordem_questoes,
        respostas: resposta.respostas,
        acertos: resposta.acertos,
        total_questoes: resposta.total_questoes,
        percentual_bruto: resposta.percentual_bruto,
        desempenho_por_descritor: resposta.desempenho_por_descritor,
        desempenho_por_componente: resposta.desempenho_por_componente,
        enviado_em: resposta.enviado_em,
      },
      { onConflict: "avaliacao_codigo,estudante_chave" },
    );

    if (error) throw error;
    await supabase.from("log_auditoria").insert({
      usuario_tipo: "aluno",
      acao: "resposta_avaliacao_enviada",
      entidade: "resposta_avaliacao",
      entidade_id: resposta.id,
      metadados: {
        avaliacao_codigo: resposta.avaliacao_codigo,
        estudante_chave: resposta.estudante_chave,
        total_questoes: resposta.total_questoes,
      },
    });
    return { data: { ...resposta, origem: "supabase" }, modo: "supabase" };
  } catch (error) {
    return { erro: error instanceof Error ? error.message : "Falha ao salvar resposta da avaliação.", modo: "supabase" };
  }
}
