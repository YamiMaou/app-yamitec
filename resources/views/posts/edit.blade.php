@extends('content_container_card')
@php
$title = "Atualizacao de Categoria";
$route = route('categorias.index');
@endphp
@section('card-body')
<div class="container" id="">
    <div class="row justify-content-center">
        <div class="col-sm-12 mb-3">
            <form data-sendrequest="{{url('categorias/'.$data->id)}}" method="POST">
                @csrf
                @method('PUT')
                <div class="form-row">
                    <div id="errors" class="alert alert-danger d-none">
                        <ul>
                        </ul>
                    </div>
                    <div class="form-group col-sm-12">
                        <label for="name">Nome da Categoria </label>
                        <input type="text" class="form-control" name="name" id="name" required="required" value="{{$data->name}}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-sm-12">
                        <label for="fathercat">Categoria Pai</label>
                        <select class="form-control" id="fathercat" name="subcategory" require="require">
                            <option value={{null}}> Nenhuma </option>
                            @foreach($globalCategories as $category)
                            <option @if($data->subcategory == $category->id) selected @endif value="{{$category->id}}"> {{$category->name}} </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" name="enviar">Salvar</button>
            </form>
        </div>
    </div>
</div>
@endsection
