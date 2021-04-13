import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { withRouter } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import LForms from '../../../components/Forms';
//
import { setSnackbar } from '../../../actions/appActions'
import { putApiClients, getAddressByCepla, getApiClients } from '../../../providers/api'
import { validaEmail, validaCpf, stringToaddDate } from '../../../providers/commonMethods'

import { InputCep, InputCpf, InputPhone } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';
import { withSnackbar  } from 'notistack';
class EditContributors extends Component {
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
        let data = await getApiClients({}, this.props.match.params.id);
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
            delete data.addresses;
            delete data.contacts;
            let response = await putApiClients(this.props.match.params.id, data);
            //console.log(response);
            if (response.data.success) {
                this.props.setSnackbar({ open: true, message: response.data.message });
                this.setState({ ...this.state, loading: false });
                this.props.history.goBack();
            } else {
                let errors = response.data ?? undefined;
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
                            if (v1.validateHandler(value) == false)
                                campo = { id: v1.column, message: `O Campo ${v1.label} não possui é inválido ` }
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
                    { 
                        column: 'active', label: 'Ativo', type: 'checkbox',  value: this.state.data['active'] == 1 ? true : false, disabled: false, 
                        justification: this.state.data['audits'] ? this.state.data['audits'].justification : '', 
                        flexBasis : "100%" 
                    },
                    { column: 'cpf', value: this.state.data['cpf'], label: 'CPF', type: 'text', mask: InputCpf, validate: { min: 11, number: true, required: true }, validateHandler: validaCpf, flexBasis: '12%', helperText: "o valor digitado é inválido" },
                    { column: 'name', value: this.state.data['name'], label: 'Nome', type: 'text', validate: { max: 50, required: true }, flexBasis },
                    { column: 'birth_date', value: this.state.data['birth_date'], label: 'Data de nascimento', type: 'date', flexBasis},
                ]
            },
            {
                id: 'addr',
                title: 'Endereço',
                //flexFlow: 'row no-wrap',
                //json: "address",
                fields: [
                    { column: 'zipcode', label: 'CEP', type: 'text', mask: InputCep, validate: { max: 9, required: true }, flexBasis: '9%', value: this.state.data['addresses'] ? this.state.data['addresses'].zipcode : '' },
                    { column: 'street', label: 'Endereço', validate: { max: 100, required: true }, type: 'text', flexBasis, value: this.state.data['addresses'] ?  this.state.data['addresses'].street :'' },
                    { column: 'additional', label: 'Complemento', type: 'text', validate: {max: 20}, flexBasis, value: this.state.data['addresses'] ? this.state.data['addresses'].additional != null ? this.state.data['addresses'].additional : '' :'' },
                    {
                        column: 'uf', label: 'Estado', type: 'select',
                        values: ["Acre", "Alagoas", "Amazonas", "Amapá", "Bahia", "Ceará", "Brasília", "Espírito Santo", "Goiás", "Maranhão", "Minas Gerais", "Mato Grosso do Sul", "Mato Grosso", "Pará", "Paraíba", "Pernambuco", "Piauí", "Paraná", "Rio de Janeiro", "Rio Grande do Norte", "Rondônia", "Roraima", "Rio Grande do Sul", "Santa Catarina", "Sergipe", "São Paulo", "Tocantins"],
                        value:this.state.data['addresses'] ?   this.state.data['addresses'].uf : '', flexBasis, flexGrow: 2, style: { minWidth: "192px" }
                    },
                    { column: 'city', label: 'Cidade', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['addresses'] ? this.state.data['addresses'].city : '' },
                ]
            },
            {
                title: 'Contato',
                //json: 'contact',
                fields: [
                    { column: 'phone1', label: 'Contato', type: 'text', mask: InputPhone, validate: { max: 15, required: true }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].phone1 : '' },
                    { column: 'phone2', label: 'Contato alternativo', type: 'text', mask: InputPhone, validate: { max: 15 }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].phone2 : '' },
                    { column: 'email', label: 'E-mail', type: 'email', validate: { max: 100 }, validateHandler: validaEmail, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].email : '' },
                ]
            },
            {
                title: 'Redes Sociais',
                //json: 'contact',
                fields: [
                    { column: 'linkedin', label: 'Usuário do LinkedIn', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].linkedin : '' },
                    { column: 'facebook', label: 'Usuário do Facebook', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].facebook  : ''},
                    { column: 'instagram', label: 'Usuário do Instagram', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].instagram : ''},
                ]
            }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditContributors))
