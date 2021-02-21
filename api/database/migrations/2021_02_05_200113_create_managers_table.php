<?php

/**
 * Migration que cria o responsável pela farmácia
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateManagersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('managers', function (Blueprint $table) {
            $table->id();

            $table->tinyInteger('active')->default(1);
            $table->string('cpf', 14)->unique();
            $table->string('name', 50);
            $table->string('role', 50);
            $table->longText('address');
            $table->longText('contact');
            
            $table->unsignedBigInteger('user_id'); // ID do usuário que executou o cadastro do responsável
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
        Schema::dropIfExists('managers');
    }
}
