<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FonteRecurso extends Model
{
    use HasFactory;
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
