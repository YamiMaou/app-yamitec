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
import { deleteApiAccountmanager, getApiAccountmanager, putApiAccountmanager } from '../../providers/api'

import { InputCpf, stringCnpj, stringCpf, } from '../../providers/masks'
import { CircularProgress, IconButton, ListItem, ListItemText, Popover, Toolbar, Tooltip } from '@material-ui/core';
import { Add, AttachMoney, DeleteForeverOutlined, FiberManualRecord, MoneyOffOutlined, TrendingUpOutlined } from '@material-ui/icons';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { DataGrid, RowsProp, ColDef, CheckCircleIcon } from '@material-ui/data-grid';
import { stringToDate } from '../../providers/commonMethods';

import { withRouter } from 'react-router-dom'

// MODULE ID
const module_id = 6

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
        if (props.delete) {
            props.handle(1);
        } else {
            await putApiAccountmanager(props.id, { status: props.active ?? undefined, note: justfy });
            props.handle(props.active);
        }
        props.handleClose();
        setjustfy('');
        setLoading(false);
    }
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{props.delete ? `Deleção de Registro` : `Atualização de situação`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirma {!props.delete ? props.active == 2 ? "Pendência" : "Pagamento" : ` Exclusão `} do registro selecionado?
            </DialogContentText>
                    {props.delete == true && <TextField
                        autoFocus
                        margin="dense"
                        id="Justificativa"
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
class AccountManager extends Component {
    state = {
        session: JSON.parse(localStorage.getItem("user")),
        data: [],
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

    render() {
        const rows: RowsProp = this.state.data.data ?? [];
        const columns: ColDef[] = [
            {
                field: 'launch_date', headerName: 'Data', flex: 0.7, row:true,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    console.log(params.row);
                    return window.innerWidth > 720 ?
                     (<div>
                        {stringToDate(params.value, 'DD/MM/YYYY')}
                        <Tooltip placement="right" title={`Motivo: ${params.row.note != (null|| undefined) ? params.row.note : "Sem Motivo"}`} arrow>
                            <FiberManualRecord color="primary" />
                        </Tooltip>
                        </div>
                    ) : (
                        <div>
                            {stringToDate(params.row.launch_date, 'DD/MM/YYYY')}
                            <ListItemText primary={<span style={{color:'black'}}>Motivo</span>} secondary={params.row.note != (null|| undefined) ? params.row.note : "Sem Motivo"} />
                        </div>
                    )
                    
                }
            },
            {
                field: 'cpf_cnpj', row: true, headerName: 'CPF/CNPJ', flex: 1,
                valueFormatter: (params: ValueFormatterParams) => {
                    let cpfcnpj = params.row.cpf_cnpj != null ? params.row.cpf_cnpj.length > 11
                        ? stringCnpj(params.row.cpf_cnpj) : stringCpf(params.row.cpf_cnpj) : "";
                    return cpfcnpj;
                }
            },
            { field: 'name', headerName: 'Nome', flex: 0.7 },
            {
                field: 'bill_type', headerName: 'Lançamento', flex: 0.5,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value === 1 ? "Receita" : "Despesas";
                }
            },
            {
                field: 'amount', headerName: 'Valor', flex: 0.5,
                valueFormatter: (params: ValueFormatterParams) => {
                    let tmp = params.value.replace(/[^\d]/g, "") + '';
                    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
                    if (tmp.length > 6)
                        tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
                    if (tmp.length >= 10)
                        tmp = tmp.replace(/([0-9]{3})\.([0-9]{3}),([0-9]{2}$)/g, "$1.$2,$3");

                    return 'R$ ' + tmp;
                }
            },
            {
                field: 'status',
                headerName: 'Situação',
                flex: 0.5,
                valueFormatter: (params: ValueFormatterParams) => {
                    return params.value === 1 ? "Efetuado" : "Dependente";
                }
            }, {
                field: 'id',
                headerName: 'Ações',
                flex: 1,
                renderCell: (params: ValueFormatterParams, row: RowIdGetter) => {
                    let view = this.state.session.permissions.find(x => x.module_id === module_id)

                    return (
                        <div>
                            <Button
                                disabled={view.update === 0}
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={async (e) => {
                                    const handle = (status) => {
                                        params.row.status = status;
                                    }
                                    this.setState({ ...this.state, blockDialog: { open: true, id: params.value, active: params.row.status === 1 ? 2 : 1, handle } })
                                }}
                                style={{ marginLeft: 16 }}
                            >
                                {params.row.status === 1 ? <MoneyOffOutlined fontSize="small" /> : <AttachMoney fontSize="small" />}
                            </Button>
                            {params.row.detached == 1 &&
                                <Button
                                    disabled={view.delete === 0}
                                    variant="contained"
                                    color="primary"
                                    onClick={async (e) => {
                                        const handle = async (justify) => {
                                            const delRow = await deleteApiAccountmanager(params.row.id, { justification: justify });
                                            this.props.setSnackbar({ open: true, message: "Excluído com Êxito!" });
                                            setTimeout(() => { this.props.history.go(0) }, 1000);
                                        }
                                        this.setState({ ...this.state, blockDialog: { open: true, delete: true, handle } })
                                    }}
                                    style={{ marginLeft: 16 }}
                                >
                                    <DeleteForeverOutlined fontSize="small" />
                                </Button>}
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
                    )
                },
            },
        ];
        const flexBasis = '25%';
        const filter = [
            { column: 'launch_date', label: 'De', type: 'date' },
            { column: 'launch_date_to', label: 'Até', type: 'date' },
            { column: 'cpf_cnpj', label: 'CPF/CNPJ', type: 'text', mask: 'cpfcnpj', flexBasis },
            { column: 'status', label: 'Situação', type: 'select', values: ["Efetuada", "Dependente"], value: "Todos", grow:0, flexBasis: window.innerWidth < 720 ? flexBasis : '14%'  },
            { column: 'name', label: 'Nome', type: 'text', flexBasis, grow: 1 },
            //{ column: 'created_at', label: 'Data', type: 'date' },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            <HomeIcon />  <span>Gerênciador de Contas</span>
                        </Typography>
                        {
                            this.state.session.permissions.find(x => x.module_id === module_id).create === 1 ? (
                                <Link to="contas/novo" style={{ textDecoration: 'none' }} >
                                    <Button variant="contained" size="small" fullWidth color="primary"
                                        style={{
                                            background: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',
                                        }}>
                                        Novo <Add style={{ color: 'white' }} fontSize="small" />
                                    </Button>
                                </Link>) : ('')
                        }


                    </Toolbar>

                </AppBar>
                {window.innerWidth > 720 ? (
                    <LDataGrid rows={rows} columns={columns} filterInputs={filter}
                        autoload={true}
                        sortModel={[
                            {
                                field: 'launch_date',
                                sort: 'desc',
                            },
                        ]}
                        pageRequest={
                            (params) => {
                                if (params.status)
                                    params.status = "Efetuada" ? 1 : 0
                                if (params.cpf_cnpj)
                                    params.cpf_cnpj = params.cpf_cnpj.replace(/\D/gim, '')
                                if (params.active !== undefined) {
                                    params.active = params.active == "Ativo" ? 1 : 0;
                                }
                                this.setState({ ...this.state, pageRequest: params })
                                return getApiAccountmanager(params)
                            }} />) : (
                    <LCardGrid rows={rows} columns={columns} filterInputs={filter}
                        pageRequest={
                            (params) => {
                                if (params.status)
                                    params.status = "Efetuada" ? 1 : 0
                                if (params.cpf_cnpj)
                                    params.cpf_cnpj = params.cpf_cnpj.replace(/\D/gim, '')

                                if (params.active !== undefined) {
                                    params.active = params.active == "Ativo" ? 1 : 0;
                                }
                                this.setState({ ...this.state, pageRequest: params })
                                return getApiAccountmanager(params)
                            }} />
                )}
                <BlockDialog
                    open={this.state.blockDialog.open}
                    id={this.state.blockDialog.id}
                    handle={this.state.blockDialog.handle}
                    active={this.state.blockDialog.active}
                    delete={this.state.blockDialog.delete ?? false}
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
});
const mapDispatchToProps = dispatch =>
    bindActionCreators({ setSnackbar }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountManager))
