<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NaturezaDespesa extends Model
{
    protected $table = 'naturezas_despesa';

    protected $fillable = [
        'nome',
    ];

    // Uma natureza de despesa pode ter vários orçamentos
    public function orcamentos()
    {
        return $this->hasMany(
            Orcamento::class,
            'natureza_despesa_id',
            'id'
        );
    }
}
