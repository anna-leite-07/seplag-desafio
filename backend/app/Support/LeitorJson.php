<?php

namespace App\Support;

use RuntimeException;

class LeitorJson
{
    public static function load(string $arquivo = 'dados.json'): array
    {
        $caminho = database_path("data/{$arquivo}");

        if (! file_exists($caminho)) {
            throw new RuntimeException("Arquivo {$arquivo} não encontrado.");
        }

        return json_decode(
            file_get_contents($caminho),
            true,
            flags: JSON_THROW_ON_ERROR
        );
    }
}