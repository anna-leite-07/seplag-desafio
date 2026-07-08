<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected static ?string $password = null;

    public function definition(): array
    {
        $nome = fake()->name();
        $email = fake()->unique()->safeEmail();
        
        if (static::$password === null) {
            static::$password = Hash::make('orcamento@2026');
        }
        $senha = static::$password;

        return [
            'name' => $nome,
            'email' => $email,
            'password' => $senha,
        ];
    }
}