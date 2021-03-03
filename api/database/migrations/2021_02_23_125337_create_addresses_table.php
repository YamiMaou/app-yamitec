<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();

            $table->string('zipcode', 8);
            $table->string('street', 100);
            $table->string('additional', 20)->nullable(); // complemento
            $table->string('city', 100);
            $table->string('uf', 50);

            $table->unsignedBigInteger('contributors_id');
            $table->foreign('contributors_id')->references('id')->on('contributors')->onDelete('cascade');

            $table->unsignedBigInteger('providers_id');
            $table->foreign('providers_id')->references('id')->on('providers')->onDelete('cascade');

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
        Schema::dropIfExists('addresses');
    }
}
