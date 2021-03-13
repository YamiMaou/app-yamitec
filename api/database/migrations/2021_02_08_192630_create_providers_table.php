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
            
            $table->tinyInteger('type');  // 1-Matriz 0-Filial 
            $table->tinyInteger('active')->default(1);
            $table->string('cnpj', 14)->unique();
            $table->string('company_name', 100);
            $table->string('fantasy_name', 100);
            $table->boolean('addr_clone')->default(false)->nullable();
            $table->boolean('contact_clone')->default(false)->nullable();
            $table->boolean('contract_clone')->default(false)->nullable();

            $table->unsignedBigInteger('matriz_id')->nullable(); // referencia do self-relation/filial
            $table->unsignedBigInteger('providertype_id')->nullable(); // referencia do self-relation/filial

            $table->foreign('matriz_id')->references('id')->on('providers')->onDelete('cascade');
            $table->foreign('providertype_id')->references('id')->on('providertypes')->onDelete('cascade');

            $table->unsignedBigInteger('audit_id')->nullable();
            $table->foreign('audit_id')->references('id')->on('audits')->onDelete('cascade');

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
