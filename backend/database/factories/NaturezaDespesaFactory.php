<?php

namespace Database\Factories;

use App\Models\NaturezaDespesa;
use Illuminate\Database\Eloquent\Factories\Factory;

class NaturezaDespesaFactory extends Factory
{
    protected $model = NaturezaDespesa::class;
    
    public function definition(): array
    {
        return [
            // Gera 3 palavras aleatórias e retorna como string
            'nome' => fake()->unique->words(3, true), 
        ];
    }
}
