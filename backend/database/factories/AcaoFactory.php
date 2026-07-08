<?php

namespace Database\Factories;

use App\Models\Acao;
use App\Models\Programa;
use Illuminate\Database\Eloquent\Factories\Factory;

class AcaoFactory extends Factory
{
    protected $model = Acao::class;

    public function definition(): array
    {
        $codigoOficial = fake()->unique()->numberBetween(2000, 9999);
        $nome = fake()->sentence(3);
        $programaId = Programa::query()->inRandomOrder()->value('id');

        return [
            'codigo_oficial' => $codigoOficial,
            'nome' => $nome,
            'programa_id' => $programaId,
        ];
    }
}
