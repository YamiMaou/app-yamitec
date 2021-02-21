<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\ProviderFiles;
use Faker\Generator as Faker;
use App\Models\Provider;
use App\User;

$factory->define(ProviderFiles::class, function (Faker $faker) {
        return [
            'title' => $faker->sentence,
            'path' => $faker->url,
            'name' => $faker->word,
            'provider_id' => function () {
                return factory(Provider::class)->create()->id;
            },
            'user_id' => function () {
                return factory(User::class)->create()->id;
            }
    ];
});
