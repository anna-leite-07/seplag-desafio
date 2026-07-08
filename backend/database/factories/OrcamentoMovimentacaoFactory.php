<?php

namespace Database\Factories;

use App\Models\OrcamentoMovimentacao;
use App\Models\Orcamento;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrcamentoMovimentacaoFactory extends Factory
{
    protected $model = OrcamentoMovimentacao::class;

    public function definition(): array
    {
        $orcamentoId = Orcamento::query()->inRandomOrder()->value('id');
        $tipo = fake()->randomElement(['suplementacao', 'anulacao']);
        $valor = fake()->randomFloat(2, 1000, 50000);
        $dataMovimentacao = fake()->dateTimeBetween('-3 years', 'now');

        return [
            'orcamento_id' => $orcamentoId,
            'tipo' => $tipo,
            'valor' => $valor,
            'data_movimentacao' => $dataMovimentacao,
        ];
    }
}