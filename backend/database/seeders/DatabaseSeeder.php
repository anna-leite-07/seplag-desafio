<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            OrgaoSeeder::class,
            UnidadeGestoraSeeder::class,
            ProgramaSeeder::class,
            AcaoSeeder::class,
            FuncaoSeeder::class,
            NaturezaDespesaSeeder::class,
            FonteRecursoSeeder::class,
            FornecedorSeeder::class,
            OrcamentoSeeder::class,
            ContratoSeeder::class,
            OrcamentoRevisaoSeeder::class
        ]);
    }
}
