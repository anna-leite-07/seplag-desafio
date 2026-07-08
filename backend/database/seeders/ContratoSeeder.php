<?php

namespace Database\Seeders;

use App\Models\Contrato;
use App\Models\Fornecedor;
use App\Models\Orcamento;
use Illuminate\Database\Seeder;
use App\Support\LeitorJson;

class ContratoSeeder extends Seeder
{
    public function run(): void
    {
        $dados = LeitorJson::load();
        $objetos = $dados['contratos_objetos'] ?? [];

        $orcamentos = Orcamento::pluck('id');
        $fornecedores = Fornecedor::pluck('id');

        $contador = 1;
        for ($i = 1; $i <= 300; $i++) {
            [$dataInicio, $dataFim, $status] = $this->gerarVigencia();

            Contrato::create([
                'orcamento_id' => $orcamentos->random(),
                'fornecedor_id' => $fornecedores->random(),
                'status' => $status,
                'numero' => $this->gerarNumero($contador++, $dataInicio->format('Y')),
                'objeto' => count($objetos)
                    ? fake()->randomElement($objetos) : fake()->sentence(6),
                'valor' => fake()->randomFloat(2, 50000, 3000000),
                'data_inicio' => $dataInicio,
                'data_fim' => $dataFim,
            ]);
        }
    }

    private function gerarNumero(int $sequencial, string $ano): string
    {
        return str_pad($sequencial, 3, '0', STR_PAD_LEFT) . '/' . $ano;
    }

    // Gera datas coerentes com o status sorteado
    private function gerarVigencia(): array
    {
        $tipo = fake()->numberBetween(1, 100);

        if ($tipo <= 50) {
            // 50% Vigente. Começou no passado, termina no futuro.
            $inicio = fake()->dateTimeBetween('-1 year', '-1 month');
            $fim = fake()->dateTimeBetween('+1 month', '+1 year');
            $status = 'VIGENTE';

        } elseif ($tipo <= 75) {
            // 25% Vencido. data_fim já passou, mas nunca foi encerrado formalmente
            $inicio = fake()->dateTimeBetween('-2 years', '-1 year');
            $fim = fake()->dateTimeBetween('-6 months', '-1 day');
            $status = 'VENCIDO';

        } elseif ($tipo <= 90) {
            // 15% Encerrado. Vigência já concluída e formalmente finalizada
            $inicio = fake()->dateTimeBetween('-2 years', '-1 year');
            $fim = fake()->dateTimeBetween('-1 year', '-1 month');
            $status = 'ENCERRADO';

        } else {
            // 10% Suspenso. Dentro do período de vigência, mas paralisado.
            $inicio = fake()->dateTimeBetween('-1 year', '-1 month');
            $fim = fake()->dateTimeBetween('+1 month', '+1 year');
            $status = 'SUSPENSO';
        }

        return [$inicio, $fim, $status];
    }
}

