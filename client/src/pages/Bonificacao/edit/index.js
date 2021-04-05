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
import { putApiBonus, getAddressByCepla, getApiClients, getApiBonus, deleteApiBonus } from '../../../providers/api'
import { validaEmail, validaCpf, stringToaddDate } from '../../../providers/commonMethods'
//
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//
import { InputCep, InputCpf, InputPhone } from '../../../providers/masks'
import { Redirect } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { DeleteForever } from '@material-ui/icons';
import { Button, CircularProgress, Toolbar } from '@material-ui/core';
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
        await deleteApiBonus(props.id, { justification: justfy });
        props.handle(1);
        props.handleClose();
        setjustfy('');
        setLoading(false);
    }
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Exclusão definitiva de registro</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirma a exclusão permanente do  registro?
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
class EditBonus extends Component {
    state = {
        data: {},
        loading: false,
        blockDialog: { open: false, id: undefined, active: 0, handle: undefined },
    }
    async componentDidMount() {
        if (JSON.parse(localStorage.getItem("user")) == null) {
            window.location.href = '/login';
            return;
        }
        localStorage.setItem("sessionTime", 9000)
        let data = await getApiBonus({}, this.props.match.params.id);
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
            data = Object.assign({}, state.addresses, data);
            data = Object.assign({}, state.contacts, data);
            data = Object.assign({}, state, data);
            delete data.addresses;
            delete data.contacts;
            let response = await putApiBonus(this.props.match.params.id, data);
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
                            if (v1.validate.decimal !== undefined) {
                                if (/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/.test(value) == false)
                                    campo = { id: v1.column, message: `O Campo ${v1.label} é somente números e ponto ` }
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
                    { column: 'indication_qtty', label: 'Quantidade', type: 'text', validate: { min: 1, number: true, required: true }, value: 1, flexBasis: "45%", value: this.state.data.indication_qtty },
                    { column: 'discount_percent', label: 'Desconto (%)', type: 'text', validate: { min: 1, decimal: true, required: true }, flexBasis: '45%', value: this.state.data.discount_percent },
                ]
            },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Toolbar>
                        <Typography variant="h6"  style={{flexGrow: 1}}>
                            <HomeIcon />  <span>Editar / Colaboradores</span>
                        </Typography>
                        { /*<Button variant="contained" size="small" color="primary"
                            style={{
                                background: 'linear-gradient(45deg, #c50000 30%, rgb(234 16 0) 90%)',
                            }}
                            onClick={(e)=> {
                                const handle = async (status) => {
                                    this.props.history.goBack();
                                }
                                this.setState({...this.state, blockDialog: {open: true, id: this.props.match.params.id, handle }})
                            }}>
                            Deletar <DeleteForever style={{ color: 'white' }} fontSize="small" />
                        </Button> */} 
                    </Toolbar>
                </AppBar>
                {
                    <LForms forms={forms}
                        request={(data) => { request(this.state.data, data) }}
                        validate={(values) => { return validateFields(forms, values) }}
                        loading={this.state.loading}
                    />
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
                <BlockDialog
                    open={this.state.blockDialog.open}
                    id={this.state.blockDialog.id}
                    handle={this.state.blockDialog.handle}
                    active={this.state.blockDialog.active}
                    handleClose={() => {
                        this.setState({ ...this.state, blockDialog: { open: false, id: undefined } })
                    }}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditBonus))
