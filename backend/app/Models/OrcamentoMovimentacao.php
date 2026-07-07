<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrcamentoMovimentacao extends Model
{
    protected $table = 'orcamentos_movimentacoes';

    protected $fillable = [
        'orcamento_id',
        'tipo',
        'valor',
        'data_movimentacao',
    ];

    protected function casts(): array
    {
        return [
            'valor' => 'decimal:2',
            'data_movimentacao' => 'date',
        ];
    }
    

    // Uma movimentação de orçamento pertence a um orçamento
    public function orcamento()
    {
        return $this->belongsTo(
            Orcamento::class,
            'orcamento_id',
            'id'
        );
    }
}
