<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->integer("module");  // 
            $table->unsignedBigInteger("profile_id"); // function
            $table->foreign('profile_id')
                ->references('id')
                ->on('profiles')
                ->onDelete('cascade');
                
            $table->integer("create")->default(0); // store methods/buttons
            $table->integer("read")->default(0);    // show data / list view
            $table->integer("update")->default(0); // update methods /buttons
            $table->integer("delete")->default(0);  // delete methods / buttons
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
        Schema::dropIfExists('permissions');
    }
}
