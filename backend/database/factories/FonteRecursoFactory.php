<?php

namespace Database\Factories;

use App\Models\FonteRecurso;
use Illuminate\Database\Eloquent\Factories\Factory;

class FonteRecursoFactory extends Factory
{
    protected $model = FonteRecurso::class;

    public function definition(): array
    {
        return [
            'nome' => ucfirst(fake()->unique->words(3, true)),
        ];
    }
}
