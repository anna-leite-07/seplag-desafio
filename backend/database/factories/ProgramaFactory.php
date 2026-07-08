<?php

namespace Database\Factories;

use App\Models\Programa;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgramaFactory extends Factory
{
    protected $model = Programa::class;
    
    public function definition(): array
    {
        $codigoOficial = fake()->unique()->numberBetween(100, 2000);
        // catchPhrase gera frases de efeito curtas ("Inovação em Saúde", etc)
        $nome = fake()->unique()->catchPhrase(); 
        
        return [
            'codigo_oficial' => $codigoOficial,
            'nome' => $nome,
        ];
    }
}
