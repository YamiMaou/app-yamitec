<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Provider;
use App\User;
use App\Models\Manager;
use Faker\Generator as Faker;

$factory->define(Provider::class, function (Faker $faker) {
        return [
            'type' => $faker->word,
            'active' => $faker->numberBetween(0,1),
            'cnpj' => $faker->numerify('##############'),
            'company_name' => $faker->company,
            'fantasy_name' => $faker->company,
            'address' => json_encode([
                'city' => $faker->city,
                'state' => $faker->state,
                'street' => $faker->streetName,
                'zipcode' => $faker->postcode,
                'complement'=> $faker->word
            ]),
            'contact' => json_encode([
                'phone1' => $faker->phoneNumber,
                'phone2' => $faker->phoneNumber,
                'email' => $faker->email,
                'site' => $faker->url,
                'facebook' => $faker->username,
                'linkedin' => $faker->username,
                'instagram' => $faker->username,
            ]),
            'social_media' => json_encode([
                'linkedin' => $faker->username,
                'facebook' => $faker->username,
                'instagram' => $faker->username,
            ]),
            'manager_id' => function () {
                return factory(Manager::class)->create()->id;
            },
            'filial_id' => $faker->randomNumber(),
            'user_id' => function () {
                return factory(User::class)->create()->id;
            }
    ];
});
