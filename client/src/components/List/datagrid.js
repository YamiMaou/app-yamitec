import React, { Component, Fragment, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
//
import { DataGrid, RowsProp, ColDef } from '@material-ui/data-grid';
//
import { setSnackbar } from '../../actions/appActions'
import { DEFAULT_LOCALE_TEXT } from '../../providers/langs/datagrid'
//const classes = useStyles();
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
//
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import ReorderIcon from '@material-ui/icons/Reorder';

import ptBR from "date-fns/locale/pt-BR";
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';

// VALIDATORS

import { validaCpf } from '../../providers/commonMethods'
//

//const [valus, setValues] = useState(new Date('2021-02-13'));
const idNumbers = [
    'cpf', 'cnpj'
];
// MASKED INPUTS 

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            value={props.value}
            mask={props.mask}
            placeholderChar={'\u2000'}

        />
    );
}


//
const DateInput = (props) => {
    const [value, setValue] = useState(new Date('2021-02-13'));
    function handleChange(value) {
        let e = {target: {id:props.id , value: `${value.toJSON().split('T')[0]}`}}
        try {
            //inputValues[props.id] = `${value.toJSON().split('T')[0]}`
            props.onChange(e)
        } catch (err) {
            console.log(err);
        }
        setValue(value);
    }
    return (<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
        <Grid justify="space-around" style={{ flexGrow: 0, marginTop: 18 }}>
            <KeyboardDatePicker
                margin="normal"
                id={props.id}
                value={props.value}
                label={props.label ?? 'Data'}
                format="dd/MM/yyyy"
                value={value}
                onChange={handleChange}
                onBlur={handleChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </Grid>
    </MuiPickersUtilsProvider>)
}
//

const SelectInput = (props) => {
    const [value, setValue] = useState(props.values[0]);
    function handleChange(e) {
        props.onBlur(e)
        setValue(e.target.value);
    }
    return (
        <FormControl id={props.column} style={{ ...props.style, marginTop: '25px' }}>
            <InputLabel id={props.column}>{props.label}</InputLabel>
            <Select
                labelId={props.id}
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={handleChange}
                onBlur={handleChange}
            >
                {
                    props.values.map(val => {
                        return <MenuItem value={val}>{val}</MenuItem>
                    })
                }

            </Select>
        </FormControl>)
}
const StyledDataGrid = withStyles({
    window:  {
          overflowX: 'hidden'
      }
  })(DataGrid);
  const useStyles = makeStyles(theme => ({
    root: {
      "& div.react-grid-Container": {
        color: "red",
        // color: theme.palette.text.color
      }
    }
  }));
class LDataGrid extends Component {
    state = {
        data: [],
        filters: {},
        filter: 'flex',
        loading: true
    }
    async setPage(params = { page: 1 }) {
        this.setState({ ...this.state, loading: true })
        let cleanfilters = {};
        Object.entries(params).map((item) => { 
            if(item[1].length >= 1 ){
                if(item[1] !== "Todos"){
                    cleanfilters[item[0]] = item[1];
                    console.log(item);
                }
            }
            
        });
        let query = Object.assign({queryType : 'like', withId: "name"}, cleanfilters);
        console.log(query);
        const data = await this.props.pageRequest(query);
        if (data !== undefined) {
            this.setState({ ...this.state, data, loading: false })
        }

    }
    async componentDidMount() {
        //this.setPage();
        let filters = {};
        this.props.filterInputs.map(input => { 
            filters[input.column] = input.value ?? "";
        });

        this.setState({...this.state, filters});

    }

    render() {
        const classes = {
            m5: {
                margin: 5,
                marginTop: 25,
                //flexBasis: '30%'

            },
            root: {
                maxWidth: 345,
                marginBottom: 25
            },
            media: {
                height: 140,
            },
        }
        let filters = this.state.filters;
        const onChangeInputs = (e) => {
            let value = e.target.value;
            if (idNumbers.includes(e.target.id)) {
                value = value.replace(/[^\d]+/g, '');
            }
            if (value.length == 0 ) {
                delete filters[e.target.id ?? e.target.name];
            } else {
                if (e.target.id == 'created_at') {
                    value = `${value.toJSON().split('T')[0]}`
                }
                if (e.target.id == 'nome') {
                    //filters["withId"] = "name"
                }
                if (idNumbers.includes(e.target.id)) {
                    value = value.replace(/[^\d]+/g, '');
                }
                filters[e.target.id ?? e.target.name] = value
                this.setState({...this.state, filters});
            }
        }

        const onClearFilter = () => {
            let filters = {};
            this.props.filterInputs.map(input => { 
                filters[input.column] = input.value ?? "";
            });

            this.setState({...this.state, filters});
        }
        const rows: RowsProp = this.state.data.data ?? [];
          
        const columns: ColDef[] = this.props.columns;
        return (
            <div>
                <Card className={classes.root} style={{ marginBottom: 15 }}>
                    <CardContent>
                        <Typography onClick={() => {
                            this.setState({ ...this.state, filter: this.state.filter == 'none' ? 'flex' : 'none' })
                        }}>
                            <FilterListIcon /> Filtros
                    </Typography>

                        <div id="filter-form" style={{
                            alignItems: 'center',
                            flexFlow: 'row wrap',
                            justifyContent: 'space-around',
                            display: this.state.filter,
                        }}>
                            {
                                this.props.filterInputs.map(input => {
                                    if (input.type == "text") {
                                        if (input.mask === undefined)
                                            return <TextField style={{ ...classes.m5, flexGrow: input.grow ?? 0, flexBasis: input.flexBasis ?? '30%' }} id={input.column} label={input.label} onChange={onChangeInputs} onBlur={onChangeInputs} />
                                        else
                                            return (
                                                <FormControl style={{ ...classes.m5, flexGrow: input.grow ?? 0 }} >
                                                    <InputLabel htmlFor="formatted-text-mask-input">{input.label}</InputLabel>
                                                    <Input
                                                        value={this.state.filters[input.column] ?? ""}
                                                        onChange={onChangeInputs}
                                                        onFocus={(e) => {
                                                            if (e.target.value.length == 0) {
                                                                //alert(e.target.value);
                                                                e.target.setSelectionRange(0, e.target.value.length)
                                                            }
                                                        }}
                                                        name={input.column}
                                                        id={input.column}
                                                        value={this.state.filters[input.column] ?? ""}
                                                        inputProps={{
                                                            mask: input.mask
                                                        }}
                                                        inputComponent={TextMaskCustom}
                                                    />
                                                </FormControl>)

                                    } else if (input.type == "date") {
                                        return <DateInput id={input.column} style={{ ...classes.m5, flexGrow: input.grow ?? 0 }} onBlur={onChangeInputs} />
                                    } else if (input.type == "select") {
                                        return (<SelectInput id={input.column} label={input.label} name={input.column} value={this.state.filters[input.column] ?? ""} values={input.values} style={{ ...classes.m5, flexGrow: input.grow ?? 0 }} onBlur={onChangeInputs} />)
                                    }
                                })
                            }
                            <div>
                                <Button size="small" style={{ margin: 5 }} startIcon={<SearchIcon />} variant="contained" color="primary" onClick={() => { this.setPage(this.state.filters) }}> Pesquisar</Button>
                                <Button size="small" style={{ margin: 5 }} startIcon={<ReorderIcon />} variant="contained" color="primary" onClick={() => {onClearFilter()}} > Limpar</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        {rows.length > 0 &&
                        <div style={{ height: 450, width: '100%' }}>
                            <StyledDataGrid rows={rows} columns={columns}
                                columnBuffer={4}
                                disableClickEventBubbling
                                disableColumnMenu={true}
                                loading={this.state.loading}
                                localeText={DEFAULT_LOCALE_TEXT}
                                paginationMode="server"
                                rowCount={this.state.data.total ?? 0}
                                pageSize={10} rowsPerPageOptions={[10]} pagination
                                /*onPageSizeChange={(params) => {
                                    this.setPage({ page: params.page, pageSize: params.pageSize });
                                }}*/
                                onPageChange={(params) => {
                                    console.log("CARREGOU");
                                    this.setPage({ page: params.page, pageSize: params.pageSize });
                                }}
                            />
                        </div> }
                    </CardContent>
                    <CardActionArea>
                    </CardActionArea>
                    <CardActions>

                    </CardActions>
                </Card>

            </div>
        )
    }
}
const mapStateToProps = store => ({

});
const mapDispatchToProps = dispatch =>
    bindActionCreators({setSnackbar}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LDataGrid)
