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
  | "coordenador_escolar"
  | "crede"
  | "seduc"
  | "administrador";

export interface Regional {
  id: string;
  codigo: string;
  nome: string;
  tipo: TipoRegional;
  municipioSede?: string;
  emailInstitucional?: string;
  telefone?: string;
  responsavel?: string;
  ativa: boolean;
}

export interface Escola {
  id: string;
  codigoInep: string;
  nomeOficial: string;
  tipo: TipoEscola;
  regionalId: string;
  municipio: string;
  endereco?: string;
  emailPrincipal: string;
  emailsAdicionais: EscolaEmail[];
  telefone?: string;
  diretorNome?: string;
  coordenadorEpNome?: string;
  status: "ativa" | "inativa" | "em_implantacao";
}

export interface EscolaEmail {
  email: string;
  descricao?: string;
  principal: boolean;
}

export interface Professor {
  id: string;
  matricula: string;
  nomeCompleto: string;
  telefone?: string;
  emailInstitucional: string;
  escolaLotacaoId?: string;
  perfilAcesso: PerfilAcesso;
  areaFormacao?: string;
  status: "ativo" | "afastado" | "removido" | "inativo";
}

export interface ProfessorVinculo {
  id: string;
  professorId: string;
  escolaId: string;
  cursoTecnicoId?: string;
  componenteCurricularId?: string;
  turmaId?: string;
  anoLetivo: number;
  papel: "professor" | "coordenador_curso" | "revisor_itens" | "gestor_pedagogico";
  ativo: boolean;
}

export interface CursoTecnico {
  id: string;
  nome: string;
  eixoTecnologicoId: string;
  cargaHorariaMinima?: number;
  cnctReferencia?: string;
  ativo: boolean;
}

export interface Turma {
  id: string;
  escolaId: string;
  cursoTecnicoId: string;
  codigo: string;
  serie: string;
  turno?: string;
  anoLetivo: number;
  quantidadeEstudantes?: number;
  status: "ativa" | "concluida" | "inativa";
}

