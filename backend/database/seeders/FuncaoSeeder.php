<?php

namespace Database\Seeders;

use App\Models\Funcao;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class FuncaoSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();
        
        foreach ($dados['funcoes'] as $funcao) {
            Funcao::create([
                'codigo_oficial' => $funcao['codigo'],
                'nome' => $funcao['nome'],
            ]);
        }
    }
}
