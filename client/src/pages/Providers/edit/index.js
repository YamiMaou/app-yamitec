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
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import BlockIcon from '@material-ui/icons/Block';
import EditIcon from '@material-ui/icons/Edit';

import { setSnackbar } from '../../../actions/appActions'
import { putApiProviders, getAddressByCepla, getApiProviders, getApiProviderTypes } from '../../../providers/api'
import { validaEmail, validaCnpj, stringToaddDate } from '../../../providers/commonMethods'
import { InputCep, InputCnpj, InputPhone, stringCpf } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { DataGrid } from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from '../../../providers/langs/datagrid';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// MODULE ID
const module_id = 2
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
        await putApiProviders( props.id, {active: props.active ?? undefined, justification: justfy});
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
            { props.active == 0 &&<TextField
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
            /> }
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} color="primary">
              NÃO
            </Button>
            { !loading ? (
            <Button onClick={send} color="primary">
              SIM
            </Button>):(
                <Button color="primary">
                     <CircularProgress style={{display: 'flex'}} />
                </Button>
               
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }

class EditProviders extends Component {
    state = {
        data: {},
        providers: [],
        loading: false
    }
    async componentDidMount() {
        if (JSON.parse(localStorage.getItem("user")) == null) {
            window.location.href = '/login';
            return;
        }
        localStorage.setItem("sessionTime", 9000)
        const data = await getApiProviders({}, this.props.match.params.id);
        const providers = await getApiProviders();
        const providertypes = await getApiProviderTypes();
        console.log(data);
        this.setState({ ...this.state, data, providers: providers.data, providertypes: providertypes.data });

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
            data = Object.assign({}, state.addresses, data);
            data = Object.assign({}, state.contacts, data);
            data = Object.assign({}, state.contracts, data);
            data = Object.assign({}, state, data);
            delete data.addresses;
            delete data.contacts;
            let response = await putApiProviders(this.props.match.params.id, data);
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

                            if(v1.validate.decimal !== undefined){
                                if (/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/.test(value) == false)
                                    campo = {id: v1.column, message: `O Campo ${v1.label} é somente números e ponto ` }
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
        const forms = this.state.data.id == undefined ? [] : [
            {
                title: 'Dados Básicos',
                fields: [
                    {
                        column: 'active', label: 'Ativo', type: 'checkbox', value: this.state.data['active'] == 1 ? true : false, disabled: false,
                        justification: this.state.data['audits'] ? this.state.data['audits'].justification == null ? " " : this.state.data['audits'].justification : '',
                        flexBasis: "100%"
                    },
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
                        column: 'type', label: 'Empresa', type: 'select',
                        json: true,
                        valueLabel: "value",
                        values: [{ id: 1, value: "Matriz" }, { id: 0, value: "Filial" }],
                        validate: { required: true },
                        value: this.state.data['type'],
                        flexBasis
                    },
                    {
                        column: 'matriz_id', label: 'Matriz', type: 'select',
                        json: true,
                        values: this.state.providers,
                        valueLabel: "fantasy_name",
                        //validate: {required: true },
                        value: this.state.data['matriz_id'],
                        flexBasis, style: { width: '220px' }
                    },
                    { column: 'cnpj', label: 'CNPJ', type: 'text', value: this.state.data['cnpj'], mask: InputCnpj, validate: { min: 11, number: true, required: true }, validateHandler: validaCnpj, flexBasis: '33%', helperText: "o valor digitado é inválido" },
                    { column: 'company_name', label: 'Razão Social', type: 'text', value: this.state.data['company_name'], validate: { max: 50, required: true }, flexBasis },
                    { column: 'fantasy_name', label: 'Nome Fantasia', type: 'text', value: this.state.data['fantasy_name'], validate: { max: 50, required: true }, flexBasis: '33%' },
                    { column: 'anexo', label: 'Documento', type: 'file', value: this.state.data['anexo'], flexBasis },
                    { column: 'logo', label: 'Logo marca', type: 'file', value: this.state.data['logo'], validate: { required: true }, flexBasis },

                ]
            },
            {
                id: 'addr',
                title: 'Endereço',
                //flexFlow: 'row no-wrap',
                //json: "address",
                fields: [
                    { column: 'addr_clone', label: 'Clonar Matriz', type: 'checkbox', flexBasis: "100%", value: this.state.data.addr_clone },
                    { column: 'zipcode', label: 'CEP', type: 'text', mask: InputCep, validate: { max: 9, required: true }, flexBasis: '9%', value: this.state.data['addresses'].zipcode },
                    { column: 'street', label: 'Endereço', validate: { max: 100, required: true }, type: 'text', flexBasis, value: this.state.data['addresses'].street },
                    { column: 'additional', label: 'Complemento', type: 'text', flexBasis, value: this.state.data['addresses'].additional != 'null' ? this.state.data['addresses'].additional : '' },
                    {
                        column: 'uf', label: 'Estado', type: 'select',
                        values: ["Acre", "Alagoas", "Amazonas", "Amapá", "Bahia", "Ceará", "Brasília", "Espírito Santo", "Goiás", "Maranhão", "Minas Gerais", "Mato Grosso do Sul", "Mato Grosso", "Pará", "Paraíba", "Pernambuco", "Piauí", "Paraná", "Rio de Janeiro", "Rio Grande do Norte", "Rondônia", "Roraima", "Rio Grande do Sul", "Santa Catarina", "Sergipe", "São Paulo", "Tocantins"],
                        value: this.state.data['addresses'].uf, flexBasis, flexGrow: 2, style: { minWidth: "192px" }
                    },
                    { column: 'city', label: 'Cidade', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['addresses'].city },
                ]
            },
            {
                title: 'Contato',
                //json: 'contact',
                fields: [
                    { column: 'contact_clone', label: 'Clonar Matriz', type: 'checkbox', flexBasis: "100%", value: this.state.data.contact_clone },
                    { column: 'phone1', label: 'Contato', type: 'text', mask: InputPhone, validate: { max: 15, required: true }, flexBasis, value: this.state.data['contacts'].phone1 },
                    { column: 'phone2', label: 'Contato alternativo', type: 'text', mask: InputPhone, validate: { max: 15 }, flexBasis, value: this.state.data['contacts'].phone2 },
                    { column: 'email', label: 'E-mail', type: 'email', validate: { max: 100 }, validateHandler: validaEmail, flexBasis, value: this.state.data['contacts'].email },
                    { column: 'site', label: 'Site', type: 'text', validate: { max: 100 }, flexBasis: '20%', value: this.state.data['contacts'].site },
                ]
            },
            {
                title: 'Redes Sociais',
                //json: 'contact',
                fields: [
                    { column: 'linkedin', label: 'Usuário do LinkedIn', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['contacts'].linkedin },
                    { column: 'facebook', label: 'Usuário do Facebook', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['contacts'].facebook },
                    { column: 'instagram', label: 'Usuário do Instagram', type: 'text', validate: { max: 100, required: true }, flexBasis, value: this.state.data['contacts'].instagram },
                ]
            },
            {
                title: 'Contrato Atual',
                //json: 'contact',
                fields: [
                    { column: 'contract_clone', label: 'Clonar Matriz', type: 'checkbox', flexBasis: "100%" },
                    { column: 'accession_date', label: 'Data de Adesão - Início', type: 'date', validate: { required: true }, flexBasis: '20%', value: this.state.data['contracts'].accession_date },
                    { column: 'end_date', label: 'Data de Adesão - Fim', type: 'date', validate: { required: true }, flexBasis: '20%', value: this.state.data['contracts'].end_date },
                    { column: 'rate', label: 'Taxa de Adesão', type: 'number', validate: { required: true, decimal: true }, flexBasis: '20%', value: this.state.data['contracts'].rate },
                ]
            }
        ];
        const rows = this.state.data.managers ?? [];
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
                            <Link to={`/responsaveis/${params.value}`} style={{ textDecoration: 'none' }} >
                                <Button
                                   
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                >
                                    <EditIcon fontSize="small" />
                                </Button>
                            </Link>
                            <Button
                                
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={async (e) => {
                                    const handle = (status) => {
                                        params.row.active = status;
                                    }
                                    this.setState({ ...this.state, blockDialog: { open: true, id: params.value, active: params.row.active === 1 ? 0 : 1, handle } })
                                }}
                                style={{ marginLeft: 16 }}
                            >
                                {params.row.active === 1 ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                            </Button>
                        </div>
                    )
                },
            },
        ];

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Typography variant="h6">
                        <HomeIcon />  <span>Editar / Colaboradores</span>
                    </Typography>
                </AppBar>
                {
                    <LForms forms={forms}
                        request={(data) => { request(this.state.data, data) }}
                        validate={(values) => { return validateFields(forms, values) }}
                        loading={this.state.loading}
                    >
                        {this.state.data.id !== undefined && 
                        (<div>
                            <Card style={{ marginBottom: 15 }}>
                                <CardContent>
                                    <Typography>
                                        <IndeterminateCheckBoxIcon /> Responsáveis
                                    </Typography>
                                    <div style={{
                                        alignItems: 'center',
                                        justifyContent: 'start',
                                        height: 350
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
                                Id:  <b>{this.state.data.audits.id}</b>
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
