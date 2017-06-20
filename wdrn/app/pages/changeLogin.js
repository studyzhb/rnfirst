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

import CountDownText from '../util/CountDownText';

const isIOS=Platform.OS==='ios';
let {width,height} = Dimensions.get('window');
// console.log(CountDownText)

let count={
    num:60
}

export default class ChangeLogin extends Component{
    constructor(props){
        super(props);
        this.state={
            verifyCode:'',
            phoneNumber:'',
            password:'',
            password1:'',
            countingDone:false,
            codeSent:false,
            count:60
        }
        this.interval=null;
    }

    leftPress(){
       
        this.props.navigator.pop();
    }
    rightPress(){
       
    }

     _submit(){
        let self=this;
        let phoneNumber=this.state.phoneNumber;
        let verifyCode=this.state.verifyCode;
        let password = this.state.password;
        let password1 = this.state.password1;
        if(!phoneNumber||!verifyCode){
            return isIOS?AlertIOS.alert('手机号或验证码不能为空！'):Alert.alert('手机号或验证码不能为空！');
        }

        if(!password){
            return isIOS?AlertIOS.alert('密码不能为空！'):Alert.alert('密码不能为空！');
        }

        let body={
            tel:phoneNumber,
            code:verifyCode,
            password:password,
        }

        let verifyURL=config.baseUrl + config.api.user.changePass;

        request.post(verifyURL,body)
                .then((data)=>{
                 
                    if(data.code==1){
                        this.props.navigator.pop();
                    }else{
                        isIOS?AlertIOS.alert(data.message):Alert.alert(data.message);
                    }
                })
                .catch((err)=>{
                    console.log(err)
                    isIOS?AlertIOS.alert('获取验证码失败，请检查网络是否良好'):Alert.alert('获取验证码失败，请检查网络是否良好');
                })
    }
    
    _showVerifyCode(){
        let self=this;
        this.setState({
            codeSent:true
        })
        clearInterval(this.interval)
        this.interval=setInterval(()=>{
            count.num--;
            this.setState({
                count:count.num
            })
            if(count.num<=0){
                self.setState({
                    codeSent:false
                })
                clearInterval(self.interval)
            }
        },1000);
    }

    _countingDone(){
       
        this.setState({
            countingDone:true
        })
    }

    _sendVerifyCode(){
        let self=this;
        let phoneNumber=this.state.phoneNumber;

        if(!phoneNumber){
            return isIOS?AlertIOS.alert('手机号不能为空!'):Alert.alert('手机号不能为空');
        }

        let body={
            tel:phoneNumber,
            type:'find'
        }
        //注册URL
        let signupURL=config.baseUrl + config.api.user.sendmessage;

        request.get(signupURL,body)
                .then((data)=>{
                   
                    if(data.code==1){
                        isIOS?AlertIOS.alert(data.message):Alert.alert(data.message);
                        self._showVerifyCode()
                    }else{
                        isIOS?AlertIOS.alert(data.message):Alert.alert(data.message);
                    }
                })
                .catch((err)=>{
                    console.log(err)
                     isIOS?AlertIOS.alert('获取验证码失败，请检查网络是否良好!'):Alert.alert('获取验证码失败，请检查网络是否良好');
                })
    }

    render(){
        return (
            <View style={styles.container} > 
                <NavBar 
                    title='设置登录密码'
                    style={{'backgroundColor':'#fff'}}
                    titleStyle={{'color':'#666'}}
                    leftIcon='ios-close-outline'
                    leftPress={this.leftPress.bind(this)}
                    
                    rightPress={this.rightPress.bind(this)}
                />
                <View style={styles.logo}>
                    
                </View>
                <View style={styles.inputWrapper}>
                    <Text>+86</Text>
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
                    
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入收到的验证码"
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='number-pad' //弹出软键盘类型
                        onChangeText={(text)=>{
                            this.setState({
                                verifyCode:text
                            })
                        }}
                    />
                    {
                        !this.state.codeSent
                        ?<Button onPress={this._sendVerifyCode.bind(this)} style={[styles.countBtn,{backgroundColor:'#fff',color:'#2ac945',fontSize:14,height:px2dp(50),paddingTop:px2dp(18)}]}>
                        获取验证码
                        </Button>
                        :<Button style={[styles.countBtn,{backgroundColor:'#fff',color:'#2ac945',fontSize:14,height:px2dp(50),paddingTop:px2dp(18)}]}>
                            ({count.num}秒)后再试
                        </Button>
                        
                    }
                    
                </View>
                <View style={styles.inputWrapper}>
                    
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请设置密码"
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
                        确认
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
        height:px2dp(100)
    },
    inputWrapper:{
        // backgroundColor:'#eaeaea',
        height:px2dp(50),
        borderBottomWidth:1,
        borderBottomColor:"#eaeaea",
        paddingLeft:10,
        // width:width,
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
        flex:1,
        paddingLeft:10,
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
        backgroundColor:'#d8d8d8',
        // borderColor:'#ee735c',
        // borderWidth:1,
        borderRadius:4,
        color:'#fff'
    },
    countBtn:{
        width:110,
        height:40,
        padding:10,
        marginLeft:8,
        backgroundColor:'#ee735c',
        borderColor:'#ee735c',
        color:'#fff',
        textAlign:'left',
        fontWeight:'600',
        fontSize:15,
        borderRadius:2
    },
})