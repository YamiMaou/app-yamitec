import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { postAuth, JWT_Decode } from '../../../providers/api'
import {setDialog as authDialog, setAuth} from '../../../actions/authAction'
import {setLoading } from '../../../actions/appActions'
import { StyledAppBar } from '../../Layout/Header/style'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import InputMask from 'react-input-mask';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop:84,
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
  const classes = useStyles();

  const handleClose = () => {
    props.authDialog(false);
  };

  const { aDialog } = props;

  //
  let dados = {};
  function onChange(e) {
    dados[e.target.id] = e.target.value
    console.log(dados);
    //props.setAuth(dados);
    //props.setLoading(false);
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let data = await postAuth(dados);
    console.log(data);
    if(data !== undefined) {
      if(data.data.success){
        //let userData= JWT_Decode(data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.data.user));
        localStorage.setItem("token", data.data.data.token);
        props.setAuth(data.data.data.user);
        //let invoices = await getInvoices();
        //props.setInvoices(invoices.data);
        handleClose();
        setLoginerror(false);
      }else{
        setLoginerror(true)
      }
    }
  }
  //
  return (
    <div>
      <form id="loginform" onSubmit={onSubmit}>
      <Dialog fullScreen open={aDialog} onClose={() => handleClose()} TransitionComponent={Transition}>
        <StyledAppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => handleClose()} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Entrar
            </Typography>
          </Toolbar>
        </StyledAppBar>
        <Card className={classes.root}>
          <CardActionArea>
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
                helperText={ loginError ? "Usuário ou senha invalidos." : ""}
                type="text"
                fullWidth id="email" type="text" label="E-Mail" variant="outlined" onChange={onChange} />
              </div><br />
              <div>
              <TextField
                error={loginError === true ? true : false}
                helperText={ loginError ? "Usuário ou senha invalidos." : ""}
                type="text"
                fullWidth id="password" type="password" label="Senha" variant="outlined" onChange={onChange} />
              </div>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button variant="contained" size="big" fullWidth color="primary" disableElevation type="submit" form="loginform"
            style={{
              position: 'fixed',
              bottom: 0, left: 0,
              background: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',
            }}>
              Entrar
            </Button>
          </CardActions>
        </Card>
      </Dialog>
      </form>
    </div>
  );
}
const mapStateToProps = store => ({
  aDialog: store.authReducer.authDialog,
  data: store.authReducer.data,
});
const mapDispatchToProps = dispatch =>
bindActionCreators({ setLoading, authDialog, setAuth,JWT_Decode }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenInvoiceDialog)
