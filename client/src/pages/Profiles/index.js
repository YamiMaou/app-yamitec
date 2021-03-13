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
import { getApiBonus, putApiBonus } from '../../providers/api'

import {InputCpf, stringCpf} from '../../providers/masks'
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
        await putApiBonus( props.id, {active: props.active ?? undefined, justification: justfy});
        props.handle(props.active);
        props.handleClose();
        setjustfy('');
        setLoading(false);
    }
    return (
      <div>
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{ props.active == 0 ? "B" : "Desb" }loqueio de colaborador</DialogTitle>
          <DialogContent>
            <DialogContentText>
            
                Confirma o { props.active == 0 ? "" : "Des" }bloqueio do registro selecionado?
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

class Profiles extends Component {
    state = {
        session: JSON.parse(localStorage.getItem("user")),
        data: [],
        permissions: [],
        pageRequest: {},
        blockDialog: {open: false, id: undefined,active: 0, handle: undefined},
       
    }
    
    componentDidMount() {
        const session = JSON.parse(localStorage.getItem("user"));
        if(session == null){
            window.location.href = '/login';
            return;
        }
    }
    onChangeSwitch(e,permcas) {
        let rowValues = this.state.permissions.find(x => x.module === permcas.xid)
        console.log(rowValues);
        if(rowValues == undefined){
            this.setState({...this.state, permissions: [permcas]})
        } else {
            rowValues = this.state.permissions.map((x,k)=> {
                if(x.module === permcas.xid){
                    console.log(e.target.name + ' -> ' + e.target.checked)
                    return x[e.target.name] = e.target.checked ? 1 : 0;
                }
                
            });
            this.setState({...this.state, permissions: rowValues})
        }
        //rowValues[e.target.name] = e.target.checked ? 1: 0;
        let permissions = this.state.permissions;
        //permissions.push(permcas)
        console.log(this.state.permissions);
        //this.setState({...this.state, permissions});
    }

    render() {
        const rows : RowsProp = [
            {id: 1, module: 0, profile_id: 1, modelName: 'Colaboradores', profileName: "Administração", create: 0, read: 0, update:0, delete:0 },
            {id: 2, module: 0, profile_id: 2, modelName: 'Colaboradores', profileName: "Coordenador de usuários", create: 0, read: 0, update:0, delete:0 },
            {id: 3, module: 0, profile_id: 3, modelName: 'Colaboradores', profileName: "Coordenador de parceiros", create: 0, read: 0, update:0, delete:0 },
            {id: 4, module: 0, profile_id: 4, modelName: 'Colaboradores', profileName: "Gerente", create: 0, read: 0, update:0, delete:0 }
        ];
        const columns: ColDef[] = [
            { field: 'modelName', headerName: 'Módulo', flex: 0.7 },
            { field: 'profileName', headerName: 'Perfil', flex: 0.7 },
            {
                field: 'create',
                headerName: 'Cadastrar',
                flex: 0.3,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    const {id, module, profile_id, create, read, update} = params.row;
                    let permca = {xid: id, module, profile_id, create, read, update}
                    return (
                        <Switch
                            //checked={create}
                            onChange={(e) => this.onChangeSwitch(e, permca)}
                            name="create"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                  )},
            },
            {
                field: 'read',
                headerName: 'Visualizar',
                flex: 0.3,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let view = this.state.session.permissions.find(x => x.module === module_id)
                    return (
                        <Switch
                            
                            name="read"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                  )},
            },{
                field: 'update',
                headerName: 'Atualizar',
                flex: 0.3,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let view = this.state.session.permissions.find(x => x.module === module_id)
                    return (
                        <Switch
                            
                            name="update"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                  )},
            },
        ];
        const flexBasis = '25%';
        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10}}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>
                            <HomeIcon />  <span>Cadastro / Bonificação</span>
                        </Typography>
                        {
                            this.state.session.permissions.find(x => x.module === module_id).create === 1 ?(
                                <Link to="bonificacao/novo" style={{textDecoration: 'none'}} >
                                <Button variant="contained" size="small" fullWidth color="primary"
                                    style={{
                                    background: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',
                                    }}>
                                        Novo <Add style={{color: 'white'}} fontSize="small"/>
                                    </Button>
                                </Link>) : ('')
                        }
                        
                        
                    </Toolbar>
                    
                </AppBar>
                {
                window.innerWidth > 720 ? ( 
                    <div style={{ height: 700, width: '100%' }}><DataGrid
                    sx={{
                        '& .MuiDataGrid-root':{
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
                                if(params.active !== undefined){
                                    params.active = params.active == "Ativo" ? 1: 0;
                                }
                                this.setState({...this.state, pageRequest: params})
                                return getApiBonus(params)
                        }}  />
                    )}
                        <BlockDialog 
                            open={this.state.blockDialog.open} 
                            id={this.state.blockDialog.id}
                            handle={this.state.blockDialog.handle}
                            active={this.state.blockDialog.active}
                            handleClose={() => {
                                this.setState({...this.state, blockDialog: { open : false, id: undefined }})
                            }}
                            />
            </Fragment>
        )
    }
}
const mapStateToProps = store => ({
    session: store.authReducer.data,
});
const mapDispatchToProps = dispatch =>
    bindActionCreators({ setSnackbar}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profiles)
