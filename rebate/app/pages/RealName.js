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
    Image
} from 'react-native';

import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';
import px2dp from '../util/px2dp';
import NavBar from '../component/NavBar';


const isIOS=Platform.OS==='ios';
let {width,height} = Dimensions.get('window');
export default class RealName extends Component{
    constructor(props){
        super(props);
        this.state={
            name:'',
            phoneNumber:'',
            code:''
        }
    }
    _submit(){
        
    }

    leftPress(){
        this.props.navigator.pop();
    }
    rightPress(){
        
        this.props.navigator.push({
            component: Register,
            args: {}
        });
    }

    render(){
        console.log(this.props)
        return (
            <View style={styles.container} > 
                <NavBar 
                    title='实名认证'
                    style={{'backgroundColor':'#fff'}}
                    titleStyle={{'color':'#666'}}
                    leftIcon='ios-close-outline'
                    leftPress={this.leftPress.bind(this)}
                    rightPress={this.rightPress.bind(this)}
                />
                <View style={styles.inputWrapper}>
                    <Text style={styles.labelinput}>身份证号</Text>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入身份证号"
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='number-pad' //弹出软键盘类型
                        onChangeText={(text)=>{
                            this.setState({
                                name:text
                            })
                        }}
                    />

                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.labelinput}>真实姓名</Text>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入真实姓名"
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='number-pad' //弹出软键盘类型
                        onChangeText={(text)=>{
                            this.setState({
                                phoneNumber:text
                            })
                        }}
                    />

                </View>

                <View style={{width:width,flexDirection:'row',justifyContent:'center'}}>
                    <Button
                        style={styles.btn}
                        onPress={this._submit.bind(this)}
                    >
                        提交
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
    logo:{
        height:px2dp(200),
        alignItems:'center',
        justifyContent:'center',
    },
    inputWrapper:{
         paddingLeft:20,
    },
    labelinput:{
        fontSize:16,
       
        height:px2dp(20),
        marginBottom:7,
        color:'#3a3a3a',
        alignItems:'center',
        paddingTop:px2dp(16),
        alignSelf:'center',
        backgroundColor:'#fff'
    },
    inputField:{
        width:334,
        height:44,
        paddingLeft:14,
        fontSize:14,
        color:'#999',
        alignItems:'center',
        borderColor:'#979797',
        borderWidth:1,
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
        width:px2dp(284),
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


