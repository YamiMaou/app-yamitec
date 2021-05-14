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
import LCardGrid from '../../components/List/cardgrid';
//
import { setSnackbar } from '../../actions/appActions'
import { getApiProviders, putApiProviders } from '../../providers/api'

import {InputCnpj, stringCnpj} from '../../providers/masks'
import { CircularProgress, IconButton, Toolbar } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { DataGrid, RowsProp, ColDef, CheckCircleIcon } from '@material-ui/data-grid';
import { stringToDate } from '../../providers/commonMethods';
// MODULE ID

const module_id = 4;

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
          <DialogTitle id="form-dialog-title">{ props.active == 0 ? "B" : "Desb" }loqueio de fornecedor</DialogTitle>
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

class Providers extends Component {
    state = {
        session: JSON.parse(localStorage.getItem("user")),
        providers: [],
        pageRequest: {},
        blockDialog: {open: false, id: undefined,active: 0, handle: undefined},
       
    }
    
    componentDidMount() {
        if(JSON.parse(localStorage.getItem("user")) == null){
            window.location.href = '/login';
            return;
        }
    }

    render() {
        const rows : RowsProp = this.state.providers.data ?? [];
        const columns: ColDef[] = [
            { field: 'cnpj', headerName: 'CNPJ', flex: 1,
                valueFormatter: (params: ValueFormatterParams) => {
                    return stringCnpj(params.value);
                }
            },
            { field: 'company_name', headerName: 'Razão Social',flex: 1.2 },
            { 
                field: 'created_at', 
                headerName: 'Data de Adesão', 
                flex: 1,
                valueFormatter: (params: ValueFormatterParams) => {
                    return stringToDate(params.value, 'DD/MM/YYYY')
                } 
            },
            { 
                field: 'type', headerName: 'Tipo', flex: 1,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value === 1 ? "Matriz" : "Filial"
                } 
            },
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
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let view = this.state.session.permissions.find(x => x.module_id === module_id)
                    return(
                        
                    <div>
                    <Link to={view.update === 0 ? '#' : `/fornecedores/${params.value}`} style={{textDecoration: 'none'}} >
                        <Button
                            disabled={view.update === 0}
                            variant="contained"
                            color="primary"
                            size="small"
                        >
                            <EditIcon fontSize="small" />
                        </Button>
                    </Link>
                      <Button
                        disabled={view.delete === 0}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={async (e)=> {
                            const handle = (status) => {
                                params.row.active = status;
                            }
                            this.setState({...this.state, blockDialog: {open: true, id: params.value, active: params.row.active === 1 ? 0 : 1,handle }})
                        }}
                        style={{ marginLeft: 16 }}
                      >
                        {params.row.active === 1 ? <BlockIcon fontSize="small"/> : <CheckCircleIcon fontSize="small" /> }
                      </Button>
                    </div>
                  )},
            },
        ];
        const flexBasis = '25%';
        const filter = [
            { column: 'cnpj', label: 'CNPJ', type: 'text', mask: InputCnpj,  flexBasis: '20%' },
            { column: 'company_name', label: 'Razão Social', type: 'text', flexBasis: '20%' },
            {
                column: 'type', label: 'Tipo', type: 'select',
                values: [
                    "Matriz",
                    "Filial",
                ],
                value: "Todos",
                flexBasis:'12%'
            },
            { column: 'active', label: 'Situação', type: 'select', values: ["Ativo", "Inativo"], value: "Todos", flexBasis: '12%'},
            { column: 'created_at', label: 'Periodo de Adesão', type: 'date', flexBasis: '22%' },
            { column: 'created_at_to', label: ' até', type: 'date', flexBasis: '22%' },
            
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10}}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>
                            <HomeIcon />  <span>Cadastro / Fornecedores</span>
                        </Typography>
                        {
                        this.state.session.permissions.find(x => x.module_id === module_id).create === 1 ?
                        (
                        <Link to="fornecedores/novo" style={{textDecoration: 'none'}} >
                        <Button variant="contained" size="small" fullWidth color="primary"
                            style={{
                            background: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',
                            }}>
                                Novo <Add style={{color: 'white'}} fontSize="small"/>
                            </Button>
                        </Link>
                        ) : ('')}
                        
                    </Toolbar>
                    
                </AppBar>
                {window.innerWidth > 720 ? (
                    <LDataGrid rows={rows} columns={columns} filterInputs={filter} 
                    sortModel={[
                        {
                          field: 'company_name',
                          sort: 'asc',
                        },
                    ]}
                    pageRequest={
                        (params) => {
                            if(params.active !== undefined){
                                params.active = params.active == "Ativo" ? 1: 0;
                            }
                            if(params.type !== undefined){
                                params.type = params.type == "Matriz" ? 1: 2;
                            }
                            this.setState({...this.state, pageRequest: params})
                            return getApiProviders(params)
                    }} />) : (
                        <LCardGrid rows={rows} columns={columns} filterInputs={filter}
                        pageRequest={
                            (params) => {
                                if(params.active !== undefined){
                                    params.active = params.active == "Ativo" ? 1: 0;
                                }
                                if(params.type !== undefined){
                                    params.type = params.type == "Matriz" ? 1: 2;
                                }
                                this.setState({...this.state, pageRequest: params})
                                return getApiProviders(params)
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

export default connect(mapStateToProps, mapDispatchToProps)(Providers)
