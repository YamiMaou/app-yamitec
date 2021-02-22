import React, { Component, Fragment, useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
//
//
import { setSnackbar } from '../../actions/appActions'
//const classes = useStyles();
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Snackbar from '@material-ui/core/Snackbar';
//
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';

import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

import ptBR from "date-fns/locale/pt-BR";
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaskedInput from 'react-text-mask';
const idNumbers = [
    'cpf', 'cnpj', 'cep'
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
            onChange={props.onChange}
            onBlur={props.onChange}
            mask={props.mask}
            placeholderChar={'\u2000'}

        />
    );
}
// CheckBox

const CheckBoxInput = (props) => {
    const [value, setValue] = useState(props.value ?? false);
    const [error, setError] = useState(false);
    function handleChange(e) {
        const { value, id } = e.target;
        if (props.validate !== undefined) {
            if (props.validate(value)) {
                setError(false);
            } else {
                setError(true)
            }
        }
        
        props.onChange({target: {id, value: event.target.checked ? 1 : 0, type: 'checkbox'}})
        setValue(e.target.checked);
    }
    return (
        <div key={`check-${props.id}`} style={{...props.style}}>
        <FormControlLabel 
        control={<Checkbox checked={value} disabled={props.disabled ?? false}onChange={handleChange} name={props.id} id={props.id} />}
        label={props.label}
      />
      </div>
      )
}

