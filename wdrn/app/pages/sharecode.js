'use strict';

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    AlertIOS,
    Alert,
    Platform,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';

import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';
import px2dp from '../util/px2dp';
import NavBar from '../component/NavBar';
import QRCode from 'react-native-qrcode'


import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox, Avatar } from 'react-native-elements';

const isIOS = Platform.OS === 'ios';
let { width, height } = Dimensions.get('window');




export default class ShareCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text:''
        }
    }

    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    rightPress() {


    }

    componentDidMount() {
        let url=config.baseUrl+config.api.user.mycode;
        request.get(url)
            .then(data=>{
                console.log(data)
                if(data.code==1){
                    this.setState({
                        text:data.data
                    })
                }
            })
    }

    render() {
        return (
            <View style={styles.container} >
                <NavBar
                        title='我的二维码'
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                <View style={styles.codeStyle}>
                    <QRCode 
                    value={this.state.text}
                    size={200}
                    bgColor='purple'
                    fgColor='white'
                />
                </View>
                

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding:10,
        backgroundColor: '#fff',

    },  
    codeStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
