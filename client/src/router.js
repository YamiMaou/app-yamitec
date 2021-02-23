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
import Contributors from './pages/Contributors';
import CreateContributors from './pages/Contributors/create';
import EditContributors from './pages/Contributors/edit';
import LauncherDialog from './components/Loading/LauncherLoading'
import Header from './components/Layout/Header'
import {themeStyle} from './components/Layout/Header/style'
import Footer from './components/Layout/Footer'
import BottonNav from './components/Layout/BottonNav'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Box, Snackbar, Slide } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { Redirect } from "react-router-dom";

import { setAuth } from './actions/authAction';
import { setSnackbar } from './actions/appActions';
// Theme
const YamiTheme = createMuiTheme(themeStyle)
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
  return props.products !== undefined ? (<LauncherDialog />) : (
  <ThemeProvider theme={YamiTheme}>
    { authData !== null ? <Header /> : '' }
    <Container maxWidth="xl" style={{ overflow: 'hidden', paddingTop: 80, background: '#f1f1f1', height: window.innerHeight, overflow:'auto' }}>
      <Box>
      <Snackbar
        anchorOrigin={{ vertical:'top', horizontal: 'center' }}
        open={props.snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        TransitionComponent={TransitionDown}
        message={props.snackbar.message}
        key="snb"
      />
     
        <Router>
          <Switch>
            <Route path="/login" exact={true} component={Login} />
            <Route path="/" exact={true} render={() => (isAuth ?  <Home /> : <Redirect push to="/login" />)} />
            <Route path="/colaboradores" exact={true} render={() => (isAuth ?  <Contributors /> : <Redirect push to="/login" />)} />
            <Route path="/colaboradores/novo" exact={true} render={() => (isAuth ?  <CreateContributors /> : <Redirect push to="/login" />)} />
            <Route path="/colaboradores/:id" exact={true} render={() => (isAuth ?  <EditContributors /> : <Redirect push to="/login" />)} />
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
  snackbar: store.appReducer.snackbar
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setAuth, setSnackbar }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
