import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  media: {
    height: 140,
  },
}));

function CardDialogLoading() {
  const classes = useStyles();
  
  return (
    <div>
        <Card className={classes.root}>
          <CardActionArea>
            <Typography gutterBottom variant="h5" component="h2">
            <Skeleton variant="rect" fullWidth height={400} />
            </Typography>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  <Skeleton variant="h1" />
                </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                <Skeleton variant="h2" />
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
              <Skeleton width="40%" />
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
          </CardActions>
        </Card>
    </div>
  );
}

export default CardDialogLoading