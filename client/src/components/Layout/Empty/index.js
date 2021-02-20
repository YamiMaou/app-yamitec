import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function EmpryAlert() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="warning">
        <AlertTitle>Conteúdo Indisponível</AlertTitle>
        o item selecionado não possui conteúdo disponível para seu perfil.<strong>check it out!</strong>
      </Alert>
    </div>
  );
}