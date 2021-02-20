import React from 'react';
import { Image, View } from 'react-native'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import FilterListIcon from '@material-ui/icons/FilterList';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

//
import healthy_options_svg from '../../../../../assets/healthy_options.svg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontFamily: 'Open Sans',
      padding: '2px 4px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
      marginBottom: 15,
      width: '95vw',
      height: '45vh'
    },
    svgContainer1:{
      color: '#3e3e3e',
      width: '100%',
      flexDirection: 'row',
      flex: 1,
    },
    svg1:{
      height: 150,
      width: 150
    },
    inputContainer: {
      padding: '2px 4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
      marginBottom: 15,
      width: '95vw',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      justifyContent: 'center',
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

export default function GlobalSearchBox() {
  const classes = useStyles();

  return (
    <div style={{fontFamily: 'Quicksand-Regular'}} className={classes.root}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <View><h2 style={{color: '#3e3e3e'}}>Nunca foi tão fácil pedir</h2></View>
        <View  style={{width: 150, marginLeft: 15, marginRight: 15}} ><img src={healthy_options_svg} className={classes.svg1} /></View>
        <View style={{flex: 1, flexDirection: "row"}}><h2><span style={{color: 'blue'}}>Comida</span></h2></View>
      </View>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <h3> Descubra lanchonetes, restaurantes e mercados perto de você</h3>
      </View>
    <Paper component="form" className={classes.inputContainer}>
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Busque por produtos ou comércios"
        inputProps={{ 'aria-label': 'Busque por produtos ou comércios' }}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton} aria-label="directions">
        <FilterListIcon />
      </IconButton>
    </Paper>
    </div>
  );
}
