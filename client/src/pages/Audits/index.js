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
import { deleteApiBonus, getApiBonus, getApiReportFile, putApiBonus } from '../../providers/api'

import {InputCpf, stringCpf} from '../../providers/masks'
import { CircularProgress, IconButton, Toolbar } from '@material-ui/core';
import { Add, DeleteForeverOutlined } from '@material-ui/icons';
import { Link, withRouter } from 'react-router-dom';
import { DataGrid, RowsProp, ColDef, CheckCircleIcon } from '@material-ui/data-grid';

// MODULE ID
const module_id = 8

class Auditoria extends Component {
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
        const rows = [];
        const columns = [];
        const flexBasis = '25%';
        const filter = [
            { column: 'from', label: 'De', type: 'date', flexBasis: window.innerWidth > 720 ? '30%' : '100%' },
            { column: 'to', label: 'Até', type: 'date', flexBasis: window.innerWidth > 720 ? '30%' : '100%' },
            { column: 'name', label: 'Nome', type: 'text', flexBasis: window.innerWidth > 720 ? '30%' : '100%' },
            { column: 'email', label: 'Usuário', type: 'text', flexBasis: window.innerWidth > 720 ? '30%' : '100%' },
            //{ column: 'created_at', label: 'Data', type: 'date' },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10}}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>
                            <HomeIcon />  <span>Auditoria</span>
                        </Typography>
                    </Toolbar>
                </AppBar>
                    <LDataGrid hideList={true} rows={rows} columns={columns} filterInputs={filter} 
                    pageRequest={
                        (params) => {
                            return getApiReportFile(params)
                    }} />
            </Fragment>
        )
    }
}
const mapStateToProps = store => ({
    session: store.authReducer.data,
});
const mapDispatchToProps = dispatch =>
    bindActionCreators({ setSnackbar}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Auditoria))
