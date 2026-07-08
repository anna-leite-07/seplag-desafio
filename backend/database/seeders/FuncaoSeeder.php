<?php

namespace Database\Seeders;

use App\Models\Funcao;
use App\Models\Subfuncao;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class FuncaoSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();

        foreach ($dados['funcoes'] as $itemFuncao) {
            $funcao = Funcao::create([
                'codigo_oficial' => $itemFuncao['codigo'],
                'nome' => $itemFuncao['nome'],
            ]);

            foreach ($itemFuncao['subfuncoes'] as $subfuncao) {
                Subfuncao::create([
                    'nome' => $subfuncao,
                    'funcao_id' => $funcao->id,
                ]);
            }
        }
    }
}
