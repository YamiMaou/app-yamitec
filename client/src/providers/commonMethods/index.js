import moment from 'moment';
export const stringToDate = (_date,_format) =>
{
  return moment(_date).format(_format);
}
export const stringToaddDate = (_date,_format,add = { qtd : 1, period : 'M'}) =>
{
  return moment(_date).add(add.qtd, add.period).format(_format);
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
  let emailCheck = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
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