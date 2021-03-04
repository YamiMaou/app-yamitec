<?php

/**
 * Migration que cria o fornecedor(farmácia/filial)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProvidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            
            $table->text('type'); // qual tipo/estrutura de type?
            $table->tinyInteger('active')->default(1);
            $table->string('cnpj', 14)->unique();
            $table->string('company_name', 100);
            $table->string('fantasy_name', 100);

            $table->unsignedBigInteger('matriz_id')->nullable(); // referencia do self-relation/filial
            $table->foreign('matriz_id')->references('id')->on('providers')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('providers');
    }
}
