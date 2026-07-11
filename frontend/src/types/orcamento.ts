import type { UnidadeGestora, Acao, Subfuncao, NaturezaDespesa, FonteRecurso } from './organizacional';
import type { Contrato } from './contrato';
import type { Usuario } from './auth';

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
  user?: Usuario;
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
  dotacao_atualizada?: string;
  percentual_execucao?: number;
  valor_empenhado: string;
  valor_liquidado: string;
  valor_pago: string;
  orcamento_movimentacoes?: OrcamentoMovimentacao[];
  contratos?: Contrato[];
  orcamento_revisoes?: OrcamentoRevisao[];
}