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
        Schema::create('contratos', function (Blueprint $table) {
            $table->id();


            $table->foreignId('orcamento_id')
                ->constrained('orcamentos')
                ->cascadeOnDelete();

            $table->foreignId('fornecedor_id')
                ->constrained('fornecedores')
                ->cascadeOnDelete();

            $table->enum('status', ['VIGENTE', 'VENCIDO', 'ENCERRADO', 'SUSPENSO']);

            $table->string('numero', 30)->unique();
            $table->string('objeto', 255);

            $table->decimal('valor', 15, 2);
            
            $table->date('data_inicio');
            $table->date('data_fim');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contratos');
    }
};
