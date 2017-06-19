'use strict';

import React,{Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    AlertIOS,
    Alert,
    Platform,
    Dimensions
} from 'react-native';

import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';
import px2dp from '../util/px2dp';
import NavBar from '../component/NavBar';



export default class ForgetPass extends Component{
    constructor(props){
        super(props);
    }

    leftPress(){

    }
    rightPress(){

    }

    render(){
        return (
            <View>
                <NavBar 
                    title='忘记密码'
                    leftIcon='ios-notifications-outline'
                    leftPress={this.leftPress.bind(this)}
                    
                />
                <Text>忘记密码</Text>
            </View>
        )
    }
}