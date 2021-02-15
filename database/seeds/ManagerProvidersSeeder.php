<?php

use Illuminate\Database\Seeder;

class ManagerProvidersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        factory(App\Models\ManagerProvider::class, 7)->create();
    }
}
