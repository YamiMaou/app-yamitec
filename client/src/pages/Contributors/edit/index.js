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
import { putApiContributors, getAddressByCepla, getApiContributors } from '../../../providers/api'
import { validaEmail, validaCpf, stringToaddDate } from '../../../providers/commonMethods'

import { InputCep, InputCpf, InputPhone } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';
import { withSnackbar  } from 'notistack';
class EditContributors extends Component {
    state = {
        contributor: undefined,
    }
    async componentDidMount() {
        let contributor = await getApiContributors({}, this.props.match.params.id);
        this.setState({ ...this.state, contributor });

    }

    render() {
        const closeSnack = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            this.props.setSnackbar({ open: false, message: "" });
        };
        const flexBasis = '30%';
        const request = async (state, data) => {
            this.props.setSnackbar({ open: true, message: "Validando Dados, Aguarde ...", });
            //this.props.enqueueSnackbar("Validando Dados, Aguarde ...", {variant: 'info'});
            let address = JSON.stringify(Object.assign({},JSON.parse(state.address),data.address));
            let contact = JSON.stringify(Object.assign({},JSON.parse(state.contact),data.contact));
            if (data.address) data.address = address;
            if (data.contact) data.contact = contact
            //if (data.active) data.active = data.active == 'Ativo' ? 1 : 0;
            let response = await putApiContributors(this.props.match.params.id, data);
            //console.log(response);
            if (response.data.success) {
                this.props.setSnackbar({ open: true, message: response.data.message });
                this.props.history.goBack();
            } else {
                let {errors} = response.data.error.response.data
                let message = '';
                console.log(errors)
                Object.keys(errors).map(err => {
                    console.log(err);
                    message += `Campo ${err.toUpperCase()} : ${errors[err][0]} \n`;
                })
                //response.data.error.response.data.errors
                this.props.setSnackbar({ open: true, message});
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
                                campo = { id: v1.column, message: `O Campo ${v1.label} não possui um conteúdo é válido ` }
                        }
                    }
                })
            })
            //console.log(campo)
            campo !== undefined ? this.props.setSnackbar({ open: true, message: campo.message}) : '';

            return campo === undefined ? true : false
        }

        const forms = !this.state.contributor ? [] : [
            {
                title: 'Dados Básicos',
                fields: [
                    { column: 'active', label: 'Ativo', type: 'checkbox',  value: this.state.contributor['active'] == 1 ? true : false, disabled: false, flexBasis : "100%" },
                    { column: 'cpf', value: this.state.contributor['cpf'], label: 'CPF', type: 'text', mask: InputCpf, validate: { min: 11, number: true, required: true }, validateHandler: validaCpf, flexBasis: '20%', helperText: "o valor digitado é inválido" },
                    { column: 'name', value: this.state.contributor['name'], label: 'Nome', type: 'text', validate: { max: 50, required: true }, flexBasis },
                    { column: 'birthdate', value: this.state.contributor['birthdate'], label: 'Data de Nascimento', type: 'date', flexBasis, style: { maxWidth: '160px' } },
                    {
                        column: 'function', label: 'Função', type: 'select',
                        values: [
                            "Administração",
                            "Coordenador de usuários",
                            "Coordenador de parceiros",
                            "Gerente",
                            "Operador de marketing",
                            "Vendedor"
                        ],
                        value: this.state.contributor['function'],
                        flexBasis
                    },
                    { column: 'anexo', label: 'Anexar Documento', type: 'file', flexBasis:'15%', style:{maxWidth: '180'} },
                ]
            },
            {
                id: 'addr',
                title: 'Endereço',
                flexFlow: 'row no-wrap',
                json: "address",
                fields: [
                    { column: 'cep', label: 'CEP', type: 'text', mask: InputCep, validate: { max: 9, required: true }, flexBasis: '10%', value: JSON.parse(this.state.contributor['address']).cep },
                    { column: 'street', label: 'Endereço', validate: { max: 100, required: true }, type: 'text', flexBasis, value: JSON.parse(this.state.contributor['address']).street },
                    { column: 'complement', label: 'Complemento', type: 'text', flexBasis: '20%', value: JSON.parse(this.state.contributor['address']).complement },
                    {
                        column: 'state', label: 'Estado', type: 'select',
                        values: ["Acre", "Alagoas", "Amazonas", "Amapá", "Bahia", "Ceará", "Brasília", "Espírito Santo", "Goiás", "Maranhão", "Minas Gerais", "Mato Grosso do Sul", "Mato Grosso", "Pará", "Paraíba", "Pernambuco", "Piauí", "Paraná", "Rio de Janeiro", "Rio Grande do Norte", "Rondônia", "Roraima", "Rio Grande do Sul", "Santa Catarina", "Sergipe", "São Paulo", "Tocantins"],
                        value: JSON.parse(this.state.contributor['address']).state, flexBasis, flexGrow: 2, style: { minWidth: "192px" }
                    },
                    { column: 'city', label: 'Cidade', type: 'text', validate: { max: 100, required: true }, flexBasis, value: JSON.parse(this.state.contributor['address']).city },
                ]
            },
            {
                title: 'Contato',
                json: 'contact',
                fields: [
                    { column: 'contact1', label: 'Contato', type: 'text', mask: InputPhone, validate: { max: 15, required: true }, flexBasis: '20%', value: JSON.parse(this.state.contributor['contact']).contact1 },
                    { column: 'contact2', label: 'Contato alternativo', type: 'text', mask: InputPhone, validate: { max: 15 }, flexBasis: '20%', value: JSON.parse(this.state.contributor['contact']).contact2 },
                    { column: 'email', label: 'E-mail', type: 'email', validate: { max: 100 }, validateHandler: validaEmail, flexBasis: '20%', value: JSON.parse(this.state.contributor['contact']).email },
                ]
            },
            {
                title: 'Redes Sociais',
                json: 'contact',
                fields: [
                    { column: 'linkedin', label: 'Usuário do LinkedIn', type: 'text', validate: { max: 100, required: true }, flexBasis: '20%', value: JSON.parse(this.state.contributor['contact']).linkedin },
                    { column: 'facebook', label: 'Usuário do Facebook', type: 'text', validate: { max: 100, required: true }, flexBasis: '20%', value: JSON.parse(this.state.contributor['contact']).facebook },
                    { column: 'instagram', label: 'Usuário do Instagram', type: 'text', validate: { max: 100, required: true }, flexBasis: '20%', value: JSON.parse(this.state.contributor['contact']).instagram },
                ]
            }
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Typography variant="h6">
                        <HomeIcon />  <span>Editar / Colaboradores</span>
                    </Typography>
                </AppBar>
                {
                    <LForms forms={forms}
                        request={(data) => {request(this.state.contributor,data)}}
                        validate={(values) => { return validateFields(forms, values) }}
                    />
                }
                { this.state.contributor !== undefined &&
                    <Paper style={{ marginTop: 10, marginBottom: 10, padding: 15, height: 90 }}>
                        <div style={{ float: 'left', maxWidth: 350 }}>
                            <Typography variant="subtitle1" style={{ padding: 10 }}>
                                Data de Cadastro:  <b>{stringToaddDate(this.state.contributor.created_at, 'DD/MM/YYYY', { qtd: 1, period: 'days' })}</b>&nbsp;
                            </Typography>
                            <Typography variant="subtitle1" style={{ padding: 10 }}>
                                Última alteração:  <b>{stringToaddDate(this.state.contributor.updated_at, 'DD/MM/YYYY', { qtd: 1, period: 'days' })}</b>
                            </Typography>
                        </div>
                        <div style={{ float: 'left', maxWidth: 350 }}>
                            <Typography variant="subtitle1" style={{ padding: 10 }}>
                                Id:  <b>{this.state.contributor.id}</b>
                            </Typography>
                            <Typography variant="subtitle1" style={{ padding: 10 }}>
                                Usuário:  <b>{this.state.contributor.user.name}</b>
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
