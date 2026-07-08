<?php

namespace Database\Seeders;

use App\Models\Fornecedor;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class FornecedorSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();

        foreach ($dados['fornecedores'] as $fornecedor) {
            Fornecedor::create([
                'nome' => $fornecedor,
            ]);
        }
    }
}
