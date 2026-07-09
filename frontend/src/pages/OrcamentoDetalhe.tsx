import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

import type { Orcamento } from '../types';
import CampoInfo from '../components/CampoInfo';

export default function OrcamentoDetalhe() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarOrcamento() {
      try {
        const resposta = await api.get(`/orcamentos/${id}`);
        setOrcamento(resposta.data);
      } catch (err) {
        setErro('Não foi possível carregar o orçamento.');
      } finally {
        setCarregando(false);
      }
    }

    buscarOrcamento();
  }, [id]);

  if (carregando) return <div className="p-6 text-gray-900">Carregando...</div>;
  if (erro) return <div className="p-6 text-red-400">{erro}</div>;
  if (!orcamento) return <div className="p-6 text-gray-900">Orçamento não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4">
        Orçamento #{orcamento.id} — {orcamento.ano}
      </h1>

      <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
        <CampoInfo label="Órgão" valor={orcamento.unidade_gestora?.orgao?.nome} />
        <CampoInfo label="Unidade Gestora" valor={orcamento.unidade_gestora?.nome} />
        <CampoInfo label="Programa" valor={orcamento.acao?.programa?.nome} />
        <CampoInfo label="Ação" valor={orcamento.acao?.nome} />
        <CampoInfo label="Subfunção" valor={orcamento.subfuncao?.nome} />
        <CampoInfo label="Natureza da Despesa" valor={orcamento.natureza_despesa?.nome} />
        <CampoInfo label="Fonte de Recurso" valor={orcamento.fonte_recurso?.nome} />

        <hr className="border-zinc-700 my-2" />

        <CampoInfo label="Dotação Inicial" valor={orcamento.dotacao_inicial} tipo="moeda" />
        <CampoInfo label="Empenhado" valor={orcamento.valor_empenhado} tipo="moeda" />
        <CampoInfo label="Liquidado" valor={orcamento.valor_liquidado} tipo="moeda" />
        <CampoInfo label="Pago" valor={orcamento.valor_pago} tipo="moeda" />
      </div>
    </div>
  );
}