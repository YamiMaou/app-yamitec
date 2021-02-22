import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
//
import AppBar from '@material-ui/core/AppBar';

import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import BlockIcon from '@material-ui/icons/Block';
import EditIcon from '@material-ui/icons/Edit';

import Typography from '@material-ui/core/Typography';
import LDataGrid from '../../components/List/datagrid';
//
import { setSnackbar } from '../../actions/appActions'
import { getApiContributors } from '../../providers/api'

import {InputCpf, stringCpf} from '../../providers/masks'
import { IconButton, Toolbar } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
class Contributors extends Component {
    state = {
        contributors: [],
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
        const rows = this.state.contributors.data ?? [];
        const columns = [
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
                        onClick={()=> {
                            console.log(`ID : ${params.value} `)
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
            { column: 'cpf', label: 'Cpf', type: 'text', 
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
                    <LDataGrid rows={rows} columns={columns} filterInputs={filter} pageRequest={getApiContributors} />
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
