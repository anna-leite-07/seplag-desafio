<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FonteRecurso extends Model
{
    protected $table = 'fontes_recurso';

    protected $fillable = [
        'nome',
    ];

    // Uma fonte de recurso pode ter vários orçamentos
    public function orcamentos()
    {
        return $this->hasMany(
            Orcamento::class,
            'fonte_recurso_id',
            'id'
        );
    }
}
