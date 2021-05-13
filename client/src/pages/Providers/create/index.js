import React, { Component, Fragment, useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { withRouter } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import HomeIcon from '@material-ui/icons/Home';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid, RowsProp, ColDef} from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from '../../../providers/langs/datagrid';
import LForms from '../../../components/Forms';
import TextField from '@material-ui/core/TextField';
//
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
//
import { setSnackbar } from '../../../actions/appActions'
import { postApiProviders, getApiProviders, getApiProviderTypes, getApiManagers, getApiContributors } from '../../../providers/api'
import { validaEmail, validaCnpj, isFutureData } from '../../../providers/commonMethods'

import { InputCep, InputCnpj, InputPhone, InputDecimal, stringCpf, stringCnpj } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';

import { withSnackbar  } from 'notistack';
import { TextInput } from 'react-native';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { CardActions, CircularProgress, List, ListItem, ListItemText } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

// MODULE ID
const module_id = 4
const AutocompleteMatriz = (props) => {
  
    const [value, setValue] = React.useState(props.value ? props.values.find((item) => item.id == props.value) : undefined);
    const [inputValue, setInputValue] = React.useState('');
    const [defaultVal, setDefault] = useState(props.value ? props.values.find((item) => item.id == props.value) : undefined);
      useEffect(() => {
          if(props.value !== defaultVal){
              const vl = props.value ? props.values.find((item) => item.id == props.value) : undefined;
              if(vl !== undefined){
                console.log(vl);
                setValue(vl);
                setInputValue(vl !== undefined ? vl[props.valueLabel] : "");
              }
          }
      })
  
    function handleChange(e, newValue) {
        const { val } = e.target;
        let vl = { target: { id: 'contributors_id', value: newValue ? newValue.id : "" } }
        props.onChange(vl)
      if (props.validate !== undefined) {
          if (props.validate(val)) {
              setError(false);
          } else {
              setError(true)
          }
      }
        props.onChange(vl)
        console.log(vl);
        setValue(newValue);
      }
    return <Autocomplete
          key={`autocomplete-${props.id}`}
          id={props.id}
          disabled={props.disabled ?? false}
          name={props.name}
          value={value}
          inputValue={inputValue}
          onChange={handleChange}
          getOptionSelected={(option, value) => {
              if(option.id == value.id){
                  setInputValue(value[props.valueLabel])
              }
              
              return option.id == value.id
          }}
          getOptionLabel={(option) => option[props.valueLabel]}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={props.values}
          style={props.style}
          renderInput={(params) => <TextField {...params} 
          label={props.label} 
           />}
        />;
  }
  
