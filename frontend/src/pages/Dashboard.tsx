import { useEffect, useState } from 'react';
import api from '../services/api';

import type { Dashboard } from '../types';
import Card from '../components/Card';

export default function Dashboard() {
  const [dados, setDados] = useState<Dashboard | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarDashboard() {
      try {
        const resposta = await api.get('/dashboard');
        setDados(resposta.data);
      } catch (err: any) {
          console.log(err);
          console.log(err.response);
          console.log(err.response?.status);
          console.log(err.response?.data);

          setErro('Não foi possível carregar o dashboard.');
      } finally {
        setCarregando(false);
      }
    }

    buscarDashboard();
  }, []);

  if (carregando) return <div className="p-6">Carregando...</div>;
  if (erro) return <div className="p-6 text-red-600">{erro}</div>;
  if (!dados) return <div className="p-6">Sem dados.</div>;

  // percentual máximo limitado à 100%
  const percentual = Math.min(
      Math.max(dados.percentual_execucao, 0), 100
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-6">Painel de Execução Orçamentária</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card titulo="Órgãos" valor={dados.total_orgaos} />
        <Card titulo="Contratos" valor={dados.total_contratos} />
        <Card titulo="Orçamento Total" valor={dados.orcamento_total} tipo='moeda' />
        <Card titulo="Saldo Disponível" valor={dados.saldo} tipo='moeda' />
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">Execução</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card titulo="Empenhado" valor={dados.empenhado} tipo='moeda' />
          <Card titulo="Liquidado" valor={dados.liquidado} tipo='moeda' />
          <Card titulo="Pago" valor={dados.pago} tipo='moeda' />
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Percentual de Execução</span>
            <span>{dados.percentual_execucao}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${percentual}%` }}
            />
          </div>
        </div>
      </div>

      {dados.ultima_atualizacao && (
        <p className="text-sm text-gray-500">
          Última atualização: {new Date(dados.ultima_atualizacao).toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  );
}

