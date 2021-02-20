import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { postAuth, JWT_Decode } from '../../providers/api'
import {setDialog as authDialog, setAuth} from '../../actions/authAction'
import {setLoading } from '../../actions/appActions'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Slide from '@material-ui/core/Slide';

import logo from '../../../assets/logo.png'

import InputMask from 'react-input-mask';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 350,
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto'
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  media: {
    height: 140,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FullScreenInvoiceDialog(props) {
  const [loginError, setLoginerror] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const [dados, setDados] = React.useState({});

  const classes = useStyles();

  const handleClose = () => {
    props.authDialog(false);
  };

  const { aDialog } = props;

  function onChange(e) {
    let dt = dados;
    dt[e.target.id] = e.target.value
    setDados(dt);
  }
  async function onSubmit(e) {
    e.preventDefault();
    setloading(true);
    let data = await postAuth(dados);
    if(data !== undefined) {
      if(data.data.success){
        localStorage.setItem("user", JSON.stringify(data.data.data.user));
        localStorage.setItem("token", data.data.token);
        props.setAuth(data.data.data.user);
        setLoginerror(false);
        setloading(false);
        window.location.href="/";
      }else{
        setLoginerror(true)
        setloading(false);
      }
    }
  }
  //
  return (
    <div>
      <img src={logo} style={{display: 'flex', margin: 'auto'}} height="150" width="150" />
      <form id="loginform" onSubmit={onSubmit}>
        
        <Card className={classes.root}>
            <CardContent>
              <div>
              {/*<InputMask id="username" label="Usuário" mask="999.999.999-99" maskChar=" " onChange={onChange}>
                {(inputProps) =>
                  <TextField
                  error={loginError === true ? true : false}
                  helperText={ loginError ? "Usuário ou senha invalidos." : ""}
                  fullWidth id="username" label="Usuário" variant="outlined" onChange={onChange} />
                }
              </InputMask> */}
              <TextField
                error={loginError === true ? true : false}
                helperText={ loginError ? "E-mail ou senha inválidos." : ""}
                type="text"
                fullWidth id="email" type="text" label="E-Mail" variant="outlined" 
                onChange={onChange}
                onBlur={onChange} />
              </div><br />
              <div>
              <TextField
                error={loginError === true ? true : false}
                //helperText={ loginError ? "E-mail ou senha inválidos." : ""}
                type="text"
                fullWidth id="password" type="password" label="Senha" variant="outlined" 
                onChange={onChange}
                onBlur={onChange} />
              </div>
            </CardContent>
            
         
          <CardActions>
            {!loading ? (
            <Button variant="contained" size="large" fullWidth color="primary" disableElevation type="submit" form="loginform"
            style={{
              background: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',
            }}>
              Entrar 
            </Button>
            ) : (
            <CircularProgress style={{margin: 'auto'}} />
            )}
            
          </CardActions>
          
        </Card>
      </form>
    </div>
  );
}
const mapStateToProps = store => ({
  aDialog: store.authReducer.authDialog,
  data: store.authReducer.data,
  loading: store.appReducer.loading
});
const mapDispatchToProps = dispatch =>
bindActionCreators({ setLoading, authDialog, setAuth,JWT_Decode }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenInvoiceDialog)
