<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Orgao;
use App\Models\Contrato;
use App\Models\Orcamento;
use App\Models\OrcamentoMovimentacao;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    //
    public function index(Request $request): JsonResponse
    {
        $totalOrgaos = Orgao::count();
        $totalContratos = Contrato::count();

        $dotacaoInicial = Orcamento::sum('dotacao_inicial');

        $suplementacoes = OrcamentoMovimentacao::query()
            ->where('tipo', 'suplementacao')
            ->sum('valor');

        $anulacoes = OrcamentoMovimentacao::query()
            ->where('tipo', 'anulacao')
            ->sum('valor');

        $orcamentoTotal = $dotacaoInicial + $suplementacoes - $anulacoes;

        $empenhado = Orcamento::sum('valor_empenhado');
        $liquidado = Orcamento::sum('valor_liquidado');
        $pago = Orcamento::sum('valor_pago');

        $saldo = $orcamentoTotal - $empenhado;

        $percentual = $orcamentoTotal > 0
            ? round(($empenhado / $orcamentoTotal) * 100, 2) : 0;

        return response()->json([
            'total_orgaos' => $totalOrgaos,
            'total_contratos' => $totalContratos,
            'orcamento_total' => round($orcamentoTotal, 2),
            'empenhado' => round($empenhado, 2),
            'liquidado' => round($liquidado, 2),
            'pago' => round($pago, 2),
            'saldo' => round($saldo, 2),
            'percentual_execucao' => $percentual,
            'ultima_atualizacao' => Orcamento::max('updated_at'),
        ]);
    }

}
