<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Fornecedor extends Model
{
    use HasFactory;
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
