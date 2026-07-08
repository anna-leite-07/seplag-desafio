<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = [
            [
                'name' => 'Admin SEPLAG',
                'email' => 'admin@seplag.rj.gov.br',
            ],
            [
                'name' => 'Gestor SEPLAG',
                'email' => 'gestor@seplag.rj.gov.br',
            ],
            [
                'name' => 'Analista SEPLAG',
                'email' => 'analista@seplag.rj.gov.br',
            ]
        ];

        foreach ($usuarios as $usuario) {

            User::create([
                'name' => $usuario['name'],
                'email' => $usuario['email'],
                'password' => Hash::make('orcamento@2026'),
            ]);

        }
    }
}
