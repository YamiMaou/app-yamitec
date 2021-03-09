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
            ProfileSeeder::class,
            UserSeeder::class,
            PermissionSeeder::class,
            
           // PostsTableSeeder::class,
           // ProvidersSeeder::class,
           // ManagersSeeder::class,
           // ContributorsTableSeeder::class,
           // ProviderFilesSeeder::class,
           // ContractsSeeder::class,
           // ContractsSeeder::class,
           // ManagerProvidersSeeder::class  ,
            //ContactSeeder::class,
            //AddressSeeder::class
        ]);
        //$this->call(PostsTableSeeder::class);
    }
}
