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

            $table->string('phone1', 15);
            $table->string('phone2', 15)->nullable();
            $table->string('email', 100);
            $table->string('linkedin', 100);
            $table->string('facebook', 100);
            $table->string('instagram', 100);

            $table->unsignedBigInteger('contributors_id');
            $table->foreign('contributors_id')->references('id')->on('contributors')->onDelete('cascade');

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
