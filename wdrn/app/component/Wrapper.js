'use strict';

import React, { Component } from 'react'
import { View, Platform, BackAndroid } from 'react-native'
import TabView from './TabView'
import Login from '../pages/validateLogin';

import FinalNum from '../util/FinalNum'

export default class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: FinalNum.LOGINDEFAULT
        }
        this.onBackAndroid = this.onBackAndroid.bind(this)
    }

    componentWillMount() {
        console.log('componentWillMount')
        storage.load({
            key: 'token'
        })
            .then(data => {
                if (data) {
                    console.log(data)
                    this.setState({
                        isLogin: FinalNum.LOGINFINISHED
                    })
                } else {
                    this.setState(
                        {
                            isLogin: FinalNum.LOGINNOFINISHED
                        }
                    )
                }
            })
            .catch(err => {
                console.log(err)
                switch (err.name) {
                    case 'NotFoundError':
                        // TODO;
                        this.setState({
                            isLogin: FinalNum.LOGINNOFINISHED
                        })
                        break;
                    case 'ExpiredError':
                        // TODO
                        this.setState({
                            isLogin: FinalNum.LOGINNOFINISHED
                        })
                        break;
                }
            })
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    componentWillUnmount() {
        console.log('componentWillUnmount')
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate')

        return true;
    }

    componentWillUpdate() {
        console.log('componentWillUpdate')
    }

    componentDidUpdate() {
        console.log("componentDidUpdate")

    }

    // componentShould

    onBackAndroid() {
        console.log(this)
        console.log('huitui')
        const nav = this.props.navigator;
        const routers = nav.getCurrentRoutes();
        if (routers.length > 1) {
            const top = routers[routers.length - 1];
            if (top.ignoreBack || top.component.ignoreBack) {
                // 路由或组件上决定这个界面忽略back键
                return true;
            }
            const handleBack = top.handleBack || top.component.handleBack;
            if (handleBack) {
                // 路由或组件上决定这个界面自行处理back键
                return handleBack();
            }
            // 默认行为： 退出当前界面。
            nav.pop();
            return true;
        }
        return false;
    }

    _afterLogin(user) {
        console.log(user);
        storage.save({
            key: 'loginUser',
            data: user
        })
        storage.save({
            key: 'token',
            data: user.login_token
        })
        this.setState({
            isLogin: FinalNum.LOGINFINISHED
        })
    }

    render() {
        if (this.state.isLogin == FinalNum.LOGINNOFINISHED) {
            return (
                <Login navigator={this.props.navigator} enterLogin={this._afterLogin.bind(this)} />
            )
        } else if (this.state.isLogin == FinalNum.LOGINFINISHED) {
            return (
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <TabView navigator={this.props.navigator} />
                </View>
            )
        } else if (this.state.isLogin == FinalNum.LOGINDEFAULT) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                </View>
            )
        }

    }
}
