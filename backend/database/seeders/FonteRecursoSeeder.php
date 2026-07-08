<?php

namespace Database\Seeders;

use App\Models\FonteRecurso;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class FonteRecursoSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();

        foreach ($dados['fontes_recurso'] as $fonte) {
            FonteRecurso::create([
                'nome' => $fonte,
            ]);
        }
    }
}
