<?php

namespace Database\Seeders;

use App\Models\Subfuncao;
use App\Models\Funcao;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class SubfuncaoSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();
        
        foreach ($dados['funcoes'] as $itemFuncao) {
            // Primeiro encontra a função pelo seu código oficial
            $funcao = Funcao::firstWhere('codigo_oficial', $itemFuncao['codigo']);

            foreach ($itemFuncao['subfuncoes'] as $subfuncao) {
                Subfuncao::create([
                    'nome' => $subfuncao,
                    'funcao_id' => $funcao->id,
                ]);
            }
        }
    }
}
