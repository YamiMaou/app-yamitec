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
import { deleteApiBonus, getApiBonus, putApiBonus } from '../../providers/api'

import {InputCpf, stringCpf} from '../../providers/masks'
import { CircularProgress, IconButton, Toolbar } from '@material-ui/core';
import { Add, DeleteForeverOutlined } from '@material-ui/icons';
import { Link, withRouter } from 'react-router-dom';
import { DataGrid, RowsProp, ColDef, CheckCircleIcon } from '@material-ui/data-grid';

// MODULE ID
const module_id = 5
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
        await deleteApiBonus( props.id, {justification: justfy});
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

class Bonus extends Component {
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
            { field: 'indication_qtty', headerName: 'Quantidade', flex: 0.7,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value;
                }
            },
            { field: 'discount_percent', headerName: 'Desconto (%)',flex: 2,
                valueFormatter: (params: ValueFormatterParams) => {
                    return `${params.value}%`
                }
            },
            {
                field: 'id',
                headerName: 'Ações',
                flex: 1,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let view = this.state.session.permissions.find(x => x.module_id === module_id)
                    return (
                    <div>
                    <Link to={ view.update === 0 ? '#' :  `/bonificacao/${params.value}`} style={{textDecoration: 'none'}} >
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
                        variant="contained" color="primary"
                        size="small"
                        onClick={async (e)=> {
                            const handle = async (justify) => {
                                this.props.setSnackbar({open: true, message: "Excluído com Êxito!"});
                                setTimeout(()=> {this.props.history.go(0)}, 1000);
                            }
                            this.setState({...this.state, blockDialog: {open: true, id: params.row.id,handle }})
                        }}
                        style={{ marginLeft: 16 }}
                      >
                        <DeleteForeverOutlined fontSize="small"/>
                      </Button> 
                    </div>
                  )},
            },
        ];
        const flexBasis = '25%';
        const filter = [
            { column: 'indication_qtty', label: 'Quantidade', type: 'text', flexBasis },
            { column: 'discount_percent', label: 'Desconto (%)', type: 'percent', flexBasis },
            //{ column: 'created_at', label: 'Data', type: 'date' },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10}}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>
                            <HomeIcon />  <span>Cadastro / Bonificação</span>
                        </Typography>
                        {
                            this.state.session.permissions.find(x => x.module_id === module_id).create === 1 ?(
                                <Link to="/bonificacao/novo" style={{textDecoration: 'none'}} >
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
                   
                    pageRequest={
                        (params) => {
                            if(params.active !== undefined){
                                params.active = params.active == "Ativo" ? 1: 0;
                            }
                            if(params.discount_percent)
                                params.discount_percent = params.discount_percent.replace(',','.');
                            this.setState({...this.state, pageRequest: params})
                            return getApiBonus(params)
                    }} />) : (
                        <LCardGrid rows={rows} columns={columns} filterInputs={filter}
                        pageRequest={
                            (params) => {
                                if(params.active !== undefined){
                                    params.active = params.active == "Ativo" ? 1: 0;
                                }
                                if(params.discount_percent)
                                    params.discount_percent = params.discount_percent.replace(',','.');
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bonus))
