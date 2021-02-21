<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Contract;
use App\Models\Provider;
use App\User;
use Faker\Generator as Faker;

$factory->define(Contract::class, function (Faker $faker) {
        return [
            'title' => $faker->word,
            'value' => $faker->randomDigit,
            'provider_id' => function () {
                return factory(Provider::class)->create()->id;
            }
    ];
});