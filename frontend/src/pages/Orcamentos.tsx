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
  const [painelAberto, setPainelAberto] = useState(true); // aberto por padrão em telas maiores

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

  useEffect(() => { buscar(); }, [pagina, ordenacao, campoOrdenacao, gatilhoBusca]);

  if (carregando) return <div className="p-6">Carregando...</div>;
  if (erro) return <div className="p-6 text-red-600">{erro}</div>;

  return (

    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orçamentos</h1>

      {/* Toggle do painel — some em telas maiores, aparece em mobile */}
      <button
        onClick={() => setPainelAberto(!painelAberto)}
        className="sm:hidden flex items-center gap-1 mb-3 text-blue-600 font-medium cursor-pointer"
      >
        Filtros
        <span className={`transition-transform ${painelAberto ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {/* Painel de filtros — sempre visível em sm+, controlado por painelAberto em mobile */}
      <div className={`${painelAberto ? 'block' : 'hidden'} sm:block space-y-4 mb-3`}>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
          <select
            value={campoNovoFiltro}
            onChange={(e) => setCampoNovoFiltro(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {OPCOES_FILTRO_CAMPO.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
            ))}
          </select>
          <input
            value={valorNovoFiltro}
            onChange={(e) => setValorNovoFiltro(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && adicionarFiltro()}
            placeholder="Valor do filtro..."
            className="border rounded px-3 py-2 flex-1 min-w-0"
          />
          <button
            onClick={adicionarFiltro}
            className="bg-blue-600 text-white rounded px-4 py-2 cursor-pointer"
          >
            Adicionar Filtro
          </button>
        </div>

        {/* Badges dos filtros ativos */}
        {Object.keys(filtrosAtivos).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.entries(filtrosAtivos) as [keyof FiltrosAtivos, string][]).map(([campo, valor]) => (
              <span
                key={campo}
                className="bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1 flex items-center gap-2"
              >
                {rotuloCampo(campo)}: {valor}
                <button
                  onClick={() => removerFiltro(campo)}
                  className="cursor-pointer font-bold hover:text-blue-900"
                  aria-label={`Remover filtro de ${campo}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Filtro de percentual */}
        <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-3 mb-4">
          <span className="sm:mr-2">Execução</span>

          <input
            type="number"
            value={percentualMin}
            onChange={(e) => setPercentualMin(e.target.value)}
            placeholder="% mín."
            className="border rounded px-3 py-2 w-full sm:w-28"
          />
          <input
            type="number"
            value={percentualMax}
            onChange={(e) => setPercentualMax(e.target.value)}
            placeholder="% máx."
            className="border rounded px-3 py-2 w-full sm:w-28"
          />
          <button
            onClick={() => { setPagina(1); setGatilhoBusca((g) => g + 1); }}
            className="bg-blue-600 text-white rounded px-4 py-2 cursor-pointer"
          >
            Filtrar
          </button>
        </div>

        {/* Total + Ordenação */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <span>{total} registros encontrados</span>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <span className="sm:mr-2">Ordenação</span>

            <select
              value={campoOrdenacao}
              onChange={(e) => setCampoOrdenacao(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {OPCOES_ORDENACAO.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
              ))}
            </select>

            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="desc">Decrescente</option>
              <option value="asc">Crescente</option>
            </select>
          </div>
        </div>
      </div>


      {/* Tabela de orçamentos */}
      <Table<Orcamento> dados={orcamentos} chave={(o) => o.id} onRowClick={(o) => navigate(`/orcamentos/${o.id}`)}
        tituloLinha={(o) => o.alerta ?? undefined} classeLinha={(o) => (o.situacao && o.situacao !== 'ok' ? 'bg-red-300' : '')}
        colunas={[
          { cabecalho: 'ID', render: (o) => o.id },
          { cabecalho: 'Ano', render: (o) => o.ano },
          { cabecalho: 'Órgão', render: (o) => o.unidade_gestora?.orgao.sigla },
          { cabecalho: 'Programa', render: (o) => o.acao?.programa.nome },
          { cabecalho: 'Ação', render: (o) => o.acao?.nome },
          {
            cabecalho: 'Dotação Atual', alinhamento: 'right',
            render: (o) => formatarMoeda(Number(o.dotacao_atualizada ?? o.dotacao_inicial)),
          },
          {
            cabecalho: 'Empenhado', alinhamento: 'right',
            render: (o) => formatarMoeda(Number(o.valor_empenhado)),
          },
          {
            cabecalho: 'Liquidado', alinhamento: 'right',
            render: (o) => formatarMoeda(Number(o.valor_liquidado)),
          },
          {
            cabecalho: 'Pago', alinhamento: 'right',
            render: (o) => formatarMoeda(Number(o.valor_pago)),
          },
          {
            cabecalho: '% Execução', alinhamento: 'right',
            render: (o) =>
              o.percentual_execucao != null
                ? `${o.percentual_execucao}%` : 'Informação não disponível',
          },
        ]}
      />


      {/* Navegação de páginas */}
      <div className="flex justify-between mt-5">
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} className={`cursor-pointer ${pagina === 1 ? 'invisible' : ''}`}>← Anterior</button>
        <span>Página {pagina} de {ultimaPagina}</span>
        <button disabled={pagina === ultimaPagina} onClick={() => setPagina(pagina + 1)} className={`cursor-pointer ${pagina === ultimaPagina ? 'invisible' : ''}`}>Próxima →</button>
      </div>

    </div>

  );

}