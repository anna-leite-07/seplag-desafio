<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            OrgaoSeeder::class,
            UnidadeGestoraSeeder::class,
            ProgramaSeeder::class,
            AcaoSeeder::class,
            FuncaoSeeder::class,
            SubfuncaoSeeder::class,
            NaturezaDespesaSeeder::class,
            FonteRecursoSeeder::class,
            FornecedorSeeder::class,
        ]);
    }
}
