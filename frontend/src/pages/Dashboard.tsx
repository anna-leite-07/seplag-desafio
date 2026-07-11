import { useEffect, useState } from 'react';
import api from '../services/api';

import type { Dashboard, GraficosData } from '../types';
import Card from '../components/Card';

import { formatarMoeda, formatarData, limitarPercentual } from '../utils/formatters';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const [dados, setDados] = useState<Dashboard | null>(null);
  const [graficos, setGraficos] = useState<GraficosData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarTudo() {
      try {
        const [respDashboard, respGraficos] = await Promise.all([
          api.get('/dashboard'),
          api.get('/graficos'),
        ]);
        setDados(respDashboard.data);
        setGraficos(respGraficos.data);
      } catch (err) {
        setErro('Não foi possível carregar o dashboard.');
      } finally {
        setCarregando(false);
      }
    }

    buscarTudo();
  }, []);

  if (carregando) return <div className="p-6">Carregando...</div>;
  if (erro) return <div className="p-6 text-red-600">{erro}</div>;
  if (!dados) return <div className="p-6">Sem dados.</div>;

  return (
    <div className="bg-gray-50 text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-6">Painel de Execução Orçamentária</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card titulo="Órgãos" valor={dados.total_orgaos} />
        <Card titulo="Contratos" valor={dados.total_contratos} />
        <Card titulo="Orçamento Total" valor={dados.orcamento_total} tipo='moeda' />
        <Card titulo="Saldo Disponível" valor={dados.saldo} tipo='moeda' />
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">Execução</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              style={{ width: `${limitarPercentual(dados.percentual_execucao)}%` }}
            />
          </div>
        </div>
      </div>

      {dados.ultima_atualizacao && (
        <p className="text-sm text-gray-500">
          Última atualização: {formatarData(dados.ultima_atualizacao)}
        </p>
      )}

      {graficos && (
        <>
          {/* Execução por Órgão */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-4">Execução por Órgão</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graficos.execucao_por_orgao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="orgao_sigla" />
                <YAxis />
                <Tooltip formatter={(valor: number) => formatarMoeda(valor)} />
                <Legend />
                <Bar dataKey="dotacao_atualizada" name="Dotação Atualizada" fill="#3b82f6" />
                <Bar dataKey="empenhado" name="Empenhado" fill="#93c5fd" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Empenhado x Pago (Top 10 Órgãos) */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-4">Empenhado x Pago (Top 10 Órgãos)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graficos.empenhado_x_pago}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="orgao_sigla" />
                <YAxis />
                <Tooltip formatter={(valor: number) => formatarMoeda(valor)} />
                <Legend />
                <Bar dataKey="empenhado" name="Empenhado" fill="#3b82f6" />
                <Bar dataKey="pago" name="Pago" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Top 10 maiores contratos */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-4">Top 10 Maiores Contratos</h2>
            <ul className="divide-y">
              {graficos.top_10_contratos.map((c) => (
                <li key={c.id} className="py-2 flex justify-between">
                  <span>{c.numero} — {c.fornecedor?.nome ?? 'Informação não disponível'}</span>
                  <span className="font-semibold">{formatarMoeda(Number(c.valor))}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Execução por programa (Top 10) */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-4">Execução por Programa (Top 10)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graficos.execucao_por_programa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="programa_nome" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(valor: number) => formatarMoeda(valor)} />
                <Legend />
                <Bar dataKey="dotacao_atualizada" name="Dotação Atualizada" fill="#3b82f6" />
                <Bar dataKey="empenhado" name="Empenhado" fill="#93c5fd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}


