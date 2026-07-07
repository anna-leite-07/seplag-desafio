<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orgao extends Model
{
    protected $table = 'orgaos';

    protected $fillable = [
        'sigla',
        'nome',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }
    
    // Um órgão pode ter várias unidades gestoras
    public function unidadesGestoras()
    {
        return $this->hasMany(
            UnidadeGestora::class,
            'orgao_id',
            'id'
        );
    }
}
