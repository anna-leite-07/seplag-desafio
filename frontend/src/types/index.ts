export interface Dashboard {
  total_orgaos: number;
  total_contratos: number;
  orcamento_total: number;
  empenhado: number;
  liquidado: number;
  pago: number;
  saldo: number;
  percentual_execucao: number;
  ultima_atualizacao: string | null;
}


export interface Orgao {
  id: number;
  sigla: string;
  nome: string;
  status: boolean;
}

export interface UnidadeGestora {
  id: number;
  nome: string;
  orgao: Orgao;
}


export interface Programa {
  id: number;
  nome: string;
}

export interface Acao {
  id: number;
  nome: string;
  programa: Programa;
}


export interface Subfuncao {
  id: number;
  nome: string;
}

export interface NaturezaDespesa {
  id: number;
  nome: string;
}

export interface FonteRecurso {
  id: number;
  nome: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
}


export interface Contrato {
  id: number;
  orcamento_id: number;
  fornecedor_id: number;
  fornecedor?: Fornecedor;
  status: 'VIGENTE' | 'VENCIDO' | 'ENCERRADO' | 'SUSPENSO';
  numero: string;
  objeto: string;
  valor: string;
  data_inicio: string;
  data_fim: string;
}

export interface OrcamentoMovimentacao {
  id: number;
  orcamento_id: number;
  tipo: 'suplementacao' | 'anulacao';
  valor: string;
  data_movimentacao: string;
}

export interface OrcamentoRevisao {
  id: number;
  orcamento_id: number;
  user_id: number;
  observacao: string | null;
  data_revisao: string;
}

export interface Orcamento {
  id: number;
  unidade_gestora_id: number;
  unidade_gestora?: UnidadeGestora;
  acao_id: number;
  acao?: Acao;
  subfuncao_id: number;
  subfuncao?: Subfuncao;
  natureza_despesa_id: number;
  natureza_despesa?: NaturezaDespesa;
  fonte_recurso_id: number;
  fonte_recurso?: FonteRecurso;
  ano: number;
  dotacao_inicial: string;
  valor_empenhado: string;
  valor_liquidado: string;
  valor_pago: string;
  movimentacoes?: OrcamentoMovimentacao[];
  contratos?: Contrato[];
  revisoes?: OrcamentoRevisao[];
}

export interface Usuario {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: Usuario;
}