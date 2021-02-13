<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Manager;
use Faker\Generator as Faker;

$factory->define(Manager::class, function (Faker $faker) {
        return [
            'active' => $faker->numberBetween(0,1),
            'type' => $faker->word,
            'cpf' => $faker->word,
            'name' => $faker->firstName(),
            'role' => $faker->word,
            'address' => json_encode([
                'city' => $faker->city,
                'state' => $faker->state,
                'street' => $faker->streetName,
                'number' => $faker->randomDigit,
                'zipcode' => $faker->postcode,
                'complement'=> $faker->word
            ]),
            'contact' => json_encode([
                'facebook' => $faker->username,
                'linkedin' => $faker->username,
                'instagram' => $faker->username,
            ]),
            'drugstore_group' => $faker->company,
            'drugstore' => $faker->company,
            'phone' => $faker->phoneNumber,
            'email' => $faker->email,
            'type' => $faker->word,
            'condition' => $faker->word,
            'user' => $faker->word,
    ];
});