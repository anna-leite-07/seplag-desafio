<?php

namespace Database\Seeders;

use App\Models\NaturezaDespesa;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class NaturezaDespesaSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();
        
        foreach ($dados['naturezas_despesa'] as $natureza) {
            NaturezaDespesa::create([
                'nome' => $natureza,
            ]);
        }
    }
}
