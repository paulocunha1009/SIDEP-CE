export type TipoRegional = "CREDE" | "SEFOR";

export type TipoEscola =
  | "EEEP"
  | "EEMCP"
  | "EEMTI"
  | "EEM"
  | "EJA"
  | "ESCOLA_DO_CAMPO"
  | "EFA"
  | "OUTRA";

export type PerfilAcesso =
  | "professor"
  | "professor_tecnico"
  | "coordenador_professor_tecnico"
  | "coordenador_escolar"
  | "crede"
  | "seduc"
  | "administrador";

export interface Regional {
  id: string;
  codigo: string;
  nome: string;
  tipo: TipoRegional;
}

export interface EscolaDraft {
  codigo_inep: string;
  nome_oficial: string;
  tipo: TipoEscola;
  regional_codigo: string;
  municipio: string;
  email_principal: string;
  emails_adicionais: string;
  telefone?: string;
  diretor_nome?: string;
  coordenador_ep_nome?: string;
  status?: "ativa" | "inativa";
  senha_acesso?: string;
  alterar_senha_primeiro_login?: boolean;
}

export interface ProfessorDraft {
  matricula: string;
  nome_completo: string;
  cpf?: string;
  telefone?: string;
  email_institucional: string;
  escola_inep?: string;
  curso_responsavel: string;
  componentes_responsaveis: string;
  perfil_acesso: PerfilAcesso;
  status?: "ativo" | "inativo";
  senha_acesso?: string;
  alterar_senha_primeiro_login?: boolean;
}

export interface AvaliacaoDraft {
  titulo: string;
  codigo_acesso: string;
  curso_tecnico: string;
  componentes: string;
  turma_codigo: string;
  quantidade_questoes: number;
  etapa: "diagnostica" | "formativa" | "final";
  questoes_por_componente?: Record<string, number>;
  descritores_selecionados?: string[];
  questoes_codigos?: string[];
  status?: "rascunho" | "agendada" | "aberta" | "encerrada" | "corrigida";
  professor_matricula?: string;
  escola_inep?: string;
  inicio_em?: string;
  fim_em?: string;
  codigo_bloqueado_em?: string;
}

export interface CompetenciaDraft {
  codigo: string;
  curso_tecnico: string;
  descricao: string;
  fonte: string;
}

export interface DescritorDraft {
  codigo: string;
  competencia_codigo: string;
  componente_curricular: string;
  descricao: string;
  nivel_esperado: "basico" | "intermediario" | "avancado";
}

export type AlternativaKey = "A" | "B" | "C" | "D" | "E";

export interface QuestaoDraft {
  codigo: string;
  descritor_codigo: string;
  componente_curricular: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_e: string;
  gabarito: AlternativaKey;
  justificativa: string;
  dificuldade_inicial: number;
  status: "rascunho" | "em_revisao" | "validada";
}

export interface RespostaAvaliacaoDraft {
  id: string;
  avaliacao_codigo: string;
  avaliacao_titulo: string;
  estudante_nome: string;
  estudante_chave: string;
  turma_codigo: string;
  curso_tecnico: string;
  escola_inep?: string;
  professor_matricula?: string;
  etapa: AvaliacaoDraft["etapa"];
  ordem_questoes: string[];
  respostas: Record<string, AlternativaKey>;
  acertos: number;
  total_questoes: number;
  percentual_bruto: number;
  desempenho_por_descritor: Record<string, { acertos: number; total: number; percentual: number }>;
  desempenho_por_componente: Record<string, { acertos: number; total: number; percentual: number }>;
  enviado_em: string;
  origem: "local" | "supabase";
}

export interface ResultadoAcao<T> {
  data?: T;
  erro?: string;
  modo: "supabase" | "local";
}
