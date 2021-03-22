import React, { Component, Fragment, useState, useRef, useEffect  } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { withRouter } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import HomeIcon from '@material-ui/icons/Home';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import { DataGrid } from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from '../../../providers/langs/datagrid';
import LForms from '../../../components/Forms';

import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
//
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

//
import { setSnackbar } from '../../../actions/appActions'
import { putApiManagers, getApiManagers, deleteApiManagersProviders, putApiProviders, getApiProviders } from '../../../providers/api'
import { validaEmail, validaCpf, stringToaddDate } from '../../../providers/commonMethods'

import { InputCep, InputCpf, InputPhone, stringCnpj } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';
import { withSnackbar } from 'notistack';

// MODULE ID
const module_id = 2
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
    const [value, setValue] = useState(props.value);
    const [value1, setValue1] = useState(props.value);
    function handleChange(e) {
        const { value, id } = e.target;
        props.onChange(e) ?? undefined;
        setValue(e.target.value);
    }
    function handleChange1(e) {
        const { value, id } = e.target;
        props.onChange(e) ?? undefined;
        setValue1(e.target.value);
    }
    return (<div style={{flexBasis: props.style.flexBasis, display: 'flex'}}>
        <SelectInput valueLabel="value" json={true} value={value} helperText={props.helperText ?? ""} key={`input-${15000}`} id={"type"} label={"Empresa"} name={"type"} values={[{id:1, value: 'Matriz'},{id:2, value: 'Filial'} ]} style={{margin: 5, marginTop: 25,flexBasis: window.innerWidth < 768 ? '100%' : '50%' }} onChange={(e) => handleChange(e)} />
        {value == 2 &&
        <SelectInput valueLabel={props.valueLabel} json={props.json} value={value1 ?? undefined} helperText={props.helperText ?? ""} key={`input-${15001}`} id={props.column} label={props.label} name={props.column} values={props.values} style={{margin: 5, marginTop: 25,flexBasis: window.innerWidth < 768 ? '100%' : '50%' }} onChange={(e) => handleChange1(e) ?? undefined} />
    }</div>)
}


