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
    Dimensions,
    Image,
    WebView
} from 'react-native';

import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';
import px2dp from '../util/px2dp';
import NavBar from '../component/NavBar';

import Authorize from './authorize';

let DEFAULT_URL='https://www.baidu.com';
const isIOS=Platform.OS==='ios';
let {width,height} = Dimensions.get('window');

export default class Notice extends Component{
    constructor(props){
        super(props);
        this.state={
            url:DEFAULT_URL
        }
    }
    _submit(){
        this.props.navigator.push({
            name:'author',
            component:Authorize,
            params:{
                enterOblist:this.props.enterAuthor
            }
        });
    }

    leftPress(){
        
    }
    rightPress(){
        
    }

    render(){
        
        return (
            <View style={styles.container}>
            
                <View style={[styles.container,{paddingBottom:46}]} > 
                    <NavBar 
                        title='公告'
                        style={{'backgroundColor':'#fff'}}
                        titleStyle={{'color':'#666'}}
                        leftPress={this.leftPress.bind(this)}
                        rightPress={this.rightPress.bind(this)}
                    />
                    <View style={{justifyContent:'center',alignItems:'center',flex:1,paddingTop:10}}>
                        <WebView 
                            scalesPageToFit={true}
                            startInLoadingState={true}
                            style={styles.webView}
                            source={{uri: this.state.url}}
                        />
                    </View>
                    
                    <Button
                        style={styles.btn}
                        containerStyle={{padding:10,alignItems:'center'}}
                        onPress={this._submit.bind(this)}
                    >
                        立即认证
                    </Button>

                </View>
            </View>    

            
        )
    }



}

const styles=StyleSheet.create({
    container:{
        flex:1,
        // padding:10,
        backgroundColor:'#fff',
        // alignItems:'center'
        // justifyContent:'center'
    },
    webView:{
        width:322,
        flex:1
    },
    inputField:{
        padding:0,
        fontSize:14,
        flex:6,
        height:px2dp(50),
        color:'#999',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    subbtn:{
        width:px2dp(284),
        height:px2dp(40),
        backgroundColor:'#2ac945',
        color:'#fff',
        fontSize:18,
        alignItems:'center',
        alignSelf:'center'
    },
    btn:{
        width:px2dp(320),
        height:px2dp(40),
        marginTop:10,
        padding:10,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#2ac945',
        // borderColor:'#ee735c',
        // borderWidth:1,
        borderRadius:4,
        color:'#fff'
    }
})


