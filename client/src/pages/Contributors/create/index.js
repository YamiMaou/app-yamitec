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
import { postApiContributors, getAddressByCepla } from '../../../providers/api'
import { validaEmail, validaCpf, stringToDate } from '../../../providers/commonMethods'

import { InputCep, InputCpf, InputPhone } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';
class CreateContributors extends Component {
    state = {
        contributors: [],
        states: []
    }
    async componentDidMount() {


    }

    render() {
        const closeSnack = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            this.props.setSnackbar({ open: false, message: "" });
        };
        const flexBasis = '30%';
        const request = async (data) => {
            this.props.setSnackbar({ open: true, message: "Validando Dados, Aguarde ..." })

            //data.address = JSON.stringify(data.address);
            //data.contact = JSON.stringify(data.contact);
            data.active = data.active == 'Ativo' ? 1 : 0;
            let response = await postApiContributors(data);
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
            //console.log(fields);
            let campo = undefined;
            fields.reverse().map((v,k) => {
                v.fields.reverse().map((v1,k1)=>{
                        let value = values[v1.column];
                        if (v1.validate !== undefined) {
                            if (v1.validate.number !== undefined) {
                                if (/^[-]?\d+$/.test(value) == false)
                                    campo = {id: v1.column, message: `o campo ${v1.label} é somente números ` }
                            }

                            if (v1.validate.max !== undefined) {
                                if (value.length > v1.validate.max)
                                    campo = {id: v1.column, message: `o campo ${v1.label}, tamanho máximo de ${v1.validate.max} caracteres exêdido` };
                            }

                            if (v1.validate.min !== undefined) {
                                if (value.length < v1.validate.min)
                                    campo = {id: v1.column, message: `o campo ${v1.label}, tamanho minimo de ${v1.validate.min} caracteres.` };
                            }

                            if (v1.validate.required !== undefined) {
                                if (value.length == 0)
                                    campo = {id: v1.column, message: `o campo ${v1.label} obrigatório` };
                            }
                        }
                        if(v1.validateHandler !== undefined){
                            if (v1.validateHandler(value) == false)
                                    campo = {id: v1.column, message: `O Campo ${v1.label} não possui um conteúdo é válido ` }
                        }
                    })
                })
                //console.log(campo)
                campo !== undefined ? this.props.setSnackbar({ open: true, message: campo.message }) : '';

                return campo === undefined ? true : false
        }
        const forms = [
            {
                title: 'Dados Básicos',
                fields: [
                    { column: 'cpf', label: 'CPF', type: 'text', mask: InputCpf, validate: {min: 11, number: true, required: true},validateHandler: validaCpf, flexBasis: '20%', helperText: "o valor digitado é inválido" },
                    { column: 'name', label: 'Nome', type: 'text', validate: {max: 50, required: true}, flexBasis },
                    { column: 'birthdate', label: 'Data de Nascimento', type: 'date', validate: {required: true},flexBasis, style:{maxWidth: '160px'} },
                    { column: 'anexo', label: 'Anexar Documento', type: 'file', flexBasis:'15%', style:{maxWidth: '160px'} },
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
                        value: "Coordenador de usuários",
                        flexBasis
                    },
                    //
                    { column: 'active', label: 'Situação', type: 'select', values: ["Ativo", "Inativo"], value: "Ativo", flexBasis },
                    //{ column: 'created_at', label: 'Data', type: 'date' },
                ]
            },
            {
                id: 'addr',
                title: 'Endereço',
                flexFlow: 'row no-wrap',
                json: "address",
                fields: [
                    {
                        column: 'cep', label: 'CEP', type: 'text', mask: InputCep, validate: {max: 9, required: true}, flexBasis: '10%',
                        //handle: getAddress 
                    },
                    { column: 'street', label: 'Endereço', validate: {max: 100, required: true}, type: 'text', flexBasis },
                    { column: 'complement', label: 'Complemento', type: 'text', flexBasis: '20%' },
                    {
                        column: 'state', label: 'Estado', type: 'select',
                        values: ["Acre", "Alagoas", "Amazonas", "Amapá", "Bahia", "Ceará", "Brasília", "Espírito Santo", "Goiás", "Maranhão", "Minas Gerais", "Mato Grosso do Sul", "Mato Grosso", "Pará", "Paraíba", "Pernambuco", "Piauí", "Paraná", "Rio de Janeiro", "Rio Grande do Norte", "Rondônia", "Roraima", "Rio Grande do Sul", "Santa Catarina", "Sergipe", "São Paulo", "Tocantins"],
                        value: "São Paulo", flexBasis, flexGrow: 2, style:{minWidth: "192px"}
                    },
                    { column: 'city', label: 'Cidade', type: 'text', validate: {max: 100, required: true}, flexBasis },
                ]
            },
            {
                title: 'Contato',
                json: 'contact',
                fields: [
                    { column: 'contact1', label: 'Contato', type: 'text', mask: InputPhone, validate: {max: 15, required: true}, flexBasis: '20%' },
                    { column: 'contact2', label: 'Contato alternativo', type: 'text', mask: InputPhone, validate: {max: 15}, flexBasis: '20%' },
                    { column: 'email', label: 'E-mail', type: 'email', validate: {max: 100}, validateHandler: validaEmail, flexBasis: '20%' },
                ]
            },
            {
                title: 'Redes Sociais',
                json: 'contact',
                fields: [
                    { column: 'linkedin', label: 'Usuário do LinkedIn', type: 'text', validate: {max: 100, required: true}, flexBasis: '20%' },
                    { column: 'facebook', label: 'Usuário do Facebook', type: 'text', validate: {max: 100, required: true}, flexBasis: '20%' },
                    { column: 'instagram', label: 'Usuário do Instagram', type: 'text', validate: {max: 100, required: true}, flexBasis: '20%' },
                ]
            }
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Typography variant="h6">
                        <HomeIcon />  <span>Cadastro / Colaboradores</span>
                    </Typography>
                </AppBar>
                <LForms forms={forms}
                    request={request} 
                    validate={(values) => { return validateFields(forms,values)}}
                />
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.props.snackbar.open}
                    onClose={closeSnack}
                    autoHideDuration={3000}
                    message={this.props.snackbar.message}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateContributors))
