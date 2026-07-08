<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrcamentoRevisao extends Model
{
    use HasFactory;
    protected $table = 'orcamentos_revisoes';

    protected $fillable = [
        'orcamento_id',
        'user_id',
        'observacao',
    ];

    protected function casts(): array
    {
        return [
            'data_revisao' => 'datetime',
        ];
    }
    
    // Uma revisão de orçamento pertence a um orçamento
    public function orcamento()
    {
        return $this->belongsTo(
            Orcamento::class,
            'orcamento_id',
            'id'
        );
    }

    // Uma revisão de orçamento pertence a um usuário
    public function user()
    {
        return $this->belongsTo(
            User::class,
            'user_id',
            'id'
        );
    }

}
