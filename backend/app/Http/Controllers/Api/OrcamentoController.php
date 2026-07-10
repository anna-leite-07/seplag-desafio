<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Orcamento;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrcamentoController extends Controller
{
    public function index(Request $request)
    {
        $query = Orcamento::query()
            ->select([
                'id',
                'unidade_gestora_id',
                'acao_id',
                'subfuncao_id',
                'natureza_despesa_id',
                'fonte_recurso_id',
                'ano',
                'dotacao_inicial',
                'valor_empenhado',
                'valor_liquidado',
                'valor_pago',
            ])
            ->withSum(['orcamentoMovimentacoes as total_suplementacoes' => function ($q) {
                $q->where('tipo', 'suplementacao');
            }], 'valor')
            ->withSum(['orcamentoMovimentacoes as total_anulacoes' => function ($q) {
                $q->where('tipo', 'anulacao');
            }], 'valor')
            ->with([
                'unidadeGestora:id,orgao_id',
                'unidadeGestora.orgao:id,sigla,nome',

                'acao:id,programa_id,nome',
                'acao.programa:id,nome',

                'subfuncao:id,nome',
                'naturezaDespesa:id,nome',
                'fonteRecurso:id,nome',
        ]);

        if ($request->filled('orgao')) {
            $sigla = $request->string('orgao');
            $query->whereHas('unidadeGestora.orgao', function ($q) use ($sigla) {
                $q->where('sigla', 'like', "%{$sigla}%");
            });
        }

        if ($request->filled('programa')) {
            $programa = $request->string('programa');
            $query->whereHas('acao.programa', function ($q) use ($programa) {
                $q->where('nome', 'like', "%{$programa}%");
            });
        }

        if ($request->filled('acao')) {
            $acao = $request->string('acao');
            $query->whereHas('acao', function ($q) use ($acao) {
                $q->where('nome', 'like', "%{$acao}%");
            });
        }

        if ($request->filled('ano')) {
            $query->where('ano', $request->integer('ano'));
        }

        

        $porPagina = $request->integer('per_page', 15);
        $pagina = $request->integer('page', 1);

        $orcamentos = $query
            ->orderBy('id')
            ->paginate(
                perPage: $porPagina,
                page: $pagina
        );
        
        return response()->json($orcamentos);
    }

    public function show(int $id): JsonResponse
    {
        $orcamento = Orcamento::query()
            ->select([
                'id',
                'unidade_gestora_id',
                'acao_id',
                'subfuncao_id',
                'natureza_despesa_id',
                'fonte_recurso_id',
                'ano',
                'dotacao_inicial',
                'valor_empenhado',
                'valor_liquidado',
                'valor_pago',
            ])
            ->withSum(['orcamentoMovimentacoes as total_suplementacoes' => function ($q) {
                $q->where('tipo', 'suplementacao');
            }], 'valor')
            ->withSum(['orcamentoMovimentacoes as total_anulacoes' => function ($q) {
                $q->where('tipo', 'anulacao');
            }], 'valor')
            ->with([
                'unidadeGestora:id,orgao_id',
                'unidadeGestora.orgao:id,sigla,nome',

                'acao:id,programa_id,nome',
                'acao.programa:id,nome',

                'subfuncao:id,nome',
                'naturezaDespesa:id,nome',
                'fonteRecurso:id,nome',

                'contratos:id,orcamento_id,fornecedor_id,numero,objeto,valor,status,data_inicio,data_fim',
                'contratos.fornecedor:id,nome',
                'orcamentoMovimentacoes:id,orcamento_id,tipo,valor,data_movimentacao',
                'orcamentoRevisoes:id,orcamento_id,user_id,observacao,data_revisao',
            ])
            ->findOrFail($id);

        return response()->json($orcamento);
    }

    public function revisao(Request $request, int $id): JsonResponse
    {
        $orcamento = Orcamento::findOrFail($id);

        $dadosValidados = $request->validate([
            'observacao' => ['nullable', 'string', 'max:1000'],
        ]);

        $revisao = $orcamento->orcamentoRevisoes()->create([
            'user_id' => auth('api')->id(),
            'observacao' => $dadosValidados['observacao'] ?? null,
            'data_revisao' => now(),
        ]);

        return response()->json([
            'message' => 'Orçamento marcado como revisado.',
            'revisao' => $revisao->load('user:id,name,email'),
        ]);
    }
}
