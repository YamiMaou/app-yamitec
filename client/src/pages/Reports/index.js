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
import { deleteApiBonus, getApiBonus, getApiReportFile, getApiReportFileS, putApiBonus } from '../../providers/api'

import {InputCnpj, InputCpf, stringCpf} from '../../providers/masks'
import { CircularProgress, IconButton, Toolbar } from '@material-ui/core';
import { Add, DeleteForeverOutlined } from '@material-ui/icons';
import { Link, withRouter } from 'react-router-dom';
import { DataGrid, RowsProp, ColDef, CheckCircleIcon } from '@material-ui/data-grid';

// MODULE ID
const module_id = 10

class Reports extends Component {
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
        const flexBasis = '25%';
        const filter = [
            { column: 'from', label: 'De', type: 'date', flexBasis : window.innerWidth > 720 ? '33%' : '100%'},
            { column: 'to', label: 'Até', type: 'date', flexBasis : window.innerWidth > 720 ? '33%' : '100%'},
            { column: 'from_launch', label: 'Lançado De', type: 'date', flexBasis : window.innerWidth > 720 ? '33%' : '100%'},
            { column: 'to_launch', label: 'Lançado Até', type: 'date', flexBasis : window.innerWidth > 720 ? '33%' : '100%'},
            { column: 'cnpj', label: 'CNPJ', type: 'text',mask: InputCnpj, flexBasis : window.innerWidth > 720 ? '40%' : '100%'},
            { column: 'company_name', label: 'Razão Social', type: 'text', flexBasis : window.innerWidth > 720 ? '35%' : '100%'},
            { 
                column: 'type_rel', label: 'Tipo', type: 'select', flexBasis : window.innerWidth > 720 ? '22%' : '100%' , grow:0,
                values: ['Fornecedor', 'Vendas'],
                defaultLabel: 'Selecione'
            },
            //{ column: 'created_at', label: 'Data', type: 'date' },
        ]

        const filter_ranking = [
            { column: 'from', label: 'De', type: 'date', flexBasis, grow: 0 },
            { column: 'to', label: 'Até', type: 'date', flexBasis, grow: 0 },
            { 
                column: 'type_rank', label: 'Tipo', type: 'select', flexBasis : window.innerWidth > 720 ? '14%' : '100%', grow: 0 ,
                values: ['Cliente', 'Fornecedor'],
                defaultLabel: 'Selecione'
            },
            //{ column: 'created_at', label: 'Data', type: 'date' },
        ]

        return (
            <Fragment>
                <AppBar position="static" style={{ padding: 10, marginTop: 10, marginBottom: 10}}>
                    <Toolbar>
                        <Typography variant="h6" style={{flexGrow: 1}}>
                            <HomeIcon />  <span>Relatórios</span>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Typography variant="h6" style={{flexGrow: 1}}>
                    <span>Fornecedores</span>
                </Typography>
                <LDataGrid hideList={true} rows={[]} columns={[]} filterInputs={filter} 
                    pageRequest={
                        async (params) => {
                            let type = {
                                'Fornecedor': 'reports/providers',
                                'Vendas': 'reports/sales'
                            }
                            if(type[params.type_rel] != undefined){
                                let report = await getApiReportFileS(type[params.type_rel],'xlsx',params)
                                console.log(report);
                            }else{
                                this.props.setSnackbar({open: true, message: "Selecione um Tipo de relatório"});
                            }
                            
                    }} />

                <Typography variant="h6" style={{flexGrow: 1}}>
                    <span>Ranking</span>
                </Typography>
                <LDataGrid hideList={true} rows={[]} columns={[]} filterInputs={filter_ranking} 
                    pageRequest={
                        async (params) => {
                            let type = {
                                'Cliente': 'reports/client-ranking',
                                'Fornecedor': 'reports/provider-ranking'
                            }
                            ///console.log(type[params.type_rank]);
                            ///console.log(params.type_rank);
                            if(type[params.type_rank] != undefined){
                                const report = await getApiReportFileS(type[params.type_rank],'xlsx',params)
                                console.log(report);
                            }else{
                                this.props.setSnackbar({open: true, message: "Selecione um Tipo de relatório"});
                            }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reports))
