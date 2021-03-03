<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Address;
use App\Models\Contributors;
use App\Models\Manager;
use App\User;
use Faker\Generator as Faker;

$factory->define(Address::class, function (Faker $faker) {
        return [
            'zipcode' => $faker->numerify('########'),
            'street' => $faker->word,
            'city' => $faker->word,
            'uf' => $faker->word,
            'contributors_id' => function () {
                return factory(Contributors::class)->create()->id;
            },
            'manager_id' => function () {
                return factory(Manager::class)->create()->id;
            }
    ];
});