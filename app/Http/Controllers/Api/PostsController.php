<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Models\Post;

class PostsController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Post::class, 'home');
    }
}