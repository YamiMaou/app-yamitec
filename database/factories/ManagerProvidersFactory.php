<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\ManagerProvider;
use App\Models\Manager;
use App\Models\Provider;
use Faker\Generator as Faker;

$factory->define(ManagerProvider::class, function (Faker $faker) {
        return [
            'manager_id' => function () {
                return factory(Manager::class)->create()->id;
            },
            'provider_id' => function () {
                return factory(Provider::class)->create()->id;
            }
    ];
});