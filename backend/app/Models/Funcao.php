<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Funcao extends Model
{
    protected $table = 'funcoes';

    protected $fillable = [
        'codigo_oficial',
        'nome',
    ];

    // Uma função pode ter várias subfunções
    public function subfuncoes()
    {
        return $this->hasMany(
            Subfuncao::class,
            'funcao_id',
            'id'
        );
    }
}
