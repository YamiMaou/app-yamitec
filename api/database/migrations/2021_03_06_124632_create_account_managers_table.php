<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAccountManagersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('account_managers', function (Blueprint $table) {
            $table->id();
            $table->string('cpf_cnpj', 14)->nullable();
            $table->string('name', 100);
            $table->tinyInteger('bill_type');
            $table->decimal('amount', 8, 2);
            $table->tinyInteger('status')->nullable();
            $table->tinyInteger('detached')->default(1)->nullable();
            $table->string('note', 200)->nullable();
            $table->date('launch_date');
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
        Schema::dropIfExists('account_managers');
    }
}
