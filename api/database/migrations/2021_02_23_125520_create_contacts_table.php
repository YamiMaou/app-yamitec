<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();

            $table->string('phone1', 11);
            $table->string('phone2', 11)->nullable();
            $table->string('email', 100);
            $table->string('linkedin', 100);
            $table->string('facebook', 100);
            $table->string('instagram', 100);

            $table->unsignedBigInteger('contributors_id')->nullable();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->unsignedBigInteger('manager_id')->nullable();

            $table->foreign('contributors_id')->references('id')->on('contributors')->onDelete('cascade');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
            $table->foreign('manager_id')->references('id')->on('managers')->onDelete('cascade');

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
        Schema::dropIfExists('contacts');
    }
}
