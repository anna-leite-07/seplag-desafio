<?php

namespace Database\Factories;

use App\Models\Orcamento;
use App\Models\UnidadeGestora;
use App\Models\Acao;
use App\Models\Subfuncao;
use App\Models\NaturezaDespesa;
use App\Models\FonteRecurso;
use Illuminate\Database\Eloquent\Factories\Factory;


class OrcamentoFactory extends Factory
{
    protected $model = Orcamento::class;
    
    public function definition(): array
    {
        $unidadeGestoraId = UnidadeGestora::query()->inRandomOrder()->value('id');
        $acaoId = Acao::query()->inRandomOrder()->value('id');
        $subfuncaoId = Subfuncao::query()->inRandomOrder()->value('id');
        $naturezaDespesaId = NaturezaDespesa::query()->inRandomOrder()->value('id');
        $fonteRecursoId = FonteRecurso::query()->inRandomOrder()->value('id');
        
        $ano = fake()->numberBetween(2023, 2026);
        $dotacaoInicial = fake()->randomFloat(2, 100000, 10000000);
        
        $valorEmpenhado = fake()->randomFloat(2, 0, $dotacaoInicial);
        $valorLiquidado = fake()->randomFloat(2, 0, $valorEmpenhado);
        $valorPago = fake()->randomFloat(2, 0, $valorLiquidado);

        return [
            'unidade_gestora_id' => $unidadeGestoraId,
            'acao_id' => $acaoId,
            'subfuncao_id' => $subfuncaoId,
            'natureza_despesa_id' => $naturezaDespesaId,
            'fonte_recurso_id' => $fonteRecursoId,
            'ano' => $ano,
            'dotacao_inicial' => $dotacaoInicial,
            'valor_empenhado' => $valorEmpenhado,
            'valor_liquidado' => $valorLiquidado,
            'valor_pago' => $valorPago,
        ];
    }
}