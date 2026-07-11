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

export interface ExecucaoPorOrgao {
  orgao_id: number;
  orgao_sigla: string;
  orgao_nome: string;
  dotacao_atualizada: string;
  empenhado: string;
  percentual_execucao: number | null;
}

export interface ExecucaoPorPrograma {
  programa_id: number;
  programa_nome: string;
  dotacao_atualizada: string;
  empenhado: string;
  percentual_execucao: number | null;
}

export interface EmpenhadoXPago {
  orgao_sigla: string;
  empenhado: string;
  pago: string;
}

export interface TopContrato {
  id: number;
  numero: string;
  objeto: string;
  valor: string;
  fornecedor?: { id: number; nome: string };
}

export interface GraficosData {
  execucao_por_orgao: ExecucaoPorOrgao[];
  execucao_por_programa: ExecucaoPorPrograma[];
  empenhado_x_pago: EmpenhadoXPago[];
  top_10_contratos: TopContrato[];
}