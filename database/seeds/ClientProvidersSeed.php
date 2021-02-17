<?php

use Illuminate\Database\Seeder;

class ClientProvidersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        factory(App\Models\ClientProvider::class, 7)->create();
    }
}
