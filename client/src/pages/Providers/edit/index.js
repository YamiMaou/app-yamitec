import React, { Component, Fragment, useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { withRouter } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import LProviderForms from '../../../components/Forms/provider';
//
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
//
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import BlockIcon from '@material-ui/icons/Block';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import { setSnackbar } from '../../../actions/appActions'
import { putApiProviders, getApiManagers, deleteApiManagersProviders, getAddressByCepla, getApiProviders, getApiProviderTypes, getApiContributors } from '../../../providers/api'
import { validaEmail, validaCnpj, stringToaddDate } from '../../../providers/commonMethods'
import { InputCep, InputCnpj, InputPhone, stringCpf, stringCnpj } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { DataGrid } from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from '../../../providers/langs/datagrid';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CardActions, List, ListItem, ListItemText, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

// MODULE ID
const module_id = 4

const AutocompleteMatriz = (props) => {

    const [value, setValue] = React.useState(props.value ? props.values.find((item) => item.id == props.value) : undefined);
    const [inputValue, setInputValue] = React.useState(props.value ? props.values.find((item) => item.id == props.value).name : undefined);
    const [defaultVal, setDefault] = useState(props.value ? props.values.find((item) => item.id == props.value) : undefined);
    console.log(value);
    useEffect(() => {
        //if (props.value !== defaultVal) {
            console.log(props.value)
            const vl = props.value ? props.values.find((item) => item.id == props.value) : undefined;
            if (vl !== undefined) {
                //console.log(vl);
                setValue(vl);
                setInputValue(vl !== undefined ? vl[props.valueLabel] : "");
                setDefault(vl)
            }
        //}
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
        
        //console.log(newValue);
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
            if (option.id == value.id) {
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
        if (props.value !== defaultVal) {
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
        //console.log(e.target)
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
    const [value, setValue] = useState(props.value);
    const [value1, setValue1] = useState(props.value1);
    function handleChange(e) {
        const { value, id } = e.target;
        props.onChange(e) ?? undefined;
        setValue(e.target.value);
    }
    async function handleChange1(e) {
        const { value, id } = e.target;
        try {
            await props.handler(value);
        } catch (e) {
            console.error(e);
        }
        props.onChange(e) ?? undefined;
        setValue1(e.target.value);
    }
    return (<div style={{ flexBasis: props.style.flexBasis, display: 'flex' }}>
        <SelectInput valueLabel="value" json={true} value={value} helperText={props.helperText ?? ""} key={`input-${15000}`} id={"type"} label={"Empresa"} name={"type"} values={[{ id: 1, value: 'Matriz' }, { id: 2, value: 'Filial' }]} style={{ margin: 5, marginTop: 25, flexBasis: window.innerWidth < 768 ? '100%' : '50%' }} onChange={(e) => handleChange(e)} />
        {value == 2 &&
            <SelectInput valueLabel={props.valueLabel} json={props.json} value={value1} helperText={props.helperText ?? ""} key={`input-${15001}`} id={"matriz_id"} label={props.label} name={"matriz_id"} values={props.values} style={{ margin: 5, marginTop: 25, flexBasis: window.innerWidth < 768 ? '100%' : '50%' }} onChange={(e) => handleChange1(e) ?? undefined} />
        }</div>)
}

function BlockDialog(props) {
    const [open, setOpen] = React.useState(props.open);
    const [loading, setLoading] = React.useState(false);
    const [justfy, setjustfy] = React.useState('');

    const handleClose = () => {
        setOpen(false);
        setLoading(false);
    };

    const send = async () => {
        setLoading(true);
        await putApiProviders(props.id, { active: props.active ?? undefined, justification: justfy });
        props.handle(props.active);
        props.handleClose();
        setjustfy('');
        setLoading(false);
    }
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Desvincular Responsável ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                        Confirma o desvinculo do registro selecionado?
            </DialogContentText>
                    {props.active == 0 && <TextField
                        autoFocus
                        margin="dense"
                        id="justification"
                        label="Justificativa"
                        type="text"
                        fullWidth
                        value={justfy}
                        onChange={(e) => {
                            setjustfy(e.target.value)
                        }}
                    />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        NÃO
            </Button>
                    {!loading ? (
                        <Button onClick={send} color="primary">
                            SIM
                        </Button>) : (
                        <Button color="primary">
                            <CircularProgress style={{ display: 'flex' }} />
                        </Button>

                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}
function getMoney(str) {
    return parseInt(str.replace(/[\D]+/g, ''));
}
function formatReal(int) {
    var tmp = int + '';
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6)
        tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    if (tmp.length >= 10)
        tmp = tmp.replace(/([0-9]{3})\.([0-9]{3}),([0-9]{2}$)/g, "$1.$2,$3");
    return tmp;
}
class EditProviders extends Component {
    state = {
        filter: ['flex'],
        fields: {},
        data: {},
        managers: [],
        contributors: [],
        manager: 0,
        providers: [],
        filials: [],
        provider: 0,
        provProviders: [],
        provManagers: [],
        provManagersDeleted: [],
        loading: false
    }
    async componentDidMount() {
        if (JSON.parse(localStorage.getItem("user")) == null) {
            window.location.href = '/login';
            return;
        }
        localStorage.setItem("sessionTime", 9000)
        const contributors = await getApiContributors({ pageSize: 9999, active: 1 });
        const data = await getApiProviders({}, this.props.match.params.id);
        const providers = await getApiProviders({ type: 1, active: 1 });
        const filials = await getApiProviders({ type: 2, active: 1, pageSize: 9999 });
        const managers = await getApiManagers({ active: 1, pageSize: 9999 });
        const providertypes = await getApiProviderTypes({pageSize: 9999});
        //console.log(providers.data.filter(x => x.id != this.props.match.params.id))
        this.setState({
            ...this.state,
            data,
            fields: data,
            providers: providers.data.filter(x => x.id != this.props.match.params.id),
            filials: filials.data.filter(x => x.id != this.props.match.params.id),
            provManagers: data.managers,
            provProviders: data.filials,
            managers: managers.data,
            contributors: contributors.data,
            providertypes: providertypes.data
        });

        if (data.matriz_id != (null || undefined)) {
            let fields = this.state.fields;
            Object.entries(data.addresses)
                .map(([key, val]) => {
                    fields[key] = val
                });
            Object.entries(data.contacts)
                .map(([key, val]) => {
                    fields[key] = val
                });
            Object.entries(data.contracts)
                .map(([key, val]) => {
                    if (key == 'rate') {
                        fields[key] = formatReal(getMoney(val))
                    } else {
                        fields[key] = val
                    }

                });
            this.setState({ ...this.state, fields: Object.assign({},this.state.fields, fields)});
        }
        //console.log(this.state.fields);

    }
    onChange(e) {
        //console.log(e);
        this.setState({ ...this.state, fields: e });
    }
    render() {
        const closeSnack = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            this.props.setSnackbar({ open: false, message: "" });
        };
        const request = async (state, data) => {
            if (this.state.provManagers.length == 0) {
                this.props.setSnackbar({ open: true, message: "Você deve manter pelo menos 1 Responsável vinculado" });
                return false;
            }
            this.setState({ ...this.state, loading: true });
            this.props.setSnackbar({ open: true, message: "Validando Dados, Aguarde ...", });
            data = Object.assign({}, state.addresses, data);
            data = Object.assign({}, state.contacts, data);
            data = Object.assign({}, state.contracts, data);
            data = Object.assign({}, state, data);
            delete data.addresses;
            delete data.contacts;
            delete data.contracts;
            data.rate = formatReal(getMoney(data.rate))
            console.log(data.rate)
            this.state.provManagersDeleted.map(async (v, k) => {
                let del = await deleteApiManagersProviders({ provider_id: this.props.match.params.id, manager_id: v.id });
                if (del.success == false) {
                    this.props.setSnackbar({ open: true, message: del.message });
                }
            });
            this.state.provManagers.map(async (v, k) => {
                let add = await putApiProviders(`manager/${this.props.match.params.id}/${v.id}`)
                if (add.success == false) {
                    this.props.setSnackbar({ open: true, message: del.message });
                }
            });
            //data.rate = data.rate.replace(/\./g,'').replace(',', '.');
            let response = await putApiProviders(this.props.match.params.id, data);
            //console.log(response);
            if (response.data.success) {
                this.props.setSnackbar({ open: true, message: response.data.message });
                this.setState({ ...this.state, loading: false });
                this.props.history.goBack();
            } else {
                //console.log(response)
                let errors = response.data ?? undefined;

                //let { errors } = response.data.error.response.data ?? {error: undefined}
                let messages = '';
                if (errors !== undefined && errors.error !== undefined && errors.error.response && errors.error.response.data !== undefined && errors.error.response.data.errors !== undefined) {
                    Object.keys(errors.error.response.data.errors).map(err => {
                        //console.log(err);
                        let field = err == "file" ? "Anexo" : err
                        messages += `O ${field.toUpperCase()} ${errors.error.response.data.errors[err][0]} \n`;
                    })
                } else {
                    messages = 'Houve um problema em sua requisição!'
                }
                this.setState({ ...this.state, loading: false });
                //response.data.error.response.data.errors
                this.props.setSnackbar({ open: true, messages });
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
                            if (v1.validate.depends !== undefined) {
                                let val = values[v1.validate.depends.column];
                                //console.log(v1.validate.depends.value);
                                //return false;
                                if (val == "Selecione") {
                                    campo = { id: v1.column, message: `O Campo ${val.label} é inválido ` }
                                }
                                if (v1.validate.depends.value !== val)
                                    campo = { id: v1.column, message: `O Campo ${v1.label} depende do valor ${v1.validate.depends.text} em ${v1.validate.depends.label}` }
                            }

                            if (v1.validate.decimal !== undefined) {
                                //if (/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/.test(value) == false)
                                //    campo = {id: v1.column, message: `O Campo ${v1.label} é somente números e ponto ` }
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
                                if (value == "Selecione") {
                                    campo = { id: v1.column, message: `O Campo ${v1.label} é inválido ` }
                                }
                                if (value.length == 0)
                                    campo = { id: v1.column, message: `O Campo ${v1.label} é obrigatório` };
                            }
                        }
                        if (v1.validateHandler !== undefined) {
                            if (v1.validateHandler(value) == false)
                                campo = { id: v1.column, message: `O Campo ${v1.label} não possui é inválido ` }
                        }
                    }
                })
            })
            //console.log(campo)
            campo !== undefined ? this.props.setSnackbar({ open: true, message: campo.message }) : '';

            return campo === undefined ? true : false
        }
        const flexBasis = '22%';
        const forms = (this.state.data === undefined || this.state.data.id === undefined) ? [] : [
            {
                title: 'Dados Básicos',
                fields: [
                    {
                        column: 'active', label: 'Ativo', type: 'checkbox', value: this.state.data['active'] == 1 ? true : false, disabled: false,
                        justification: this.state.data['audits'] ? this.state.data['audits'].justification == null ? " " : this.state.data['audits'].justification : '',
                        flexBasis: "100%"
                    },
                    { column: 'cnpj', label: 'CNPJ', type: 'text', value: this.state.data['cnpj'], mask: InputCnpj, validate: { min: 11, number: true, required: true }, validateHandler: validaCnpj, flexBasis: '22%', helperText: "o valor digitado é inválido" },
                    {
                        column: 'providertype_id', label: 'Tipo Fornecedor', type: 'select',
                        json: true,
                        valueLabel: "name",
                        values: this.state.providertypes,//[{id: 1, value: "Farmácia"},{id: 2, value: "Loja"}],
                        validate: { required: true },
                        value: this.state.data['providertype_id'],
                        //value: "Coordenador de usuários",
                        flexBasis
                    },
                    {
                        column: 'matriz_id',
                        label: 'Matriz',
                        type: 'custom',
                        json: true,
                        valueLabel: "fantasy_name",
                        value: this.state.data['type'],
                        value1: this.state.data['matriz_id'],
                        values: this.state.fields['providertype_id'] == undefined ? [] : this.state.providers.filter(x => x.providertype_id == this.state.fields['providertype_id']),//[{id: 1, value: "Farmácia"},{id: 2, value: "Loja"}],
                        flexBasis: '35%',
                        component: TypeEmpresaInput,
                        handler: async (id) => {
                            let matrizData = await getApiProviders({}, id);
                            let clone = this.state.clone;
                            Object.entries(matrizData.addresses)
                                .map(([key, val]) => {
                                    if(key != 'addr_clone')
                                        fields[key] = val
                                });
                            Object.entries(matrizData.contacts)
                                .map(([key, val]) => {
                                    if(key != 'contacts_clone')
                                        fields[key] = val
                                });
                            Object.entries(matrizData.contracts)
                                .map(([key, val]) => {
                                    if(key != 'contracts_clone')
                                        fields[key] = val
                                });
                            clone.addr_clone = this.state.fields['addr_clone']
                            clone.contact_clone = this.state.fields['contact_clone']
                            clone.contract_clone = this.state.fields['contract_clone']
                            clone.type = this.state.data.type;

                            this.setState({ ...this.state, clone });
                            console.log(this.state.clone['addr_clone']);
                            //console.log(fields);
                        }
                    },
                    { column: 'company_name', label: 'Razão Social', type: 'text', value: this.state.data['company_name'], validate: { max: 50, required: true }, flexBasis: '25%' },
                    { column: 'fantasy_name', label: 'Nome Fantasia', type: 'text', value: this.state.data['fantasy_name'], validate: { max: 50, required: true }, flexBasis: '25%' },
                    { column: 'file_anexo', label: 'Documento', type: 'file', file: this.state.data['file_anexo'] ? this.state.data['file_anexo'].name : '', flexBasis },
                    { column: 'file_logo', label: 'Logo marca', type: 'file', file: this.state.data['file_logo'] ? this.state.data['file_logo'].name : '', validate: { required: true }, flexBasis },

                ]
            },
            {
                id: 'addr',
                title: 'Endereço',
                //flexFlow: 'row no-wrap',
                //json: "address",
                fields: [
                    { column: 'addr_clone', label: 'Clonar Matriz', disabled: (this.state.fields['type'] == 1), type: 'checkbox', validate: { depends: { label: 'Tipo', value: 2, column: 'type', text: 'Filial' } }, flexBasis: "100%", value: this.state.data.addr_clone },
                    { column: 'zipcode', label: 'CEP', type: 'text', disabled: (this.state.fields['addr_clone'] == (1 || "1")), mask: InputCep, validate: { max: 9, required: true }, flexBasis: '9%', value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1 && this.state.fields['zipcode'] != ("" || null || undefined)) ? this.state.fields['zipcode'] : this.state.data['addresses'].zipcode },
                    { column: 'street', label: 'Endereço', disabled: (this.state.fields['addr_clone'] == 1), validate: { max: 100, required: true }, type: 'text', flexBasis, value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1 && this.state.fields['street'] != ("" || null || undefined)) ? this.state.fields['street'] : this.state.data['addresses'].street },
                    { column: 'additional', label: 'Complemento', disabled: (this.state.fields['addr_clone'] == 1), validate: { max: 20 }, type: 'text', flexBasis, value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1 && this.state.fields['additional'] != ("" || null || undefined)) ? this.state.fields['additional'] : (this.state.data['addresses'].additional != 'null' ? this.state.data['addresses'].additional : '') },
                    {
                        column: 'uf', label: 'Estado', type: 'custom',
                        component: SelectMatriz, disabled: (this.state.fields['addr_clone'] == 1),
                        values: ["Acre", "Alagoas", "Amazonas", "Amapá", "Bahia", "Ceará", "Brasília", "Espírito Santo", "Goiás", "Maranhão", "Minas Gerais", "Mato Grosso do Sul", "Mato Grosso", "Pará", "Paraíba", "Pernambuco", "Piauí", "Paraná", "Rio de Janeiro", "Rio Grande do Norte", "Rondônia", "Roraima", "Rio Grande do Sul", "Santa Catarina", "Sergipe", "São Paulo", "Tocantins"],
                        value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1 && this.state.fields['uf'] != ("" || null || undefined)) ? this.state.fields['uf'] : this.state.data['addresses'].uf, flexBasis, flexGrow: 2, style: { minWidth: "192px" }
                    },
                    { column: 'city', label: 'Cidade', type: 'text', disabled: (this.state.fields['addr_clone'] == 1), validate: { max: 100, required: true }, flexBasis, value: (this.state.fields['type'] == 2 && this.state.fields['addr_clone'] == 1 && this.state.fields['city'] != ("" || null || undefined)) ? this.state.fields['city'] : this.state.data['addresses'].city },
                ]
            },
            {
                title: 'Contato',
                //json: 'contact',
                fields: [
                    { column: 'contact_clone', label: 'Clonar Matriz', disabled: (this.state.fields['type'] == 1 ? true : false), type: 'checkbox', validate: { depends: { label: 'Tipo', value: 2, column: 'type', text: 'Filial' } }, flexBasis: "100%", value: this.state.data.contact_clone },
                    { column: 'phone1', label: 'Contato', type: 'text', disabled: (this.state.fields['contact_clone'] == 1), mask: InputPhone, validate: { max: 15, required: true }, flexBasis, value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1 && this.state.fields['phone1'] != ("" || null || undefined)) ? this.state.fields['phone1'] : this.state.data['contacts'].phone1 },
                    { column: 'phone2', label: 'Contato alternativo', type: 'text', disabled: (this.state.fields['contact_clone'] == 1), mask: InputPhone, validate: { max: 15 }, flexBasis, value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1 && this.state.fields['phone2'] != ("" || null || undefined)) ? this.state.fields['phone2'] : this.state.data['contacts'].phone2 },
                    { column: 'email', label: 'E-mail', type: 'email', disabled: (this.state.fields['contact_clone'] == 1), validate: { max: 100 }, validateHandler: validaEmail, flexBasis, value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1 && this.state.fields['email'] != ("" || null || undefined)) ? this.state.fields['email'] : this.state.data['contacts'].email },
                    { column: 'site', label: 'Site', type: 'text', disabled: (this.state.fields['contact_clone'] == 1), validate: { max: 100 }, flexBasis: '20%', value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1 && this.state.fields['site'] != ("" || null || undefined)) ? this.state.fields['site'] : (this.state.data['contacts'].site == "null" ? "" : this.state.data['contacts'].site) },
                ]
            },
            {
                title: 'Redes Sociais',
                //json: 'contact',
                fields: [
                    { column: 'linkedin', label: 'Usuário do LinkedIn', type: 'text', disabled: (this.state.fields['contact_clone'] == 1), validate: { max: 100, required: true }, flexBasis, value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1 && this.state.fields['linkedin'] != ("" || null || undefined)) ? this.state.fields['linkedin'] : this.state.data['contacts'].linkedin },
                    { column: 'facebook', label: 'Usuário do Facebook', type: 'text', disabled: (this.state.fields['contact_clone'] == 1), validate: { max: 100, required: true }, flexBasis, value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1 && this.state.fields['facebook'] != ("" || null || undefined)) ? this.state.fields['facebook'] : this.state.data['contacts'].facebook },
                    { column: 'instagram', label: 'Usuário do Instagram', type: 'text', disabled: (this.state.fields['contact_clone'] == 1), validate: { max: 100, required: true }, flexBasis, value: (this.state.fields['type'] == 2 && this.state.fields['contact_clone'] == 1 && this.state.fields['instagram'] != ("" || null || undefined)) ? this.state.fields['instagram'] : this.state.data['contacts'].instagram },
                ]
            },
            {
                title: 'Contrato Atual',
                //json: 'contact',
                fields: [
                    { column: 'contract_clone', label: 'Clonar Matriz', disabled: (this.state.fields['type'] == 1 ? true : false), type: 'checkbox', validate: { depends: { label: 'Tipo', value: 2, column: 'type', text: 'Filial' } }, flexBasis: "100%" },
                    { column: 'accession_date', label: 'Data de Adesão - Início', type: 'date', disabled: (this.state.fields['contract_clone'] == 1), validate: { required: true }, flexBasis: '20%', value: (this.state.fields['type'] == 2 && this.state.fields['contract_clone'] == 1 && this.state.fields['accession_date'] != ("" || null || undefined)) ? this.state.fields['accession_date'] : this.state.data['contracts'].accession_date },
                    { column: 'end_date', label: 'Data de Adesão - Fim', type: 'date', disabled: (this.state.fields['contract_clone'] == 1), validate: { required: true }, flexBasis: '20%', value: (this.state.fields['type'] == 2 && this.state.fields['contract_clone'] == 1 && this.state.fields['end_date'] != ("" || null || undefined)) ? this.state.fields['end_date'] : this.state.data['contracts'].end_date },
                    {
                        column: 'contributors_id',
                        label: 'Vendedor',
                        type: 'custom',
                        component: AutocompleteMatriz,
                        validate: { required: true },
                        value: this.state.clone == undefined ? this.state.data.contracts.contributors_id : this.state.clone.contributors_id,
                        //value: this.state.data['contracts'].contributors_id,
                        //value: this.state.fields['type'] == 2 && this.state.fields['contract_clone'] == 1 && this.state.fields['contributors_id'] != (undefined || null || "") ? this.state.fields['contributors_id'] : this.state.data['contributors_id'],
                        //value: (this.state.fields['type'] == 2 && this.state.fields['contract_clone'] == 1 && this.state.fields['contributors_id'] != ("" || null || undefined)) ? this.state.fields['contributors_id'] : this.state.data['contracts'].contributors_id,
                        json: true,
                        valueLabel: 'name',
                        values: this.state.contributors,
                        flexBasis: '20%', disabled: (this.state.fields['contract_clone'] == 1)
                    },
                    { column: 'rate', label: 'Taxa de Adesão', type: 'decimal', disabled: (this.state.fields['contract_clone'] == 1), validate: { required: true, decimal: true }, flexBasis: '20%', value: (this.state.fields['type'] == 2 && this.state.fields['contract_clone'] == 1 && this.state.fields['rate'] != ("" || null || undefined)) ? formatReal(getMoney(this.state.fields['rate'])) : formatReal(getMoney(this.state.data['contracts'].rate)) },
                ]
            }
        ];
        const rows = (this.state.provManagers !== undefined) ? this.state.provManagers : [];
        const columns = [
            {
                field: 'cpf', headerName: 'CPF', flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value ? stringCpf(params.value) : '';
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
                                    try {
                                        let provManagers = this.state.provManagers;
                                        let actualDel = provManagers.find(x => x.id == params.row.id)
                                        let index = provManagers.findIndex(x => x.id == params.row.id)
                                        await getApiProviders({}, this.props.match.params.id);
                                        this.setState({ ...this.state, provManagers: undefined });
                                        provManagers.splice(index, 1)
                                        let provManagersDeleted = this.state.provManagersDeleted;
                                        provManagersDeleted.push(actualDel)
                                        this.setState({ ...this.state, provManagers, provManagersDeleted });

                                        //if(this.state.provManagers.length > 1){
                                        /*await deleteApiManagersProviders({provider_id: this.props.match.params.id, manager_id: params.row.id });
                                        const data = await getApiProviders({}, this.props.match.params.id);
                                        this.setState({...this.state, provManagers: data.managers});*/
                                        //}else{
                                        //    this.props.setSnackbar({ open: true, message: "Você deve manter pelo menos 1 registro" })
                                        //}

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
        ];

        //
        // Providers Grid
        const rowsProv = (this.state.provProviders !== undefined) ? this.state.provProviders : [];
        const columnsProv = [
            {
                field: 'company_name', headerName: 'Farmácia', flex: 0.7, row: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.row.company_name + " - " + stringCnpj(params.row.cnpj ?? '00000000000000');
                }
            },
            {
                field: 'phone1', headerName: 'Telefone', flex: 0.7, row: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    //let provider = this.state.providers.filter(prov => prov.id === params.row.id); 
                    return params.row.contact ? params.row.contact.phone1 : '-';
                }
            },
            {
                field: 'email', headerName: 'E-mail', flex: 0.7, row: true,
                valueFormatter: (params: ValueFormatterParams) => {
                    //let provider = this.state.providers.filter(prov => prov.id === params.row.id); 
                    //console.log(provider)
                    return params.row.contact ? params.row.contact.email : '';
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
                                        //if(this.state.provProviders.length > 1){
                                        await putApiProviders(params.row.id, { matriz_id: null, type: 1 })
                                        //await deleteApiManagersProviders({provider_id: params.row.id,manager_id: this.props.match.params.id})
                                        const data = await getApiProviders({}, this.props.match.params.id);
                                        this.setState({ ...this.state, provProviders: data.filials });
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
                        <HomeIcon />  <span>Editar / Fornecedor</span>
                    </Typography>
                </AppBar>
                {
                    <LProviderForms
                        forms={forms}
                        onChange={(e) => { this.onChange(e) }}
                        request={(data) => { request(this.state.data, data) }}
                        validate={(values) => { return validateFields(forms, values) }}
                        loading={this.state.loading}
                    >
                        {this.state.data.id == undefined ? ('') :
                            (<div>
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
                                            <div style={{
                                                alignItems: 'center',
                                                justifyContent: 'start',
                                                display: 'flex',
                                            }}>
                                                <SelectInput valueLabel="value"
                                                    json={true}
                                                    valueLabel={'name'}
                                                    key={`input-${15019}`} id={"manager"} label={"Responsável"} name={"manager"}
                                                    values={this.state.managers}
                                                    style={{ flexBasis: window.innerWidth < 768 ? '75%' : '75%', marginBottom: 15 }}
                                                    onChange={(e) => {
                                                        this.setState({ ...this.state, manager: e.target.value });
                                                    }} />
                                                <Button variant="contained" color="primary" size="small" disableElevation onClick={async () => {
                                                    let provManagers = this.state.provManagers;
                                                    const allmanagers = provManagers.find(x => x.id == this.state.manager)
                                                    if (allmanagers) {
                                                        this.props.setSnackbar({ open: true, message: `O Responsável ${allmanagers.name} já está vinculado.` })
                                                        return false;
                                                    }
                                                    const data = await getApiManagers({}, this.state.manager);
                                                    this.setState({ ...this.state, provManagers: undefined });
                                                    provManagers.push(data)
                                                    this.setState({ ...this.state, provManagers });
                                                    console.log(this.state.provManagers);
                                                    /*
                                                    await putApiProviders(`manager/${this.props.match.params.id}/${this.state.manager}`)
                                                    const data = await getApiProviders({}, this.props.match.params.id);
                                                    // let data = {...this.state.data};
                                                    // data = managers.managers
                                                    this.setState({...this.state, provManagers: data.managers });*/
                                                }}><AddIcon /></Button>
                                            </div>
                                            <div style={{
                                                alignItems: 'center',
                                                justifyContent: 'start',
                                                overflow: 'auto',
                                                height: 350,
                                                minHeight: 350,
                                            }}>
                                                {window.innerWidth > 720 ? (
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
                                                            <Card key={`card-container${key}`} style={{ marginTop: 15 }}>
                                                                <CardContent>
                                                                    <List key={`list_field_${key}`} component="nav">
                                                                        {Object.entries(row).map(field => {

                                                                            let headerName = columns.find(column => column.field === field[0]);
                                                                            if (headerName && headerName.field !== 'id') {
                                                                                //console.log(field[1])
                                                                                let value = headerName.valueFormatter ?? headerName.renderCell;
                                                                                value = value == undefined ? field[1] : value(headerName.row == true ? { row } : { value: field[1] });
                                                                                if (headerName.renderCell !== undefined) {
                                                                                    //console.log(row);
                                                                                    value = headerName.renderCell({ value: field[1], row: row }, row);
                                                                                    //console.log(value);
                                                                                    return (
                                                                                        <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                                                                                            <ListItemText primary={`${headerName.headerName}`} secondary={value} />
                                                                                        </ListItem>
                                                                                    )
                                                                                } else {
                                                                                    return (
                                                                                        <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                                                                                            <ListItemText primary={`${headerName.headerName}`} secondary={`${value}`} />
                                                                                        </ListItem>
                                                                                    )
                                                                                }
                                                                            }
                                                                        })}
                                                                    </List>
                                                                </CardContent>
                                                                <CardActions style={{ justifyContent: 'center' }}>
                                                                    {Object.entries(row).map(field => {
                                                                        let headerName = columns.find(column => column.field === field[0]);
                                                                        if (headerName && headerName.field == 'id') {
                                                                            return headerName.renderCell({ value: field[1], row }, row);
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
                                            <IndeterminateCheckBoxIcon /> Fornecedores
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
                                                    key={`input-${15019}`} id={"provider"} label={"Filial"} name={"provider"}
                                                    values={this.state.filials}
                                                    style={{ flexBasis: window.innerWidth < 768 ? '75%' : '75%', marginBottom: 15 }}
                                                    onChange={(e) => {
                                                        this.setState({ ...this.state, provider: e.target.value });
                                                    }} />
                                                <Button variant="contained" color="primary" size="small" disableElevation onClick={async () => {
                                                    await putApiProviders(this.state.provider, { type: 2, matriz_id: this.state.data.matriz_id > 0 ? this.state.data.matriz_id : this.props.match.params.id })
                                                    const data = await getApiProviders({}, this.props.match.params.id);
                                                    this.setState({ ...this.state, provProviders: data.filials });
                                                }}><AddIcon /></Button>
                                            </div>
                                            <div style={{
                                                alignItems: 'center',
                                                justifyContent: 'start',
                                                overflow: 'auto',
                                                height: 350,
                                                minHeight: 350,
                                            }}>
                                                {window.innerWidth > 720 ? (
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
                                                    />
                                                ) : rowsProv.map((row, key) => {
                                                    //console.log(row);
                                                    return (
                                                        <Card key={`card-container${key}`} style={{ marginTop: 15 }}>
                                                            <CardContent>
                                                                <List key={`list_field_${key}`} component="nav">
                                                                    {Object.entries(row).map(field => {
                                                                        let headerName = columnsProv.find(column => (column.field === field[0] || field[0] == 'contact' && column.field == 'phone1' || field[0] == 'contact_clone' && column.field == 'email'));
                                                                        if (headerName && headerName.field !== 'id') {
                                                                            //console.log(headerName)
                                                                            let value = headerName.valueFormatter ?? headerName.renderCell;
                                                                            value = value == undefined ? field[1] : value(headerName.row == true ? { row, value: field[1] } : { value: field[1] });
                                                                            if (headerName.renderCell !== undefined) {
                                                                                //console.log(row);
                                                                                value = headerName.renderCell({ value: field[1], row: row }, row);
                                                                                //console.log(value);
                                                                                return (
                                                                                    <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                                                                                        <ListItemText primary={`${headerName.headerName}`} secondary={value} />
                                                                                    </ListItem>
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                                                                                        <ListItemText primary={`${headerName.headerName}`} secondary={`${value}`} />
                                                                                    </ListItem>
                                                                                )
                                                                            }
                                                                        }
                                                                    })}
                                                                </List>
                                                            </CardContent>
                                                            <CardActions style={{ justifyContent: 'center' }}>
                                                                {Object.entries(row).map(field => {
                                                                    let headerName = columnsProv.find(column => column.field === field[0]);
                                                                    if (headerName && headerName.field == 'id') {
                                                                        return headerName.renderCell({ value: field[1], row }, row);
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
                            </div>)
                        }
                    </LProviderForms>
                }
                { this.state.data.audits &&
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditProviders))
