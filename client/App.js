import React from "react";
import AppRouter from "./src/router"
import { connect, Provider } from 'react-redux'
import { SnackbarProvider, useSnackbar } from 'notistack';
import store from './store'
const App = () => (
  <SnackbarProvider maxSnack={3}>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </SnackbarProvider>
);

export default App;
