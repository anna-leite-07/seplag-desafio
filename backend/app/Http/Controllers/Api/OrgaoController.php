<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Orgao;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrgaoController extends Controller
{
    // Lista todos os órgãos
    public function index(Request $request): JsonResponse
    {
        $query = Orgao::query()
            ->select([
                'id',
                'sigla',
                'nome',
                'status',
        ]);

        if ($request->filled('nome')) {
            $query->where('nome', 'like', "%{$request->nome}%");
        }

        if ($request->filled('sigla')) {
            $query->where('sigla', 'like', "%{$request->sigla}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }
        
        $porPagina = $request->integer('per_page', 10);
        $pagina = $request->integer('page', 1);

        $orgaos = $query
            ->orderBy('sigla')
            ->paginate(
                perPage: $porPagina,
                page: $pagina
        );

        return response()->json($orgaos);
    }

    // Exibe um órgão específico
    public function show(int $id): JsonResponse
    {
        $orgao = Orgao::findOrFail($id);

        return response()->json($orgao);
    }
}
