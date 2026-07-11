<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contrato;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class GraficoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'execucao_por_orgao' => $this->execucaoPorOrgao(),
            'execucao_por_programa' => $this->execucaoPorPrograma(),
            'empenhado_x_pago' => $this->empenhadoXPago(),
            'top_10_contratos' => $this->top10Contratos(),
        ]);
    }

    private function sqlDotacaoAtualizada(): string
    {
        return "(o.dotacao_inicial
            + COALESCE((SELECT SUM(valor) FROM orcamentos_movimentacoes m WHERE m.orcamento_id = o.id AND m.tipo = 'suplementacao'), 0)
            - COALESCE((SELECT SUM(valor) FROM orcamentos_movimentacoes m2 WHERE m2.orcamento_id = o.id AND m2.tipo = 'anulacao'), 0)
        )";
    }

    private function execucaoPorOrgao(): array
    {
        $dotacaoAtualizada = $this->sqlDotacaoAtualizada();

        return DB::table('orcamentos as o')
            ->join('unidades_gestoras as ug', 'ug.id', '=', 'o.unidade_gestora_id')
            ->join('orgaos as org', 'org.id', '=', 'ug.orgao_id')
            ->selectRaw("
                org.id as orgao_id,
                org.sigla as orgao_sigla,
                org.nome as orgao_nome,
                SUM({$dotacaoAtualizada}) as dotacao_atualizada,
                SUM(o.valor_empenhado) as empenhado,
                ROUND(SUM(o.valor_empenhado) / NULLIF(SUM({$dotacaoAtualizada}), 0) * 100, 2) as percentual_execucao
            ")
            ->groupBy('org.id', 'org.sigla', 'org.nome')
            ->orderByDesc('dotacao_atualizada')
            ->get()
            ->toArray();
    }

    private function execucaoPorPrograma(): array
    {
        $dotacaoAtualizada = $this->sqlDotacaoAtualizada();

        return DB::table('orcamentos as o')
            ->join('acoes as a', 'a.id', '=', 'o.acao_id')
            ->join('programas as p', 'p.id', '=', 'a.programa_id')
            ->selectRaw("
                p.id as programa_id,
                p.nome as programa_nome,
                SUM({$dotacaoAtualizada}) as dotacao_atualizada,
                SUM(o.valor_empenhado) as empenhado,
                ROUND(SUM(o.valor_empenhado) / NULLIF(SUM({$dotacaoAtualizada}), 0) * 100, 2) as percentual_execucao
            ")
            ->groupBy('p.id', 'p.nome')
            ->orderByDesc('dotacao_atualizada')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function empenhadoXPago(): array
    {
        return DB::table('orcamentos as o')
            ->join('unidades_gestoras as ug', 'ug.id', '=', 'o.unidade_gestora_id')
            ->join('orgaos as org', 'org.id', '=', 'ug.orgao_id')
            ->selectRaw("
                org.sigla as orgao_sigla,
                SUM(o.valor_empenhado) as empenhado,
                SUM(o.valor_pago) as pago
            ")
            ->groupBy('org.id', 'org.sigla')
            ->orderByDesc('empenhado')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function top10Contratos(): array
    {
        return Contrato::query()
            ->with('fornecedor:id,nome')
            ->orderByDesc('valor')
            ->limit(10)
            ->get(['id', 'numero', 'objeto', 'valor', 'fornecedor_id'])
            ->toArray();
    }
}