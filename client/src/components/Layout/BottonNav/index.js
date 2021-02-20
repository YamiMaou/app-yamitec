import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { StyledBadge } from '../../Custom'
import RestoreIcon from '@material-ui/icons/Restore';
import Icon from '@material-ui/core/Icon';
import StorefrontIcon from '@material-ui/icons/Storefront';
import PaymentIcon from '@material-ui/icons/Payment';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import {styles} from './style'

import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

function BottonNav(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const authData = JSON.parse(localStorage.getItem("user"));
  return (
    <BottomNavigation
      value={value}
      style={styles.stickToBottom}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction component={Link}
        to="/" label="Produtos" icon={<StorefrontIcon/>} />
      {(props.auth !== undefined) &&
      <BottomNavigationAction  component={Link}
        to="/invoices" label="Faturas" icon={
          <StyledBadge badgeContent={0} color="secondary">
            <PaymentIcon />
          </StyledBadge>
        } />}
        
      <BottomNavigationAction onClick={() => props.setDialog(true)} label="Carrinho" 
      icon={
        <StyledBadge badgeContent={0} color="secondary">
          <ShoppingBasketIcon/>
        </StyledBadge>
      } />
    </BottomNavigation>
  );
}

const mapStateToProps = store => ({
  auth: store.authReducer.data
});
const mapDispatchToProps = dispatch =>
bindActionCreators({ }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BottonNav)