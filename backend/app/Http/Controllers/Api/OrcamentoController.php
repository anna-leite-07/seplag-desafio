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
                'orcamentos.id',
                'orcamentos.unidade_gestora_id',
                'orcamentos.acao_id',
                'orcamentos.subfuncao_id',
                'orcamentos.natureza_despesa_id',
                'orcamentos.fonte_recurso_id',
                'orcamentos.ano',
                'orcamentos.dotacao_inicial',
                'orcamentos.valor_empenhado',
                'orcamentos.valor_liquidado',
                'orcamentos.valor_pago',
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


        // FILTROS de pesquisa
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
        
        // FILTROS de percentual
        if ($request->filled('percentual_min')) {
            $query->havingRaw(
                '(valor_empenhado / NULLIF(' . $this->sqlDotacaoAtualizada() . ', 0)) * 100 >= ?',
                [$request->float('percentual_min')]
            );
        }

        if ($request->filled('percentual_max')) {
            $query->havingRaw(
                '(valor_empenhado / NULLIF(' . $this->sqlDotacaoAtualizada() . ', 0)) * 100 <= ?',
                [$request->float('percentual_max')]
            );
        }

        // FILTROS de ordenação
        $colunasOrdenacao = [
            'id' => 'orcamentos.id',
            'ano' => 'orcamentos.ano',
            'valor_empenhado' => 'orcamentos.valor_empenhado',
            'valor_liquidado' => 'orcamentos.valor_liquidado',
            'valor_pago' => 'orcamentos.valor_pago',
            'orgao' => 'org_ord.sigla',
            'programa' => 'prog_ord.nome',
            'acao' => 'acao_ord.nome',
        ];

        $campoOrdenacao = $request->input('sort_by');
        $direcao = $request->input('direction') === 'desc' ? 'desc' : 'asc';
        $camposComJoin = ['orgao', 'programa', 'acao'];

        if (in_array($campoOrdenacao, $camposComJoin)) {
            $query->join('unidades_gestoras as ug_ord', 'ug_ord.id', '=', 'orcamentos.unidade_gestora_id')
                ->join('orgaos as org_ord', 'org_ord.id', '=', 'ug_ord.orgao_id')
                ->join('acoes as acao_ord', 'acao_ord.id', '=', 'orcamentos.acao_id')
                ->join('programas as prog_ord', 'prog_ord.id', '=', 'acao_ord.programa_id')
                ->select('orcamentos.*');
        }

        if ($campoOrdenacao === 'dotacao_atualizada') {
            $query->orderByRaw('(' . $this->sqlDotacaoAtualizada() . ') ' . $direcao);
        } elseif ($campoOrdenacao === 'percentual_execucao') {
            $query->orderByRaw('(valor_empenhado / NULLIF(' . $this->sqlDotacaoAtualizada() . ', 0)) ' . $direcao);
        } elseif (isset($colunasOrdenacao[$campoOrdenacao])) {
            $query->orderBy($colunasOrdenacao[$campoOrdenacao], $direcao);
        } else {
            $query->orderBy('orcamentos.id', $direcao);
        }

        // LIMITE e paginação
        $porPagina = $request->integer('per_page', 15);
        $pagina = $request->integer('page', 1);
        $orcamentos = $query->paginate(perPage: $porPagina, page: $pagina);

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
                'orcamentoRevisoes.user:id,name',
            ])
            ->findOrFail($id);

        return response()->json($orcamento);
    }

    private function sqlDotacaoAtualizada(): string
    {
        return '(dotacao_inicial + COALESCE(total_suplementacoes,0) - COALESCE(total_anulacoes,0))';
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
