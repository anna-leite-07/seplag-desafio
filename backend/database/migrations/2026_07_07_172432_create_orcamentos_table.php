<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orcamentos', function (Blueprint $table) {
            $table->id();


            $table->foreignId('unidade_gestora_id')
                ->constrained('unidades_gestoras')->cascadeOnDelete();
            
            $table->foreignId('acao_id')
                ->constrained('acoes')->cascadeOnDelete();
            
            $table->foreignId('subfuncao_id')
                ->constrained('subfuncoes')->cascadeOnDelete();

            $table->foreignId('natureza_despesa_id')
                ->constrained('naturezas_despesa')->cascadeOnDelete();

            $table->foreignId('fonte_recurso_id')
                ->constrained('fontes_recurso')->cascadeOnDelete();

            $table->smallInteger('ano')->index();;

            $table->decimal('dotacao_inicial', 15,2);
            $table->decimal('valor_empenhado', 15,2);
            $table->decimal('valor_liquidado', 15,2);
            $table->decimal('valor_pago', 15,2);


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orcamentos');
    }
};
