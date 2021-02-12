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
            'function' => $faker->word,
            'address' => json_encode([
                'city' => $faker->city,
                'state' => $faker->state,
                'street' => $faker->address,
                'cep' => $faker->postcode,
                'complement'=> $faker->word
            ]),
            'social' => json_encode([
                'facebook' => $faker->username,
                'linkedin' => $faker->username,
                'instagram' => $faker->username,
            ]),
    ];
});
