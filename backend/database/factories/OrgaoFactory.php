<?php

namespace Database\Factories;

use App\Models\Orgao;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrgaoFactory extends Factory
{
    protected $model = Orgao::class;
    
    public function definition(): array
    {
        // Gera 5 letras aleatórias
        $sigla = strtoupper(fake()->unique->lexify('?????'));
            
        // Gera um nome fictício corporativo/institucional
        $nome = fake()->unique->company(); 
        
        // 80% de chance do órgão nascer com status ativo (true)
        $status = fake()->boolean(80); 
        
        return [
            'sigla' => $sigla,
            'nome' => $nome, 
            'status' => $status,
        ];
    }
}