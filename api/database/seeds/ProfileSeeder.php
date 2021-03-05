<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('profiles')->insert([[
            'name' => 'Administração',
        ],[
            'name' => 'Coordenador de usuários',
        ],[
            'name' => 'Coordenador de parceiros',
        ],[
            'name' => 'Gerente',
        ],[
            'name' => 'Operador de marketing',
        ],[
            'name' => 'Vendedor',
        ]]);
        //factory(User::class, 2)->create();
    }
}
