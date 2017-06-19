'use strict';

import React, { Component } from 'react';
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
    TouchableOpacity
} from 'react-native';

import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';
import px2dp from '../util/px2dp';
import NavBar from '../component/NavBar';

import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';

import ImagePicker from 'react-native-image-picker';

const isIOS = Platform.OS === 'ios';
let { width, height } = Dimensions.get('window');

let photoOptions = {
    //底部弹出框选项
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    quality: 0.75,
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

export default class Person extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: 3,
            age: '',
            sex: '',
            nickname: '',
            avatar: ''
        }
    }
    _submit() {
        let url = config.baseUrl + config.api.user.updateUserInfo;
        let { navigator } = this.props;
        let body = {
            age: this.state.age,
            sex: this.state.sex,
            nickname: this.state.nickname
        };

        request.post(url, body)
            .then(data => {
                isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                if (data.code == 1) {
                    this.props._onRefresh();
                    if (navigator) {
                        navigator.pop();
                    }
                }
            })
    }

    leftPress() {

    }
    rightPress() {


    }

    componentDidMount() {
        console.log(this.props, 'person')
        let { user } = this.props;
        this.setState({
            age: user.age,
            avatar: user.avatar,
            sex: user.sex,
            nickname: user.nickname,
            checked: user.sex
        })
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate  person')
        return true;
    }

    imageupload() {
        console.log('shangchuan')
        console.log(ImagePicker)
        if (!!ImagePicker) {
           ImagePicker.showImagePicker? ImagePicker.showImagePicker(photoOptions, (response) => {
                console.log('response' + response);

                if (response.didCancel) {
                    return
                }

                // let url = config.baseUrl + config.api.user.uploadImage;

                // let body = {
                //     type: 'avatar',
                //     avatar: response
                // }

                // request.post(url, body)
                //     .then(data => {
                //         if (data.code == 1) {
                //             this.setState({
                //                 avatar: response
                //             })
                //         }
                //     })

            }):null
        }

    }



    //rightText='注册'
    render() {
        return (
            <View style={styles.container} >
                <NavBar
                    title=''
                    style={{ 'backgroundColor': '#fff' }}
                    titleStyle={{ 'color': '#666' }}
                    leftIcon='ios-close-outline'
                    leftPress={this.leftPress.bind(this)}
                    rightPress={this.rightPress.bind(this)}
                />
                <TouchableOpacity style={styles.logo} onPress={this.imageupload.bind(this)}>
                    <Image source={this.state.avatar ? { uri: this.state.avatar } : require('../images/avatar.jpg')} style={{ width: px2dp(124), height: px2dp(124), borderRadius: 62 }} />
                </TouchableOpacity>
                <View style={styles.inputWrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='ios-contact-outline' size={18} />
                        <Text style={styles.labelinput}>昵称</Text>
                    </View>
                    <TextInput
                        style={styles.inputField}
                        value={this.state.nickname}
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='number-pad' //弹出软键盘类型
                        onChangeText={(text) => {
                            if (text.trim()) {
                                this.setState({
                                    nickname: text
                                })
                            }

                        }}
                    />

                </View>
                <View style={styles.inputWrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='ios-contact-outline' size={18} />
                        <Text style={styles.labelinput}>性别</Text>
                    </View>

                    <CheckBox
                        center
                        title='男'
                        onPress={() => { this.setState({ checked: 1, sex: '1' }) }}
                        containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='red'
                        checked={this.state.checked == 1}
                    />
                    <CheckBox
                        center
                        title='女'
                        onPress={() => { this.setState({ checked: 2, sex: '2' }) }}
                        containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='red'
                        checked={this.state.checked == 2}
                    />

                </View>
                <View style={styles.inputWrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='ios-contact-outline' size={18} />
                        <Text style={styles.labelinput}>年龄</Text>
                    </View>
                    <TextInput
                        style={styles.inputField}
                        value={this.state.age + ''}
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='number-pad' //弹出软键盘类型
                        onChangeText={(text) => {
                            if (text.trim()) {
                                this.setState({
                                    age: text
                                })
                            }

                        }}
                    />

                </View>
                <View style={{ width: width, flexDirection: 'row', justifyContent: 'center' }}>
                    <Button
                        style={styles.btn}
                        onPress={this._submit.bind(this)}
                    >
                        点击保存
                    </Button>
                </View>
            </View>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding:10,
        backgroundColor: '#fff',
        // alignItems:'center'
        // justifyContent:'center'
    },
    logo: {
        height: px2dp(200),
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputWrapper: {
        // backgroundColor:'#eaeaea',
        height: px2dp(44),
        width: px2dp(304),
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea",
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    labelinput: {
        fontSize: 12,
        paddingLeft: 10,
        height: px2dp(50),
        color: '#666',
        alignItems: 'center',
        paddingTop: px2dp(16),
        backgroundColor: '#fff'
    },
    inputField: {
        flex: 4,
        // padding:0,
        // fontSize:14,
        // flex:6,
        // height:px2dp(50),
        // color:'#999',
        textAlign: 'right',
        alignItems: 'center',
        // backgroundColor:'#fff'
    },
    subbtn: {
        width: px2dp(284),
        height: px2dp(40),
        backgroundColor: '#2ac945',
        color: '#fff',
        fontSize: 18,
        alignItems: 'center',
        alignSelf: 'center'
    },
    btn: {
        width: px2dp(284),
        height: px2dp(40),
        marginTop: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2ac945',
        // borderColor:'#ee735c',
        // borderWidth:1,
        borderRadius: 4,
        color: '#fff'
    }
})


