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

import Icon from 'react-native-vector-icons/Ionicons';
import {CheckBox} from 'react-native-elements';

const isIOS=Platform.OS==='ios';
let {width,height} = Dimensions.get('window');

export default class Person extends Component{
    constructor(props){
        super(props);
        this.state={
            checked:true,
        }
    }
    _submit(){
       
    }

    leftPress(){
       
    }
    rightPress(){
        
       
    }
    //rightText='注册'
    render(){
        return (
            <View style={styles.container} > 
                <NavBar 
                    title=''
                    style={{'backgroundColor':'#fff'}}
                    titleStyle={{'color':'#666'}}
                    leftIcon='ios-close-outline'
                    leftPress={this.leftPress.bind(this)}
                    rightPress={this.rightPress.bind(this)}
                />
                <View style={styles.logo}>
                    <Image source={require('../images/avatar.jpg')} style={{width:px2dp(124),height:px2dp(124),borderRadius:62}} />
                </View>
                <View style={styles.inputWrapper}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Icon name='ios-contact-outline' size={18} />
                        <Text style={styles.labelinput}>昵称</Text>
                    </View>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="一朵花花"
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
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Icon name='ios-contact-outline' size={18} />
                        <Text style={styles.labelinput}>昵称</Text>
                    </View>
                    
                    <CheckBox
                    center
                    title='男'
                    containerStyle={{backgroundColor:'#fff',borderWidth:0}}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checkedColor='red'
                    checked={this.state.checked}
                    />

                </View>
                <View style={styles.inputWrapper}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Icon name='ios-contact-outline' size={18} />
                        <Text style={styles.labelinput}>年龄</Text>
                    </View>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="22"
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
        height:px2dp(44),
        width:px2dp(304),
        borderBottomWidth:1,
        borderBottomColor:"#eaeaea",
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'space-between'
    },
    labelinput:{
        fontSize:12,
        paddingLeft:10,
        height:px2dp(50),
        color:'#666',
        alignItems:'center',
        paddingTop:px2dp(16),
        backgroundColor:'#fff'
    },
    inputField:{
        flex:4,
        // padding:0,
        // fontSize:14,
        // flex:6,
        // height:px2dp(50),
        // color:'#999',
        textAlign:'right',
        alignItems:'center',
        // backgroundColor:'#fff'
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


