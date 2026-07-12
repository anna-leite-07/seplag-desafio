import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import type { Orcamento, PaginatedResponse } from '../types';
import { formatarMoeda } from '../utils/formatters';
import Table from '../components/Table';

export default function Orcamentos() {
  // Opções de ordenação e filtro
  const OPCOES_ORDENACAO = [
    { value: 'id', label: 'Id' },
    { value: 'ano', label: 'Ano' },
    { value: 'orgao', label: 'Órgão' },
    { value: 'programa', label: 'Programa' },
    { value: 'acao', label: 'Ação' },
    { value: 'dotacao_atualizada', label: 'Dotação Atualizada' },
    { value: 'valor_empenhado', label: 'Empenhado' },
    { value: 'valor_liquidado', label: 'Liquidado' },
    { value: 'valor_pago', label: 'Pago' },
    { value: 'percentual_execucao', label: '% Execução' },
  ] as const;

  const OPCOES_FILTRO_CAMPO = [
    { value: 'orgao', label: 'Órgão' },
    { value: 'programa', label: 'Programa' },
    { value: 'acao', label: 'Ação' },
    { value: 'ano', label: 'Ano' },
  ] as const;

  // Estado que força a execução de useEffect
  const [gatilhoBusca, setGatilhoBusca] = useState(0);
  const [campoOrdenacao, setCampoOrdenacao] = useState('id');
  const [percentualMin, setPercentualMin] = useState('');
  const [percentualMax, setPercentualMax] = useState('');
  const [itensPorPagina, setItensPorPagina] = useState(15);
  const [itensPorPaginaInput, setItensPorPaginaInput] = useState('15'); // valor sendo digitado

  // Estados
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);

  // Filtros
  interface FiltrosAtivos {
    orgao?: string;
    programa?: string;
    acao?: string;
    ano?: string;
  }

  const [ordenacao, setOrdenacao] = useState('desc');
  const [filtrosAtivos, setFiltrosAtivos] = useState<FiltrosAtivos>({});
  const [campoNovoFiltro, setCampoNovoFiltro] = useState('orgao');
  const [valorNovoFiltro, setValorNovoFiltro] = useState('');
  const [painelAberto, setPainelAberto] = useState(() => window.innerWidth >= 640);

  function adicionarFiltro() {
    if (!valorNovoFiltro.trim()) return;

    setFiltrosAtivos((atual) => ({
      ...atual,
      [campoNovoFiltro]: valorNovoFiltro.trim(),
    }));

    setValorNovoFiltro('');
    setPagina(1);
    setGatilhoBusca((g) => g + 1);
  }

  function removerFiltro(campo: keyof FiltrosAtivos) {
    setFiltrosAtivos((atual) => {
      const novo = { ...atual };
      delete novo[campo];
      return novo;
    });
    setPagina(1);
    setGatilhoBusca((g) => g + 1);
  }

  // Paginação
  const navigate = useNavigate();
  const [pagina, setPagina] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState(1);
  const [total, setTotal] = useState(0);

  function rotuloCampo(campo: string): string {
    const rotulos: Record<string, string> = {
      orgao: 'Órgão',
      programa: 'Programa',
      acao: 'Ação',
      ano: 'Ano',
    };
    return rotulos[campo] ?? campo;
  }

  async function buscar() {
    setCarregando(true);

    try {
      const params: any = {
        page: pagina,
        per_page: itensPorPagina,
        sort_by: campoOrdenacao,
        direction: ordenacao,
        ...filtrosAtivos, // espalha todos os filtros ativos como parâmetros
      };

      if (percentualMin) params.percentual_min = percentualMin;
      if (percentualMax) params.percentual_max = percentualMax;

      const resposta = await api.get<PaginatedResponse<Orcamento>>('/orcamentos', { params });

      setOrcamentos(resposta.data.data);
      setPagina(resposta.data.current_page);
      setUltimaPagina(resposta.data.last_page);
      setTotal(resposta.data.total);
    } catch {
      setErro('Não foi possível carregar os orçamentos.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { buscar(); }, [pagina, ordenacao, campoOrdenacao, itensPorPagina, gatilhoBusca]);

  function aplicarFiltroExecucaoEPaginacao() {
    setItensPorPagina(Number(itensPorPaginaInput) || 15);
    setPagina(1);
    setGatilhoBusca((g) => g + 1);
  }
  
  if (carregando) return <div className="p-6">Carregando...</div>;
  if (erro) return <div className="p-6 text-red-600">{erro}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Orçamentos</h1>

      {/* Painel de Filtros */}
      <div className="bg-white border border-zinc-200 rounded-b-xl shadow-sm mb-4 overflow-hidden">
        {/* Título toggle */}
        <button
          onClick={() => setPainelAberto(!painelAberto)}
          className="sm:hidden w-full flex items-center justify-between gap-1 bg-zinc-50 text-zinc-900 font-medium cursor-pointer px-4 py-3 border-b border-zinc-200"
        >
          Filtros
          <span className={`transition-transform text-zinc-400 ${painelAberto ? 'rotate-180' : ''}`}>▾</span>
        </button>

        <div className="hidden sm:block w-full bg-blue-300 text-zinc-900 text-sm font-semibold uppercase tracking-wide px-4 py-3 border-b border-zinc-200">
          Filtros
        </div>

        <div className={`${painelAberto ? 'block' : 'hidden'} sm:block space-y-4 p-4 sm:p-5`}>
          {/* Filtro de texto */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <select
              value={campoNovoFiltro}
              onChange={(e) => setCampoNovoFiltro(e.target.value)}
              className="border border-zinc-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            >
              {OPCOES_FILTRO_CAMPO.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>

            <input
              value={valorNovoFiltro}
              onChange={(e) => setValorNovoFiltro(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && adicionarFiltro()}
              placeholder="Valor do filtro..."
              className="border border-zinc-400 rounded-lg px-3 py-2 text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />

            <button
              onClick={adicionarFiltro}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors"
            >
              Adicionar Filtro
            </button>
          </div>

          {/* Badges */}
          {Object.keys(filtrosAtivos).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(Object.entries(filtrosAtivos) as [keyof FiltrosAtivos, string][]).map(([campo, valor]) => (
                <span
                  key={campo}
                  className="bg-indigo-50 text-indigo-700 text-sm rounded-full px-3 py-1 flex items-center gap-2 border border-indigo-100"
                >
                  {rotuloCampo(campo)}: {valor}
                  <button
                    onClick={() => removerFiltro(campo)}
                    className="cursor-pointer font-bold hover:text-indigo-900"
                    aria-label={`Remover filtro de ${campo}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Percentual + Ordenação/Por página */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 pt-2 border-t border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-3 lg:pt-0">
              {/* Percentual de execução */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-zinc-800">Execução</span>
                <input
                  type="number"
                  value={percentualMin}
                  onChange={(e) => setPercentualMin(e.target.value)}
                  placeholder="% mín."
                  className="border border-zinc-400 rounded-lg px-3 py-2 text-sm w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                />
                <input
                  type="number"
                  value={percentualMax}
                  onChange={(e) => setPercentualMax(e.target.value)}
                  placeholder="% máx."
                  className="border border-zinc-400 rounded-lg px-3 py-2 text-sm w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                />
              </div>

              {/* Por página */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-zinc-800">Por página</span>
                <input
                  type="number"
                  value={itensPorPaginaInput}
                  onChange={(e) => setItensPorPaginaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && aplicarFiltroExecucaoEPaginacao()}
                  className="border border-zinc-400 rounded-lg px-3 py-2 text-sm w-full sm:w-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                />
              </div>

              <div>
                <button
                  onClick={aplicarFiltroExecucaoEPaginacao}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors"
                >
                  Filtrar
                </button>
              </div>
            </div>

            {/* Ordenação */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:ml-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-zinc-800">Ordenar por</span>
                <select
                  value={campoOrdenacao}
                  onChange={(e) => setCampoOrdenacao(e.target.value)}
                  className="border border-zinc-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                >
                  {OPCOES_ORDENACAO.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>

                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="border border-zinc-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                >
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total de registros */}
      <p className="text-sm text-zinc-580 mb-3">{total} registros encontrados</p>

      {/* Tabela de orçamentos */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <Table<Orcamento> dados={orcamentos} chave={(o) => o.id} onRowClick={(o) => navigate(`/orcamentos/${o.id}`)}
          tituloLinha={(o) => o.alerta ?? undefined} classeLinha={(o) => (o.situacao && o.situacao !== 'ok' ? 'bg-red-200' : '')}
          colunas={[
            { cabecalho: 'ID', render: (o) => o.id },
            { cabecalho: 'Ano', render: (o) => o.ano },
            { cabecalho: 'Órgão', render: (o) => o.unidade_gestora?.orgao.sigla },
            { cabecalho: 'Programa', render: (o) => o.acao?.programa.nome },
            { cabecalho: 'Ação', render: (o) => o.acao?.nome },
            {
              cabecalho: 'Dotação Atual', alinhamento: 'center',
              render: (o) => formatarMoeda(Number(o.dotacao_atualizada ?? o.dotacao_inicial)),
            },
            {
              cabecalho: 'Empenhado', alinhamento: 'center',
              render: (o) => formatarMoeda(Number(o.valor_empenhado)),
            },
            {
              cabecalho: 'Liquidado', alinhamento: 'center',
              render: (o) => formatarMoeda(Number(o.valor_liquidado)),
            },
            {
              cabecalho: 'Pago', alinhamento: 'center',
              render: (o) => formatarMoeda(Number(o.valor_pago)),
            },
            {
              cabecalho: 'Execução', alinhamento: 'center',
              render: (o) => (
                o.percentual_execucao != null ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {o.percentual_execucao}%
                  </span>
                ) : (
                  <span className="text-zinc-400">Informação não disponível</span>
                )
              ),
            },
          ]}
        />
      </div>

      {/* Navegação de páginas */}
      <div className="flex justify-between items-center mt-5 text-sm">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
          className={`cursor-pointer text-zinc-600 hover:text-indigo-600 transition-colors ${pagina === 1 ? 'invisible' : ''}`}
        >
          ← Anterior
        </button>
        <span className="text-zinc-500">Página {pagina} de {ultimaPagina}</span>
        <button
          disabled={pagina === ultimaPagina}
          onClick={() => setPagina(pagina + 1)}
          className={`cursor-pointer text-zinc-600 hover:text-indigo-600 transition-colors ${pagina === ultimaPagina ? 'invisible' : ''}`}
        >
          Próxima →
        </button>
      </div>
    </div>
  );

}