@extends('content_container_card')
@php
$title = "Cadastro de Categoria";
$route = route('categorias.index');
@endphp
@section('card-body')

<div class="container" id="">
    <div class="row justify-content-center">
        <div class="col-sm-12 mb-3">
            <form data-sendrequest="{{route('categorias.store')}}" method="POST">
                @csrf
                <div class="form-row">
                    <div id="errors" class="alert alert-danger d-none">
                        <ul>
                        </ul>
                    </div>
                    <div class="form-group col-sm-12">
                        <label for="name">Nome da Categoria </label>
                        <input placeholder="Digite um nome para a categoria" type="text" class="form-control" name="name" id="name" required="required" value="">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-sm-12">
                        <label for="fathercat">Categoria Pai</label>
                        <select class="form-control" id="fathercat" name="subcategory" require="require">
                            <option value={{null}}> Nenhuma </option>
                            @foreach($globalCategories as $category)
                            <option value="{{$category->id}}"> {{$category->name}} </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" name="enviar">Salvar</button>
            </form>
        </div>
    </div>
</div>


<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
<script>
    $("#frmavatar").on("change", function() {
        var input = document.getElementById("frmavatar");
        var fReader = new FileReader();
        fReader.readAsDataURL(input.files[0]);
        fReader.onloadend = function(event) {
            var img = document.getElementById("avatar");
            img.src = event.target.result;
        }
    });

    // get Address info from cep api
    function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("input[name='stree']").val("");
        $("input[name='district']").val("");
        $("input[name='city']").val("");
        $("input[name='uf']").val("");
    }

    //Quando o campo cep perde o foco.
    $("input[name='zipcode']").blur(function() {

        //Nova variável "cep" somente com dígitos.
        var cep = $(this).val().replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if (validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                $("input[name='stree']").val("...");
                $("input[name='district']").val("...");
                $("input[name='city']").val("...");
                $("input[name='uf']").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {

                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        $("input[name='street']").val(dados.logradouro);
                        $("input[name='district']").val(dados.bairro);
                        $("input[name='city']").val(dados.localidade);
                        $("input[name='uf']").val(dados.uf);
                    } //end if.
                    else {
                        //CEP pesquisado não foi encontrado.
                        limpa_formulário_cep();
                        alert("CEP não encontrado.");
                    }
                });
            } //end if.
            else {
                //cep é inválido.
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    });
</script>
@endsection
