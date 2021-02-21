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
            $table->longText('address');
            $table->longText('contact');
            $table->longText('social_media');

            $table->unsignedBigInteger('manager_id')->nullable(); // ID do responsável pela farmácia
            $table->unsignedBigInteger('filial_id')->nullable(); // referencia do self-relation/filial
            $table->unsignedBigInteger('user_id'); // ID do usuário que executou ações no fornecedor

            $table->foreign('manager_id')->references('id')->on('managers')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

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
