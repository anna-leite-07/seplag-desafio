<?php

namespace Database\Seeders;

use App\Models\Orgao;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class OrgaoSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();

        foreach ($dados['orgaos'] as $orgao) {
            Orgao::create([
                'sigla' => $orgao['sigla'],
                'nome' => $orgao['nome'],
                'status' => true,
            ]);
        }
    }
}
