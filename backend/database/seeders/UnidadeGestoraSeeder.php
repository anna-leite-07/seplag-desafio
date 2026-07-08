<?php

namespace Database\Seeders;

use App\Models\UnidadeGestora;
use App\Models\Orgao;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class UnidadeGestoraSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();
        
        foreach ($dados['unidades_gestoras'] as $unidade) {
            // Primeiro encontra o orgão pela sigla
            $orgao = Orgao::firstWhere('sigla', $unidade['orgao']);
            
            UnidadeGestora::create([
                'nome' => $unidade['nome'],
                'orgao_id' => $orgao->id,
            ]);
        }
    }
}
