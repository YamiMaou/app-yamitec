export const InputCpf = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-',/\d/, /\d/];

export const stringCpf = (value) => {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export const InputCnpj = [/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'/', /\d/, /\d/, /\d/, /\d/,'-',/\d/, /\d/];

export const stringCnpj = (value) => {
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
} 

export const InputCep = [/[0-9]/, /\d/,  /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

export const InputPhone = ['(',/[0-9]/, /\d/,')', /\d/,' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

