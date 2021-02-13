<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Provider;
use Faker\Generator as Faker;

$factory->define(Provider::class, function (Faker $faker) {
        return [
            'active' => $faker->numberBetween(0,1),
            'type' => $faker->word,
            'cnpj' => $faker->word,
            'company_name' => $faker->word,
            'fantasy_name' => $faker->word,
            'address' => json_encode([
                'city' => $faker->city,
                'state' => $faker->state,
                'street' => $faker->address,
                'number' => $faker->randomDigit,
                'zipcode' => $faker->postcode,
                'complement'=> $faker->word
            ]),
            'contact' => json_encode([
                'facebook' => $faker->username,
                'linkedin' => $faker->username,
                'instagram' => $faker->username,
            ]),
    ];
});