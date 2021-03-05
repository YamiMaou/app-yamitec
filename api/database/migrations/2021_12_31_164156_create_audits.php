<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAudits extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('audits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
            ->references('id')->on('users')
            ->onDelete('cascade');

            $table->unsignedBigInteger('clients_id')->nullable();
            $table->foreign('clients_id')
            ->references('id')->on('clients')
            ->onDelete('cascade');

            $table->unsignedBigInteger('contributors_id')->nullable();
            $table->foreign('contributors_id')
            ->references('id')->on('contributors')
            ->onDelete('cascade');

            $table->unsignedBigInteger('managers_id')->nullable();
            $table->foreign('managers_id')
            ->references('id')->on('managers')
            ->onDelete('cascade');

            $table->unsignedBigInteger('providers_id')->nullable();
            $table->foreign('providers_id')
            ->references('id')->on('providers')
            ->onDelete('cascade');

            $table->text('justification')->nullable();
            $table->text('to')->nullable();
            $table->text('from')->nullable();
            $table->timestamps();
            $table->engine = 'InnoDB';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('audits');
    }
}