<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ComtributorsTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $response = $this->get('/api/contributors');

        $response->assertStatus(200);
    }

    public function testShow()
    {
        $response = $this->get('/api/contributors/1');

        $response->assertStatus(200);
    }
}
