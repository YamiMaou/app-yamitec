import React, { Component, Fragment, useState } from 'react'
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
import { putApiAccountmanager, getAddressByCepla, getApiAccountmanager, getApiClients, getApiContributors, getApiProviders } from '../../../providers/api'
import { validaEmail, validaCpf,validaCnpj, stringToaddDate } from '../../../providers/commonMethods'

import { InputCep, InputCpf,InputCnpj, InputPhone } from '../../../providers/masks'
import { IconButton } from '@material-ui/core';
import { SearchIcon } from '@material-ui/data-grid';
const TextInputsAutocomplete = (props) => {
    const [value, setValue] = useState(props.value ?? "");
    const [value1, setValue1] = useState(props.value1 ?? "");
    const [lock, setLock] = useState(props.value ? true : false);
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
        props.onChange(e);
        if(e.target.value.length <= 14)
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
            if(value.replace(/\D/gim, '').length == 11){
                cpfcnpj = await getApiClients({cpf : value.replace(/\D/gim, '')})
                if(cpfcnpj.data.length == 0)
                    cpfcnpj = await getApiContributors({cpf : value.replace(/\D/gim, '')});
            }else if(value.replace(/\D/gim, '').length == 14){
                cpfcnpj = await getApiProviders({cnpj : value.replace(/\D/gim, '')})
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
class EditAccountManager extends Component {
    state = {
        data: {},
        loading: false
    }
    async componentDidMount() {
        if(JSON.parse(localStorage.getItem("user")) == null){
            window.location.href = '/login';
            return;
        }
        localStorage.setItem("sessionTime", 9000)
        let data = await getApiAccountmanager({}, this.props.match.params.id);
        this.setState({ ...this.state, data });

    }

    render() {
        const closeSnack = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            this.props.setSnackbar({ open: false, message: "" });
        };
        const request = async (state, data) => {
            this.setState({ ...this.state, loading: true });
            this.props.setSnackbar({ open: true, message: "Validando Dados, Aguarde ...", });
            //this.props.enqueueSnackbar("Validando Dados, Aguarde ...", {variant: 'info'});
            //let address = JSON.stringify(Object.assign({},JSON.parse(state.address),data.address));
            //let contact = JSON.stringify(Object.assign({},JSON.parse(state.contact),data.contact));
            //if (data.address) data.address = address;
            //if (data.contact) data.contact = contact
            //if (data.active) data.active = data.active == 'Ativo' ? 1 : 0;
            data = Object.assign({},state.addresses,data);
            data = Object.assign({},state.contacts,data);
            data = Object.assign({},state,data);
            data.amount = data.amount.replace(/\./g,'').replace(',', '.');
            delete data.addresses;
            delete data.contacts;
            let response = await putApiAccountmanager(this.props.match.params.id, data);
            //console.log(response);
            if (response.data.success) {
                this.props.setSnackbar({ open: true, message: response.data.message });
                this.setState({ ...this.state, loading: false });
                this.props.history.goBack();
            } else {
                let {errors, message} = response.data.error.response.data
                let messages = '';
                console.log(errors)
                if(errors !== undefined ){
                    Object.keys(errors).map(err => {
                        console.log(err);
                        messages += `O campo ${err.toUpperCase()} : ${errors[err][0]} \r`;
                    });
                } else{
                    messages = 'Houve um problema em sua requisição!'
                }
                this.setState({ ...this.state, loading: false });
                //response.data.error.response.data.errors
                this.props.setSnackbar({ open: true, messages});
            }

        }
        const validateFields = (fields, values) => {
            let campo = undefined;
            fields.reverse().map((v, k) => {
                v.fields.reverse().map((v1, k1) => {
                    if (values[v1.column] !== undefined) {
                        let value = values[v1.column];
                        if (v1.validate !== undefined) {
                            if (v1.validate.number !== undefined) {
                                if (/^[-]?\d+$/.test(value) == false)
                                    campo = { id: v1.column, message: `O Campo ${v1.label} é somente números ` }
                            }
                            if(v1.validate.decimal !== undefined){
                                if(value.length > 0){
                                    //if (/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/.test(value) == false)
                                    //campo = {id: v1.column, message: `O Campo ${v1.label} é somente números e ponto ` }
                                }
                            }
                            if (v1.validate.max !== undefined) {
                                if (value.length > v1.validate.max)
                                    campo = { id: v1.column, message: `O Campo ${v1.label}, tamanho máximo de ${v1.validate.max} caracteres exêdido` };
                            }

                            if (v1.validate.min !== undefined) {
                                if (value.length < v1.validate.min)
                                    campo = { id: v1.column, message: `O Campo ${v1.label}, tamanho minimo de ${v1.validate.min} caracteres.` };
                            }

                            if (v1.validate.required !== undefined) {
                                if (value.length == 0)
                                    campo = { id: v1.column, message: `O Campo ${v1.label} é obrigatório` };
                            }
                        }
                        if(value == "Selecione"){
                            campo = {id: v1.column, message: `O Campo ${v1.label} é inválido ` }
                        }

                        if (v1.validateHandler !== undefined) {
                            //if (v1.validateHandler(value) == false)
                                //campo = { id: v1.column, message: `O Campo ${v1.label} não possui é inválido ` }
                        }
                    }
                })
            })
            //console.log(campo)
            campo !== undefined ? this.props.setSnackbar({ open: true, message: campo.message}) : '';

            return campo === undefined ? true : false
        }
        const flexBasis = '22%';
        const forms = this.state.data.id == undefined ? [] : [
            {
                title: 'Dados Básicos',
                fields: [
                    { column: 'launch_date', label: 'Data', type: 'date', value: this.state.data['launch_date'], validate: {required: true}, flexBasis, style:{maxWidth: '210px'} },
                    { 
                        column: 'cpf_cnpj', 
                        label: 'CPF/CNPJ', 
                        type: 'custom', component: TextInputsAutocomplete, 
                        value: this.state.data['cnpj'],
                        value1: this.state.data['name'],
                        flexBasis
                    },
                    { column: 'status', label: 'Situação', type: 'select', 
                        json: true, 
                        valueLabel: "value",
                        value: this.state.data['status'],
                        values: [{id: 1, value: "Efetuada"},{id: 2, value: "Dependente"}], 
                        validate: {required: true}, flexBasis, style:{maxWidth: '210px'} 
                    },
                    { column: 'bill_type', label: 'Tipo', type: 'select', 
                        json: true, 
                        valueLabel: "value",
                        value: this.state.data['bill_type'],
                        values: [{id: 1, value: "Receita"},{id: 2, value: "Despesas"}],
                        validate: {required: true}, 
                        flexBasis, style:{maxWidth: '210px'} 
                    },
                ]
            },
            {
                title: 'Financeiro',
                fields: [
                    { column: 'amount', label: 'Valor', type: 'decimal',value: this.state.data['amount'], validate: {required: true}, flexBasis, style:{maxWidth: '210px'} },
                    { column: 'note', label: 'Motivo', type: 'text',value: this.state.data['note'], flexBasis, style:{maxWidth: '210px'} },
                ]
            },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Typography variant="h6">
                        <HomeIcon />  <span>Editar / Cliente</span>
                    </Typography>
                </AppBar>
                {
                    <LForms forms={forms}
                        request={(data) => {request(this.state.data,data)}}
                        validate={(values) => { return validateFields(forms, values) }}
                        loading={this.state.loading}
                    />
                }
                { this.state.data.audits  &&
                    <Paper style={{ marginTop: 10, marginBottom: 10, padding: 15, height: window.innerWidth < 720 ? 210 : 90 }}>
                        <div style={{ float: 'left', maxWidth: 350 }}>
                            <Typography variant="subtitle1" style={{ padding: 10 }}>
                                Data de cadastro:  <b>{stringToaddDate(this.state.data.created_at, 'DD/MM/YYYY', { qtd: 1, period: 'days' })}</b>&nbsp;
                            </Typography>
                            <Typography variant="subtitle1" style={{ padding: 10 }}>
                                Última alteração:  <b>{stringToaddDate(this.state.data.updated_at, 'DD/MM/YYYY', { qtd: 1, period: 'days' })}</b>
                            </Typography>
                        </div>
                        <div style={{ float: 'left', maxWidth: 350 }}>
                            <Typography variant="subtitle1" style={{ padding: 10 }}>
                                Id:  <b>{this.state.data.audits.user.id}</b>
                            </Typography>
                            <Typography variant="subtitle1" style={{ padding: 10 }}>
                                Usuário:  <b>{this.state.data.audits.user.name}</b>
                            </Typography>
                        </div>
                    </Paper>
                }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditAccountManager))
