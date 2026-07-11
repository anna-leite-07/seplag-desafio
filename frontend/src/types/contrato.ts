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