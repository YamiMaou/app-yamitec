import React from "react";
import { connect, Provider } from 'react-redux'
import { bindActionCreators } from 'redux';
import { StyleSheet, Text, View, Platform } from "react-native";
import store from '../store'
import { Switch, Router, Route, Link } from "../react-router";

import Sidebar from './components/Layout/Sidebar'
import MiniDrawer from './components/Layout/Sidebar/minidrawer'
//import './index.css';

import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/Login/recovery';

//import Audits from './pages/Audits';Providers
import Contributors from './pages/Contributors';
import CreateContributors from './pages/Contributors/create';
import EditContributors from './pages/Contributors/edit';

import Providers from './pages/Providers';
import CreateProviders from './pages/Providers/create';
import EditProviders from './pages/Providers/edit';

import Clients from './pages/Clientes';
import CreateClients from './pages/Clientes/create';
import EditClients from './pages/Clientes/edit';

import Managers from './pages/Managers';
import CreateManagers from './pages/Managers/create';
import EditManagers from './pages/Managers/edit';

import Bonus from './pages/Bonificacao';
import CreateBonus from './pages/Bonificacao/create';
import EditBonus from './pages/Bonificacao/edit';

import LauncherDialog from './components/Loading/LauncherLoading'
import Header from './components/Layout/Header'
import { themeStyle } from './components/Layout/Header/style'
import Footer from './components/Layout/Footer'
import BottonNav from './components/Layout/BottonNav'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Box, Snackbar, Slide } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { Redirect } from "react-router-dom";

import { setAuth } from './actions/authAction';
import { setSnackbar, setTimer } from './actions/appActions';
// Theme
import * as locales from '@material-ui/core/locale';
const YamiTheme = createMuiTheme(themeStyle, locales['ptbr'])
//background: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',

const AppRouter = (props) => {
  const closeSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setSnackbar({ open: false, message: "" });
  };
  function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const authData = JSON.parse(localStorage.getItem("user"));
  const isAuth = authData !== null ? true : false;
  const routes = [
    { path: 'colaboradores', component: [<Contributors />, <EditContributors />, <CreateContributors />] },
    { path: 'clientes', component: [<Clients />, <EditClients />, <CreateClients />] },
    { path: 'responsaveis', component: [<Managers />, <EditManagers />, <CreateManagers />] },
  ]
  function permRoutes() {
    return <Route path="colaboradores" exact={true} render={() => (isAuth ? <Contributors /> : <Redirect push to="/login" />)} />
    return authData.permissions.map((v, k) => {
      if (k > 2) return ('');

      if (v.read === 0) return ('');
      console.log(routes[v.module]);
      return (
        <div>
          <Route path={`${routes[v.module].path}`} exact={true} render={() => (isAuth ? routes[v.module].component[0] : <Redirect push to="/login" />)} />
          <Route path={`${routes[v.module].path}/novo`} exact={true} render={() => (isAuth ? routes[v.module].component[1] : <Redirect push to="/login" />)} />
          <Route path={`${routes[v.module].path}/:id`} exact={true} render={() => (isAuth ? routes[v.module].component[2] : <Redirect push to="/login" />)} />
        </div>);
      /*if(session.permissions.find(x => x.module === 0).read === 0){
                    
      }*/
    });
  }
  return props.products !== undefined ? (<LauncherDialog />) : (
    <ThemeProvider theme={YamiTheme}>
      { authData !== null ? <Header /> : ''}
      <Container maxWidth="xl" style={{ overflow: 'hidden', paddingTop: 80, background: '#f1f1f1', height: window.innerHeight, overflow: 'auto' }}>
        <Box>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={props.snackbar.open}
            autoHideDuration={3000}
            onClose={closeSnack}
            TransitionComponent={TransitionDown}
            message={props.snackbar.message}
            key="snb"
          />

          <Router>
            <Switch>
              <Route path="/login" exact={true} render={() => (!isAuth ? <Login /> : <Redirect push to="/" />)} />
              <Route path="/reset/:token" exact={true} component={ResetPassword} />
              <Route path="/" exact={true} render={() => (isAuth ? <Home /> : <Redirect push to="/login" />)} />
              <Route path="/colaboradores" exact={true} render={() => (isAuth ? <Contributors /> : <Redirect push to="/login" />)} />
              <Route path="/colaboradores/novo" exact={true} render={() => (isAuth ? <CreateContributors /> : <Redirect push to="/login" />)} />
              <Route path="/colaboradores/:id" exact={true} render={() => (isAuth ? <EditContributors /> : <Redirect push to="/login" />)} />
              <Route path="/fornecedores" exact={true} render={() => (isAuth ? <Providers /> : <Redirect push to="/login" />)} />
              <Route path="/fornecedores/novo" exact={true} render={() => (isAuth ? <CreateProviders /> : <Redirect push to="/login" />)} />
              <Route path="/fornecedores/:id" exact={true} render={() => (isAuth ? <EditProviders /> : <Redirect push to="/login" />)} />

              <Route path="/clientes" exact={true} render={() => (isAuth ? <Clients /> : <Redirect push to="/login" />)} />
              <Route path="/clientes/novo" exact={true} render={() => (isAuth ? <CreateClients /> : <Redirect push to="/login" />)} />
              <Route path="/clientes/:id" exact={true} render={() => (isAuth ? <EditClients /> : <Redirect push to="/login" />)} />

              <Route path="/responsaveis" exact={true} render={() => (isAuth ? <Managers /> : <Redirect push to="/login" />)} />
              <Route path="/responsaveis/novo" exact={true} render={() => (isAuth ? <CreateManagers /> : <Redirect push to="/login" />)} />
              <Route path="/responsaveis/:id" exact={true} render={() => (isAuth ? <EditManagers /> : <Redirect push to="/login" />)} />
              
              <Route path="/bonificacao" exact={true} render={() => (isAuth ? <Bonus /> : <Redirect push to="/login" />)} />
              <Route path="/bonificacao/novo" exact={true} render={() => (isAuth ? <CreateBonus /> : <Redirect push to="/login" />)} />
              <Route path="/bonificacao/:id" exact={true} render={() => (isAuth ? <EditBonus /> : <Redirect push to="/login" />)} />

              <Route path="*">
                <Box>
                  <View> Pagina não encontrada.</View>
                </Box>
              </Route>
            </Switch>
            <Sidebar />
            { /*window.innerWidth < 767 &&
            <BottonNav />}
          {window.innerWidth >= 767 &&
          <Sidebar /> */}
          </ Router>
          <Footer />
        </Box>
      </Container>
    </ThemeProvider>)
  //)};
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
const mapStateToProps = store => ({
  auth: store.authReducer.data,
  timer: store.appReducer.timer,
  snackbar: store.appReducer.snackbar
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setAuth, setSnackbar, setTimer }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
