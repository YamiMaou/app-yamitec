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
import { postApiProviders, getApiProviders, getApiDownloadFile } from '../../../providers/api'
import { validaEmail, validaCnpj, isFutureData } from '../../../providers/commonMethods'

import { InputCep, InputCnpj, InputPhone } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';

import { withSnackbar  } from 'notistack';
class CreateProviders extends Component {
    
    state = {
        data: [],
        states: []
    }
    async componentDidMount() {
        const data = await getApiProviders({type: "Matriz", active: 1});
        this.setState({...this.state, data: data.data});
        localStorage.setItem("sessionTime", 900);

    }

    render() {
        console.log(this.state.data)
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

            let response = await postApiProviders(data);
            //console.log(response);
            if (response.data.success) {
                //this.props.enqueueSnackbar( response.data.message, { variant: 'success' });
                this.props.setSnackbar({ open: true, message: response.data.message });
                this.setState({ ...this.state, loading: false });
                //this.props.history.goBack();
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
                    messages = 'Houve um problema em sua requisição!'
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
                                if (/^[-]?\d+$/.test(value) == false)
                                    campo = {id: v1.column, message: `O Campo ${v1.label} é somente números ` }
                            }

                            if (v1.validate.max !== undefined) {
                                if (value.length > v1.validate.max)
                                    campo = {id: v1.column, message: `O Campo ${v1.label}, tamanho máximo de ${v1.validate.max} caracteres exêdido` };
                            }

                            if (v1.validate.min !== undefined) {
                                if (value.length < v1.validate.min)
                                    campo = {id: v1.column, message: `O Campo ${v1.label}, tamanho minimo de ${v1.validate.min} caracteres.` };
                            }

                            if (v1.validate.required !== undefined) {
                                if (value.length == 0)
                                    campo = {id: v1.column, message: `O Campo ${v1.label} é obrigatório` };
                            }
                        }
                        if(value == "Selecione"){
                            campo = {id: v1.column, message: `O Campo ${v1.label} é inválido ` }
                        }
                        if(v1.validateHandler !== undefined){
                            if (v1.validateHandler(value) == false)
                                    campo = {id: v1.column, message: `O Campo ${v1.label}  é inválido ` }
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
                    { column: 'active', label: 'Ativo', type: 'checkbox',  value: 1, disabled: true, flexBasis : "20%" },
                    {
                        column: 'type', label: 'Tipo Fornecedor', type: 'select',
                        values: [
                            "Matriz",
                            "Filial", 
                        ],
                        validate: {required: true },
                        //value: "Coordenador de usuários",
                        flexBasis
                    },
                    {
                        column: 'provider_id', label: 'Empresa', type: 'select',
                        json: true,
                        values: this.state.data,
                        //validate: {required: true },
                        //value: "Coordenador de usuários",
                        flexBasis, style:{width: '220px'}
                    },
                    {
                        column: 'matriz', label: 'Matriz', type: 'select',
                        values: [
                            "Sim",
                            "Não", 
                        ],
                        validate: {required: true },
                        //value: "Coordenador de usuários",
                        flexBasis, style:{width: '220px'}
                    },
                    { column: 'cnpj', label: 'CNPJ', type: 'text', mask: InputCnpj, validate: {min: 11, number: true, required: true},validateHandler: validaCnpj, flexBasis: '12%', helperText: "o valor digitado é inválido" },
                    { column: 'company_name', label: 'Razão Social', type: 'text', validate: {max: 50, required: true}, flexBasis },
                    { column: 'fantasy_name', label: 'Nome Fantasia', type: 'text', validate: {max: 50, required: true}, flexBasis },
                    { column: 'anexo', label: 'Documento', type: 'file', flexBasis },
                    { column: 'logo', label: 'Logo marca', type: 'file', validate: {required: true}, flexBasis },
                    //
                    //{ column: 'created_at', label: 'Data', type: 'date' },
                ]
            },
            {
                id: 'addr',
                title: 'Endereço',
                //flexFlow: 'row no-wrap',
                //json: "address",
                fields: [
                    {
                        column: 'zipcode', label: 'CEP', type: 'text', mask: InputCep, validate: {max: 9, required: true}, flexBasis: '9%',
                        //handle: getAddress 
                    },
                    { column: 'street', label: 'Endereço', validate: {max: 100, required: true}, type: 'text', flexBasis },
                    { column: 'additional', label: 'Complemento', type: 'text', flexBasis },
                    {
                        column: 'uf', label: 'Estado', type: 'select',
                        validate: {required: true },
                        values: ["Acre", "Alagoas", "Amazonas", "Amapá", "Bahia", "Ceará", "Brasília", "Espírito Santo", "Goiás", "Maranhão", "Minas Gerais", "Mato Grosso do Sul", "Mato Grosso", "Pará", "Paraíba", "Pernambuco", "Piauí", "Paraná", "Rio de Janeiro", "Rio Grande do Norte", "Rondônia", "Roraima", "Rio Grande do Sul", "Santa Catarina", "Sergipe", "São Paulo", "Tocantins"],
                        flexBasis, style:{minWidth: "192px"}
                    },
                    { column: 'city', label: 'Cidade', type: 'text', validate: {max: 100, required: true}, flexBasis },
                ]
            },
            {
                title: 'Contato',
                //json: 'contact',
                fields: [
                    { column: 'phone1', label: 'Contato', type: 'text', mask: InputPhone, validate: {max: 15, required: true}, flexBasis: '20%' },
                    { column: 'phone2', label: 'Contato alternativo', type: 'text', mask: InputPhone, validate: {max: 15}, flexBasis: '20%' },
                    { column: 'email', label: 'E-mail', type: 'email', validate: {max: 100}, validateHandler: validaEmail, flexBasis: '20%' },
                ]
            },
            {
                title: 'Redes Sociais',
                //json: 'contact',
                fields: [
                    { column: 'linkedin', label: 'Usuário do LinkedIn', type: 'text', validate: {max: 100, required: true}, flexBasis: '20%' },
                    { column: 'facebook', label: 'Usuário do Facebook', type: 'text', validate: {max: 100, required: true}, flexBasis: '20%' },
                    { column: 'instagram', label: 'Usuário do Instagram', type: 'text', validate: {max: 100, required: true}, flexBasis: '20%' },
                ]
            },
            {
                title: 'Contrato Atual',
                //json: 'contact',
                fields: [
                    { column: 'accession_date', label: 'Data de Adesão - Início', type: 'date', validate: {required: true}, flexBasis: '20%' },
                    { column: 'end_date', label: 'Data de Adesão - Fim', type: 'date', validate: {required: true}, flexBasis: '20%' },
                    { column: 'rate', label: 'Taxa de Adesão', type: 'number', validate: {required: true}, flexBasis: '20%' },
                ]
            }
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Typography variant="h6">
                        <HomeIcon />  <span>Cadastro / Fornecedores</span>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProviders))
