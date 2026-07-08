<?php

namespace Database\Seeders;

use App\Models\Programa;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class ProgramaSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();
        
        foreach ($dados['programas'] as $programa) {
            Programa::create([
                'codigo_oficial' => $programa['codigo'],
                'nome' => $programa['nome'],
            ]);
        }
    }
}
