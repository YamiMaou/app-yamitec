import React, { useState, useEffect }  from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
/** Assets */

import {setSnackbar} from '../../../actions/appActions'
//import './index.css'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Footer(props) {
  let data = [];
  const doSome = async () => {
    if(props.invoices.length === 0){
      const response = await getInvoices();
      //console.log(response.data)
      props.setInvoices(response.data);
    }
  }
  // useEffect(() =>{doSome();}, [data])
  const classes = useStyles();
  return (
    <div className={classes.root}>
      
    </div>
  );
}


const mapStateToProps = store => ({
  snackbar: store.appReducer.snackbar,
});
const mapDispatchToProps = dispatch =>
bindActionCreators({ setSnackbar}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Footer)