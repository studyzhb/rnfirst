'use strict';

import React, { Component } from 'react'
import { View } from 'react-native'
import TabView from './TabView'

export default class Wrapper extends Component{
    constructor(props){
      super(props);
      this.state={
        isLogin:false
      }
    }

    _afterLogin(){
        this.setState({
            isLogin:true
        })
    }

    render(){
        if(!this.state.isLogin){
            return (
                <Login navigator={this.props.navigator} enterLogin={this._afterLogin.bind(this)} />
            )
        }
        return(
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <TabView navigator={this.props.navigator} />
          </View>
        )
    }
}
