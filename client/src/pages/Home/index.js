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
import { Bar } from 'react-chartjs-2';
//

import { setSnackbar, setTimer} from '../../actions/appActions'
import { getApiRanking } from '../../providers/api';
class Home extends Component {
    state = {
        item: undefined,
        ranking: [0, 0, 0, 0, 0, 0]
    }

    async componentDidMount() {
        if(JSON.parse(localStorage.getItem("user")) == null){
            window.location.href = '/login';
            return;
        }
        const ranking = await getApiRanking();
        if(ranking !== undefined)
            this.setState({...this.state,  ranking: [ranking.client, ranking.provider, ranking.manager, ranking.contributor, ranking.other]});
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
        const data = {
            labels: ['Clientes', 'Farmácia', 'Responsáveis', 'Colaboradores','Outros'],
            datasets: [
              {
                label: '# Ranking',
                data: this.state.ranking,//[12, 50, 3, 5, 2, 3],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
              },
            ],
          };
          
          const options = {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          };
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
                        Resumo de Lançamentos Ger. de contas:
                    </Typography>
                    <div>
                    <Bar width={window.innerWidth > 720 ? 100 : 50} height={window.innerWidth > 720 ? 35 : 35} data={data} options={options} />
                    </div>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Caso o mesmo CPF esteja cadastrado em outros módulos, o lançamento é computado para o primeiro módulo seguindo a sequência:
                        cliente, responsável  e por último colaboradores.
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
