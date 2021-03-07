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

            $table->unsignedBigInteger('client_id')->nullable();
            $table->foreign('client_id')
            ->references('id')->on('clients')
            ->onDelete('cascade');

            $table->unsignedBigInteger('contributor_id')->nullable();
            $table->foreign('contributor_id')
            ->references('id')->on('contributors')
            ->onDelete('cascade');

            $table->unsignedBigInteger('manager_id')->nullable();
            $table->foreign('manager_id')
            ->references('id')->on('managers')
            ->onDelete('cascade');

            $table->unsignedBigInteger('provider_id')->nullable();
            $table->foreign('provider_id')
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