function limpa_formulário() {
  // Limpa valores do formulário de cep.
  $("input[name='street']").val("");
  $("input[name='district']").val("");
  $("input[name='city']").val("");
  $("input[name='uf']").val("");
}

$.fn.extend({
  getAddress: function () {
    //Quando o campo cep perde o foco.
    $("input[name='zipcode']").blur(function () {
      //Nova variável "cep" somente com dígitos.
      var cep = $(this).val().replace(/\D/g, '');
      //Verifica se campo cep possui valor informado.
      if (cep != "") {
        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;
        //Valida o formato do CEP.
        if (validacep.test(cep)) {
          //Preenche os campos com "..." enquanto consulta webservice.
          $("input[name='street']").val("...");
          $("input[name='district']").val("...");
          $("input[name='city']").val("...");
          $("input[name='uf']").val("...");
          //Consulta o webservice viacep.com.br/
          $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
            if (!("erro" in dados)) {
              //Atualiza os campos com os valores da consulta.
              $("input[name='street']").val(dados.logradouro);
              $("input[name='district']").val(dados.bairro);
              $("input[name='city']").val(dados.localidade);
              $("input[name='uf']").val(dados.uf);
            } //end if.
            else {
              //CEP pesquisado não foi encontrado.
              limpa_formulário();
              alert("CEP não encontrado.");
            }
          });
        } //end if.
        else {
          //cep é inválido.
          limpa_formulário();
          alert("Formato de CEP inválido.");
        }
      } //end if.
      else {
        //cep sem valor, limpa formulário.
        limpa_formulário();
      }
    });
    //** */
  }
})
