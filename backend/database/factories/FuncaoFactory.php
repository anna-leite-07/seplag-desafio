<?php

namespace Database\Factories;

use App\Models\Funcao;
use Illuminate\Database\Eloquent\Factories\Factory;

class FuncaoFactory extends Factory
{
    protected $model = Funcao::class;
    
    public function definition(): array
    {
        $codigoOficial = fake()->unique()->numberBetween(10, 99);
        $nome = ucfirst(fake()->words(2, true));

        return [
            'codigo_oficial' => $codigoOficial,
            'nome' => $nome,
        ];
    }
}
