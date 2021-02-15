<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProviderFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('provider_files', function (Blueprint $table) {
            $table->id();

            $table->string('title', 100);
            $table->string('path');
            $table->string('name');

            $table->unsignedBigInteger('provider_id'); // ID forecedor
            $table->unsignedBigInteger('user_id'); // ID do usuário que executou operações em arquivo

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
        Schema::dropIfExists('provider_files');
    }
}
