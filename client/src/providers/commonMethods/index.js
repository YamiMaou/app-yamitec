import moment from 'moment';
export const stringToDate = (_date,_format) =>
{
  return moment(_date).format(_format);
}
export const stringToaddDate = (_date,_format,add = { qtd : 1, period : 'M'}) =>
{
  return moment(_date).add(add.qtd, add.period).format(_format);
}

export const isFutureData = (_value) => {
  let today = Date.now()
  return new Date(_value) < today;
}
export const formatToBRL = (_valor) => {
  
  _valor = _valor + '';
  _valor = parseInt(_valor.replace(/[\D]+/g,''));
  _valor = _valor + '';
  _valor = _valor.replace(/([0-9]{2})$/g, ",$1");

  if (_valor.length > 6) {
    _valor = _valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
  }

  return _valor;
}

export const checkImageUrl = (imageUrl) => {
  var img = new Image();
  img.src = imageUrl;
  if(img.height>0){
    return true;
  } else {
    return false;
  }
}
export function validaEmail(email){
  //let emailCheck = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
  let emailCheck = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  
  return emailCheck.test(email);
}
export function validaCpf(strCPF = "") {
  //console.log(strCPF);
  strCPF = strCPF.replace(/[^\d]+/g, '');
  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF.length != 11 ||
    strCPF == "00000000000" ||
    strCPF == "11111111111" ||
    strCPF == "22222222222" ||
    strCPF == "33333333333" ||
    strCPF == "44444444444" ||
    strCPF == "55555555555" ||
    strCPF == "66666666666" ||
    strCPF == "77777777777" ||
    strCPF == "88888888888" ||
    strCPF == "99999999999")
    return false;
if (strCPF.length < 11) return false;

if (strCPF.length < 11 ) return false;
for (let i=1; i<=9; i++) {
  Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
}
Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

Soma = 0;
  for (let i = 1; i <= 10; i++) {
    Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)
  };
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
  return true; //strCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function validaCnpj(value) {
 
  let cnpj = value.replace(/[^\d]+/g,'');

  if(cnpj == '') return false;
   
  if (cnpj.length != 14)
      return false;

  // Elimina CNPJs invalidos conhecidos
  if (cnpj == "00000000000000" || 
      cnpj == "11111111111111" || 
      cnpj == "22222222222222" || 
      cnpj == "33333333333333" || 
      cnpj == "44444444444444" || 
      cnpj == "55555555555555" || 
      cnpj == "66666666666666" || 
      cnpj == "77777777777777" || 
      cnpj == "88888888888888" || 
      cnpj == "99999999999999")
      return false;
       
  // Valida DVs
  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0,tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
          pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0))
      return false;
       
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0,tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
          pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(1))
        return false;
         
  return true;
  
}