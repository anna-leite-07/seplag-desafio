<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Acao extends Model
{
    use HasFactory;
    protected $table = 'acoes';

    protected $fillable = [
        'programa_id',
        'codigo_oficial',
        'nome',
    ];

    // Uma ação pertence a um programa
    public function programa()
    {
        return $this->belongsTo(
            Programa::class,
            'programa_id',
            'id'
        );
    }

    // Uma ação pode ter vários orçamentos
    public function orcamentos()
    {
        return $this->hasMany(
            Orcamento::class,
            'acao_id',
            'id'
        );
    }
}
