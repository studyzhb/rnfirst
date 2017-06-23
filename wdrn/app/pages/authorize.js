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
export default class Authorize extends Component{
    constructor(props){
        super(props);
        this.state={
            name:'zhang',
            tel:'18137826957',
            coding:'1-59367118-3887'
        }
    }
    _submit(){
        let self=this;
        let tel=this.state.tel;
        let name=this.state.name;
        let coding=this.state.coding;

        if(!tel){
            return isIOS?AlertIOS.alert('手机号不能为空！'):Alert.alert('手机号不能为空！');
        }

        if(!name){
            return isIOS?AlertIOS.alert('姓名不能为空！'):Alert.alert('姓名不能为空！');
        }

        if(!coding){
            return isIOS?AlertIOS.alert('编号不能为空！'):Alert.alert('编号不能为空！');
        }

        let body={
            tel:tel,
            name:name,
            coding:coding
        }

        let loginUrl=config.baseUrl+config.api.rebate.applyInfo;
    
        request.post(loginUrl,body)
                .then((data)=>{
                    if(data.code==1){
                        this.props.navigator.pop();
                        this.props.enterOblist();
                    }
                    else if (data.code == 2 || data.code == 3) {
                        let { navigator } = this.props;
                        
                        storage.remove({
                            key: 'loginUser'
                        });
                        storage.remove({
                            key: 'user'
                        });
                        storage.remove({
                            key: 'token'
                        });

                        if (navigator) {
                            navigator.popToTop();
                        }

                    }
                    else{
                        isIOS?AlertIOS.alert(data.message):Alert.alert(data.message);
                    }
                })
                .catch((err)=>{
                    console.log(JSON.stringify(err));
                }) 
        
    }

    leftPress(){
        
    }
    rightPress(){
        
        this.props.navigator.push({
            component: Register,
            args: {}
        });
    }
    /*leftIcon='ios-close-outline'*/
    render(){
       
        return (
            <View style={styles.container} > 
                <NavBar 
                    title='认证'
                    style={{'backgroundColor':'#fff'}}
                    titleStyle={{'color':'#666'}}
                    leftPress={this.leftPress.bind(this)}
                    rightPress={this.rightPress.bind(this)}
                />
                <View style={styles.inputWrapper}>
                    <Text style={styles.labelinput}>姓名</Text>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入姓名"
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='default' //弹出软键盘类型
                        onChangeText={(text)=>{
                            this.setState({
                                name:text
                            })
                        }}
                    />

                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.labelinput}>联系方式</Text>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入手机号"
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='numeric' //弹出软键盘类型
                        onChangeText={(text)=>{
                            this.setState({
                                tel:text
                            })
                        }}
                    />

                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.labelinput}>编号</Text>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入编号1-59367118-3887"
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='number-pad' //弹出软键盘类型
                        onChangeText={(text)=>{
                            this.setState({
                                coding:text
                            })
                        }}
                    />

                </View>
                <View style={{width:width,flexDirection:'row',justifyContent:'center'}}>
                    <Button
                        style={styles.btn}
                        onPress={this._submit.bind(this)}
                    >
                        立即申请
                    </Button>
                </View>
                <View style={{paddingLeft:px2dp(50),marginTop:8}}>
                    <Text style={{color:'#999',fontSize:12}}>同意并接受《会员认证协议》</Text>

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
        flex:2,
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


