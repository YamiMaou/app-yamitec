import React, { Component, Fragment, useState, } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { withRouter } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import LForms from '../../../components/Forms';
import TextField from '@material-ui/core/TextField';
//
import { setSnackbar } from '../../../actions/appActions'
import { postApiAccountmanager, getApiDownloadFile, getApiClients, getApiContributors, getApiProviders } from '../../../providers/api'
import { validaEmail, validaCpf, validaCnpj, isFutureData } from '../../../providers/commonMethods'

import { InputCep, InputCnpj, InputCpf, InputPhone } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';

import { withSnackbar  } from 'notistack';
import { Button, IconButton } from '@material-ui/core';
import { SearchIcon } from '@material-ui/data-grid';
const MaskedDecimalInput = (props) => {
    const [value1, setValue] = useState(props.value ?? 0);
    const [error, setError] = useState(false);
    function getMoney( str )
    {
        return parseInt( str.replace(/[\D]+/g,'') );
    }
    function formatReal( int )
    {
        var tmp = int+'';
            tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
            if( tmp.length > 6)
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
            if( tmp.length >= 9 )
                tmp = tmp.replace(/([0-9]{3})\.([0-9]{3}),([0-9]{2}$)/g, ".$1.$2,$3");
            return tmp;
    }
    function handleChange(e) {
        //const { value, id } = e.target;
        let val = e.target.value.length > 0 ? e.target.value : '0';
        if( val.length < 14 ){
            props.onChange(e) ?? undefined;
            setValue(formatReal(getMoney(val)));
        }
    }
    return (
        <TextField key={`input-${props.id}`} size="small" style={props.style}
            required={props.required ?? false}
            disabled={props.disabled ?? false}
            error={error}
            type={props.type ?? "text"}
            value={value1 ?? ''}
            helperText={error == true ? props.helperText ?? "conteúdo inválido" : ""}
            id={props.id} label={props.label}
            onChange={handleChange}
            onBlur={handleChange}
        />
    );
}
//
const TextInputsAutocomplete = (props) => {
    const [value, setValue] = useState(props.value ?? "");
    const [value1, setValue1] = useState(props.value ?? "");
    const [lock, setLock] = useState(false);
    function formatCPFCNPJ( int )
    {
        var tmp = int+'';
        if( tmp.length <= 11 ){
            tmp = tmp.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
            return tmp;
        }
        if( tmp.length > 11 && tmp.length <= 14){
             tmp = tmp.replace(/([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2}$)/g, "$1.$2.$3/$4-$5");
            return tmp;
        }
    }
    function handleChange(e) {
        //console.log(e.target)
        props.onChange(e);
        if(e.target.value.replace(/[^\d]/g, "").length <= 14)
            setValue(formatCPFCNPJ(e.target.value.replace(/[^\d]/g, "")));
    }
    function handleChange1(e) {
        props.onChange(e);
        setValue1(e.target.value);
        console.log(e.target.value)
    }
    return (<div>
        <TextField value={value} helperText={props.helperText ?? ""} key={`input-${15000}`} id={"cnpj"} label={props.label} name={"cnpj"} style={{margin: "20px 5px 5px",flexBasis: window.innerWidth < 768 ? '100%' : props.flexBasis }} onChange={handleChange} />
        <IconButton style={{margin: "20px 5px 5px"}} onClick={async () => {
            let cpfcnpj = undefined;
            if(value.replace(/[^\d]/g, '').length == 11){
                cpfcnpj = await getApiClients({cpf : value.replace(/[^\d]/g, '')})
                if(cpfcnpj.data.length == 0)
                    cpfcnpj = await getApiContributors({cpf : value.replace(/[^\d]/g, '')});
            }else if(value.replace(/[^\d]/g, '').length == 14){
                cpfcnpj = await getApiProviders({cnpj : value.replace(/[^\d]/g, '')})
                /*
                if(cpfcnpj.data.length == 0)
                    cpfcnpj = await getApiContributors({cnpj : value.replace(/\D/gim, '')});
                */
            }
            if(cpfcnpj && cpfcnpj.data && cpfcnpj.data.length > 0){
                setLock(true);
                console.log(cpfcnpj.data[0].name ?? cpfcnpj.data[0].fantasy_name ?? "");
                setValue1(cpfcnpj.data[0].name ?? cpfcnpj.data[0].fantasy_name ?? "");
                props.onChange({target: {name: 'name', id: 'name', value: cpfcnpj.data[0].name ?? cpfcnpj.data[0].fantasy_name ?? ""}});
            }else{
                setLock(false);
            }
        }}><SearchIcon /></IconButton>
        <TextField disabled={lock} value={value1} helperText={props.helperText ?? ""} key={`input-${15001}`} id={"name"} label={'Nome'} name={"name"} style={{margin: "20px 5px 5px",flexBasis: window.innerWidth < 768 ? '100%' : props.flexBasis }} onChange={handleChange1} />
    </div>)
}
class CreateAccountManager extends Component {
    
    state = {
        contributors: [],
        states: []
    }
    async componentDidMount() {
        localStorage.setItem("sessionTime", 900)

    }

    render() {
         // to use snackbar Provider
        const closeSnack = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            this.props.setSnackbar({ open: false, message: "" });
        };
        
