<?php

namespace Database\Seeders;

use App\Models\Orcamento;
use App\Models\OrcamentoRevisao;
use App\Models\User;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class OrcamentoRevisaoSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();
        $observacoes = $dados['revisoes_observacoes'] ?? [];

        $orcamentos = Orcamento::pluck('id');
        $usuarios = User::pluck('id');

        foreach ($orcamentos as $orcamentoId) {
            $tipo = fake()->numberBetween(1, 100);

            if ($tipo <= 60) {
                // 60% Sem revisão
                continue;
            } elseif ($tipo <= 90) {
                // 30% 1 revisão
                $quantidade = 1;
            } else {
                // 10% 2-3 revisões
                $quantidade = fake()->numberBetween(2, 3);
            }

            for ($i = 0; $i < $quantidade; $i++) {

                OrcamentoRevisao::create([
                    'orcamento_id' => $orcamentoId,
                    'user_id' => $usuarios->random(),
                    'observacao' => count($observacoes)
                        ? fake()->randomElement($observacoes) : fake()->sentence(6),
                    'data_revisao' => fake()->dateTimeBetween('-2 years', 'now'),
                ]);

            }
        }
    }
}