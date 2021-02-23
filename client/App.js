import React from "react";
import AppRouter from "./src/router"
import { connect, Provider } from 'react-redux'
import { SnackbarProvider, useSnackbar } from 'notistack';
import store from './store'
console.reportErrorsAsExceptions = false;
const App = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>

);

export default App;