        const request = async (data) => {
            this.props.setSnackbar({ open: true, message: "Validando Dados, Aguarde ...", });
            this.setState({ ...this.state, loading: true });
            //data = Object.assign({},state.addresses,data);
            //data = Object.assign({},state.contacts,data);
            //data = Object.assign({},state,data);
            //delete data.addresses;
           // delete data.contacts;
            data.amount = data.amount.replace(/\./g,'').replace(',', '.');
            let response = await postApiAccountmanager(data);
            //console.log(response);
            if (response.data.success) {
                //this.props.enqueueSnackbar( response.data.message, { variant: 'success' });
                this.props.setSnackbar({ open: true, message: response.data.message });
                this.setState({ ...this.state, loading: false });
                this.props.history.goBack();
            } else {
                console.log(response)
                let errors = response.data ?? undefined;

                //let { errors } = response.data.error.response.data ?? {error: undefined}
                let messages = '';
                if(errors !== undefined && errors.error !== undefined && errors.error.response && errors.error.response.data !== undefined && errors.error.response.data.errors !== undefined){
                    Object.keys(errors.error.response.data.errors).map(err => {
                        console.log(err);
                        let field = err == "file" ? "Anexo" : err
                        messages += `O ${field.toUpperCase()} ${errors.error.response.data.errors[err][0]} \n`;
                    })
                } else{
                    messages = errors.message ?? 'Houve um problema em sua requisição!'
                }
                //response.data.error.response.data.errors
                //this.props.enqueueSnackbar( message, { variant: 'error' });
                this.setState({ ...this.state, loading: false });
                this.props.setSnackbar({ open: true, message: messages});
            }

        }
        const validateFields = (fields, values) => {
            //console.log(fields);
            let campo = undefined;
            fields.reverse().map((v,k) => {
                v.fields.reverse().map((v1,k1)=>{
                        let value = values[v1.column];
                        if (v1.validate !== undefined) {
                            if (v1.validate.number !== undefined) {
                                if(value.length > 0){
                                if (/^[-]?\d+$/.test(value) == false)
                                    campo = {id: v1.column, message: `O Campo ${v1.label} é somente números ` }
                                }
                            }
                            if(v1.validate.decimal !== undefined){
                                if(value.length > 0){
                                    //if (/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/.test(value.replace(/[\D]+/g,'')) == false)
                                    //campo = {id: v1.column, message: `O Campo ${v1.label} é somente números e ponto ` }
                                }
                            }
                            if (v1.validate.max !== undefined) {
                                if (value.length > v1.validate.max)
                                    campo = {id: v1.column, message: `O Campo ${v1.label}, tamanho máximo de ${v1.validate.max} caracteres exêdido` };
                            }

                            if (v1.validate.min !== undefined) {
                                if (value.length < v1.validate.min)
                                    campo = {id: v1.column, message: `O Campo ${v1.label}, tamanho minimo de ${v1.validate.min} caracteres.` };
                            }
                           
                        }
                        if(value == "Selecione"){
                            campo = {id: v1.column, message: `O Campo ${v1.label} é inválido ` }
                        }
                        
                        if(v1.validateHandler !== undefined){
                            //if (v1.validateHandler(value) == false)
                                    //campo = {id: v1.column, message: `O Campo ${v1.label}  é inválido ` }
                        }
                    })
                })
                //console.log(campo)
                campo !== undefined ? this.props.setSnackbar({ open: true, message: campo.message}) : '';

                return campo === undefined ? true : false
        }
        const flexBasis = '22%';
        const forms = [
            {
                title: 'Dados Básicos',
                fields: [
                    { column: 'launch_date', label: 'Data', type: 'date', validate: {required: true}, flexBasis, style:{maxWidth: '210px'} },
                    //{ column: 'cpf', label: 'CPF', type: 'text', mask: InputCpf, validate: {number: true}, validateHandler: validaCpf, flexBasis: '12%', helperText: "o valor digitado é inválido" },
                    //{ column: 'cnpj', label: 'CNPJ', type: 'text', mask: InputCnpj, validate: {number: true},validateHandler: validaCnpj, flexBasis: '12%', helperText: "o valor digitado é inválido" },
                    //{ column: 'name', label: 'Nome', type: 'text', validate: {max: 50, required: true}, flexBasis },
                    { column: 'cpf_cnpj', label: 'CPF/CNPJ', type: 'custom', component: TextInputsAutocomplete, flexBasis},
                    /*{ column: 'status', label: 'Situação', type: 'select', 
                        json: true, 
                        valueLabel: "value",
                        values: [{id: 1, value: "Efetuada"},{id: 2, value: "Dependente"}], 
                        validate: {required: true}, flexBasis, style:{maxWidth: '210px'} 
                    },*/
                    { column: 'bill_type', label: 'Tipo', type: 'select', 
                        json: true, 
                        valueLabel: "value",
                        values: [{id: 1, value: "Receita"},{id: 2, value: "Despesas"}],
                        validate: {required: true}, 
                        flexBasis, style:{maxWidth: '210px'} 
                    },
                ]
            },
            {
                title: 'Financeiro',
                fields: [
                    { column: 'amount', label: 'Valor', type: 'decimal',  validate: {required: true}, flexBasis, style:{maxWidth: '210px'} },
                    { column: 'note', label: 'Motivo', type: 'text', flexBasis, style:{maxWidth: '210px'} },
                ]
            },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Typography variant="h6">
                        <HomeIcon />  <span>Cadastro / Conta</span>
                    </Typography>
                </AppBar>
                <LForms forms={forms}
                    request={request} 
                    validate={(values) => { return validateFields(forms,values)}}
                    loading={this.state.loading}
                />
            </Fragment>
        )
    }
}
const mapStateToProps = store => ({
    session: store.authReducer.data,
    snackbar: store.appReducer.snackbar
});
const mapDispatchToProps = dispatch =>
    bindActionCreators({ setSnackbar }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateAccountManager))
