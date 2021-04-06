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
import { InputCnpj, InputCpf } from '../../providers/masks';
//

//const [valus, setValues] = useState(new Date('2021-02-13'));
const idNumbers = [
    'cpf', 'cnpj'
];
// Decimal 

const MaskedDecimalInput = (props) => {
    const [value1, setValue] = useState(props.value ?? 0);
    const [error, setError] = useState(false);
    function getMoney( str )
    {
        return parseInt( str.replace(/[\D]+/g,'') );
    }
    function formatReal( int )
    {
        var tmp = int+'';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        
        if( tmp.length > 6 && !props.percent )
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        return tmp;
    }
    function handleChange(e) {
        //const { value, id } = e.target;
        let val = e.target.value.length > 0 ? e.target.value : '0';
        if( val.length > 5 && props.percent )
            return false;
        props.onChange(e) ?? undefined;
        setValue(formatReal(getMoney(val)));
    }
    return (
        <TextField key={`input-${props.id}`} size="small" style={props.style}
            required={props.required ?? false}
            disabled={props.disabled ?? false}
            error={error}
            type={props.type ?? "text"}
            value={value1 ?? ''}
            helperText={error == true ? props.helperText ?? "conteúdo inválido" : ""}
            id={props.id} label={props.label}
            onChange={handleChange}
            onBlur={handleChange}
        />
    );
}

// MASKED INPUTS 

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;
    let InCpf = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-',/\d/, /\d/, /\d/]
    let mask = props.mask == "cpfcnpj" ? props.value.replace(/[^\d]/g, "").length < 12 ? InCpf : InputCnpj : props.mask;
    //console.log(props.value.length)
    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            value={props.value}
            mask={mask}
            placeholderChar={'\u2000'}

        />
    );
}


