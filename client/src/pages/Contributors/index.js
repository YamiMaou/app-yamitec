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
//
import Typography from '@material-ui/core/Typography';
import LDataGrid from '../../components/List/datagrid';
//
import { setSnackbar } from '../../actions/appActions'
import { getApiContributors, putApiContributors } from '../../providers/api'

import {InputCpf, stringCpf} from '../../providers/masks'
import { IconButton, Toolbar } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { DataGrid, RowsProp, ColDef } from '@material-ui/data-grid';

function BlockDialog(props) {
    const [open, setOpen] = React.useState(props.open);
    const [justfy, setjustfy] = React.useState("");
  
    const handleClose = () => {
      setOpen(false);
    };
    
    const send = async () => {
        await putApiContributors( props.id, {active: 0 ?? undefined, justification: justfy});
        props.handleClose();
    }
    return (
      <div>
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Bloqueio de Colaborador</DialogTitle>
          <DialogContent>
            <DialogContentText>
                Confirma o bloqueio do registro selecionado?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="jistification"
              label="Jistificativa"
              type="text"
              fullWidth
              value={justfy}
              onChange={(e) => {
                setjustfy(e.target.value)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} color="primary">
              NÃO
            </Button>
            <Button onClick={send} color="primary">
              SIM
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

class Contributors extends Component {
    state = {
        contributors: [],
        blockDialog: {open: false, id: undefined}
    }
    
    async componentDidMount() {
    }

    render() {
        const authData = JSON.parse(localStorage.getItem("user"));
        const classes = {
            root: {
                //maxWidth: 345,
                height: window.innerHeight -150
            },
            media: {
                height: 140,
            },
        }
        const rows : RowsProp = this.state.contributors.data ?? [];
        const columns: ColDef[] = [
            { field: 'cpf', headerName: 'Cpf', flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    return stringCpf(params.value);
                }
            },
            { field: 'name', headerName: 'Nome',flex: 2 },
            { field: 'function', headerName: 'Função', flex: 1 },
            {
                field: 'active',
                headerName: 'Situação',
                flex: 0.5,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value === 1 ? "Ativo" : "Inativo"
                }
            },{
                field: 'id',
                headerName: 'Ações',
                flex: 1,
                renderCell: (params: ValueFormatterParams) => (
                    <div>
                    <Link to={`/colaboradores/${params.value}`} style={{textDecoration: 'none'}} >
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
                        onClick={async ()=> {
                            this.setState({...this.state, blockDialog: {open: true, id: params.value}})
                        }}
                        style={{ marginLeft: 16 }}
                      >
                        <BlockIcon fontSize="small"/>
                      </Button>
                    </div>
                  ),
            },
        ];
        const flexBasis = '25%';
        const filter = [
            { column: 'cpf', label: 'CPF', type: 'text', 
            mask: InputCpf, 
            flexBasis },
            { column: 'name', label: 'Nome', type: 'text', flexBasis },
            {
                column: 'function', label: 'Função', type: 'select',
                values: [
                    "Todos",
                    "Administração",
                    "Coordenador de usuários", 
                    "Coordenador de parceiros", 
                    "Gerente", 
                    "Operador de marketing", 
                    "Vendedor"
                ],
                value: "Todos",
                flexBasis
            },
            { column: 'active', label: 'Situação', type: 'select', values: ["Todos", "Ativo", "Inativo"], value: "Todos", flexBasis },
            //{ column: 'created_at', label: 'Data', type: 'date' },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10}}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>
                            <HomeIcon />  <span>Cadastro / Colaboradores</span>
                        </Typography>
                        <Link to="colaboradores/novo" style={{textDecoration: 'none'}} >
                        <Button variant="contained" size="small" fullWidth color="primary"
                            style={{
                            background: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',
                            }}>
                                Novo <Add style={{color: 'white'}} fontSize="small"/>
                            </Button>
                        </Link>
                        
                    </Toolbar>
                    
                </AppBar>
                    <LDataGrid rows={rows} columns={columns} filterInputs={filter} 
                    pageRequest={
                        (params) => {
                            if(params.active !== undefined){
                                params.active = params.active == "Ativo" ? 1: 0;
                            }
                            return getApiContributors(params)
                    }} />
                        <BlockDialog 
                            open={this.state.blockDialog.open} 
                            id={this.state.blockDialog.id}
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

export default connect(mapStateToProps, mapDispatchToProps)(Contributors)
