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
import { getApiBonus, getApiPermissions, putApiBonus, putApiPermissions } from '../../providers/api'

import { InputCpf, stringCpf } from '../../providers/masks'
import { Card, CardActions, CardContent, CircularProgress, IconButton, List, ListItem, ListItemText, TablePagination, Toolbar } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { DataGrid, RowsProp, ColDef, CheckCircleIcon } from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from '../../providers/langs/datagrid';

// MODULE ID
const module_id = 7
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
        permissions: [],
        pageRequest: {},
        blockDialog: { open: false, id: undefined, active: 0, handle: undefined },

    }

    async componentDidMount() {
        const session = JSON.parse(localStorage.getItem("user"));
        if (session == null) {
            window.location.href = '/login';
            return;
        }
        let remotePermissions = await getApiPermissions();
        let permissions = [];
        let id = 1;
        if(remotePermissions !== undefined)
        remotePermissions.modules.map((module,k1) => {
            remotePermissions.profiles.map((profile,k2) => {
                        let permission = remotePermissions.permissions.find(perm => perm.profile_id == profile.id && perm.module_id == module.id);
                        //console.log(permission);
                        //return;
                        permissions.push(
                            { 
                                id,
                                module_id: module.id, 
                                profile_id: profile.id, 
                                modelName: module.name, 
                                profileName: profile.name, 
                                create: permission ? permission.create: 0, 
                                read: permission ? permission.read: 0, 
                                update: permission ? permission.update: 0, 
                                delete: permission ? permission.delete: 0,  
                            });
                            id++;
                    });
                });
                this.setState({...this.state, permissions})
            console.log(permissions);

    }
    async onChangeSwitch(permcas) {
        /*console.log(permcas);
        let row = this.state.permissions;
        row[row.findIndex(x => x.id === permcas.id)][e.target.name] = e.target.checked ? 1 : 0;
        console.log(row.findIndex(x => x.id === permcas.id));
        this.setState({ ...this.state, permissions: row });
        //console.log(this.state.permissions);*/
        this.setState({ ...this.state, loading: true });
        let save = await putApiPermissions(1,permcas);
        if(save.data.success){
            this.setState({ ...this.state, loading: false });
        }

    }
    async onSavePermcas(){
        this.setState({ ...this.state, loading: true });
        let save = await putApiPermissions(1,this.state.permissions);
        if(save.data.success){
            this.setState({ ...this.state, loading: false });
        }
        
    }

    render() {
        const rows: RowsProp = this.state.permissions.length > 0 ? this.state.permissions : [];
        const columns: ColDef[] = [
            { field: 'modelName', headerName: 'Módulo', flex: 0.7 },
            { field: 'profileName', headerName: 'Perfil', flex: 0.7 },
            {
                field: 'create',
                headerName: 'Cadastrar',
                flex: 0.3,
                row: true,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let { id, module_id, profile_id, create, read, update } = params.row;
                    //let permca = { id, module_id, profile_id, create, read, update }
                    let prop = this.state.permissions.find(x => x.id === id)
                    let checked = false;
                    if(prop){
                        checked = (prop.create == 1)
                    }
                    return (
                        <Switch
                        key={id+"-module-"+module_id+"-profile-"+profile_id}
                        checked={this.state.permissions[this.state.permissions.findIndex(x => x.id == id)].create == 1}
                        color="primary"
                        onClick={(e)=> {
                            let permissions = this.state.permissions;
                            console.log(permissions)
                            permissions[this.state.permissions.findIndex(x => x.id == id)].create = !permissions[this.state.permissions.findIndex(x => x.id == id)].create
                            let save = permissions[this.state.permissions.findIndex(x => x.id == id)];
                            this.onChangeSwitch(save);
                            this.setState({...this.state, permissions})
                        }}
                            name="create"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    )
                },
            },
            {
                field: 'read',
                headerName: 'Visualizar',
                flex: 0.3,
                row: true,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let { id, module_id, profile_id, create, read, update } = params.row;
                    let permca = { id, module_id, profile_id, create, read, update }
                    let prop = this.state.permissions.find(x => x.id === id)
                    let checked = false;
                    if(prop){
                        checked = (prop.read == 1)
                    }
                    return (
                        <Switch
                            key={id+"-module-"+module_id+"-profile-"+profile_id}
                            checked={this.state.permissions[this.state.permissions.findIndex(x => x.id == id)].read == 1}
                            color="primary"
                            onClick={(e)=> {
                                let permissions = this.state.permissions;
                                //console.log(permissions)
                                permissions[this.state.permissions.findIndex(x => x.id == id)].read = !permissions[this.state.permissions.findIndex(x => x.id == id)].read
                                let save = permissions[this.state.permissions.findIndex(x => x.id == id)];
                                this.onChangeSwitch(save);
                                this.setState({...this.state, permissions})
                            }}
                            onChange={(e) => {
                                /*let permissions = this.state.permissions;
                                console.log(permissions)
                                permissions[this.state.permissions.findIndex(x => x.id == id)].read = !permissions[this.state.permissions.findIndex(x => x.id == id)].read
                                this.setState({...this.state, permissions})*/
                                //params.value = e.target.checked ? 1 : 0;
                                //permca[e.target.name] = e.target.checked ? 1 : 0;
                                //return this.onChangeSwitch(e, permca)
                            }}
                            name="read"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    )
                },
            }, {
                field: 'update',
                headerName: 'Atualizar',
                flex: 0.3,
                row: true,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let { id, module_id, profile_id, create, read, update } = params.row;
                    let permca = { id, module_id, profile_id, create, read, update }
                    let prop = this.state.permissions.find(x => x.id === id)
                    let checked = false;
                    if(prop){
                        checked = (prop.update == 1)
                    }
                    return (
                        <Switch
                            key={id+"-module-"+module_id+"-profile-"+profile_id}
                            checked={this.state.permissions[this.state.permissions.findIndex(x => x.id == id)].update == 1}
                            color="primary"
                            onClick={(e)=> {
                                let permissions = this.state.permissions;
                                //console.log(permissions)
                                permissions[this.state.permissions.findIndex(x => x.id == id)].update = !permissions[this.state.permissions.findIndex(x => x.id == id)].update
                                let save = permissions[this.state.permissions.findIndex(x => x.id == id)];
                                this.onChangeSwitch(save);
                                this.setState({...this.state, permissions})
                            }}
                            name="update"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    )
                },
            },{
                field: 'delete',
                headerName: 'Deletar/Bloquear',
                flex: 0.3,
                row: true,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let { id, module_id, profile_id, create, read, update } = params.row;
                    let permca = { id, module_id, profile_id, create, read, update }
                    let prop = this.state.permissions.find(x => x.id === id)
                    let checked = false;
                    if(prop){
                        checked = (prop.delete == 1)
                    }
                    return (
                        <Switch
                            key={id+"-module-"+module_id+"-profile-"+profile_id}
                            checked={this.state.permissions[this.state.permissions.findIndex(x => x.id == id)].delete == 1}
                            color="primary"
                            onClick={(e)=> {
                                let permissions = this.state.permissions;
                                //console.log(permissions)
                                permissions[this.state.permissions.findIndex(x => x.id == id)].delete = !permissions[this.state.permissions.findIndex(x => x.id == id)].delete
                                let save = permissions[this.state.permissions.findIndex(x => x.id == id)];
                                this.onChangeSwitch(save);
                                this.setState({...this.state, permissions})
                            }}
                            name="delete"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
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
                            <HomeIcon />  <span>Permissões</span>
                        </Typography>
                    </Toolbar>

                </AppBar>
                        <div style={{ height: 700, width: '100%' }}>
                        {window.innerWidth > 720 ? (
                        <DataGrid
                            sx={{
                                '& .MuiDataGrid-root': {
                                    '& .MuiDataGrid-viewport': {
                                        maxWidth: '600px',
                                    },
                                }
                            }}
                            rows={rows} columns={columns}
                            localeText={{...DEFAULT_LOCALE_TEXT, filterPanelInputLabel:'Valor'}}
                            spacing={0}
                            stickyHeader
                            disableClickEventBubbling
                            //disableColumnMenu={true}

                        />) : (
                            <div style={{ height: 450, width: '100%' }}>
                        {rows.length == 0 ? (
                            <Card style={{marginTop: 15}}>
                                <CardContent> Não há registros</CardContent>
                            </Card>) : ('')
                        }
                        {rows.map((row, key) => {
                            //console.log(row);
                            return (
                                <Card key={`card-container${key}`} style={{marginTop: 15}}>
                                    <CardContent>
                                    <List key={`list_field_${key}`} component="nav">
                                        {Object.entries(row).map(field => {
                                            
                                            let headerName = columns.find(column => column.field === field[0]);
                                            if (headerName && headerName.field !== 'id') {
                                                //console.log(field[1])
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
                                        })}
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
                        }
                        )}
                    </div>
                        )}</div>
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
