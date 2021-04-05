<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContributors extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contributors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
            ->references('id')->on('users')
            ->onDelete('cascade');
            
            $table->integer('active');
            $table->string('username');
            $table->string('name');
            $table->string('cpf');
            $table->string('function');
            $table->string('justify')->nullable();
            $table->date('birthdate')->default(date('Y-m-d'));
            $table->integer('anexo')->nullable();
            $table->timestamps();

            /*$table->unsignedBigInteger('audit_id')->nullable();
            $table->foreign('audit_id')->references('id')->on('audits')->onDelete('cascade');*/
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contributors');
    }
}
