'use strict';

import React, { Component } from 'react'
import { View, Platform, BackAndroid } from 'react-native'
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
