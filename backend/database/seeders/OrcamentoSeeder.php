<?php

namespace Database\Seeders;

use App\Models\Orcamento;
use App\Models\OrcamentoMovimentacao;
use App\Models\UnidadeGestora;
use App\Models\Acao;
use App\Models\Subfuncao;
use App\Models\NaturezaDespesa;
use App\Models\FonteRecurso;
use Illuminate\Database\Seeder;

class OrcamentoSeeder extends Seeder
{
    public function run(): void
    {
        // Apenas ids
        $unidadesGestoras = UnidadeGestora::pluck('id');
        $acoes = Acao::pluck('id');
        $subfuncoes = Subfuncao::pluck('id');
        $naturezasDespesa = NaturezaDespesa::pluck('id');
        $fontesRecurso = FonteRecurso::pluck('id');

        for ($i = 0; $i < 500; $i++) {
            $dotacaoInicial = fake()->randomFloat(2, 100000, 10000000);
            
            $movimentacao = $this->gerarMovimentacoes($dotacaoInicial);
            $dotacaoAtualizada = $movimentacao['dotacaoAtualizada'];
            
            $tipo = fake()->numberBetween(1, 100);
            if ($tipo <= 60) {
                // 60% Saudável
                $valores = $this->gerarSaudavel($dotacaoAtualizada);
            } elseif ($tipo <= 70) {
                // 10% Sem execução
                $valores = $this->gerarSemExecucao();
            } elseif ($tipo <= 90) {
                // 20% Quase concluído
                $valores = $this->gerarQuaseConcluido($dotacaoAtualizada);
            } elseif ($tipo <= 95) {
                // 5% Saldo negativo
                $valores = $this->gerarSaldoNegativo($dotacaoAtualizada);
            } else {
                // 5% Inconsistente
                $valores = $this->gerarInconsistente($dotacaoAtualizada);
            }

            $orcamento = Orcamento::create([
                'unidade_gestora_id' => $unidadesGestoras->random(),
                'acao_id' => $acoes->random(),
                'subfuncao_id' => $subfuncoes->random(),
                'natureza_despesa_id' => $naturezasDespesa->random(),
                'fonte_recurso_id' => $fontesRecurso->random(),
                'ano' => fake()->numberBetween(2023, 2026),
                'dotacao_inicial' => $dotacaoInicial,
                'valor_empenhado' => $valores['empenhado'],
                'valor_liquidado' => $valores['liquidado'],
                'valor_pago' => $valores['pago'],
            ]);

            if ($movimentacao['suplementacao'] > 0) {
                OrcamentoMovimentacao::create([
                    'orcamento_id' => $orcamento->id,
                    'tipo' => 'suplementacao',
                    'valor' => $movimentacao['suplementacao'],
                    'data_movimentacao' => fake()->dateTimeBetween('-3 years', 'now'),
                ]);
            }

            if ($movimentacao['anulacao'] > 0) {
                OrcamentoMovimentacao::create([
                    'orcamento_id' => $orcamento->id,
                    'tipo' => 'anulacao',
                    'valor' => $movimentacao['anulacao'],
                    'data_movimentacao' => fake()->dateTimeBetween('-3 years', 'now'),
                ]);
            }

        }
    }

    // Gera suplementação/anulação antes do orçamento
    private function gerarMovimentacoes(float $dotacaoInicial): array
    {
        $temSuplementacao = fake()->boolean(50);
        $temAnulacao = fake()->boolean(30);

        $suplementacao = $temSuplementacao
            ? fake()->randomFloat(2, 0, $dotacaoInicial * 0.20)
            : 0.00;

        $anulacao = $temAnulacao
            ? fake()->randomFloat(2, 0, $dotacaoInicial * 0.15)
            : 0.00;

        $dotacaoAtualizada = $dotacaoInicial + $suplementacao - $anulacao;

        return [
            'suplementacao' => $suplementacao,
            'anulacao' => $anulacao,
            'dotacaoAtualizada' => $dotacaoAtualizada,
        ];
    }

    // Pago <= Liquidado <= Empenhado
    private function gerarSaudavel(float $dotacaoAtualizada): array
    {
        $empenhado = fake()->randomFloat(2, 0, $dotacaoAtualizada);
        $liquidado = fake()->randomFloat(2, 0, $empenhado);
        $pago = fake()->randomFloat(2, 0, $liquidado);

        return [
            'empenhado' => $empenhado,
            'liquidado' => $liquidado,
            'pago' => $pago,
        ];
    }

    // Tudo zerado
    private function gerarSemExecucao(): array
    {
        return [
            'empenhado' => 0.00,
            'liquidado' => 0.00,
            'pago' => 0.00,
        ];
    }

    // Empenhado entre 90% e 100%. Liquidado 95% do empenhado. Pago 90% do liquidado.
    private function gerarQuaseConcluido(float $dotacaoAtualizada): array
    {
        $empenhado = fake()->randomFloat(2, $dotacaoAtualizada * 0.90, $dotacaoAtualizada);
        $liquidado = round($empenhado * 0.95, 2);
        $pago = round($liquidado * 0.90, 2);

        return [
            'empenhado' => $empenhado,
            'liquidado' => $liquidado,
            'pago' => $pago,
        ];
    }

    // Empenhado > Dotação Atualizada
    private function gerarSaldoNegativo(float $dotacaoAtualizada): array
    {
        // Força o empenho a ser entre 1% e 20% maior que a dotação
        $empenhado = fake()->randomFloat(2, $dotacaoAtualizada * 1.01, $dotacaoAtualizada * 1.20);
        $liquidado = fake()->randomFloat(2, 0, $dotacaoAtualizada); 
        $pago = fake()->randomFloat(2, 0, $liquidado);

        return [
            'empenhado' => $empenhado,
            'liquidado' => $liquidado,
            'pago' => $pago,
        ];
    }

    // Pago > Liquidado OU Liquidado > Empenhado
    private function gerarInconsistente(float $dotacaoAtualizada): array
    {
        $erro = fake()->numberBetween(1, 2);
        
        $empenhado = fake()->randomFloat(2, $dotacaoAtualizada * 0.30, $dotacaoAtualizada * 0.80);

        if ($erro === 1) {
            // Erro 1: Pago maior que o Liquidado
            $liquidado = fake()->randomFloat(2, 0, $empenhado);
            $pago = fake()->randomFloat(2, $liquidado * 1.01, $liquidado * 1.50);
        } else {
            // Erro 2: Liquidado maior que o Empenhado
            $liquidado = fake()->randomFloat(2, $empenhado * 1.01, $empenhado * 1.50);
            $pago = fake()->randomFloat(2, 0, $empenhado); // Pago normal
        }

        return [
            'empenhado' => $empenhado,
            'liquidado' => $liquidado,
            'pago' => $pago,
        ];
    }
}