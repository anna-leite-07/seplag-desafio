import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

import type { Contrato, Orcamento, OrcamentoRevisao } from '../types';
import CampoInfo from '../components/CampoInfo';

import { formatarData, formatarMoeda, limitarPercentual } from '../utils/formatters';
import Table from '../components/Table';

export default function OrcamentoDetalhe() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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
      buscarOrcamento();
    } catch (err) {
      setMensagemRevisao('Não foi possível marcar como revisado.');
    } finally {
      setEnviandoRevisao(false);
    }
  }

  if (carregando) return <div className="p-6 text-zinc-500">Carregando...</div>;
  if (erro) return <div className="p-6 text-red-600">{erro}</div>;
  if (!orcamento) return <div className="p-6 text-zinc-500">Orçamento não encontrado.</div>;

  const percentual = orcamento.percentual_execucao != null
    ? limitarPercentual(orcamento.percentual_execucao) : 0;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">
              Orçamento #{orcamento.id}
            </p>
            <h1 className="text-2xl font-semibold text-zinc-900">
              {orcamento.acao?.nome ?? 'Sem ação vinculada'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {orcamento.unidade_gestora?.orgao?.sigla ?? 'Informação não disponível'} · Ano {orcamento.ano}
            </p>

            {orcamento.alerta && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-800 rounded-lg px-3 py-2 text-sm mt-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{orcamento.alerta}</span>
              </div>
            )}
          </div>
        </div>

        {percentual !== null && (
          <div className="bg-white border border-zinc-200 rounded-xl px-4 py-3 shadow-sm sm:min-w-[180px]">
            <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
              <span>Execução</span>
              <span className="font-medium text-zinc-900">{percentual}%</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Valores financeiros em destaque */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Dotação Inicial', valor: orcamento.dotacao_inicial },
          { label: 'Dotação Atual', valor: orcamento.dotacao_atualizada },
          { label: 'Empenhado', valor: orcamento.valor_empenhado },
          { label: 'Liquidado', valor: orcamento.valor_liquidado },
          { label: 'Pago', valor: orcamento.valor_pago },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">{item.label}</p>
            <p className="text-sm sm:text-base font-semibold text-zinc-900 mt-1">
              {formatarMoeda(item.valor)}
            </p>
          </div>
        ))}
      </div>

      {/* Informações do orçamento */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">
          Classificação Orçamentária
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          <CampoInfo label="Órgão" valor={orcamento.unidade_gestora?.orgao?.nome} />
          <CampoInfo label="Unidade Gestora" valor={orcamento.unidade_gestora?.nome} />
          <CampoInfo label="Programa" valor={orcamento.acao?.programa?.nome} />
          <CampoInfo label="Ação" valor={orcamento.acao?.nome} />
          <CampoInfo label="Subfunção" valor={orcamento.subfuncao?.nome} />
          <CampoInfo label="Natureza da Despesa" valor={orcamento.natureza_despesa?.nome} />
          <CampoInfo label="Fonte de Recurso" valor={orcamento.fonte_recurso?.nome} />
        </div>
      </div>

      {/* Revisão */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">Revisão</h2>

        {!mostrarFormRevisao && (
          <button
            onClick={() => setMostrarFormRevisao(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors"
          >
            Marcar como Revisado
          </button>
        )}

        {mostrarFormRevisao && (
          <div className="space-y-3">
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Observação (opcional)"
              className="border border-zinc-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleRevisar}
                disabled={enviandoRevisao}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer transition-colors"
              >
                {enviandoRevisao ? 'Enviando...' : 'Confirmar Revisão'}
              </button>
              <button
                onClick={() => { setMostrarFormRevisao(false); setObservacao(''); }}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {mensagemRevisao && (
          <p className="mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            {mensagemRevisao}
          </p>
        )}
      </div>

      {/* Histórico de revisões */}
      {orcamento.orcamento_revisoes && orcamento.orcamento_revisoes.length > 0 && (
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">
            Histórico de Revisões
          </h2>
          <Table<OrcamentoRevisao>
            dados={orcamento.orcamento_revisoes}
            chave={(r) => r.id}
            colunas={[
              { cabecalho: 'Data', render: (r) => formatarData(r.data_revisao) },
              { cabecalho: 'Analista', render: (r) => r.user?.name ?? 'Informação não disponível' },
              { cabecalho: 'Observação', render: (r) => r.observacao ?? 'Sem observação' },
            ]}
          />
        </div>
      )}

      {/* Contratos */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">
          Contratos Vinculados
        </h2>

        {orcamento.contratos && orcamento.contratos.length > 0 ? (
          <Table<Contrato>
            dados={orcamento.contratos}
            chave={(c) => c.id}
            colunas={[
              { cabecalho: 'Número', render: (c) => c.numero },
              { cabecalho: 'Objeto', render: (c) => c.objeto },
              { cabecalho: 'Fornecedor', render: (c) => c.fornecedor?.nome ?? 'Informação não disponível' },
              {
                cabecalho: 'Status',
                render: (c) => (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                    {c.status}
                  </span>
                ),
              },
              { cabecalho: 'Valor', alinhamento: 'right', render: (c) => formatarMoeda(Number(c.valor)) },
            ]}
          />
        ) : (
          <p className="text-sm text-zinc-500">Este orçamento não possui contratos vinculados.</p>
        )}
      </div>
    </div>
  );
}