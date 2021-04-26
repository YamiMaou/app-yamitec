import React, { Component, Fragment, useState, useRef, useEffect   } from 'react'
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
import LCardGrid from '../../../components/List/cardgrid';
//

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
import { postApiManagers, getApiProviders, getApiDownloadFile, getApiManagers } from '../../../providers/api'
import { validaEmail, validaCpf, isFutureData } from '../../../providers/commonMethods'

import { InputCep, InputCpf, InputPhone, stringCnpj } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';
import { CardActions, List, ListItem, ListItemText } from '@material-ui/core';
import { withSnackbar  } from 'notistack';
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
        //console.log(e.target.value)
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

class CreateManagers extends Component {
    
    state = {
        filter: ['flex'],
        managers: [],
        providers: [],
        provider: undefined,
        provManagers: [],
        states: []
    }
    async componentDidMount() {
        localStorage.setItem("sessionTime", 900)
        const providers = await getApiProviders();
        this.setState({...this.state, providers: providers.data});

    }
    render() {
        const setProviders = async () => {
            let provManagers = this.state.provManagers;
            if(provManagers.find(x => x.id === this.state.provider)){
                this.props.setSnackbar({ open: true, message: 'Fornecedor já associado.' });
                return false;
            }
            this.setState({...this.state, provManagers: undefined});
            const prov = await getApiProviders({}, this.state.provider);
            provManagers.push(prov);
            this.setState({...this.state, provManagers});
        }
         // to use snackbar Provider
        const closeSnack = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            this.props.setSnackbar({ open: false, message: "" });
        };
        
        const request = async (data) => {
            this.props.setSnackbar({ open: true, message: "Validando Dados, Aguarde ...", });
            let providers = [];
            this.state.provManagers.map(values => {
                providers.push(values.id);
            });
            data.providers = providers;
            this.setState({ ...this.state, loading: true });
            let response = await postApiManagers(data);
            if (response.data.success) {
                this.props.setSnackbar({ open: true, message: response.data.message });
                this.setState({ ...this.state, loading: false });
                this.props.history.goBack();
            } else {
                console.log(response)
                let errors = response.data ?? undefined;

                let messages = '';
                if(errors !== undefined && errors.error !== undefined && errors.error.response && errors.error.response.data !== undefined && errors.error.response.data.errors !== undefined){
                    Object.keys(errors.error.response.data.errors).map(err => {
                        console.log(err);
                        let field = err == "file" ? "Anexo" : err
                        messages += `O ${field.toUpperCase()} ${errors.error.response.data.errors[err][0]} \n`;
                    })
                } else{
                    if(errors.success == false){
                        messages = errors.message;
                    }else{
                        messages = 'Houve um problema em sua requisição!'
                    }
                    
                }
                this.setState({ ...this.state, loading: false });
                this.props.setSnackbar({ open: true, message: messages});
            }

        }
        const validateFields = (fields, values) => {
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
                campo !== undefined ? this.props.setSnackbar({ open: true, message: campo.message}) : '';

                return campo === undefined ? true : false
        }
        const flexBasis = '22%';
        const forms = [
            {
                title: 'Dados Básicos',
                fields: [
                    { column: 'active', label: 'Ativo', type: 'checkbox',  value: 1, disabled: true, flexBasis : "100%" },
                    { column: 'cpf', label: 'CPF', type: 'text', mask: InputCpf, validate: {min: 11, number: true, required: true},validateHandler: validaCpf, flexBasis: '12%', helperText: "o valor digitado é inválido" },
                    { column: 'name', label: 'Nome', type: 'text', validate: {max: 50, required: true}, flexBasis },
                    {
                        column: 'function', label: 'Função', type: 'text',
                        validate: {required: true },
                        flexBasis, style:{width: '220px'}
                    },
                ]
            },
            {
                title: 'Contato',
                fields: [
                    { column: 'phone1', label: 'Contato', type: 'text', mask: InputPhone, validate: {max: 15, required: true}, flexBasis: '20%' },
                    { column: 'phone2', label: 'Contato alternativo', type: 'text', mask: InputPhone, validate: {max: 15}, flexBasis: '20%' },
                    { column: 'email', label: 'E-mail', type: 'email', validate: {max: 100}, validateHandler: validaEmail, flexBasis: '20%' },
                ]
            },
            {
                title: 'Redes Sociais',
                fields: [
                    { column: 'linkedin', label: 'Usuário do LinkedIn', type: 'text', validate: {max: 100, required: true}, flexBasis: '20%' },
                    { column: 'facebook', label: 'Usuário do Facebook', type: 'text', validate: {max: 100, required: true}, flexBasis: '20%' },
                    { column: 'instagram', label: 'Usuário do Instagram', type: 'text', validate: {max: 100, required: true}, flexBasis: '20%' },
                ]
            }
        ];

        // Providers Grid
        const rows: RowsProp = (this.state.provManagers !== undefined) ? this.state.provManagers : [];
        const columns: ColDef[] = [
            {
                field: 'company_name', headerName: 'Farmácia', flex: 1.2, row:true,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.row.company_name +" - "+ stringCnpj(params.row.cnpj ?? '00000000000000');
                }
            },
           { 
            field: 'phone1', headerName: 'Telefone', flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    //let provider = this.state.providers.filter(prov => prov.id === params.row.id); 
                    //console.log(params.row)
                    return params.row.contacts ? params.row.contacts.phone1 : '-';
                }
            },
            { 
                field: 'email', headerName: 'E-mail',flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    //let provider = this.state.providers.filter(prov => prov.id === params.row.id); 
                    //console.log(provider)
                    return params.row.contacts ? params.row.contacts.email : '';
                }
            },
            { 
                field: 'type', headerName: 'Tipo', flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value === 1 ? "Matriz" : "Filial"
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
                                            let provManagers = this.state.provManagers;
                                            await getApiProviders({}, 1);
                                            let index = provManagers.findIndex(x => x.id == params.row.id)
                                            this.setState({...this.state, provManagers: undefined});
                                            provManagers.splice(index,1)
                                            this.setState({...this.state, provManagers });
                                            console.log(this.state.provManagers)
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
                        <HomeIcon />  <span>Cadastro / Responsável</span>
                    </Typography>
                </AppBar>
                <LForms forms={forms}
                    request={request} 
                    validate={(values) => { return validateFields(forms,values)}}
                    loading={this.state.loading} >
                        <div>
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
                                    <div  style={{
                                            alignItems: 'center',
                                            justifyContent: 'start',
                                            display: 'flex'
                                        }}>
                                        <SelectInput valueLabel="value" 
                                            json={true} 
                                            valueLabel={'company_name'}
                                            key={`input-${15019}`} id={"manager"} label={"Filial"} name={"manager"} 
                                            values={this.state.providers} 
                                            style={{flexBasis: window.innerWidth < 768 ? '75%' : '75%', marginBottom: 15 }} 
                                            onChange={(e) => {
                                                this.setState({...this.state, provider: e.target.value});
                                            }} />
                                            <Button variant="contained" color="primary" size="small" disableElevation 
                                            onClick={() => {
                                                setProviders();
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
                                        /> ) : rows.map((row, key) => {
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
                            
                        </div>
                    </LForms>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateManagers))
