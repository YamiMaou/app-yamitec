<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('modules')->insert([
            [
                'name' => "Colaboradores",
            ],
            [
                'name' => "Clientes",
            ],[
                'name' => "Responsáveis",
            ],[
                'name' => "Fornecedores",
            ],[
                'name' => "Bonificação",
            ],[
                'name' => "Ger. Contas",
            ],[
                'name' => "Permissões",
            ],[
                'name' => "Auditoria",
            ],
        ]);
        //factory(User::class, 2)->create();
    }
}
