import React from 'react';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

export const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

export const PrimaryButton = withStyles((theme) => ({
  button: {
    background: theme.palette.primary.main,
    right: -3,
    top: 13,
    fontSize:64,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Button);