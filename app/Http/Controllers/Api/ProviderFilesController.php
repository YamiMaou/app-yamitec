<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Extensions\ControllersExtends;
use App\Models\ProviderFiles;

class ProviderFilesController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(ProviderFiles::class, 'home');
    }

    public function upload()
    {
        return $this->view("upload");
    }

    public function fileUploadPost(Request $request)
    {

        $request->validate([
            'file' => 'required|mimes:jpg,pgn,pdf,xlx,csv|max:2048',
        ]);

        $fileName = time().'.'.$request->file->extension();  

        $request->file->move(public_path('uploads'), $fileName);

        return ['ok'=>'ok'];
    }
}