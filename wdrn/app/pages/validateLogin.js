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
    Image,TouchableOpacity
} from 'react-native';

import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';
import px2dp from '../util/px2dp';
import NavBar from '../component/NavBar';
import Register from './Register';
import ForgetPass from './ForgetPass';
import ChangeLogin from './changeLogin';

const isIOS=Platform.OS==='ios';
let {width,height} = Dimensions.get('window');

export default class LoginIndex extends Component{
    constructor(props){
        super(props);
        this.state={
            phoneNumber:'',
            password:''
        }
    }
    _submit(){
        let self=this;

        let phoneNumber=this.state.phoneNumber;
        let pass=this.state.password;

        if(!phoneNumber){
            return isIOS?AlertIOS.alert('手机号不能为空！'):Alert.alert('手机号不能为空！');
        }

        if(!pass){
            return isIOS?AlertIOS.alert('密码不能为空！'):Alert.alert('密码不能为空！');
        }

        let body={
            tel:phoneNumber,
            password:pass
        }

        let loginUrl=config.baseUrl+config.api.user.login;
        
        request.post(loginUrl,body)
                .then((data)=>{
                  
                    if(data.code==1){
                        this.props.enterLogin(data.data);
                    }else{
                        isIOS?AlertIOS.alert(data.message):Alert.alert(data.message);
                    }
                })
                .catch((err)=>{
                    console.log(err);
                }) 


    }

    leftPress(){
        return;
    }
    rightPress(){
        
        this.props.navigator.push({
            component: Register,
            args: {}
        });
    }

    changeLoginPass(){
        
        this.props.navigator.push({
            component: ChangeLogin,
            args: {}
        });
    }

    render(){
        return (
            <View style={styles.container} > 
                <NavBar 
                    title='登录'
                    style={{'backgroundColor':'#fff'}}
                    titleStyle={{'color':'#666'}}
                    rightText='注册'
                    rightPress={this.rightPress.bind(this)}
                />
                <View style={styles.logo}>
                    <Image source={require('../images/avatar.jpg')} style={{width:px2dp(80),height:px2dp(80)}} />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.labelinput}>账号</Text>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入手机号"
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
                <View style={styles.inputWrapper}>
                    <Text style={styles.labelinput}>密码</Text>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入密码"
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='number-pad' //弹出软键盘类型
                        onChangeText={(text)=>{
                            this.setState({
                                password:text
                            })
                        }}
                    />

                </View>
                <View style={{width:width,flexDirection:'row',justifyContent:'center'}}>
                    <Button
                        style={styles.btn}
                        onPress={this._submit.bind(this)}
                    >
                        登录
                    </Button>
                </View>
                <View style={{paddingLeft:px2dp(50),marginTop:8}}>
                    <TouchableOpacity onPress={this.changeLoginPass.bind(this)}>
                         <Text style={{color:'#999',fontSize:12}}>忘记密码</Text>
                    </TouchableOpacity>
                   
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
        // backgroundColor:'#eaeaea',
        height:px2dp(50),
        // width:width,
        borderBottomWidth:1,
        borderBottomColor:"#eaeaea",
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    labelinput:{
        fontSize:16,
        flex:1,
        paddingLeft:10,
        height:px2dp(50),
        color:'#3a3a3a',
        alignItems:'center',
        paddingTop:px2dp(16),
        alignSelf:'center',
        backgroundColor:'#fff'
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


