<?php

namespace Database\Factories;

use App\Models\Contrato;
use App\Models\Orcamento;
use App\Models\Fornecedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContratoFactory extends Factory
{
    protected $model = Contrato::class;

    public function definition(): array
    {
        $orcamentoId = Orcamento::query()->inRandomOrder()->value('id');
        $fornecedorId = Fornecedor::query()->inRandomOrder()->value('id');

        $dataInicio = fake()->dateTimeBetween('-2 years', 'now');
        $dataFim = (clone $dataInicio)->modify('+' . fake()->numberBetween(6, 24) . ' months');

        $status = fake()->randomElement(['VIGENTE', 'ENCERRADO', 'SUSPENSO', 'VENCIDO']);
        $numero = fake()->unique()->numerify('###') . '/' . $dataInicio->format('Y');
        $objeto = fake()->sentence(6);
        $valor = fake()->randomFloat(2, 50000, 3000000);
        
        return [
            'orcamento_id' => $orcamentoId,
            'fornecedor_id' => $fornecedorId,
            'status' => $status,
            'numero' => $numero,
            'objeto' => $objeto,
            'valor' => $valor,
            'data_inicio' => $dataInicio,
            'data_fim' => $dataFim,
        ];
    }
}