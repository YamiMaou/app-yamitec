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
            (<MenuItem>
              <Link style={styles.link} to="/colaboradores" >
                <ListItemIcon>
                  <StyledBadge badgeContent={0} color="secondary">
                    <PeopleIcon fontSize="small"/>
                  </StyledBadge>
                </ListItemIcon>
                <Typography variant="inherit">Colaboradores</Typography>
              </Link>
            </MenuItem>)
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