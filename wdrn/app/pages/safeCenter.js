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
    Image, BackAndroid
} from 'react-native';

import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';
import px2dp from '../util/px2dp';
import NavBar from '../component/NavBar';
import Register from './payPass';
import ChangeLogin from './changeLogin';
import ChangePay from './payPass';
import Item from '../component/Item';
const isIOS = Platform.OS === 'ios';
let { width, height } = Dimensions.get('window');
export default class SafeCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            password: ''
        }
        this.config = [
            { icon: "ios-pin", name: "修改登录密码", onPress: this.goPage.bind(this, "changeLogin") },
            { icon: "ios-bulb-outline", name: "修改支付密码", color: "#fc7b53", onPress: this.goPage.bind(this, "changePay") },
        ]
    }
    _submit() {
        let {navigator} = this.props;   

        storage.remove({
            key: 'loginUser'
        });
        storage.remove({
            key: 'user'
        });
        storage.remove({
            key: 'token'
        });

        if(navigator){
            navigator.popToTop();
        }
    }

    goPage(key, data = {}) {
        let pages = {
            "changeLogin": ChangeLogin,
            'changePay': ChangePay
        }
        if (pages[key]) {
            this.props.navigator.push({
                component: pages[key],
                args: { data },
                params: {
                    is_pay: this.state.ispay,
                    isrealname: this.state.isrealname
                }
            })
        }
    }

    leftPress() {
        let {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }
    rightPress() {

        this.props.navigator.push({
            component: Register,
            args: {}
        });
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            if (i % 3 == 0) {
                item.first = true
            }
            return (<Item key={i} {...item} />)
        })
    }

    render() {
        return (
            <View style={styles.container} >
                <NavBar
                    title='安全中心'
                    style={{ 'backgroundColor': '#fff' }}
                    titleStyle={{ 'color': '#666' }}
                />

                <View>
                    {
                        this._renderListItem()
                    }
                </View>
                <View style={{ width: width, flexDirection: 'row', justifyContent: 'center' }}>
                    <Button
                        style={styles.btn}
                        onPress={this._submit.bind(this)}
                    >
                        注销登录
                    </Button>
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
        // alignItems:'center'
        // justifyContent:'center'
    },
    logo: {
        height: px2dp(200),
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputWrapper: {
        // backgroundColor:'#eaeaea',
        height: px2dp(50),
        // width:width,
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    labelinput: {
        fontSize: 16,
        flex: 1,
        paddingLeft: 10,
        height: px2dp(50),
        color: '#3a3a3a',
        alignItems: 'center',
        paddingTop: px2dp(16),
        alignSelf: 'center',
        backgroundColor: '#fff'
    },
    inputField: {
        padding: 0,
        fontSize: 14,
        flex: 6,
        height: px2dp(50),
        color: '#999',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    subbtn: {
        width: px2dp(284),
        height: px2dp(40),
        backgroundColor: '#2ac945',
        color: '#fff',
        fontSize: 18,
        alignItems: 'center',
        alignSelf: 'center'
    },
    btn: {
        width: px2dp(284),
        height: px2dp(40),
        marginTop: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2ac945',
        // borderColor:'#ee735c',
        // borderWidth:1,
        borderRadius: 4,
        color: '#fff'
    }
})


