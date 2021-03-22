import React, { Component, Fragment, useState, useRef, useEffect } from 'react'
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
import { postApiProviders, getApiProviders, getApiProviderTypes, getApiContributors } from '../../../providers/api'
import { validaEmail, validaCnpj, isFutureData } from '../../../providers/commonMethods'

import { InputCep, InputCnpj, InputPhone, InputDecimal } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';

import { withSnackbar  } from 'notistack';
import { TextInput } from 'react-native';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
const SelectInput = (props) => {
    const [value, setValue] = useState(props.value ?? "Selecione");
    const [error, setError] = useState(false);
    function handleChange(e) {
        const { value, id } = e.target;
        if (props.validate !== undefined) {
            if (props.validate(value)) {
                setError(false);
            } else {
                setError(true)
            }
        }
        props.onChange(e)
        console.log(e.target.value)
        setValue(e.target.value);
    }
    return (
        <FormControl id={props.column} style={{ ...props.style, marginTop: '25px' }}>
            <InputLabel id={props.column}>{props.label}</InputLabel>
            <Select size="small"
                labelId={props.id}
                id={props.id}
                name={props.name}
                value={value}
                error={error}
                placeholder="Selecione"
                //helperText={props.error ? props.helperText ?? "conteúdo inválido" : ""}
                onChange={handleChange}
                onBlur={handleChange}
            >
                <MenuItem key={`input-00`} value="Selecione">Selecione</MenuItem>
                {props.json ? (
                    props.values.map((val, ind) => {
                        return <MenuItem key={`input-${ind}`} value={val.id}>{val[props.valueLabel]}</MenuItem>
                    })
                ) : (
                    props.values.map((val, ind) => {
                        return <MenuItem key={`input-${ind}`} value={val}>{val}</MenuItem>
                    })
                )
                }

            </Select>
        </FormControl>)
}
const TypeEmpresaInput = (props) => {
    const [value, setValue] = useState(1);
    const [empresa, setEmpresa] = useState(1);
    const [error, setError] = useState(false);
    function handleChange(e) {
        const { value, id } = e.target;
        props.onChange(e) ?? undefined;
        console.log(e.target.value)
        setValue(e.target.value);
    }
    return (<div>
        <SelectInput valueLabel="value" json={true} value={value} helperText={props.helperText ?? ""} key={`input-${15000}`} id={"type"} label={"Empresa"} name={"type"} values={[{id:1, value: 'Matriz'},{id:2, value: 'Filial'} ]} style={{flexBasis: window.innerWidth < 768 ? '100%' : props.flexBasis }} onChange={(e) => handleChange(e)} />
        {value == 2 &&
        <SelectInput valueLabel={props.valueLabel} json={props.json} value={props.value ?? undefined} helperText={props.helperText ?? ""} key={`input-${15001}`} id={props.column} label={props.label} name={props.column} values={props.values} style={{flexBasis: window.innerWidth < 768 ? '100%' : props.flexBasis }} onChange={(e) => props.onChange(e) ?? undefined} />
    }</div>)
}

class CreateProviders extends Component {
    
    state = {
        data: [],
        fields: {},
        providertypes: [],
        contributors: [],
        states: []
    }
    async componentDidMount() {
        const data = await getApiProviders({type: "Matriz", active: 1});
        const contributors = await getApiContributors({active: 1});
        const providertypes = await getApiProviderTypes();
        this.setState({
            ...this.state, 
            data: data.data, 
            contributors: contributors.data,
            providertypes: providertypes.data
        });
        localStorage.setItem("sessionTime", 900);

    }
    onChange(e){
        this.setState({...this.state, fields: e});
        console.log(this.state.fields);
        console.log(this.state.fields['type'] == 1);
    }
    render() {
        //console.log(this.state.data)
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
                            
                            if(v1.validate.decimal !== undefined){
                                if (/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/.test(value) == false)
                                    campo = {id: v1.column, message: `O Campo ${v1.label} é somente números e ponto ` }
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
                                if(value == "Selecione"){
                                    campo = {id: v1.column, message: `O Campo ${v1.label} é inválido ` }
                                }
                                if (value.length == 0)
                                    campo = {id: v1.column, message: `O Campo ${v1.label} é obrigatório` };
                            }
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
                    { column: 'active', label: 'Ativo', type: 'checkbox',  value: 1, disabled: true, flexBasis : "100%" },
                    {
                        column: 'providertype_id', label: 'Tipo Fornecedor', type: 'select',
                        json: true, 
                        valueLabel: "name",
                        values: this.state.providertypes,//[{id: 1, value: "Farmácia"},{id: 2, value: "Loja"}],
                        validate: {required: true },
                        value: "Selecione",
                        flexBasis
                    },
                    {
                        column: 'matriz_id', 
                        label: 'Matriz', 
                        type: 'custom',
                        json: true, 
                        valueLabel: "fantasy_name",
                        values: this.state.data,//[{id: 1, value: "Farmácia"},{id: 2, value: "Loja"}],
                        flexBasis,
                        component: TypeEmpresaInput},
                    { column: 'cnpj', label: 'CNPJ', type: 'text', mask: InputCnpj, validate: {min: 11, number: true, required: true},validateHandler: validaCnpj, flexBasis: '33%', helperText: "o valor digitado é inválido" },
                    { column: 'company_name', label: 'Razão Social', type: 'text', validate: {max: 50, required: true}, flexBasis },
                    { column: 'fantasy_name', label: 'Nome Fantasia', type: 'text', validate: {max: 50, required: true}, flexBasis:'33%' },
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
                    { column: 'addr_clone', label: 'Clonar Matriz', disabled: this.state.fields['type'] == 1, type: 'checkbox', flexBasis : "100%" },
                    
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
                    { column: 'contact_clone', label: 'Clonar Matriz', disabled: this.state.fields['type'] == 1, type: 'checkbox', flexBasis : "100%" },
                    { column: 'phone1', label: 'Contato', type: 'text', mask: InputPhone, validate: {max: 15, required: true}, flexBasis: '20%' },
                    { column: 'phone2', label: 'Contato alternativo', type: 'text', mask: InputPhone, validate: {max: 15}, flexBasis: '20%' },
                    { column: 'email', label: 'E-mail', type: 'email', validate: {max: 100}, validateHandler: validaEmail, flexBasis: '20%' },
                    { column: 'site', label: 'Site', type: 'text', validate: {max: 100}, flexBasis: '20%' },
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
                    { column: 'contract_clone', label: 'Clonar Matriz', disabled: this.state.fields['type'] == 1, type: 'checkbox', flexBasis : "100%" },
                    { column: 'accession_date', label: 'Data de Adesão - Início', type: 'date', validate: {required: true}, flexBasis: '20%' },
                    { column: 'end_date', label: 'Data de Adesão - Fim', type: 'date', validate: {required: true}, flexBasis: '20%' },
                    { 
                        column: 'contributor_id', 
                        label: 'Vendedor', 
                        type: 'select',
                        validate:{required: true}, 
                        json: true,
                        valueLabel: 'name',
                        values: this.state.contributors,
                        flexBasis: '20%'
                    },
                    { column: 'rate', label: 'Taxa de Adesão', type: 'number', mask: InputDecimal, validate: {decimal: true, required: true}, flexBasis: '20%' },
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
                    onChange={(e) => {this.onChange(e)}}
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
