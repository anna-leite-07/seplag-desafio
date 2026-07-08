<?php

namespace Database\Factories;

use App\Models\Fornecedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class FornecedorFactory extends Factory
{
    protected $model = Fornecedor::class;
    
    public function definition(): array
    {
        return [
            'nome' => fake()->unique()->company(), // Gera nomes como "Silva e Filhos Ltda"
        ];
    }
}
