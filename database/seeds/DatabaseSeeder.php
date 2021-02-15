<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            PostsTableSeeder::class,
            ProvidersSeeder::class,
            ManagersSeeder::class,
            Contributors::class,
            ProviderFilesSeeder::class,
            ContractsSeeder::class  
        ]);
        //$this->call(PostsTableSeeder::class);
    }
}
