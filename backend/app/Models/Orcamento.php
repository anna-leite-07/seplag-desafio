<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orcamento extends Model
{
    protected $table = 'orcamentos';

    protected $fillable = [
        'unidade_gestora_id',
        'acao_id',
        'subfuncao_id',
        'natureza_despesa_id',
        'fonte_recurso_id',
        'ano',
        'dotacao_inicial',
        'valor_empenhado',
        'valor_liquidado',
        'valor_pago',
    ];

    protected function casts(): array
    {
        return [
            'dotacao_inicial' => 'decimal:2',
            'valor_empenhado' => 'decimal:2',
            'valor_liquidado' => 'decimal:2',
            'valor_pago' => 'decimal:2',
        ];
    }

    // Um orçamento pertence a uma unidade gestora
    public function unidadeGestora()
    {
        return $this->belongsTo(
            UnidadeGestora::class,
            'unidade_gestora_id',
            'id'
        );
    }

    // Um orçamento pertence a uma ação
    public function acao()
    {
        return $this->belongsTo(
            Acao::class,
            'acao_id',
            'id'
        );
    }

    // Um orçamento pertence a uma subfunção
    public function subfuncao()
    {
        return $this->belongsTo(
            Subfuncao::class,
            'subfuncao_id',
            'id'
        );
    }

    // Um orçamento pertence a uma natureza de despesa
    public function naturezaDespesa()
    {
        return $this->belongsTo(
            NaturezaDespesa::class,
            'natureza_despesa_id',
            'id'
        );
    }

    // Um orçamento pertence a uma fonte de recurso
    public function fonteRecurso()
    {
        return $this->belongsTo(
            FonteRecurso::class,
            'fonte_recurso_id',
            'id'
        );
    }

    // Um orçamento pode ter vários contratos
    public function contratos()
    {
        return $this->hasMany(
            Contrato::class,
            'orcamento_id',
            'id'
        );
    }

    // Um orçamento pode ter várias movimentações de orçamento
    public function orcamentoMovimentacoes()
    {
        return $this->hasMany(
            OrcamentoMovimentacao::class,
            'orcamento_id',
            'id'
        );
    }

    // Um orçamento pode ter várias revisões de orçamento
    public function orcamentoRevisoes()
    {
        return $this->hasMany(
            OrcamentoRevisao::class,
            'orcamento_id',
            'id'
        );
    }
}
