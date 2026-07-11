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
        // CALCULAR total de órgãos e contratos
        $totalOrgaos = Orgao::count();
        $totalContratos = Contrato::count();

        // CALCULAR total de dotação inicial, suplementações e anulações
        $dotacaoInicial = Orcamento::sum('dotacao_inicial');
        $suplementacoes = OrcamentoMovimentacao::query()
            ->where('tipo', 'suplementacao')
            ->sum('valor');
        $anulacoes = OrcamentoMovimentacao::query()
            ->where('tipo', 'anulacao')
            ->sum('valor');

        // CALCULAR total de dotação atualizada
        $orcamentoTotal = $dotacaoInicial + $suplementacoes - $anulacoes;

        // CALCULAR total de empenhado, liquidado e pago
        $empenhado = Orcamento::sum('valor_empenhado');
        $liquidado = Orcamento::sum('valor_liquidado');
        $pago = Orcamento::sum('valor_pago');

        // CALCULAR total de saldo e percentual de execução
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
