<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Manager;
use App\User;
use Faker\Generator as Faker;

$factory->define(Manager::class, function (Faker $faker) {
        return [
            'active' => $faker->numberBetween(0,1),
            'cpf' => $faker->numerify('###########'),
            'name' => $faker->firstName(),
            'role' => $faker->word,
            'address' => json_encode([
                'zipcode' => $faker->postcode,
                'city' => $faker->city,
                'state' => $faker->state,
                'street' => $faker->streetName,
                'complement'=> $faker->word
            ]),
            'contact' => json_encode([
                'linkedin' => $faker->username,
                'facebook' => $faker->username,
                'instagram' => $faker->username,
            ]),
            'user_id' => function () {
                return factory(User::class)->create()->id;
            }
    ];
});
