<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnidadeGestora extends Model
{
    protected $table = 'unidades_gestoras';

    protected $fillable = [
        'orgao_id',
        'nome',
    ];

    // Uma unidade gestora pertence a um órgão
    public function orgao()
    {
        return $this->belongsTo(
            Orgao::class,
            'orgao_id',
            'id'
        );
    }

    // Uma unidade gestora pode ter vários orçamentos
    public function orcamentos()
    {
        return $this->hasMany(
            Orcamento::class,
            'unidade_gestora_id',
            'id'
        );
    }

}
