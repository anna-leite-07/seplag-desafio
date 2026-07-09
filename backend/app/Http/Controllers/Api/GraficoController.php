<?php

namespace App\Http\Controllers\Api;

use App\Models\Contrato;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GraficoController extends Controller
{
    public function index(Request $request)
    {
        $tipo = $request->input('tipo', 'contratos');

        $dados = [];

        switch ($tipo) {
            case 'contratos':
                $dados = $this->topContratos();
                break;

            default:
                return response()->json([
                    'message' => 'Tipo de gráfico inválido',
                ], 400);
        }

        return response()->json($dados);
    }

    private function topContratos()
    {
        $contratos = Contrato::query()
            ->select([
                'id',
                'numero',
                'objeto',
                'valor',
                'status',
                'fornecedor_id',
            ])
            ->with([
                'fornecedor:id,nome',
            ])
            ->orderByDesc('valor')
            ->limit(10)
            ->get();

        return $contratos;
    }
}
