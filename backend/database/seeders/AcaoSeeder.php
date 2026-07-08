<?php

namespace Database\Seeders;

use App\Models\Acao;
use App\Models\Programa;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class AcaoSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();

        foreach ($dados['acoes'] as $acao) {
            // Primeiro encontra o programa pelo código oficial
            $programa = Programa::firstWhere('codigo_oficial', $acao['programa']);

            Acao::create([
                'codigo_oficial' => $acao['codigo'],
                'nome' => $acao['nome'],
                'programa_id' => $programa->id,
            ]);
        }
    }
}