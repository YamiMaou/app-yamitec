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
            'function' => $faker->word,
            'user_id' => function () {
                return factory(User::class)->create()->id;
            },
    ];
});
