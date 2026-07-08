<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contrato extends Model
{
    use HasFactory;
    protected $table = 'contratos';

    protected $fillable = [
        'orcamento_id',
        'fornecedor_id',
        'status',
        'numero',
        'objeto',
        'valor',
        'data_inicio',
        'data_fim',
    ];

    protected function casts(): array
    {
        return [
            'valor' => 'decimal:2',
            'data_inicio' => 'date',
            'data_fim' => 'date',
        ];
    }
    
    // Um contrato pertence a um orçamento
    public function orcamento()
    {
        return $this->belongsTo(
            Orcamento::class,
            'orcamento_id',
            'id'
        );
    }

    // Um contrato pertence a um fornecedor
    public function fornecedor()
    {
        return $this->belongsTo(
            Fornecedor::class,
            'fornecedor_id',
            'id'
        );
    }
}
