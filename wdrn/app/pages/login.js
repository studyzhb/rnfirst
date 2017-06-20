'use strict';

import React,{Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    AlertIOS,
    Alert,
    Platform
} from 'react-native';

import CountDownText from '../util/CountDownText';
import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';

const isIOS=Platform.OS=='ios';
export default class Login extends Component{
    constructor(props){
        super(props)
        this.state={
            verifyCode:'',
            phoneNumber:'',
            countingDone:false,
            codeSent:false
        }
    }

    _showVerifyCode(){
        this.setState({
            codeSent:true
        })
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
            phoneNumber:phoneNumber
        }
        //注册URL
        let signupURL='';
        
        request.post(signupURL,body)
                .then((data)=>{
                    if(data&&data.success){
                        self._showVerifyCode()
                    }else{
                        isIOS?AlertIOS.alert('获取验证码失败，请检查手机号是否正确!'):Alert.alert('获取验证码失败，请检查手机号是否正确');
                    }
                })
                .catch((err)=>{
                     isIOS?AlertIOS.alert('获取验证码失败，请检查网络是否良好!'):Alert.alert('获取验证码失败，请检查网络是否良好');
                })
    }

    //提交
    _submit(){
        let self=this;
        let phoneNumber=this.state.phoneNumber;
        let verifyCode=this.state.verifyCode;

        if(!phoneNumber||!verifyCode){
            return isIOS?AlertIOS.alert('手机号或验证码不能为空！'):Alert.alert('手机号或验证码不能为空！');
        }

        let body={
            phoneNumber:phoneNumber,
            verifyCode:verifyCode
        }

        let verifyURL='';

        request.post(verifyURL,body)
                .then((data)=>{
                    if(data&&data.success){
                        self.props.afterLogin(data.data)
                    }else{
                        isIOS?AlertIOS.alert('获取验证码失败，请检查手机号是否正确!'):Alert.alert('获取验证码失败，请检查手机号是否正确!');
                    }
                })
                .catch((err)=>{
                    isIOS?AlertIOS.alert('获取验证码失败，请检查网络是否良好'):Alert.alert('获取验证码失败，请检查网络是否良好');
                })


    }

    render(){
        return (
            <View style={styles.container}> 
                <View style={styles.signupBox}>
                    <Text>快速登录</Text>
                    <TextInput
                        placeholder="输入手机号"
                        autoCaptialize={'none'}
                        autoCorrect={false}
                        keyboardType={'number-pad'}
                        style={styles.inputField}
                        onChangeText={(text)=>{
                            this.setState({
                                phoneNumber:text
                            })
                        }}
                    />
                    {
                        this.state.codeSent
                        ?<View style={styles.verifyCodeBox}>
                            <TextInput 
                                placeholder="输入验证码"
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                keyboardType={'number-pad'}
                                style={styles.inputField}
                                onChangeText={(text) => {
                                    this.setState({
                                    verifyCode: text
                                    })
                                }}
                            />
                            {
                                this.state.countingDone
                                ?<Button
                                    style={styles.countBtn}
                                    onPress={this._sendVerifyCode.bind(this)}
                                >
                                    获取验证码
                                </Button>
                                :<CountDownText 
                                    style={styles.countBtn}
                                    countType='seconds' //计时类型 seconds/date
                                    auto={true} //自动开始
                                    afterEnd={this._countingDone.bind(this)} //结束回调
                                    timeLeft={60} //正向计时 时间起点为0秒
                                    step={-1} //计时步长,以秒为单位，正数为正计时，负数为倒计时
                                    startText='获取验证码' //开始的文本
                                    endText='获取验证码' //结束文本
                                    intervalText={(sec)=>'剩余秒数：'+sec} //定时的文本回调
                                />
                            }
                        </View>
                        :null
                    }
                    
                    {
                        this.state.codeSent
                        ?<Button
                            style={styles.btn}
                            onPress={this._submit.bind(this)}
                        >
                            登录
                        </Button>
                        :<Button
                            style={styles.btn}
                            onPress={this._sendVerifyCode.bind(this)}
                        >
                            获取验证码
                        </Button>
                    }
                </View>
            </View>
        )
    }

}

const styles=StyleSheet.create({
    container:{
        flex:1,
        padding:10,
        backgroundColor:'#f9f9f9'
    },
    signupBox:{
        marginTop:30
    },
    title:{
        marginBottom:20,
        color:'#333',
        fontSize:20,
        textAlign:'center'
    },
    inputField:{
        // flex:1,
        height:40,
        padding:5,
        color:'#666',
        fontSize:16,
        backgroundColor:'#fff',
        borderRadius:4
    },
    verifyCodeBox:{
        marginTop:10,
        flexDirection:'row',
        justifyContent:'space-between'
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
    btn:{
        marginTop:10,
        padding:10,
        backgroundColor:'transparent',
        borderColor:'#ee735c',
        borderWidth:1,
        borderRadius:4,
        color:'#ee735c'
    }
})