//
const DateInput = (props) => {
    //let valueDate = new Date(props.value)
    const [value, setValue] = useState(props.value);
    const [error, setError] = useState(false);
    function handleChange(e) {
        console.log(value)
        setValue(e.target.value)
        let dateValue = value.split('/');
        console.log(dateValue);
        try {
            //let e = { target: { id: props.id, value: `${selectvalue.toJSON().split('T')[0]}` } }
            if (props.validate !== undefined) {
                if (props.validate(e.target.value)) {
                    setError(false);
                } else {
                    setError(true)
                }
            }
            props.onChange(e)

        } catch (err) {
            //console.log(err);
        }
        //props.onChange(value);

    }
    return (
        <FormControl style={{ ...props.style }} >
            <InputLabel htmlFor="formatted-text-mask-input">{props.label}</InputLabel>
            <Input
                value={value}
                onChange={handleChange}
                onFocus={(e) => {
                    if (e.target.value.length == 0) {
                        //alert(e.target.value);
                        e.target.setSelectionRange(0, e.target.value.length)
                    }
                }}
                name={props.name}
                id={props.id}
                inputProps={{
                    mask: [/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
                }}
                inputComponent={TextMaskCustom}
            />
        </FormControl>

    );
}
//

const SelectInput = (props) => {
    const [value, setValue] = useState(props.value ?? props.values[0]);
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
                value={value}
                onChange={handleChange}
                onBlur={handleChange}
            >
                <MenuItem key={`input-00-1`} value="Todos">Todos</MenuItem>
                {props.json ? (
                    props.values.map((val, ind) => {
                        return <MenuItem key={`input-${ind}`} value={val.id}>{val[props.valueLabel]}</MenuItem>
                    })
                ) : (
                    props.values.map((val, ind) => {
                        return <MenuItem key={`input-${ind}`} value={val}>{val}</MenuItem>
                    })
                )
                }

            </Select>
        </FormControl>)
}
const StyledDataGrid = withStyles({
    root: {
        '& div.MuiDataGrid-root .MuiDataGrid-viewport': {
            width: "600px",
            background: "blue"
        },
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
        page: 1,
        filter: 'flex',
        loading: true,
        firstLoad: this.props.autoload ?? true
    }
    async setPage(params = { page: 1 }) {
        this.setState({ ...this.state, loading: true })
        let cleanfilters = {};
        //console.log(this.state.filters);
        Object.entries(this.state.filters).map((item) => {
            if (`${item[1]}`.length >= 1) {
                if (item[1] !== "Todos") {
                    cleanfilters[item[0]] = item[1];
                    //console.log(item);
                }
            } else {
                //console.log(item[0] + " tamanho " + `${item[1]}`.length);
            }
        });
        let query = Object.assign({ queryType: 'like', withId: "name", page: params.page ?? 1 }, cleanfilters);
        //console.log(query);
        const data = await this.props.pageRequest(query);
        if (data !== undefined) {
            this.setState({ ...this.state, data, loading: false })
        }

    }
    async componentDidMount() {
        //this.setPage();
        let filters = {};
        !this.props.filterInputs ?? this.props.filterInputs.map(input => {
            filters[input.column] = input.value ?? "";
        });

        this.setState({ ...this.state, filters });

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
            if (value.length == 0) {
                filters[e.target.id ?? e.target.name] = "";
                delete filters[e.target.id ?? e.target.name];
            } else {
                if (e.target.id == 'created_at') {
                    //value = `${value.toJSON().split('T')[0]}`
                }
                if (e.target.id == 'nome') {
                    //filters["withId"] = "name"
                }
                if (idNumbers.includes(e.target.id)) {
                    value = value.replace(/[^\d]+/g, '');
                }
                filters[e.target.id ?? e.target.name] = value
                this.setState({ ...this.state, filters });
            }
        }

        const onClearFilter = () => {
            let filters = {};
            this.props.filterInputs.map(input => {
                filters[input.column] = input.value ?? "";
            });

            this.setState({ ...this.state, filters });
        }
        const rows: RowsProp = this.state.data.data ?? [];

        const columns: ColDef[] = this.props.columns;
        return (
            <div>
                {this.props.filterInputs == undefined ? ('') :
                    (<Card className={classes.root} style={{ marginBottom: 15 }}>
                        <CardContent>
                            <Typography onClick={() => {
                                this.setState({ ...this.state, filter: this.state.filter == 'none' ? 'flex' : 'none' })
                            }}>
                                <FilterListIcon /> Filtros
                    </Typography>

                            <div id="filter-form" style={{
                                alignItems: 'start',
                                flexFlow: 'row wrap',
                                justifyContent: 'space-between',
                                display: this.state.filter,
                            }}>
                                {
                                    this.props.filterInputs.map(input => {
                                        if (input.type == "text") {
                                            if (input.mask === undefined)
                                                return <TextField value={this.state.filters[input.column] ?? ""} style={{ ...classes.m5, flexGrow: input.grow ?? 0, flexBasis: input.flexBasis ?? '30%' }} id={input.column} label={input.label} onChange={onChangeInputs} onBlur={onChangeInputs} />
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
                                            let dvalue = "";
                                            if(this.state.filters[input.column] !== undefined){
                                                //console.log(this.state.filters[input.column])
                                                dvalue = this.state.filters[input.column].split('-');
                                                dvalue = `${dvalue[2]}/${dvalue[1]}/${dvalue[0]}`;
                                                //console.log(dvalue)
                                            }

                                            return (
                                                <FormControl style={{ ...classes.m5, flexGrow: input.grow ?? 0 }} >
                                                    <InputLabel htmlFor="formatted-text-mask-input">{input.label}</InputLabel>
                                                    <Input
                                                        value={this.state.filters[input.column] ?? ""}
                                                        onChange={(e) => {
                                                            let dateValue = e.target.value.split('/');
                                                            console.log(`${dateValue[2]}-${dateValue[1]}-${dateValue[0]}`)
                                                            onChangeInputs({target: { id: input.column, value: `${dateValue[2]}-${dateValue[1]}-${dateValue[0]}`}})
                                                            try {
                                                                //let e = { target: { id: props.id, value: `${selectvalue.toJSON().split('T')[0]}` } }
                                                                if (input.validate !== undefined) {
                                                                    if (input.validate(e.target.value)) {
                                                                        //setError(false);
                                                                    } else {
                                                                       // setError(true)
                                                                    }
                                                                }
                                                            } catch (err) {
                                                                //console.log(err);
                                                            }
                                                        }}
                                                        onFocus={(e) => {
                                                            if (e.target.value.length == 0) {
                                                                //alert(e.target.value);
                                                                e.target.setSelectionRange(0, e.target.value.length)
                                                            }
                                                        }}
                                                        name={input.column}
                                                        id={input.column}
                                                        value={dvalue ?? ""}
                                                        inputProps={{
                                                            mask: [/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
                                                            }}
                                                            inputComponent={TextMaskCustom}
                                                        />
                                                </FormControl>
                                            )
                                        } else if (input.type == "select") {
                                            return (<SelectInput json={input.json ?? undefined} valueLabel={input.valueLabel} id={input.column} label={input.label} name={input.column} value={this.state.filters[input.column] ?? ""} values={input.values} style={{ ...classes.m5, flexGrow: input.grow ?? 1 }} onBlur={onChangeInputs} />)
                                        } else if (input.type == "decimal" || input.type == "percent") {
                                            return <MaskedDecimalInput percent={input.type == "percent"} decimal={input.type == "decimal"} value={this.state.filters[input.column] ?? ""} style={{ ...classes.m5, flexGrow: input.grow ?? 0, flexBasis: input.flexBasis ?? '30%' }} id={input.column} label={input.label} onChange={onChangeInputs} onBlur={onChangeInputs} />
                                        }
                                    })
                                }
                                <div>
                                    <Button size="small" style={{ margin: 5 }} startIcon={<SearchIcon />} variant="contained" color="primary" onClick={() => { this.setPage(this.state.filters); this.setState({ ...this.state, firstLoad: false }) }}> Pesquisar</Button>
                                    <Button size="small" style={{ margin: 5 }} startIcon={<ReorderIcon />} variant="contained" color="primary" onClick={() => { onClearFilter() }} > Limpar</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>)}

                <Card>
                    <CardContent>
                        {!this.state.firstLoad &&
                            <div style={{ height: 700, width: '100%' }}>
                                <DataGrid
                                    sx={{
                                        '& .MuiDataGrid-root': {
                                            '& .MuiDataGrid-viewport': {
                                                maxWidth: '600px',
                                            },
                                        }
                                    }}
                                    rows={rows} columns={columns}
                                    spacing={0}
                                    stickyHeader
                                    sortModel={this.props.sortModel}
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
                                        let filters = Object.assign({}, this.state.filters, { page: params.page, pageSize: params.pageSize });
                                        this.setState({ ...this.state, filters });
                                        this.setPage(filters);
                                    }}
                                />
                            </div>}
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
    bindActionCreators({ setSnackbar }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LDataGrid)
