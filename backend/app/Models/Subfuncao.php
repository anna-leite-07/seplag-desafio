<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subfuncao extends Model
{
    protected $table = 'subfuncoes';

    protected $fillable = [
        'funcao_id',
        'nome',
    ];

    // Uma subfunção pertence a uma função
    public function funcao()
    {
        return $this->belongsTo(
            Funcao::class,
            'funcao_id',
            'id'
        );
    }

    // Uma subfunção pode ter vários orçamentos
    public function orcamentos()
    {
        return $this->hasMany(
            Orcamento::class,
            'subfuncao_id',
            'id'
        );
    }

}
