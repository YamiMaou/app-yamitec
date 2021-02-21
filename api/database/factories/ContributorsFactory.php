<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Contributors;
use Faker\Generator as Faker;
use App\User;

$factory->define(Contributors::class, function (Faker $faker) {
        return [
            'user_id' => function () {
                return factory(User::class)->create()->id;
            },
            'active' => $faker->numberBetween(0,1),
            'username' => $faker->userName,
            'name' => $faker->name,
            'birthdate' => $faker->date(),
            'anexo' => $faker->numberBetween(1,50),
            'cpf' => $faker->numberBetween(40000000000,99999999999),
            'function' => $faker->word,
            'address' => json_encode([
                'city' => $faker->city,
                'state' => $faker->state,
                'street' => $faker->address,
                'cep' => $faker->postcode,
                'complement'=> $faker->word
            ]),
            'contact' => json_encode([
                'facebook' => $faker->username,
                'linkedin' => $faker->username,
                'instagram' => $faker->username,
            ]),
    ];
});