class EditContributors extends Component {
    state = {
        data: {},
        provManagers: [],
        providers: [],
        provider: 0,
        loading: false
    }
    async componentDidMount() {
        if (JSON.parse(localStorage.getItem("user")) == null) {
            window.location.href = '/login';
            return;
        }
        localStorage.setItem("sessionTime", 9000)
        let data = await getApiManagers({}, this.props.match.params.id);
        let providers = await getApiProviders();
        this.setState({ ...this.state, data, provManagers: data.providers,providers: providers.data });

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
            data = Object.assign({}, state.addresses, data);
            data = Object.assign({}, state.contacts, data);
            data = Object.assign({}, state, data);
            delete data.addresses;
            delete data.contacts;
            let response = await putApiManagers(this.props.match.params.id, data);
            //console.log(response);
            if (response.data.success) {
                this.props.setSnackbar({ open: true, message: response.data.message });
                this.setState({ ...this.state, loading: false });
                this.props.history.goBack();
            } else {
                let { errors, message } = response.data.error.response.data
                let messages = '';
                console.log(errors)
                if (errors !== undefined) {
                    Object.keys(errors).map(err => {
                        console.log(err);
                        messages += `O campo ${err.toUpperCase()} : ${errors[err][0]} \r`;
                    });
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
                        if (value == "Selecione") {
                            campo = { id: v1.column, message: `O Campo ${v1.label} é inválido ` }
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
                        justification: this.state.data['audits'] ? this.state.data['audits'].justification : '',
                        flexBasis: "100%"
                    },
                    { column: 'cpf', value: this.state.data['cpf'], label: 'CPF', type: 'text', mask: InputCpf, validate: { min: 11, number: true, required: true }, validateHandler: validaCpf, flexBasis: '12%', helperText: "o valor digitado é inválido" },
                    { column: 'name', value: this.state.data['name'], label: 'Nome', type: 'text', validate: { max: 50, required: true }, flexBasis },
                    {
                        column: 'function', label: 'Função', type: 'text',
                        value: this.state.data['function'],
                        validate: { required: true },
                        flexBasis
                    },
                ]
            },
            {
                title: 'Contato',
                fields: [
                    { column: 'phone1', label: 'Contato', type: 'text', mask: InputPhone, validate: { max: 15, required: true }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].phone1 : '' },
                    { column: 'phone2', label: 'Contato alternativo', type: 'text', mask: InputPhone, validate: { max: 15 }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].phone2 : '' },
                    { column: 'email', label: 'E-mail', type: 'email', validate: { max: 100 }, validateHandler: validaEmail, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].email : '' },
                ]
            },
            {
                title: 'Redes Sociais',
                fields: [
                    { column: 'linkedin', label: 'Usuário do LinkedIn', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].linkedin : '' },
                    { column: 'facebook', label: 'Usuário do Facebook', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].facebook : '' },
                    { column: 'instagram', label: 'Usuário do Instagram', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['contacts'] ? this.state.data['contacts'].instagram : '' },
                ]
            }
        ];
        // Providers Grid
        const rows = (this.state.provManagers !== undefined) ? this.state.provManagers : [];
        const columns = [
            {
                field: 'company_name', headerName: 'Farmácia', flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value +" - "+ stringCnpj(params.row.cnpj ?? '00000000000000');
                }
            },
           { 
            field: 'phone1', headerName: 'Telefone', flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    //let provider = this.state.providers.filter(prov => prov.id === params.row.id); 
                    //console.log(provider)
                    return params.row.contact ? params.row.contact.phone1 : '-';
                }
            },
            { 
                field: 'email', headerName: 'E-mail',flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    //let provider = this.state.providers.filter(prov => prov.id === params.row.id); 
                    //console.log(provider)
                    return params.row.contact ? params.row.contact.email : '';
                }
            },
            { field: 'function', headerName: 'Função', flex: 0.7 }, 
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
                                        if(this.state.provManagers.length > 1){
                                            await deleteApiManagersProviders({provider_id: params.row.id,manager_id: this.props.match.params.id})
                                            const data = await getApiManagers({}, this.props.match.params.id);
                                            this.setState({ ...this.state, provManagers: data.providers });
                                        }else{
                                            this.props.setSnackbar({ open: true, message: "Você deve manter pelo menos 1 registro" })
                                        }

                                        
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
                        <HomeIcon />  <span>Editar / Responsável</span>
                    </Typography>
                </AppBar>
                {
                    <LForms forms={forms}
                        request={(data) => { request(this.state.data, data) }}
                        validate={(values) => { return validateFields(forms, values) }}
                        loading={this.state.loading}
                    >
                        {this.state.data.id == undefined ? ('') :
                        (<div>
                            <Card style={{ marginBottom: 15 }}>
                                <CardContent>
                                    <Typography>
                                        <IndeterminateCheckBoxIcon /> Fornecedores
                                    </Typography>
                                    <div  style={{
                                            alignItems: 'center',
                                            justifyContent: 'start',
                                            display: 'flex'
                                        }}>
                                        <SelectInput valueLabel="value" 
                                            json={true} 
                                            valueLabel={'company_name'}
                                            key={`input-${15019}`} id={"manager"} label={"Farmácia/Grupo"} name={"manager"} 
                                            values={this.state.providers} 
                                            style={{flexBasis: window.innerWidth < 768 ? '75%' : '75%', marginBottom: 15 }} 
                                            onChange={(e) => {
                                                this.setState({...this.state, provider: e.target.value});
                                            }} />
                                            <Button variant="contained" color="primary" size="small" disableElevation onClick={async () => {
                                                await putApiProviders(`manager/${this.state.provider}/${this.props.match.params.id}`)
                                                const data = await getApiManagers({}, this.props.match.params.id);
                                                this.setState({...this.state, provManagers: data.providers });
                                            }}><AddIcon /></Button>
                                        </div>
                                    <div style={{
                                        alignItems: 'center',
                                        justifyContent: 'start',
                                        height: 350,
                                    }}>
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
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            
                        </div>)
                        }
                    </LForms>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditContributors))
