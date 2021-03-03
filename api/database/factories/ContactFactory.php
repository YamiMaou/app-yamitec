<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Contact;
use App\Models\Contributors;
use App\Models\Manager;
use App\User;
use Faker\Generator as Faker;

$factory->define(Contact::class, function (Faker $faker) {
        return [
            'phone1' => $faker->phoneNumber,
            'email' => $faker->email,
            'linkedin' => $faker->userName,
            'facebook' => $faker->userName,
            'instagram' => $faker->userName,
            'contributors_id' => function () {
                return factory(Contributors::class)->create()->id;
            },
            'manager_id' => function () {
                return factory(Manager::class)->create()->id;
            }
    ];
});
