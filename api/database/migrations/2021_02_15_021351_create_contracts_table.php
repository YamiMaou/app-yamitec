<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->date('accession_date');
            $table->date('end_date')->nullable();

            $table->decimal('rate', 8,2);
            
            $table->unsignedBigInteger('contributors_id')->nullable(); // ID fornecedor
            $table->foreign('contributors_id')->references('id')->on('contributors')->onDelete('cascade');


            $table->unsignedBigInteger('providers_id')->nullable(); // ID fornecedor
            $table->foreign('providers_id')->references('id')->on('providers')->onDelete('cascade');
            
            //$table->unsignedBigInteger('file_id'); // ID fornecedor
            //$table->foreign('file_id')->references('id')->on('files')->onDelete('cascade');

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
        Schema::dropIfExists('contracts');
    }
}
