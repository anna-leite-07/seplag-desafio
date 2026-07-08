<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Programa extends Model
{
    use HasFactory;
    protected $table = 'programas';

    protected $fillable = [
        'codigo_oficial',
        'nome',
    ];

    // Um programa pode ter várias ações
    public function acoes()
    {
        return $this->hasMany(
            Acao::class,
            'programa_id',
            'id'
        );
    }
}
