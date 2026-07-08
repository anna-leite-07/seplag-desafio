<?php

namespace Database\Factories;

use App\Models\UnidadeGestora;
use App\Models\Orgao; // Importando o Model relacionado
use Illuminate\Database\Eloquent\Factories\Factory;

class UnidadeGestoraFactory extends Factory
{
    protected $model = UnidadeGestora::class;
    
    public function definition(): array
    {
        $nome = fake()->company(); 
        $orgaoId = Orgao::query()->inRandomOrder()->value('id');

        return [
            'nome' => $nome,
            'orgao_id' => $orgaoId,
        ];
    }
}
