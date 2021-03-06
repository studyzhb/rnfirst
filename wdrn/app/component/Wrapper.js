'use strict';

import React, { Component } from 'react'
import { View, Platform, BackAndroid ,ActivityIndicator} from 'react-native'
import TabView from './TabView'
import Login from '../pages/testForm';

import FinalNum from '../util/FinalNum'

export default class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: FinalNum.LOGINDEFAULT
        }

    }

    componentWillMount() {
        // storage.save({
        //     key: 'navigator',
        //     data: this.props.navigator
        // })

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
    }

    shouldComponentUpdate() {

        if (this.state.isLogin==FinalNum.LOGINFINISHED) {
            let status=this.state.isLogin;
            storage.load({
                key: 'token'
            })
                .then(data => {
                    console.log(data)
                    if (data) {
                       return false;
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
        }

        return true;
    }

    componentWillUpdate() {
        console.log('componentWillUpdate')
    }

    componentDidUpdate() {
        console.log("componentDidUpdate")

    }

    // componentShould



    _afterLogin(user) {
        console.log(user);
        console.log('debgyu')
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
                     <ActivityIndicator color="#aa00aa" />
                </View>
            )
        }

    }
}
