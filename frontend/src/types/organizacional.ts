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