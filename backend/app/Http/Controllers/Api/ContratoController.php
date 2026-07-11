<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contrato;
use Illuminate\Http\Request;

class ContratoController extends Controller
{
    public function index(Request $request)
    {
        $query = Contrato::query()
            ->select([
                'id',
                'orcamento_id',
                'fornecedor_id',
                'numero',
                'objeto',
                'valor',
                'status',
                'data_inicio',
                'data_fim',
            ])
            ->with([
                'fornecedor:id,nome',
                'orcamento:id,unidade_gestora_id',
                'orcamento.unidadeGestora:id,orgao_id,nome',
                'orcamento.unidadeGestora.orgao:id,sigla,nome',
        ]);


        // FILTROS de pesquisa
        if ($request->filled('status')) {
            $query->where('status', strtoupper($request->string('status')));
        }

        if ($request->filled('orgao')) {
            $query->whereHas('orcamento.unidadeGestora.orgao', function ($q) use ($request) {
                $q->where('sigla', strtoupper($request->string('orgao')));
            });
        }

        if ($request->filled('fornecedor')) {
            $query->whereHas('fornecedor', function ($q) use ($request) {
                $q->where('nome', 'like', "%{$request->string('fornecedor')}%");
            });
        }


        // FILTROS de ordenação
        $ordenaveis = [
            'numero' => 'numero',
            'objeto' => 'objeto',
            'valor' => 'valor',
            'status' => 'status',
            'data_inicio' => 'data_inicio',
            'data_fim' => 'data_fim',
        ];
        
        $campoOrdenacao = $request->input('sort_by');
        $direcao = $request->input('direction') === 'desc' ? 'desc' : 'asc';

        if (isset($ordenaveis[$campoOrdenacao])) {
            $query->orderBy($ordenaveis[$campoOrdenacao], $direcao);
        } else {
            $query->orderBy('id', $direcao);
        }


        // LIMITE e paginação
        $porPagina = $request->integer('per_page', 15);
        $pagina = $request->integer('page', 1);
        $contratos = $query->paginate(perPage: $porPagina, page: $pagina);
        
        return response()->json($contratos);
    }
}