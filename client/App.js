import React from "react";
import AppRouter from "./src/router"
import { connect, Provider } from 'react-redux'
import store from './store'
const App = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

export default App;
