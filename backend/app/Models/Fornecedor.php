<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fornecedor extends Model
{
    protected $table = 'fornecedores';

    protected $fillable = [
        'nome',
    ];

    // Um fornecedor pode ter vários contratos
    public function contratos()
    {
        return $this->hasMany(
            Contrato::class,
            'fornecedor_id',
            'id'
        );
    }
}
