import React, { Component, Fragment } from 'react'
/** Assets */

import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

class ListLoading extends Component {

    render() {
        return (
            <Paper>
            <div>
                {(Array.from(new Array(5))).map((item, index) => (
                <Skeleton fullWidth height={64} />
                ))}
           </div>
           </Paper>
        )
    }
}

export default ListLoading