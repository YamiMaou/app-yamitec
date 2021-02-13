<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateManagersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('managers', function (Blueprint $table) {
            $table->id();

            $table->boolean('active')->default(true);
            $table->string('cpf', 14)->nullable();
            $table->string('name', 50)->nullable();
            $table->string('role', 50)->nullable();
            $table->longText('address');
            $table->longText('contact');
            $table->text('drugstore_group');
            $table->longText('drugstore');
            $table->text('phone');
            $table->string('email', 50);
            $table->string('type', 50);
            $table->string('condition', 50);
            $table->string('user', 50);

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
        Schema::dropIfExists('managers');
    }
}
