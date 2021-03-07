<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('permissions')->insert([
            [
                'module' => 0,
                'profile_id' => 1,
                'create' => 1,
                'read' => 1,
                'update' => 1,
                'delete' => 1
            ],
            [
                'module' => 1,
                'profile_id' => 1,
                'create' => 1,
                'read' => 1,
                'update' => 1,
                'delete' => 1
            ],
            [
                'module' => 2,
                'profile_id' => 1,
                'create' => 1,
                'read' => 1,
                'update' => 1,
                'delete' => 1
            ],
            [
                'module' => 3,
                'profile_id' => 1,
                'create' => 1,
                'read' => 1,
                'update' => 1,
                'delete' => 1
            ],
            [
                'module' => 4,
                'profile_id' => 1,
                'create' => 1,
                'read' => 1,
                'update' => 1,
                'delete' => 1
            ],
        ]);
        //factory(User::class, 2)->create();
    }
}