// File Input
const FileInput = (props) => {
    const [value, setValue] = useState(props.value ?? undefined);
    const [error, setError] = useState(false);
    function handleChange(e) {
        const { value, id } = e.target;
        if (props.validate !== undefined) {
            if (props.validate(value)) {
                setError(false);
            } else {
                setError(true)
            }
        }
        
        props.onChange({target: {id, value: e.target.files[0], type: 'file'}})
        setValue(e.target.value);
    }
    return (
        <FormControl>
            <Button style={props.style} variant="outlined" component="label" endIcon={<Icon name="arrow-circle-up" size={18} color="#025ea2" />}>
                { value !== undefined ? <b style={{color: 'red'}}> Arquivo Selecionado! </b> : props.label}
                <input type="file" hidden
                    onChange={handleChange}
                    onBlur={handleChange}
                    name={props.id}
                    id={props.id}
                />
            </Button>
        </FormControl>)
}
//
function TextInputCustom(props) {
    const { inputRef, ...other } = props;

    const [value, setValue] = useState(props.value ?? "");
    const [error, setError] = useState(false);

    function handleChange(e) {
        const { id } = e.target;
        let val = e.target.value;
        setValue(val);
        if (props.validate !== undefined) {
            if (props.validate(val) !== false) {
                setError(false);
            } else {
                setError(true)
            }
        }
        props.onChange(e)

    }
    //console.log(value);
    if (props.mask === undefined)
        return (
            <TextField key={`input-${props.id}`} size="small" style={props.style}
                required={props.required ?? false}
                error={error}
                type={props.type ?? "text"}
                value={value}
                helperText={error == true ? props.helperText ?? "conteúdo inválido" : ""}
                id={props.id} label={props.label}
                onChange={handleChange}
                onBlur={handleChange}
            />
        )
    else
        return (
            <FormControl key={`input-${props.id}`} style={props.style} >
                <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
                <Input
                    required={props.required ?? false}
                    size="small"
                    key={`input-${props.id}`}
                    error={error}
                    onChange={handleChange}
                    onBlur={handleChange}
                    name={props.name}
                    value={value}
                    id={props.id}
                    aria-describedby="component-error-text"
                    inputProps={{
                        mask: props.mask,
                    }}
                    inputComponent={TextMaskCustom}
                />
                {error == true ? (
                    <FormHelperText id="component-error-text">{props.helperText ?? "conteúdo inválido"}</FormHelperText>
                ) : ('')}
            </FormControl>)
}
//
const DateInput = (props) => {
    let valueDate = new Date(props.value)
    const [value, setValue] = useState(props.value ? valueDate.setDate(valueDate.getDate() + 1) : '');
    const [error, setError] = useState(false);
    function handleChange(value) {
        try {
            let e = { target: { id: props.id, value: `${value.toJSON().split('T')[0]}` } }
            if (props.validate !== undefined) {
                if (props.validate(value)) {
                    setError(false);
                } else {
                    setError(true)
                }
            }
            props.onChange(e)

        } catch (err) {
            console.log(err);
        }
        //props.onChange(value);
        setValue(value);
    }

    return (<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
        <Grid style={{ ...props.style, marginTop: 18 }}>
            <KeyboardDatePicker
                required={props.required ?? false}
                margin="normal"
                id={props.id}
                label={props.label ?? 'Data'}
                error={error}
                helperText={props.error ? props.helperText ?? "conteúdo inválido" : ""}
                format="dd/MM/yyyy"
                disableFuture
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
    const [value, setValue] = useState(props.value ?? props.values[0]);
    const [error, setError] = useState(false);
    function handleChange(e) {
        const { value, id } = e.target;
        if (props.validate !== undefined) {
            if (props.validate(value)) {
                setError(false);
            } else {
                setError(true)
            }
        }
        props.onChange(e)
        setValue(e.target.value);
    }
    return (
        <FormControl id={props.column} style={{ ...props.style, marginTop: '25px' }}>
            <InputLabel id={props.column}>{props.label}</InputLabel>
            <Select size="small"
                labelId={props.id}
                id={props.id}
                name={props.name}
                value={value}
                error={error}
                placeholder="Selecione"
                //helperText={props.error ? props.helperText ?? "conteúdo inválido" : ""}
                onChange={handleChange}
                onBlur={handleChange}
            >
                {
                    props.values.map((val, ind) => {
                        return <MenuItem key={`input-${ind}`} value={val}>{val}</MenuItem>
                    })
                }

            </Select>
        </FormControl>)
}
class LForms extends Component {
    state = {
        data: [],
        inputVal: {},
        filter: ['flex']
    }
    componentDidMount() {
        let inputValues = {};
        let formValidate = {};
        this.props.forms.map((form, ind) => {
            let ifjson = {};
            form.fields.map((input, ind1) => {
                ifjson[input.column] = input.value ?? '';
                inputValues[form.json ?? input.column] = form.json == undefined ? input.value ?? '' : ifjson;
                formValidate[input.column] = input.value ?? '';
            });
        });
        this.setState({ ...this.state, inputVal: inputValues, formValidate });

        //console.log(this.state)
    }


    render() {
        const mainChange = (e, params) => {
            let inputValues = this.state.inputVal;
            let formValidate = this.state.formValidate;
            let value = e.target.value;
            let id = e.target.id ?? e.target.name;

            if (idNumbers.includes(e.target.id)) {
                value = value.replace(/[^\d]+/g, '');
            }

            if (e.target.type !== "file" && (value.length == 0 || value == '' || value == 'Todos')) {
                if (params.json === undefined) {
                    inputValues[id] = ''
                } else {
                    if (inputValues[params.json] == undefined) {
                        inputValues[params.json] = {};
                    }
                    inputValues[params.json][id] = '';
                }
            } else {
                if (id == 'created_at') {
                    value = `${value.toJSON().split('T')[0]}`
                }

                if (idNumbers.includes(id)) {
                    value = value.replace(/[^\d]+/g, '');
                }
                if (params.handle !== undefined) {
                    //let request = await params.handle(value)
                    //value = request[id] ?? '';
                }


                if (params.json === undefined) {
                    inputValues[id] = value
                } else {
                    if (inputValues[params.json] == undefined) {
                        inputValues[params.json] = {};
                    }
                    inputValues[params.json][id] = value;
                }
            }
            formValidate[id] = value;
            this.setState({ ...this.state, inputVal: inputValues, formValidate });
            //console.log(this.state.inputVal);
        }

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
        return (
            <div>
                {
                    this.props.forms.map((form, ind) => {
                        return (
                            <div key={`card-${ind}-root`}>
                                <Card style={{ marginBottom: 15 }}>
                                    <CardContent>
                                        <Typography onClick={() => {
                                            let filter = this.state.filter;
                                            filter[ind] = this.state.filter[ind] == 'flex' ? 'none' : 'flex'
                                            this.setState({ ...this.state, filter })
                                        }}>
                                            <IndeterminateCheckBoxIcon /> {form.title}
                                        </Typography>

                                        <div key={`block-${ind}`} id={`data-form-${form.id ?? '1'}`} style={{
                                            alignItems: 'center',
                                            flexFlow: form.flexFlow ?? 'row wrap',
                                            justifyContent: 'start',
                                            display: this.state.filter[ind] ?? 'flex',
                                        }}>
                                            {

                                                form.fields.map((input, ind1) => {
                                                    if (input.type == "date") {
                                                        return <DateInput value={input.value ?? ""} helperText={input.helperText ?? ""} key={`input-${ind1}`} id={input.column} label={input.label} style={{ ...classes.m5, ...input.style, flexGrow: input.grow ?? 0 }} onChange={(e) => mainChange(e, { handle: input.handle ?? undefined, json: form.json ?? undefined, validate: input.validate ?? undefined })} />
                                                    } else if (input.type == "select") {
                                                        return (<SelectInput value={input.value ?? ""} helperText={input.helperText ?? ""} key={`input-${ind1}`} id={input.column} label={input.label} name={input.column} values={input.values} style={{ ...classes.m5, ...input.style, flexGrow: input.grow ?? 0 }} onChange={(e) => mainChange(e, { handle: input.handle ?? undefined, json: form.json ?? undefined, validate: input.validate ?? undefined })} />)
                                                    } else if (input.type == "file") {
                                                        return (
                                                            <FileInput key={`input-${ind1}`}
                                                                style={{ ...classes.m5, ...input.style, flexBasis: input.flexBasis, flexGrow: input.grow ?? 0, fontSize: '.6em' }}
                                                                onChange={(e) => mainChange(e, { handle: input.handle ?? undefined, json: form.json ?? undefined, validate: input.validate ?? undefined })}
                                                                onBlur={(e) => mainChange(e, { handle: input.handle ?? undefined, json: form.json ?? undefined, validate: input.validate ?? undefined })}
                                                                label={input.label}
                                                                id={input.column}
                                                            />
                                                        )
                                                    }else if (input.type == "checkbox") {
                                                        return (
                                                            <CheckBoxInput 
                                                                key={`input-${ind1}`}
                                                                disabled={input.disabled ?? false}
                                                                value={input.value}
                                                                style={{ ...classes.m5, ...input.style, flexBasis: input.flexBasis, flexGrow: input.grow ?? 0, fontSize: '.6em' }}
                                                                onChange={(e) => mainChange(e, { handle: input.handle ?? undefined, json: form.json ?? undefined, validate: input.validate ?? undefined })}
                                                                onBlur={(e) => mainChange(e, { handle: input.handle ?? undefined, json: form.json ?? undefined, validate: input.validate ?? undefined })}
                                                                label={input.label}
                                                                id={input.column}
                                                            />
                                                        )
                                                    } else {
                                                        return <TextInputCustom key={`input-${ind1}`}
                                                            id={input.column}
                                                            type={input.type}
                                                            value={input.value}
                                                            style={{ ...classes.m5, ...input.style, flexGrow: input.grow ?? 0, flexBasis: input.flexBasis ?? '30%' }}
                                                            id={input.column} label={input.label}
                                                            mask={input.mask ?? undefined}
                                                            validate={input.validateHandler}
                                                            helperText={input.helperText ?? ""}
                                                            onChange={(e) => mainChange(e, { handle: input.handle ?? undefined, json: form.json ?? undefined, validate: input.validate ?? undefined })}
                                                            onBlur={(e) => mainChange(e, { handle: input.handle ?? undefined, json: form.json ?? undefined, validate: input.validate ?? undefined })} />
                                                    }
                                                })
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })

                }
                <Button size="small" style={{ margin: 5 }} variant="contained" color="primary" onClick={() => {
                    if (this.props.validate === undefined) {
                        this.props.request(this.state.inputVal);
                    } else {
                        if (this.props.validate(this.state.formValidate)) {
                            this.props.request(this.state.inputVal);
                            //console.log(this.state)
                        }
                    }
                }}> Salvar</Button>
                <Button size="small" style={{ margin: 5 }} variant="contained" color="primary" onClick={() => { this.props.history.goBack(); }} > Cancelar</Button>
            </div>
        )
    }
}
const mapStateToProps = store => ({
    snackbar: store.appReducer.snackbar
});
const mapDispatchToProps = dispatch =>
    bindActionCreators({ setSnackbar }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LForms))
