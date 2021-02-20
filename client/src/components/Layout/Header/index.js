import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { StyledBadge } from '../../Custom'
import { setMenu, setLoading } from '../../../actions/appActions'
import { setDialog as authDialog, setAuth } from '../../../actions/authAction'
import { checkImageUrl } from '../../../providers/commonMethods'
/** Assets */
import { fade, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MenuIcon from '@material-ui/icons/Menu';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import SearchIcon from '@material-ui/icons/Search';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

import Avatar from '@material-ui/core/Avatar';
import { styles, StyledAppBar } from './style.js'
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  search: {
    display: 'none',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '70ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }
}));

function Header(props) {
  const authData = JSON.parse(localStorage.getItem("user"));
  
  const cliente = JSON.parse(localStorage.getItem("cliente")) === null ? { logo: undefined } :JSON.parse(localStorage.getItem("cliente"));
  const doEffect = () => {
    if( props.auth === undefined &&
      JSON.parse(localStorage.getItem("user")) !== null )
        props.setAuth(JSON.parse(localStorage.getItem("user")));
  }

  const classes = useStyles();
  const toggleMenu = () => {
    props.setMenu(true);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const usrClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutClick = () => {
    //console.log(props.auth)
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    props.setAuth(undefined);
    setAnchorEl(null);
    window.location.href="/login";
  };
  let hostUrl = "https://services.yamitec.com";
  //console.log(hostUrl+"/"+cliente.logo);
  let isLogo = checkImageUrl(cliente.logo) ? true :  false
  return (
    <div className={classes.root}>
      {props.loading === true ? <CircularProgress /> : null}
      <StyledAppBar position="fixed">
        <Toolbar>
          {//window.innerWidth >= 767 &&
            <IconButton edge="start" onClick={() => toggleMenu()} className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          }

          <Typography variant="h6" className={classes.title}>
            { isLogo ? (
              <img height={40} style={{
                marginRight: 15,
                marginTop: 10
              }} src={
                cliente !== null ? checkImageUrl(cliente.logo) ? cliente.logo :
                checkImageUrl(hostUrl+"/"+cliente.logo) ?
                  hostUrl+"/"+cliente.logo :
                  '' : ''
                 } />
            ) : ("Farmácia Fácil") }
          </Typography>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Buscar produtos, categorias, etc..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

         
          {authData !== null ? (
            <div>
              <Button color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={usrClick}>
              <Avatar alt={authData.name}> {authData.name.charAt(0)} </Avatar> &nbsp; { window.innerWidth >= 767 && authData.name }
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                 { window.innerWidth < 767 && <MenuItem disable={true}>{authData.name}</MenuItem>}
                <MenuItem onClick={logoutClick}>
                  <PowerSettingsNewIcon style={{ color: red[500] }}/>
                  Sair 
                </MenuItem>
              </Menu>
            </div>
          ) : (
            ''  // <Button color="inherit" onClick={() => {props.authDialog(true);}}>Login</Button>
          )}

        </Toolbar>
      </StyledAppBar>
    </div>
  );
}
const mapStateToProps = store => ({
  open: store.appReducer.open,
  loading: store.appReducer.loading,
  auth: store.authReducer.data
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setMenu, setLoading, authDialog, setAuth }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header)
