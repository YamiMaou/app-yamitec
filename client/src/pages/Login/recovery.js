import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { putResetPassword,postAuth, JWT_Decode } from '../../providers/api'
import {setDialog as authDialog, setAuth} from '../../actions/authAction'
import {setLoading, setSnackbar } from '../../actions/appActions'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Slide from '@material-ui/core/Slide';

import { withRouter } from 'react-router-dom'

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

function ResetPassword(props) {
  const [loginError, setLoginerror] = React.useState(false);
  const [resetError, setReseterror] = React.useState({success: false, message: ''});
  const [loading, setloading] = React.useState(false);
  const [resetpwd, setResetpwd] = React.useState(false);
  const [dados, setDados] = React.useState({});

  const classes = useStyles();
  function onChange(e) {
    let dt = dados;
    dt[e.target.id] = e.target.value
    setDados(dt);
  }
  async function onSubmitReset(e) {
    e.preventDefault();
    setloading(true);
    dados.token = props.match.params.token;
    let data = await putResetPassword(dados);
    if(data !== undefined) {
      if(data.data.success){
        setLoginerror(false);
        setloading(false);
        props.setSnackbar({open: true, message: "Senha atualizada, faça já o seu login"})
        setTimeout(() => {props.history.push('/login')}, 1000)
        
        //window.location.href="/";
      }else{
        setLoginerror(true)
        setloading(false);
      }
      setReseterror({success: true, message: data.data.message})
    }
  }
  return (
    <div>
      <img src={logo} style={{display: 'flex', margin: 'auto'}} height="150" width="150" />
      <form id="loginform" onSubmit={onSubmitReset}>
        <Card className={classes.root}>
            <CardContent>
            <div>
                <TextField
                  className={classes.TextField}
                  error={resetpwd.success}
                  helperText={resetpwd.message ?? ""}
                  type="text"
                  fullWidth id="email" type="text" label="E-Mail" variant="outlined" 
                  onChange={onChange}
                  onBlur={onChange}
                   />
                </div><br />
                <div>
                <TextField
                  className={classes.TextField}
                  error={resetpwd.success}
                  //helperText={ loginError ? "E-mail ou senha inválidos." : ""}
                  type="text"
                  fullWidth id="password" type="password" label="Nova senha" variant="outlined" 
                  onChange={onChange}
                  onBlur={onChange} 
                  />
                </div>
              <br />
                <div>
                <TextField
                  className={classes.TextField}
                  error={resetpwd.success}
                  //helperText={ loginError ? "E-mail ou senha inválidos." : ""}
                  type="text"
                  fullWidth id="password_confirmation" type="password" label="Confirmar nova senha" variant="outlined" 
                  onChange={onChange}
                  onBlur={onChange} 
                  />
                </div>
            </CardContent>
          <CardActions style={{flexDirection: 'column'}}>
            {!loading ? (
            <Button variant="contained" size="large" fullWidth color="primary" disableElevation type="submit" form="loginform"
            style={{
              background: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',
            }}>
              Recuperar 
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
bindActionCreators({ setSnackbar, setLoading, authDialog, setAuth,JWT_Decode }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword))
