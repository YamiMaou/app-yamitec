<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();

            $table->text('name', 50);
            $table->string('cpf', 14)->unique();
            $table->date('birth_date');
            $table->tinyInteger('active')->default(1);
            $table->string('note', 200);
            $table->longText('address');
            $table->longText('contact');
            $table->longText('social_media');

            $table->unsignedBigInteger('provider_id');
            $table->unsignedBigInteger('user_id'); // ID do usuário que executou ações no client

            $table->foreign('provider_id')->references('id')->on('providers')->onDelete('cascade');
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
        Schema::dropIfExists('clients');
    }
}
