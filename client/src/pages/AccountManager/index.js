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
import { getApiAccountmanager, putApiAccountmanager } from '../../providers/api'

import {InputCpf, stringCnpj, stringCpf,} from '../../providers/masks'
import { CircularProgress, IconButton, Toolbar } from '@material-ui/core';
import { Add, AttachMoney, MoneyOffOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { DataGrid, RowsProp, ColDef, CheckCircleIcon } from '@material-ui/data-grid';
import { stringToDate } from '../../providers/commonMethods';

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
        await putApiAccountmanager( props.id, {status: props.active ?? undefined, note: justfy});
        props.handle(props.active);
        props.handleClose();
        setjustfy('');
        setLoading(false);
    }
    return (
      <div>
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Atualização de situação</DialogTitle>
          <DialogContent>
            <DialogContentText>
            
                Confirma { props.active == 2 ? "Pendência" : "Pagamento" } do registro selecionado?
            </DialogContentText>
            { props.active == 0 &&<TextField
              autoFocus
              margin="dense"
              id="note"
              label="note"
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

class AccountManager extends Component {
    state = {
        session: JSON.parse(localStorage.getItem("user")),
        data: [],
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

    render() {
        const rows : RowsProp = this.state.data.data ?? [];
        const columns: ColDef[] = [
            { field: 'launch_date', headerName: 'Data', flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    return stringToDate(params.value, 'DD/MM/YYYY');
                }
            },
            { field: 'cpf', headerName: 'CPF/Cnpj', flex: 1,
                valueFormatter: (params: ValueFormatterParams) => {
                    if(params.row.cpf.length > 0 && params.row.cnpj.length > 0){
                        return stringCpf(params.row.cpf) + ' | ' + stringCnpj(params.row.cnpj);
                    }else if(params.row.cpf.length > 0){
                        return stringCpf(params.row.cpf);
                    }else if(params.row.cnpj.length > 0){
                        return stringCnpj(params.row.cnpj);
                    }
                }
            },
            { field: 'name', headerName: 'Nome',flex: 0.7 },
            { field: 'bill_type', headerName: 'Lançamento',flex: 0.5,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value === 1 ? "Receita" : "Despesas";
                }
            },
            { field: 'amount', headerName: 'Valor',flex: 0.5,
                valueFormatter: (params: ValueFormatterParams) => {
                    return 'R$ '+params.value.replace('.', ',');
                }
            },
            {
                field: 'status',
                headerName: 'Situação',
                flex: 0.5,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value === 1 ? "Pago" : "A Pagar";
                }
            },{
                field: 'id',
                headerName: 'Ações',
                flex: 1,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let view = this.state.session.permissions.find(x => x.module === module_id)
                    return (
                    <div>
                      <Button
                        disabled={view.update === 0}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={async (e)=> {
                            const handle = (status) => {
                                params.row.status = status;
                            }
                            this.setState({...this.state, blockDialog: {open: true, id: params.value, active: params.row.status === 1 ? 2 : 1,handle }})
                        }}
                        style={{ marginLeft: 16 }}
                      >
                        {params.row.status === 1 ? <MoneyOffOutlined fontSize="small"/> : <AttachMoney fontSize="small" /> }
                      </Button>
                      { /* <Link to={ view.update === 0 ? '#' :  `/contas/${params.value}`} style={{textDecoration: 'none'}} >
                        <Button
                            disabled={view.update === 0}
                            variant="contained"
                            color="primary"
                            size="small"
                        >
                            <EditIcon fontSize="small" />
                        </Button>
                    </Link> */}
                    </div>
                  )},
            },
        ];
        const flexBasis = '25%';
        const filter = [
            { column: 'launch_date', label: 'De', type: 'date' },
            { column: 'launch_date_to', label: 'Até', type: 'date' },
            { column: 'cpf', label: 'CPF', type: 'text',  mask: InputCpf,  flexBasis },
            { column: 'cnpj', label: 'CNPJ', type: 'text',  mask: InputCpf,  flexBasis },
            { column: 'status', label: 'Situação', type: 'select', values: ["Todos", "Efetuada", "Dependente"], value: "Todos", grow: 2  },
            { column: 'name', label: 'Nome', type: 'text'},
            //{ column: 'created_at', label: 'Data', type: 'date' },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10}}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>
                            <HomeIcon />  <span>Gerênciador de Contas</span>
                        </Typography>
                        {
                            this.state.session.permissions.find(x => x.module === module_id).create === 1 ?(
                                <Link to="contas/novo" style={{textDecoration: 'none'}} >
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
                {window.innerWidth > 720 ? (
                    <LDataGrid rows={rows} columns={columns} filterInputs={filter} 
                    sortModel={[
                        {
                          field: 'launch_date',
                          sort: 'desc',
                        },
                    ]}
                    pageRequest={
                        (params) => {
                            if(params.active !== undefined){
                                params.active = params.active == "Ativo" ? 1: 0;
                            }
                            this.setState({...this.state, pageRequest: params})
                            return getApiAccountmanager(params)
                    }} />) : (
                        <LCardGrid rows={rows} columns={columns} filterInputs={filter}
                        pageRequest={
                            (params) => {
                                if(params.active !== undefined){
                                    params.active = params.active == "Ativo" ? 1: 0;
                                }
                                this.setState({...this.state, pageRequest: params})
                                return getApiAccountmanager(params)
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountManager)
