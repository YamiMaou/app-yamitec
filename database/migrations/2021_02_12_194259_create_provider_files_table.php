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

            $table->text('path');
            $table->text('name');

            $table->unsignedBigInteger('provider_id');
            $table->foreign('provider_id')
            ->references('id')->on('provider')
            ->onDelete('cascade');

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
