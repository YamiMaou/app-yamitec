<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Manager;
use App\User;
use Faker\Generator as Faker;

$factory->define(Manager::class, function (Faker $faker) {
        return [
            'title' => $faker->word,
            'value' => $faker->randomDigit,
            'user_id' => function () {
                return factory(User::class)->create()->id;
            }
    ];
});