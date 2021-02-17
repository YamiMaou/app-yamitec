<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Provider;
use App\User;
use App\Models\Client;
use Faker\Generator as Faker;

$factory->define(Client::class, function (Faker $faker) {
        return [
            'name' => $faker->word,                                               
            'cpf' => $faker->numerify('###########'),
            'birth_date' => $faker->date(),
            'active' => $faker->numberBetween(0,1),
            'note' => $faker->text(),
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
            'provider_id' => function () {
                return factory(Provider::class)->create()->id;
            },
            'user_id' => function () {
                return factory(User::class)->create()->id;
            }
    ];
});