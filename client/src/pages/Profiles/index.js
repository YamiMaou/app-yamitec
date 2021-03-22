import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
//
import AppBar from '@material-ui/core/AppBar';

import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import BlockIcon from '@material-ui/icons/Block';
import EditIcon from '@material-ui/icons/Edit';

//
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Switch from '@material-ui/core/Switch';
//
import Typography from '@material-ui/core/Typography';
import LDataGrid from '../../components/List/datagrid';
import LCardGrid from '../../components/List/cardgrid';
//
import { setSnackbar } from '../../actions/appActions'
import { getApiBonus, putApiBonus, putApiPermissions } from '../../providers/api'

import { InputCpf, stringCpf } from '../../providers/masks'
import { CircularProgress, IconButton, Toolbar } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { DataGrid, RowsProp, ColDef, CheckCircleIcon } from '@material-ui/data-grid';

// MODULE ID
const module_id = 1
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
        await putApiBonus(props.id, { active: props.active ?? undefined, justification: justfy });
        props.handle(props.active);
        props.handleClose();
        setjustfy('');
        setLoading(false);
    }
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{props.active == 0 ? "B" : "Desb"}loqueio de colaborador</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                        Confirma o {props.active == 0 ? "" : "Des"}bloqueio do registro selecionado?
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

class Profiles extends Component {
    state = {
        loading: false,
        session: JSON.parse(localStorage.getItem("user")),
        data: [],
        permissions: [
            { id: 1, module: 0, profile_id: 1, modelName: 'Colaboradores', profileName: "Administração", create: 0, read: 0, update: 0, delete: 0 },
            { id: 2, module: 0, profile_id: 2, modelName: 'Colaboradores', profileName: "Coordenador de usuários", create: 0, read: 0, update: 0, delete: 0 },
            { id: 3, module: 0, profile_id: 3, modelName: 'Colaboradores', profileName: "Coordenador de parceiros", create: 0, read: 0, update: 0, delete: 0 },
            { id: 4, module: 0, profile_id: 4, modelName: 'Colaboradores', profileName: "Gerente", create: 0, read: 0, update: 0, delete: 0 }
        ],
        pageRequest: {},
        blockDialog: { open: false, id: undefined, active: 0, handle: undefined },

    }

    componentDidMount() {
        const session = JSON.parse(localStorage.getItem("user"));
        if (session == null) {
            window.location.href = '/login';
            return;
        }
    }
    onChangeSwitch(e, permcas) {
        let row = this.state.permissions;
        row[row.findIndex(x => x.id === permcas.xid)][e.target.name] = e.target.checked ? 1 : 0;
        this.setState({ ...this.state, permissions: row });
        console.log(this.state.permissions);
    }
    async onSavePermcas(){
        this.setState({ ...this.state, loading: true });
        let save = await putApiPermissions(1,this.state.permissions);
        if(save.data.success){
            this.setState({ ...this.state, loading: false });
        }
        
    }

    render() {
        const rows: RowsProp = this.state.permissions;
        const columns: ColDef[] = [
            { field: 'modelName', headerName: 'Módulo', flex: 0.7 },
            { field: 'profileName', headerName: 'Perfil', flex: 0.7 },
            {
                field: 'create',
                headerName: 'Cadastrar',
                flex: 0.3,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    const { id, module, profile_id, create, read, update } = params.row;
                    //let prop = this.state.permissions.find(x => x.xid === permcas.xid)
                    let permca = { xid: id, module, profile_id, create, read, update }
                    return (
                        <Switch
                            //checked={!prop ?? prop.create == 1}
                            onChange={(e) => {
                                params.value = e.target.checked ? 1 : 0;
                                permca[e.target.name] = e.target.checked ? 1 : 0;
                                return this.onChangeSwitch(e, permca)
                            }}
                            name="create"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    )
                },
            },
            {
                field: 'read',
                headerName: 'Visualizar',
                flex: 0.3,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    const { id, module, profile_id, create, read, update } = params.row;
                    //let prop = this.state.permissions.find(x => x.xid === permcas.xid)
                    let permca = { xid: id, module, profile_id, create, read, update }
                    return (
                        <Switch
                            //checked={!prop ?? prop.read == 1}
                            onChange={(e) => {
                                params.value = e.target.checked ? 1 : 0;
                                permca[e.target.name] = e.target.checked ? 1 : 0;
                                return this.onChangeSwitch(e, permca)
                            }}
                            name="read"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    )
                },
            }, {
                field: 'update',
                headerName: 'Atualizar',
                flex: 0.3,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    const { id, module, profile_id, create, read, update } = params.row;
                    //let prop = this.state.permissions.find(x => x.xid === permcas.xid)
                    let permca = { xid: id, module, profile_id, create, read, update }
                    return (
                        <Switch
                            //checked={!prop ?? prop.update == 1}
                            onChange={(e) => {
                                params.value = e.target.checked ? 1 : 0;
                                permca[e.target.name] = e.target.checked ? 1 : 0;
                                return this.onChangeSwitch(e, permca)
                            }}
                            name="update"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    )
                },
            },
        ];
        const flexBasis = '25%';
        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            <HomeIcon />  <span>Cadastro / Bonificação</span>
                        </Typography>
                    </Toolbar>

                </AppBar>
                {
                    window.innerWidth > 720 ? (
                        <div style={{ height: 700, width: '100%' }}><DataGrid
                            sx={{
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

                        /></div>
                    )
                        : (<LCardGrid rows={rows} columns={columns}
                            pageRequest={
                                (params) => {
                                    if (params.active !== undefined) {
                                        params.active = params.active == "Ativo" ? 1 : 0;
                                    }
                                    this.setState({ ...this.state, pageRequest: params })
                                    return getApiBonus(params)
                                }} />
                        )}
                {!this.props.loading ?
                    (<div><Button size="small" style={{ margin: 5 }} variant="contained" color="primary" onClick={() => {
                        this.onSavePermcas();
                    }}> Salvar</Button>
                        <Button size="small" style={{ margin: 5 }} variant="contained" color="primary" onClick={() => { this.props.history.goBack(); }} > Cancelar</Button>
                    </div>) : (
                        <CircularProgress style={{ display: 'flex', margin: 'auto' }} />
                    )}
            </Fragment>
        )
    }
}
const mapStateToProps = store => ({
    session: store.authReducer.data,
});
const mapDispatchToProps = dispatch =>
    bindActionCreators({ setSnackbar }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profiles)
