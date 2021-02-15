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
            ContributorsTableSeeder::class,
            ProviderFilesSeeder::class,
            ContractsSeeder::class,
            ContractsSeeder::class,
            ManagerProvidersSeeder::class  
        ]);
        //$this->call(PostsTableSeeder::class);
    }
}
