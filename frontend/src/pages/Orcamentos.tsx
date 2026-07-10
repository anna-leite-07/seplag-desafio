import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import type { Orcamento } from '../types';

export default function Orcamentos() {
  const [gatilhoBusca, setGatilhoBusca] = useState(0);
  const [campoOrdenacao, setCampoOrdenacao] = useState('id');
  const [percentualMin, setPercentualMin] = useState('');
  const [percentualMax, setPercentualMax] = useState('');

  // Estados
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);

  // Filtros
  const [campoFiltro, setCampoFiltro] = useState('qualquer');
  const [ordenacao, setOrdenacao] = useState('desc');
  const [pesquisa, setPesquisa] = useState('');

  // Paginação
  const navigate = useNavigate();
  const [pagina, setPagina] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState(1);
  const [total, setTotal] = useState(0);


  async function buscar() {
    setCarregando(true);

    try {
      const params: any = {page: pagina, sort_by: campoOrdenacao, direction: ordenacao};
      if (percentualMin) params.percentual_min = percentualMin;
      if (percentualMax) params.percentual_max = percentualMax;
      
      if (pesquisa.trim()) {
        switch (campoFiltro) {
          case 'orgao':
            params.orgao = pesquisa;
            break;

          case 'programa':
            params.programa = pesquisa;
            break;

          case 'acao':
            params.acao = pesquisa;
            break;

          case 'ano':
            params.ano = pesquisa;
            break;

          default:
            params.search = pesquisa;
        }
      }

      const resposta = await api.get('/orcamentos', {params});
      
      setOrcamentos(resposta.data.data);
      setPagina(resposta.data.current_page);
      setUltimaPagina(resposta.data.last_page);
      setTotal(resposta.data.total);
    }

    catch { setErro('Não foi possível carregar os orçamentos.'); }
    finally { setCarregando(false); }
  }

  useEffect(() => { buscar(); }, [pagina, ordenacao, campoOrdenacao, gatilhoBusca]);

  if (carregando) return <div className="p-6">Carregando...</div>;
  if (erro) return <div className="p-6 text-red-600">{erro}</div>;

  return (

    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orçamentos</h1>

      {/* Filtros de pesquisa */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={campoFiltro} onChange={(e) => setCampoFiltro(e.target.value)} className="border rounded px-3 py-2">
          <option value="qualquer">Qualquer</option>
          <option value="orgao">Órgão</option>
          <option value="programa">Programa</option>
          <option value="acao">Ação</option>
          <option value="ano">Ano</option>
        </select>

        <input value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} placeholder="Pesquisar..." className="border rounded px-3 py-2 flex-1" />
        <button onClick={() => { setPagina(1); setGatilhoBusca((g) => g + 1); }} className="bg-blue-600 text-white rounded px-4">Pesquisar</button>
      </div>

      {/* Total de registros encontrados e ordenação */}
      <div className="flex justify-between items-center mb-4">
        <span>{total} registros encontrados</span>

        <div>
          <input type="number" value={percentualMin} onChange={(e) => setPercentualMin(e.target.value)} placeholder="% mínimo" className="border rounded px-3 py-2 w-28" />
          <input type="number" value={percentualMax} onChange={(e) => setPercentualMax(e.target.value)} placeholder="% máximo" className="border rounded px-3 py-2 w-28" />
          <button onClick={() => { setPagina(1); setGatilhoBusca((g) => g + 1); }} className="bg-blue-600 text-white rounded px-4">Filtrar</button>
        </div>

        <div>
          <span className="mr-2">Ordenação</span>

          <select value={campoOrdenacao} onChange={(e) => setCampoOrdenacao(e.target.value)} className="border rounded px-3 py-2 mr-2">
            <option value="id">Id</option>
            <option value="dotacao_atualizada">Dotação Atualizada</option>
            <option value="ano">Ano</option>
            <option value="valor_empenhado">Empenhado</option>
            <option value="valor_liquidado">Liquidado</option>
            <option value="valor_pago">Pago</option>
          </select>

          <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className="border rounded px-3 py-2">
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>
        </div>
      </div>

      {/* Tabela de orçamentos */}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full">
          {/* Cabeçalho da tabela */}
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Ano</th>
              <th className="text-left p-3">Órgão</th>
              <th className="text-left p-3">Programa</th>
              <th className="text-right p-3">Dotação Atual</th>
              <th className="text-right p-3">Empenhado</th>
            </tr>
          </thead>

          <tbody>
            { // Cria linha para cada orçamento
              orcamentos.map(o => (
                <tr key={o.id} onClick={() => navigate(`/orcamentos/${o.id}`)} className="cursor-pointer hover:bg-gray-100">
                  <td className="p-3">{o.ano}</td>
                  <td className="p-3">{o.unidade_gestora?.orgao.sigla}</td>
                  <td className="p-3">{o.acao?.programa.nome}</td>
                  <td className="p-3 text-right">
                    {Number(o.dotacao_atualizada ?? o.dotacao_inicial).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="p-3 text-right">{Number(o.valor_empenhado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Navegação de páginas */}
      <div className="flex justify-between mt-5">
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>← Anterior</button>
        <span>Página {pagina} de {ultimaPagina}</span>
        <button disabled={pagina === ultimaPagina} onClick={() => setPagina(pagina + 1)}>Próxima →</button>
      </div>

    </div>

  );

}