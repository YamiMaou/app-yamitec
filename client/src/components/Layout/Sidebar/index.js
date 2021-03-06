import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { StyledBadge } from '../../Custom'
import { setMenu } from '../../../actions/appActions'
import { styles } from './style';
import clsx from 'clsx';

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(styles);

function Sidebar(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const authData = JSON.parse(localStorage.getItem("user"));
  const menuItems = () => {
    const views = [
      {url: "/colaboradores", label: 'Colaboradores', icon: <PeopleIcon fontSize="small" />},
      {url: "/clientes", label: 'Clientes', icon: <PeopleIcon fontSize="small" />},
      {url: "/responsaveis", label: 'Responsáveis', icon: <PeopleIcon fontSize="small" />},
      {url: "/fornecedores", label: 'Fornecedores', icon: <PeopleIcon fontSize="small" />},
      {url: "/bonificacao", label: 'Bonificação', icon: <PeopleIcon fontSize="small" />},
      {url: "/contas", label: 'Ger. Contas', icon: <PeopleIcon fontSize="small" />},
      {url: "/funcoes", label: 'Perfis', icon: <PeopleIcon fontSize="small" />},
      {url: "/perfis", label: 'Permissões', icon: <PeopleIcon fontSize="small" />},
      {url: "/auditoria", label: 'Auditoria', icon: <PeopleIcon fontSize="small" />},
      {url: "/relatorios", label: 'Relatórios', icon: <PeopleIcon fontSize="small" />},
      //{url: "/Fornecedores", label: 'Fornecedores', icon: <PeopleIcon fontSize="small" />},
    ]
    if(authData === null) return ('');
    //console.log(authData);

    return authData.permissions.map((v, k) => {
      //console.log(v.module_id);
      //console.log(views[(v.module_id-1)]);
      if(k >= 12) return ('');
      if(v.read === 0) return ('');

      //return ('');
      return(
      <MenuItem key={`sidebar-menu-ind-${k}`} >
        <Link style={styles.link} to={views[(v.module_id-1)].url} >
          <ListItemIcon>
            <StyledBadge badgeContent={0} color="secondary">
              {views[(v.module_id-1)].icon}
            </StyledBadge>
          </ListItemIcon>
          <Typography variant="inherit">{views[(v.module_id-1)].label}</Typography>
        </Link>
      </MenuItem>)
    });
    let view = authData.permissions.find(x => x.module === 0)
    view.read === 1
  }
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    props.setMenu(!props.open)
    setState({ ...state, [anchor]: open });
  };


  return (
    <Drawer anchor="left" open={props.open} onClose={toggleDrawer("left", false)}>
      <div
        className={clsx(classes.list, {
          [classes.fullList]: "left",
        })}
        role="presentation"
        onClick={toggleDrawer("left", false)}
        onKeyDown={toggleDrawer("left", false)}
      >
        <MenuList>
          <MenuItem>
            <Link style={styles.link} to="/" >
              <ListItemIcon>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Home</Typography>
            </Link>
          </MenuItem>
          {
            authData !== null &&
            (<div>
              {menuItems()}
             </div>)
          }
        </MenuList>
        <Divider />
      </div>
    </Drawer>
  );
}
const mapStateToProps = store => ({
  open: store.appReducer.open,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setMenu }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)