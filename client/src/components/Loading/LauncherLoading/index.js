import React, { Component, Fragment } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Api } from '../../../providers/api'
import { postAuth, getInvoices, getApiProducts } from '../../../providers/api'
import empty from '../../../../assets/empty_box.png'

class LauncherLoading extends Component {
    async componentDidMount() {
        
    }

    render() {
        let failed = false;
        const doFail = async () => {
            return await setTimeout(() => {
                failed = true
            }
                , 5000);
        }
        //doFail();
        const client = localStorage.getItem("cliente") == null ? {
            logo: undefined
        } :JSON.parse(localStorage.getItem("cliente"));
        const styles = {
            backgroundColor: "#fff",
            borderRadius: 3,
            padding: 10,
            paddingTop: 0
        }
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {failed === undefined, failed !== true ? (
                    <div>
                        <Image source={  "https://services.yamitec.com/"+client.logo } />
                        <CircularProgress />
                    </div>
                ) : (
                        <Text> Problema ao carregar .</Text>
                    )}

            </View>
        )
    }
}
const mapStateToProps = store => ({
    auth: store.authReducer.data
});
const mapDispatchToProps = dispatch =>
    bindActionCreators({ setAuth}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LauncherLoading)
