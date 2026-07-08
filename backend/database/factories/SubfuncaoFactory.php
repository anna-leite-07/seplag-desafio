<?php

namespace Database\Factories;

use App\Models\Subfuncao;
use App\Models\Funcao; // Não esqueça de importar o Model pai!
use Illuminate\Database\Eloquent\Factories\Factory;

class SubfuncaoFactory extends Factory
{
    protected $model = Subfuncao::class;
    
    public function definition(): array
    {
        $nome = ucfirst(fake()->words(3, true));
        $funcaoId = Funcao::query()->inRandomOrder()->value('id');

        return [
            'nome' => $nome,
            'funcao_id' => $funcaoId, 
        ];
    }
}