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
    <div className="max-w-7xl mx-auto p-4 sm:p-7">
    <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Painel de Execução Orçamentária</h1>

    {/* Indicadores gerais */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card titulo="Órgãos" valor={dados.total_orgaos} />
      <Card titulo="Contratos" valor={dados.total_contratos} />
      <Card titulo="Orçamento Total" valor={dados.orcamento_total} tipo='moeda' />
      <Card titulo="Saldo Disponível" valor={dados.saldo} tipo='moeda' />
    </div>

    {/* Execução */}
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
      <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">Execução</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card titulo="Empenhado" valor={dados.empenhado} tipo='moeda' />
        <Card titulo="Liquidado" valor={dados.liquidado} tipo='moeda' />
        <Card titulo="Pago" valor={dados.pago} tipo='moeda' />
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-sm text-zinc-800 mb-1.5">
          <span>Percentual de Execução</span>
          <span className="font-medium text-zinc-900">{dados.percentual_execucao}%</span>
        </div>
        <div className="w-full bg-zinc-100 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all"
            style={{ width: `${limitarPercentual(dados.percentual_execucao)}%` }}
          />
        </div>
      </div>
    </div>

    {dados.ultima_atualizacao && (
      <p className="text-sm text-zinc-800 mb-6">
        Última atualização: {formatarData(dados.ultima_atualizacao)}
      </p>
    )}

    {graficos && (
      <>
        {/* Execução por Órgão */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">Execução por Órgão</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graficos.execucao_por_orgao}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
              <XAxis dataKey="orgao_sigla" tick={{ fill: '#3f3f46', fontSize: 12 }} />
              <YAxis tick={{ fill: '#3f3f46', fontSize: 12 }} />
              <Tooltip formatter={(valor: number) => formatarMoeda(valor)} />
              <Legend />
              <Bar dataKey="dotacao_atualizada" name="Dotação Atualizada" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="empenhado" name="Empenhado" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Empenhado x Pago (Top 10 Órgãos) */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">Empenhado x Pago (Top 10 Órgãos)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graficos.empenhado_x_pago}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
              <XAxis dataKey="orgao_sigla" tick={{ fill: '#3f3f46', fontSize: 12 }} />
              <YAxis tick={{ fill: '#3f3f46', fontSize: 12 }} />
              <Tooltip formatter={(valor: number) => formatarMoeda(valor)} />
              <Legend />
              <Bar dataKey="empenhado" name="Empenhado" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pago" name="Pago" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 maiores contratos */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">Top 10 Maiores Contratos</h2>
          <ul className="divide-y divide-zinc-200">
            {graficos.top_10_contratos.map((c) => (
              <li key={c.id} className="py-2.5 flex justify-between text-sm">
                <span className="text-zinc-800">{c.numero} — {c.fornecedor?.nome ?? 'Informação não disponível'}</span>
                <span className="font-semibold text-zinc-900">{formatarMoeda(Number(c.valor))}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Execução por programa (Top 10) */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">Execução por Programa (Top 10)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graficos.execucao_por_programa}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
              <XAxis dataKey="programa_nome" tick={{ fill: '#3f3f46', fontSize: 11 }} angle={-15} textAnchor="end" height={70} />
              <YAxis tick={{ fill: '#3f3f46', fontSize: 12 }} />
              <Tooltip formatter={(valor: number) => formatarMoeda(valor)} />
              <Legend />
              <Bar dataKey="dotacao_atualizada" name="Dotação Atualizada" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="empenhado" name="Empenhado" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    )}
  </div>
  );
}


