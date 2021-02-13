<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\ProviderFiles;
use Faker\Generator as Faker;
use App\Models\Provider;

$factory->define(ProviderFiles::class, function (Faker $faker) {
        return [
            'path' => $faker->url,
            'name' => $faker->word,
            'provider_id' => function () {
                return factory(Provider::class)->create()->id;
            },
    ];
});
