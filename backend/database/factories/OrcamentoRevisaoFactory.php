<?php

namespace Database\Factories;

use App\Models\OrcamentoRevisao;
use App\Models\Orcamento;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrcamentoRevisaoFactory extends Factory
{
    protected $model = OrcamentoRevisao::class;
    
    public function definition(): array
    {
        $orcamentoId = Orcamento::query()->inRandomOrder()->value('id');
        $userId = User::query()->inRandomOrder()->value('id');
        
        $observacao = fake()->sentence(6);
        $dataRevisao = fake()->dateTimeBetween('-2 years', 'now');

        return [
            'orcamento_id' => $orcamentoId,
            'user_id' => $userId,
            'observacao' => $observacao,
            'data_revisao' => $dataRevisao,
        ];
    }
}