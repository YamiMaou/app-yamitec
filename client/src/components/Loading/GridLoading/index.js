import React, { Component, Fragment } from 'react'
/** Assets */

import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

class GridLoading extends Component {
    render() {
        const styles = {
            backgroundColor: "#fff",
            borderRadius: 3,
            padding: 10,
            paddingTop: 0
        }
        return (<Fragment>
            <GridList key="glL" cellHeight={230} spacing={50} cols={window.innerWidth < 767 ? window.innerWidth < 460 ? 1 : 2 : 4} >
                {(Array.from(new Array(9))).map((item, index) => (
                    <GridListTile key={index} style={{borderRadius: 3}}>
                        <Skeleton variant="rect" height={130}/>
                            <GridListTileBar
                                title={<Skeleton variant="text" />}
                                subtitle={<Skeleton variant="text" />}
                                actionIcon={
                                    <IconButton aria-label={`info about loading`} >
                                        <InfoIcon />
                                    </IconButton>
                                }
                            />
                    </GridListTile>))}
            </GridList>
        </Fragment>
    )}
}

export default GridLoading
