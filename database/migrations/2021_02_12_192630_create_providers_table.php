<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProvidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            
            $table->text('type');
            $table->boolean('active')->default(true);
            $table->string('cnpj', 14)->nullable();
            $table->string('company_name', 100)->nullable();
            $table->string('fantasy_name', 100)->nullable();
            $table->longText('address');
            $table->longText('contact');

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
        Schema::dropIfExists('providers');
    }
}
