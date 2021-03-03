import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
//
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
//

import { setSnackbar, setTimer} from '../../actions/appActions'
class Home extends Component {
    state = {
        item: undefined,
    }

    componentDidMount() {
        if(JSON.parse(localStorage.getItem("user")) == null){
            window.location.href = '/login';
            return;
        }
    }

    dialogHandler(item) {
        this.props.setDialog(true)
        this.setState({ ...this.state, item });
    }

    render() {
        const authData = JSON.parse(localStorage.getItem("user"));
        if(JSON.parse(localStorage.getItem("user")) == null){
            window.location.href = '/login';
            return <div> Sessão Encerrada.</div>;
        }
        const styles = {
            backgroundColor: "#fff",
            borderRadius: 3,
            padding: 10,
            paddingTop: 0
        }
        const classes = {
            root: {
                maxWidth: 345,
              },
              media: {
                height: 140,
              },
        }
        return (
            <Fragment>
              <Card className={classes.root}>
                    <CardMedia
                    className={classes.media}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Contemplative Reptile"
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Bem Vindo <b>{authData.name}</b>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Você foi Autenticado com sucesso.
                    </Typography>
                    </CardContent>
                    <CardActionArea>
                    </CardActionArea>
                <CardActions>
                    
                </CardActions>
                </Card>
            </Fragment>
        )
    }
}
const mapStateToProps = store => ({
    session: store.authReducer.data,
});
const mapDispatchToProps = dispatch =>
    bindActionCreators({ setSnackbar, setTimer }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home)
