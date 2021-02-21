<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\ClientProvider;
use App\Models\Client;
use App\Models\Provider;
use Faker\Generator as Faker;

$factory->define(ClientProvider::class, function (Faker $faker) {
        return [
            'client_id' => function () {
                return factory(Client::class)->create()->id;
            },
            'provider_id' => function () {
                return factory(Provider::class)->create()->id;
            }
    ];
});