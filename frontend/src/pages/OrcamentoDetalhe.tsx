import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

import type { Contrato, Orcamento, OrcamentoRevisao } from '../types';
import CampoInfo from '../components/CampoInfo';

import { formatarData, formatarMoeda } from '../utils/formatters';
import Table from '../components/Table';

export default function OrcamentoDetalhe() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados para revisão
  const [mostrarFormRevisao, setMostrarFormRevisao] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [enviandoRevisao, setEnviandoRevisao] = useState(false);
  const [mensagemRevisao, setMensagemRevisao] = useState<string | null>(null);
  
  useEffect(() => {
    buscarOrcamento();
  }, [id]);

  async function buscarOrcamento() {
    setCarregando(true);
    try {
      const resposta = await api.get(`/orcamentos/${id}`);
      setOrcamento(resposta.data);
    } catch (err) {
      setErro('Não foi possível carregar o orçamento.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleRevisar() {
    setEnviandoRevisao(true);
    setMensagemRevisao(null);

    try {
      await api.patch(`/orcamentos/${id}/revisao`, { observacao });
      setMensagemRevisao('Orçamento marcado como revisado com sucesso!');
      setObservacao('');
      setMostrarFormRevisao(false);
      buscarOrcamento(); // recarrega para trazer a nova revisão na lista
    } catch (err) {
      setMensagemRevisao('Não foi possível marcar como revisado.');
    } finally {
      setEnviandoRevisao(false);
    }
  }

  if (carregando) return <div className="p-6 text-gray-900">Carregando...</div>;
  if (erro) return <div className="p-6 text-red-400">{erro}</div>;
  if (!orcamento) return <div className="p-6 text-gray-900">Orçamento não encontrado.</div>;

  return (
    <div className="bg-gray-50 text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4"> Orçamento #{orcamento.id} — {orcamento.ano} </h1>

      {/* Informações do orçamento */}
      <div className="bg-gray-50 text-gray-900 p-6">
        <CampoInfo label="Órgão" valor={orcamento.unidade_gestora?.orgao?.nome} />
        <CampoInfo label="Unidade Gestora" valor={orcamento.unidade_gestora?.nome} />
        <CampoInfo label="Programa" valor={orcamento.acao?.programa?.nome} />
        <CampoInfo label="Ação" valor={orcamento.acao?.nome} />
        <CampoInfo label="Subfunção" valor={orcamento.subfuncao?.nome} />
        <CampoInfo label="Natureza da Despesa" valor={orcamento.natureza_despesa?.nome} />
        <CampoInfo label="Fonte de Recurso" valor={orcamento.fonte_recurso?.nome} />

        <hr className="border-zinc-700 my-2" />

        <CampoInfo label="Dotação Inicial" valor={orcamento.dotacao_inicial} tipo="moeda" />
        <CampoInfo label="Dotação Atualizada" valor={orcamento.dotacao_atualizada} tipo="moeda" />
        <CampoInfo label="Empenhado" valor={orcamento.valor_empenhado} tipo="moeda" />
        <CampoInfo label="Liquidado" valor={orcamento.valor_liquidado} tipo="moeda" />
        <CampoInfo label="Pago" valor={orcamento.valor_pago} tipo="moeda" />
        <CampoInfo label="Percentual de Execução" valor={orcamento.percentual_execucao != null ? `${orcamento.percentual_execucao}%` : undefined} />
      </div>

      {/* Histórico de revisões */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-2">Revisão</h2>

        {/* Adicionar Revisões */}
        {!mostrarFormRevisao && (
          <button onClick={() => setMostrarFormRevisao(true)} className="bg-blue-600 text-white rounded px-4 py-2">
            Marcar como Revisado
          </button>
        )}

        {mostrarFormRevisao && (
          <div className="space-y-3">
            <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)}
                      placeholder="Observação (opcional)" className="border rounded px-3 py-2 w-full" rows={3} />

            <div className="flex gap-2">
              <button onClick={handleRevisar} disabled={enviandoRevisao} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">
                {enviandoRevisao ? 'Enviando...' : 'Confirmar Revisão'}
              </button>

              <button onClick={() => {setMostrarFormRevisao(false); setObservacao(''); }} className="bg-gray-200 text-gray-800 rounded px-4 py-2">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {mensagemRevisao && (
          <p className="mt-3 text-sm text-green-700">{mensagemRevisao}</p>
        )}
      </div>
      
      {/* Revisões */}
      {orcamento.orcamento_revisoes && orcamento.orcamento_revisoes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Histórico de Revisões</h2>
          <Table<OrcamentoRevisao> dados={orcamento.orcamento_revisoes} chave={(r) => r.id}
            colunas={[
              { cabecalho: 'Data', render: (r) => formatarData(r.data_revisao) },
              { cabecalho: 'Analista', render: (r) => r.user?.name ?? 'Informação não disponível' },
              { cabecalho: 'Observação', render: (r) => r.observacao ?? 'Sem observação' },
            ]}
          />
        </div>
      )}
      
      {/* Contratos */}
      <div className="mt-6">
        {orcamento.contratos && orcamento.contratos.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Contratos Vinculados</h2>
            <div className="overflow-x-auto rounded shadow">
              <Table<Contrato> dados={orcamento.contratos} chave={(c) => c.id}
                colunas={[
                  { cabecalho: 'Número', render: (c) => c.numero },
                  { cabecalho: 'Objeto', render: (c) => c.objeto },
                  { cabecalho: 'Fornecedor', render: (c) => c.fornecedor?.nome ?? 'Informação não disponível' },
                  { cabecalho: 'Status', render: (c) => c.status },
                  {
                    cabecalho: 'Valor', alinhamento: 'right',
                    render: (c) => formatarMoeda(Number(c.valor)),
                  },
                ]}
              />
            </div>
          </div>
        ) : (
          <p className="mt-6 text-gray-500">Este orçamento não possui contratos vinculados.</p>
        )}
      </div>

    </div>
  );
}