const SelectMatriz = (props) => {
    const [value, setValue] = useState(props.value ?? "Selecione");
    const [error, setError] = useState(false);
    const [defaultVal, setDefault] = useState(props.value ?? "Selecione");
    useEffect(() => {
        if(props.value !== defaultVal){
            setValue(props.value ?? "Selecione")
        }
    })

    function handleChange(e) {
        const { val, id } = e.target;
        if (props.validate !== undefined) {
            if (props.validate(val)) {
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
                disabled={props.disabled ?? false}
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
const MaskedDecimalInput = (props) => {
    const [value1, setValue] = useState(props.value ?? undefined);
    const [error, setError] = useState(false);
    function getMoney( str )
    {
        return parseInt( str.replace(/[\D]+/g,'') );
    }

    function formatReal( int )
    {
        var tmp = int+'';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6 )
             tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        return tmp;
    }

    function handleChange(e) {
        //const { value, id } = e.target;
        let val = e.target.value;
        props.onChange(e) ?? undefined;
        setValue(formatReal(getMoney(val)));
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
    )
}

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
        e.target.id = e.target.name;
        props.onChange(e)
        setValue(e.target.value);
    }
    return (
        <FormControl id={props.column} style={{ ...props.style, marginTop: '25px'}}>
            <InputLabel id={props.column}>{props.label}</InputLabel>
            <Select size="small"
                labelId={props.id}
                id={props.name}
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
    const [value, setValue] = useState(props.value ?? "Selecione");
    const [value1, setValue1] = useState(props.value ?? "Selecione");
    function handleChange(e) {
        const { value, id } = e.target;
        props.onChange(e);
        setValue(e.target.value);
    }
    async function handleChange1(e) {
        const { value, id } = e.target;
        try{
            await props.handler(value);
        }catch(e){
            console.error(e);
        }
        console.log(e.target);
        console.log(`${e.target.id} - ${e.target.value}`)
        props.onChange(e);
        setValue1(e.target.value);
    }
    return (<div style={{flexBasis: props.style.flexBasis, marginRight: 5}}>
        <SelectInput valueLabel="value" json={true} value={value} helperText={props.helperText ?? ""} key={`input-${15000}`} id={"type"} label={"Empresa"} name={"type"} values={[{id:1, value: 'Matriz'},{id:2, value: 'Filial'} ]} style={{flexBasis: window.innerWidth < 768 ? '100%' : '50%', minWidth: value == 2 ? '45%' : '90%'}} onChange={handleChange} />
        {value == 2 &&
        <SelectInput valueLabel={props.valueLabel} json={props.json} value={value1} helperText={props.helperText ?? ""} key={`input-${15001}`} id={"matriz_id"} label={props.label} name={"matriz_id"} values={props.values} style={{flexBasis: window.innerWidth < 768 ? '100%' : '50%', minWidth: '45%', marginLeft: 10 }} onChange={handleChange1} />
    }</div>)
}

class CreateProviders extends Component {
    
    state = {
        filter: ['flex'],
        data: [],
        fields: {},
        providertypes: [],
        contributors: [],
        managers: [],
        providers: [],
        filials: [],
        provider: undefined,
        manager: 0,
        provProviders: [],
        provManagers: [],
        provProvidersLoading: false,
        provManagerLoading: false,
        states: []
    }
    async componentDidMount() {
        const data = await getApiProviders({type: 1, active: 1, pageSize: 9999 });
        const contributors = await getApiContributors({active: 1, pageSize: 9999 });
        const managers = await getApiManagers({ active: 1, pageSize: 9999 });
        const providertypes = await getApiProviderTypes({pageSize: 9999});
        const providers = await getApiProviders({pageSize: 9999});
        const filials = await getApiProviders({type: 2, active: 1, pageSize: 9999 });
        this.setState({
            ...this.state, 
            matrizData: undefined,
            data: data.data, 
            contributors: contributors.data,
            managers: managers.data, 
            providertypes: providertypes.data,
            providers: providers.data,
            filials: filials.data
        });
        localStorage.setItem("sessionTime", 900);

    }
    onChange(e){
        this.setState({...this.state, fields: e});
    }
    render() {
        //console.log(this.state.data)
         // to use snackbar Provider
         const setProviders = async () => {
             try{
                let provProviders = this.state.provProviders;
                
                console.log(this.state.provider)
                if(this.state.provider != 'Selecione' && provProviders !== undefined ){
                    this.setState({...this.state, provProvidersLoading: false});
                    if(provProviders.find(x => x.id === this.state.provider)){
                        this.props.setSnackbar({ open: true, message: 'Filial já associado.' });
                        return false;
                    }
                    this.setState({...this.state, provProviders: undefined});
                    const prov = await getApiProviders({}, this.state.provider);
                    provProviders.push(prov);
                    this.setState({...this.state, provProviders, provProvidersLoading: false});
                }
            }catch(err){
                console.log(err);
            }
        }

        const setManagers = async () => {
            let provManagers = this.state.provManagers;
            
            console.log(this.state.provider)
            if(this.state.manager != 'Selecione' && provManagers !== undefined ){
                this.setState({...this.state, provProvManagersLoading: false});
                if(provManagers.find(x => x.id === this.state.manager)){
                    this.props.setSnackbar({ open: true, message: 'Responsável já associado.' });
                    return false;
                }
                this.setState({...this.state, provManagers: undefined});
                const prov = await getApiManagers({}, this.state.manager);
                provManagers.push(prov);
                this.setState({...this.state, provManagers, provProvManagersLoading: false});
            }
        }
        
        const request = async (data) => {
            this.props.setSnackbar({ open: true, message: "Validando Dados, Aguarde ...", });
            let providers = [];
            let managers = [];
            this.state.provManagers.map(values => {
                managers.push(values.id);
            });
            this.state.provProviders.map(values => {
                providers.push(values.id);
            });
            if(managers.length == 0){
                this.props.setSnackbar({ open: true, message: "Você deve manter pelo menos 1 Responsável vinculado"});
                return false;
            }
            data.providers = providers;
            data.managers = managers;
            //data.rate = data.rate.replace(/\./g,'').replace(',', '.');
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
            console.log(values);
            let campo = undefined;
            fields.reverse().map((v,k) => {
                v.fields.reverse().map((v1,k1)=>{
                        let value = values[v1.column];
                        if (v1.validate !== undefined) {
                            if (v1.validate.number !== undefined) {
                                if (/^[-]?\d+$/.test(value) == false)
                                    campo = {id: v1.column, message: `O Campo ${v1.label} é somente números ` }
                            }
                            
                            /*if(v1.validate.decimal !== undefined){
                                if (/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/.test(value) == false)
                                    campo = {id: v1.column, message: `O Campo ${v1.label} é somente números e ponto ` }
                            }*/

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
                    { column: 'cnpj', label: 'CNPJ', type: 'text', mask: InputCnpj, validate: {min: 11, number: true, required: true},validateHandler: validaCnpj, flexBasis: '20%', helperText: "o valor digitado é inválido" },
                    {
                        column: 'providertype_id', label: 'Tipo Fornecedor', type: 'select',
                        json: true, 
                        valueLabel: "name",
                        values: this.state.providertypes,//[{id: 1, value: "Farmácia"},{id: 2, value: "Loja"}],
                        validate: {required: true },
                        value: "Selecione",
                        flexBasis:'20%'
                    },
                    {
                        column: 'matriz_id', 
                        label: 'Matriz', 
                        type: 'custom',
                        json: true, 
                        valueLabel: "company_name",
                        values: this.state.fields['providertype_id'] == undefined ? [] : this.state.providers.filter(x => x.providertype_id == this.state.fields['providertype_id']),
                        flexBasis:'35%',
                        component: TypeEmpresaInput,
                        handler: async (id) => {
                            let matrizData = await getApiProviders({},id);
                            let fields = this.state.fields;
                            Object.entries(matrizData.addresses)
                                .map(([key, val]) => {
                                    fields[key] = val
                            });
                            Object.entries(matrizData.contacts)
                                .map(([key, val]) => {
                                    fields[key] = val
                            });
                            Object.entries(matrizData.contracts)
                                .map(([key, val]) => {
                                    fields[key] = val
                            });
                            
                            this.setState({...this.state, fields, matrizData});
                            console.log(this.state.fields);
                        }
                    },
                    { column: 'company_name', label: 'Razão Social', type: 'text', validate: {max: 50, required: true}, flexBasis:'25%' },
                    { column: 'fantasy_name', label: 'Nome Fantasia', type: 'text', validate: {max: 50, required: true}, flexBasis:'25%' },
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
                        column: 'zipcode', 
                        label: 'CEP', type: 'text',
                        disabled: (this.state.fields['addr_clone'] == 1), 
                        value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1) ? this.state.fields['zipcode'] : "",
                        mask: InputCep, validate: {max: 9, required: true}, 
                        flexBasis: '9%',
                        //handle: getAddress 
                    },
                    { column: 'street', value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1) ? this.state.fields['street'] : "", label: 'Endereço',disabled: (this.state.fields['addr_clone'] == 1), validate: {max: 100, required: true}, type: 'text', flexBasis },
                    { column: 'additional',value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1) ? this.state.fields['additional'] : "", label: 'Complemento',disabled: (this.state.fields['addr_clone'] == 1), validate: {max: 20}, type: 'text', flexBasis },
                    {
                        column: 'uf', label: 'Estado', type: 'custom',
                        component: SelectMatriz,
                        validate: {required: true },disabled: (this.state.fields['addr_clone'] == 1),
                        values: ["Acre", "Alagoas", "Amazonas", "Amapá", "Bahia", "Ceará", "Brasília", "Espírito Santo", "Goiás", "Maranhão", "Minas Gerais", "Mato Grosso do Sul", "Mato Grosso", "Pará", "Paraíba", "Pernambuco", "Piauí", "Paraná", "Rio de Janeiro", "Rio Grande do Norte", "Rondônia", "Roraima", "Rio Grande do Sul", "Santa Catarina", "Sergipe", "São Paulo", "Tocantins"],
                        flexBasis, style:{minWidth: "192px"},
                        value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1) ? this.state.fields['uf'] : "",
                    },
                    { column: 'city', value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1) ? this.state.fields['city'] : "",disabled: (this.state.fields['addr_clone'] == 1), label: 'Cidade', type: 'text', validate: {max: 100, required: true}, flexBasis },
                ]
            },
            {
                title: 'Contato',
                //json: 'contact',
                fields: [
                    { column: 'contact_clone', label: 'Clonar Matriz', disabled: this.state.fields['type'] == 1, type: 'checkbox', flexBasis : "100%" },
                    { column: 'phone1', label: 'Contato', type: 'text', value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1) ? this.state.fields['phone1'] : "", disabled: (this.state.fields['contact_clone'] == 1 ? true : false), mask: InputPhone, validate: {max: 15, required: true}, flexBasis: '20%' },
                    { column: 'phone2', label: 'Contato alternativo', type: 'text',  value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1) ? this.state.fields['phone2'] : "",disabled: (this.state.fields['contact_clone'] == 1 ? true : false), mask: InputPhone, validate: {max: 15}, flexBasis: '20%' },
                    { column: 'email', label: 'E-mail', type: 'email', value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1) ? this.state.fields['email'] : "", disabled: (this.state.fields['contact_clone'] == 1 ? true : false), validate: {max: 100}, validateHandler: validaEmail, flexBasis: '20%' },
                    { column: 'site', label: 'Site', type: 'text', value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1) ? this.state.fields['site'] : "", disabled: (this.state.fields['contact_clone'] == 1 ? true : false), validate: {max: 100}, flexBasis: '20%' },
                ]
            },
            {
                title: 'Redes Sociais',
                //json: 'contact',
                fields: [
                    { column: 'linkedin', label: 'Usuário do LinkedIn', disabled: (this.state.fields['contact_clone'] == 1 ? true : false), type: 'text', value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1) ? this.state.fields['linkedin'] : "", validate: {max: 100, required: true}, flexBasis: '20%' },
                    { column: 'facebook', label: 'Usuário do Facebook', disabled: (this.state.fields['contact_clone'] == 1 ? true : false), type: 'text', value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1) ? this.state.fields['facebook'] : "", validate: {max: 100, required: true}, flexBasis: '20%' },
                    { column: 'instagram', label: 'Usuário do Instagram', disabled: (this.state.fields['contact_clone'] == 1 ? true : false), type: 'text', value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1) ? this.state.fields['instagram'] : "", validate: {max: 100, required: true}, flexBasis: '20%' },
                ]
            },
            {
                title: 'Contrato Atual',
                //json: 'contact',
                fields: [
                    { column: 'contract_clone', label: 'Clonar Matriz', disabled: this.state.fields['type'] == 1, type: 'checkbox', flexBasis : "100%" },
                    { column: 'accession_date', value: (this.state.fields['type'] == 2 && this.state.fields['contract_clone'] == 1) ? this.state.fields['accession_date'] : "",label: 'Data de Adesão - Início', disabled: (this.state.fields['contract_clone'] == 1), type: 'date', validate: {required: true}, flexBasis: '20%' },
                    { column: 'end_date', value: (this.state.fields['type'] == 2 && this.state.fields['contract_clone'] == 1) ? this.state.fields['end_date'] : "", label: 'Data de Adesão - Fim', disabled: (this.state.fields['contract_clone'] == 1), type: 'date', validate: {required: true}, flexBasis: '20%' },
                    { 
                        column: 'contributors_id', 
                        label: 'Vendedor', 
                        type: 'custom',
                        component: AutocompleteMatriz,
                        validate:{required: true}, 
                        json: true,
                        valueLabel: 'name',
                        values: this.state.contributors,
                        value: (this.state.fields['type'] == 2 && this.state.fields['contract_clone'] == 1) ? this.state.fields['contributors_id'] : "",
                        flexBasis: '20%', disabled: (this.state.fields['contract_clone'] == 1)
                    },
                    { column: 'rate', value: (this.state.fields['type'] == 2 && this.state.fields['contract_clone'] == 1) ? this.state.fields['rate'] : "", label: 'Taxa de Adesão', type: 'decimal', disabled: (this.state.fields['contract_clone'] == 1), validate: {decimal: true, required: true}, flexBasis: '20%' },
                ]
            }
        ]

        //
        const rows =  (this.state.provManagers !== undefined) ? this.state.provManagers : [];
        const columns = [
            {
                field: 'cpf', headerName: 'CPF', flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    return stringCpf(params.value);
                }
            },
            { field: 'name', headerName: 'Nome', flex: 2 },
            { field: 'function', headerName: 'Função', flex: 1 },
            {
                field: 'active',
                headerName: 'Situação',
                flex: 0.5,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value === 1 ? "Ativo" : "Inativo"
                }
            }, {
                field: 'id',
                headerName: 'Ações',
                flex: 1,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    //let view = this.state.session.permissions.find(x => x.module === module_id)
                    return (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={async (e) => {
                                    try{
                                            let provManagers = this.state.provManagers;
                                            await getApiProviders({}, 1);
                                            let index = provManagers.findIndex(x => x.id == params.row.id)
                                            this.setState({...this.state, provManagers: undefined});
                                            provManagers.splice(index,1)
                                            this.setState({...this.state, provManagers });
                                            // console.log(this.state.provManagers)
                                        //if(this.state.provManagers.length > 1){
                                            //await deleteApiManagersProviders({provider_id: this.props.match.params.id, manager_id: params.row.id });
                                            //const data = await getApiProviders({}, this.props.match.params.id);
                                            //this.setState({...this.state, provManagers: data.managers});
                                        /*}else{
                                            this.props.setSnackbar({ open: true, message: "Você deve manter pelo menos 1 registro" })
                                        }*/
                                       
                                    }catch(err){
                                        console.log(err)
                                    };
                                    
                                }}
                                style={{ marginLeft: 16 }}
                            >
                               <DeleteForeverIcon fontSize="small" />
                            </Button>
                        </div>
                    )
                },
            },
        ];
        // Providers Grid
        const rowsProv: RowsProp = (this.state.provProviders !== undefined) ? this.state.provProviders : [];
        const columnsProv: ColDef[] = [
            {
                field: 'company_name', headerName: 'Farmácia', flex: 1.2, row:true,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.row.company_name +" - "+ stringCnpj(params.row.cnpj ?? '00000000000000');
                }
            },
           { 
            field: 'phone1', headerName: 'Telefone', flex: 0.7, row: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    //let provider = this.state.providers.filter(prov => prov.id === params.row.id); 
                    //console.log(params.row)
                    return params.row.contacts ? params.row.contacts.phone1 : '-';
                }
            },
            { 
                field: 'email', headerName: 'E-mail',flex: 0.7, row: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    //let provider = this.state.providers.filter(prov => prov.id === params.row.id); 
                    //console.log(provider)
                    return params.row.contacts ? params.row.contacts.email : '';
                }
            },
            { 
                field: 'type', headerName: 'Tipo', flex: 0.7, row: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.row.type === 1 ? "Matriz" : "Filial"
                } 
            }, 
            {
                field: 'id',
                headerName: 'Ações',
                flex: 1,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    //let view = this.state.session.permissions.find(x => x.module === module_id)
                    return (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={async (e) => {
                                    try {
                                        //if(this.state.provManagers.length > 1){
                                            let provProviders = this.state.provProviders;
                                            await getApiProviders({}, 1);
                                            let index = provProviders.findIndex(x => x.id == params.row.id)
                                            this.setState({...this.state, provProviders: undefined});
                                            provProviders.splice(index,1)
                                            this.setState({...this.state, provProviders });
                                            console.log(this.state.provProviders)
                                        /*}else{
                                            this.props.setSnackbar({ open: true, message: "Você deve manter pelo menos 1 registro" })
                                        }*/

                                        
                                    } catch (err) {
                                        console.log(err)
                                    };
                                }}
                                style={{ marginLeft: 16 }}
                            >
                                <DeleteForeverIcon fontSize="small" />
                            </Button>
                        </div>
                    )
                },
            },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Typography variant="h6">
                        <HomeIcon />  <span>Cadastro / Fornecedores</span>
                    </Typography>
                </AppBar>
                {this.state.fields == undefined ? ("Carregando ..."):
                (
                <LForms forms={forms}
                    onChange={(e) => {this.onChange(e)}}
                    request={request} 
                    validate={(values) => { return validateFields(forms,values)}}
                    loading={this.state.loading}
                >
                    <div>
                    <Card style={{ marginBottom: 15 }}>
                                <CardContent>
                                <Typography onClick={() => {
                                            let filter = this.state.filter;
                                            filter['responsaveis-ind'] = this.state.filter['responsaveis-ind'] == 'block' ? 'none' : 'block'
                                            this.setState({ ...this.state, filter })
                                        }}>
                                        <IndeterminateCheckBoxIcon /> Responsáveis
                                    </Typography>
                                    <div style={{
                                        display: this.state.filter['responsaveis-ind'] ?? 'block',
                                    }}>
                                    <div  style={{
                                            alignItems: 'center',
                                            justifyContent: 'start',
                                            display: 'flex',
                                        }}>
                                    
                                        <SelectInput valueLabel="value" 
                                            json={true} 
                                            valueLabel={'name'}
                                            key={`input-${15019}`} id={"manager"} label={"Responsável"} name={"manager"} 
                                            values={this.state.managers} 
                                            style={{flexBasis: window.innerWidth < 768 ? '75%' : '75%', marginBottom: 15 }} 
                                            onChange={(e) => {
                                                this.setState({...this.state, manager: e.target.value});
                                            }} />
                                            {!this.state.provManagerLoading ? (
                                            <Button variant="contained" color="primary" size="small" disableElevation 
                                            onClick={() => {
                                                setManagers();
                                            }}><AddIcon /></Button>)
                                            : (
                                                <CircularProgress style={{ display: 'flex', margin: 'auto' }} />
                                            )}
                                        </div>
                                    <div style={{
                                        alignItems: 'center',
                                        justifyContent: 'start',
                                        overflow: 'auto',
                                        height: 350,
                                        minHeight: 350,
                                    }}>
                                        { window.innerWidth > 720 ? (
                                        <DataGrid sx={{
                                            '& .MuiDataGrid-root': {
                                                '& .MuiDataGrid-viewport': {
                                                    maxWidth: '600px',
                                                },
                                            }
                                        }}
                                            rows={rows} columns={columns}
                                            spacing={0}
                                            stickyHeader
                                            disableClickEventBubbling
                                            disableColumnMenu={true}
                                            localeText={DEFAULT_LOCALE_TEXT}
                                            pageSize={10} rowsPerPageOptions={[10]} pagination
                                        />) : rows.map((row, key) => {
                                            //console.log(row);
                                            return (
                                                <Card key={`card-container${key}`} style={{marginTop: 15}}>
                                                    <CardContent>
                                                    <List key={`list_field_${key}`} component="nav">
                                                        {Object.entries(row).map(field => {
                                                            
                                                            let headerName = columns.find(column => column.field === field[0]);
                                                            if (headerName && headerName.field !== 'id') {
                                                                console.log(field[1])
                                                                let value = headerName.valueFormatter ?? headerName.renderCell;
                                                                value = value == undefined ? field[1] : value(headerName.row == true ? {row} : {value: field[1]}); 
                                                                if(headerName.renderCell !== undefined)
                                                                {
                                                                    console.log(row);
                                                                    value = headerName.renderCell({value: field[1], row: row }, row);
                                                                    console.log(value);
                                                                    return (
                                                                        <ListItem style={{paddingTop: 0, paddingBottom: 0}}>
                                                                            <ListItemText primary={`${headerName.headerName}`} secondary={value} />
                                                                        </ListItem>
                                                                    )
                                                                }else{
                                                                    return (
                                                                        <ListItem style={{paddingTop: 0, paddingBottom: 0}}>
                                                                            <ListItemText primary={`${headerName.headerName}`} secondary={`${value}`} />
                                                                        </ListItem>
                                                                    )}
                                                                }
                                                            }
                                                        )
                                                        }
                                                        </List>
                                                    </CardContent>
                                                    <CardActions style={{justifyContent: 'center'}}>
                                                    {Object.entries(row).map(field => {
                                                        let headerName = columns.find(column => column.field === field[0]);
                                                        if(headerName && headerName.field == 'id') {
                                                            return headerName.renderCell({value: field[1], row }, row);
                                                        }
                                                    })}
                                                    </CardActions>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                                </CardContent>
                            </Card>

                        <Card style={{ marginBottom: 15 }}>
                            <CardContent>
                                <Typography onClick={() => {
                                            let filter = this.state.filter;
                                            filter['fornecedores-ind'] = this.state.filter['fornecedores-ind'] == 'block' ? 'none' : 'block'
                                            this.setState({ ...this.state, filter })
                                        }}>
                                    <IndeterminateCheckBoxIcon /> Fornecedores Vinculados à Matriz
                                </Typography>
                                <div style={{
                                    display: this.state.filter['fornecedores-ind'] ?? 'block',
                                }}>
                                <div style={{
                                        alignItems: 'center',
                                        justifyContent: 'start',
                                        display: 'flex',
                                 }}>
                                    <SelectInput valueLabel="value" 
                                        json={true} 
                                        valueLabel={'company_name'}
                                        key={`input-${15019}`} id={"providers"} label={"Filial"} name={"providers"} 
                                        values={this.state.filials} 
                                        style={{flexBasis: window.innerWidth < 768 ? '75%' : '75%', marginBottom: 15 }} 
                                        onChange={(e) => {
                                            this.setState({...this.state, provider: e.target.value});
                                        }} />
                                        {this.state.provProvidersLoading == false ? (
                                            <Button variant="contained" color="primary" size="small" disableElevation 
                                        onClick={() => {
                                            setProviders();
                                        }}><AddIcon /></Button>
                                        ) : (
                                            <CircularProgress style={{ display: 'flex', margin: 'auto' }} />
                                        )}
                                        
                                    </div>
                                <div style={{
                                    alignItems: 'center',
                                    justifyContent: 'start',
                                    overflow: 'auto',
                                    height: 350,
                                    minHeight: 350,
                                }}>
                                     { window.innerWidth > 720 ? (
                                    <DataGrid sx={{
                                        '& .MuiDataGrid-root': {
                                            '& .MuiDataGrid-viewport': {
                                                maxWidth: '600px',
                                            },
                                        }
                                    }}
                                        rows={rowsProv} columns={columnsProv}
                                        spacing={0}
                                        stickyHeader
                                        disableClickEventBubbling
                                        disableColumnMenu={true}
                                        localeText={DEFAULT_LOCALE_TEXT}
                                        pageSize={10} rowsPerPageOptions={[10]} pagination
                                    />) : rowsProv.map((row, key) => {
                                            //console.log(row);
                                            return (
                                                <Card key={`card-container${key}`} style={{marginTop: 15}}>
                                                    <CardContent>
                                                    <List key={`list_field_${key}`} component="nav">
                                                        {Object.entries(row).map(field => {
                                                            
                                                            let headerName = columnsProv.find(column => (column.field === field[0] || field[0] == 'contacts' && column.field == 'phone1' || field[0] == 'contact_clone' && column.field == 'email' ));
                                                            if (headerName && headerName.field !== 'id') {
                                                                console.log(field[1])
                                                                let value = headerName.valueFormatter ?? headerName.renderCell;
                                                                value = value == undefined ? field[1] : value(headerName.row == true ? {row, value: field[1]} : {value: field[1]}); 
                                                                if(headerName.renderCell !== undefined)
                                                                {
                                                                    console.log(row);
                                                                    value = headerName.renderCell({value: field[1], row: row }, row);
                                                                    console.log(value);
                                                                    return (
                                                                        <ListItem style={{paddingTop: 0, paddingBottom: 0}}>
                                                                            <ListItemText primary={`${headerName.headerName}`} secondary={value} />
                                                                        </ListItem>
                                                                    )
                                                                }else{
                                                                    return (
                                                                        <ListItem style={{paddingTop: 0, paddingBottom: 0}}>
                                                                            <ListItemText primary={`${headerName.headerName}`} secondary={`${value}`} />
                                                                        </ListItem>
                                                                    )}
                                                                }
                                                        })}
                                                        </List>
                                                    </CardContent>
                                                    <CardActions style={{justifyContent: 'center'}}>
                                                    {Object.entries(row).map(field => {
                                                        let headerName = columnsProv.find(column => column.field === field[0]);
                                                        if(headerName && headerName.field == 'id') {
                                                            return headerName.renderCell({value: field[1], row }, row);
                                                        }
                                                    })}
                                                    </CardActions>
                                                </Card>
                                            )
                                        })}
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                    </div>
                </LForms>)}
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
