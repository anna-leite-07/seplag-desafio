<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Orgao extends Model
{
    use HasFactory;
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
