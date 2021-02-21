<?php

use Illuminate\Database\Seeder;

class ProviderFilesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        factory(App\Models\ProviderFiles::class, 7)->create();
    }
}
