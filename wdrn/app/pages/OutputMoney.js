'use strict'

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    AlertIOS,
    Alert,
    Platform,
    Picker,
    PickerIOS,
    Dimensions,
    ActivityIndicator
} from 'react-native';

import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';
import px2dp from '../util/px2dp';
import NavBar from '../component/NavBar';

import CountDownText from '../util/CountDownText';

import { ListItem } from 'react-native-elements'
import LbsModal from '../component/LbsModal'

import SelectedBank from './SelectedBanklist'

const isIOS = Platform.OS === 'ios';
let { width, height } = Dimensions.get('window');

export default class OutputMoney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifyCode: '',
            phoneNumber: '',
            password: '',
            countingDone: false,
            codeSent: false,
            selectedItem: '',
            banklist: [],
            selectedPosition: 0,
            modalVisible: false,
        }
        this.interval = null;
    }

    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    rightPress() {

    }

    closeModal(pass) {
        this.setState({
            modalVisible: false
        })
        if (pass!==undefined) {
            this._goPay.bind(this, pass)();
        }
    }

    openLbs() {
        if (this.state.money - 0 > 0) {
            this.setState({ modalVisible: true })
        }
    }

    _goPay(pass) {
        let createOrderUrl = config.baseUrl + config.api.user.useroutput;
        let body = {
            money: this.state.money,
            pay_pwd: pass,
            user_card_id: this.state.selectedItem
        };

        request.post(createOrderUrl, body)
            .then(data => {
                console.log(data);
                if (data.code == 1) {
                    //支付成功
                    this.props.navigator.popToTop();
                } else {
                    isIOS
                        ? AlertIOS.alert(data.message)
                        : Alert.alert(data.message)
                }

            })
    }

    _submit() {
        this.openLbs.bind(this)();

    }

    _showVerifyCode() {
        this.setState({
            codeSent: true
        })
    }

    _countingDone() {
        this.setState({
            codeSent: false
        })
    }


    componentDidMount() {
        setTimeout(() => {
            let loginUrl = config.baseUrl + config.api.user.userBanklist;

            request.get(loginUrl)
                .then((data) => {

                    if (data.code == 1) {

                        this.setState({
                            banklist: data.data,
                            selectedItem: data.data[0].id
                        })
                    } else {
                        isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                    }
                })
                .catch((err) => {
                    console.warn(err)
                    // console.log(JSON.stringify(err));
                })
        }, 500);

    }

    changeBankSelected() {
        let { navigator } = this.props;
        let self = this;
        if (navigator) {
            navigator.push({
                name: "selectedBanklist",
                component: SelectedBank,
                params: {
                    updateSelectedBank: (key) => {
                        console.log(key);
                        self.setState({
                            selectedPosition: key
                        })
                    }
                }
            })
        }
    }


    _sendVerifyCode() {
        let self = this;
        let phoneNumber = this.state.phoneNumber;

        if (!phoneNumber) {
            return isIOS ? AlertIOS.alert('手机号不能为空!') : Alert.alert('手机号不能为空');
        }

        let body = {
            tel: phoneNumber,
            type: 'reg'
        }
        //注册URL
        let signupURL = config.baseUrl + config.api.user.sendmessage;

        request.get(signupURL, body)
            .then((data) => {

                if (data.code == 1) {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                    self._showVerifyCode()
                } else {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                }
            })
            .catch((err) => {
                console.log(err)
                isIOS ? AlertIOS.alert('获取验证码失败，请检查网络是否良好!') : Alert.alert('获取验证码失败，请检查网络是否良好');
            })
    }

    render() {

        if (this.state.banklist.length > 0) {
            return (
                <View style={styles.container}>
                    <View style={styles.container} >
                        <NavBar
                            title='提现'
                            style={{ 'backgroundColor': '#fff' }}
                            titleStyle={{ 'color': '#666' }}
                            leftIcon='ios-close-outline'
                            leftPress={this.leftPress.bind(this)}
                            rightPress={this.rightPress.bind(this)}
                        />

                        <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                            <ListItem
                                roundAvatar
                                onPress={this.changeBankSelected.bind(this)}
                                title={this.state.banklist.length > 0 ? this.state.banklist[this.state.selectedPosition].card_tip : ''}
                                subtitle={this.state.banklist.length > 0 ? this.state.banklist[this.state.selectedPosition].card_num : ''}
                                avatar={{ uri: this.state.banklist[this.state.selectedPosition].card.logo }}
                            />
                            {/*<View style={{ flex: 1, position: 'absolute', left: 0, top: 0, width: width }}>
                                <Picker
                                    selectedValue={this.state.selectedItem}
                                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0)', color: 'rgba(0,0,0,0)' }}
                                    onValueChange={(lang, itemPosition) => this.setState({ selectedItem: lang, selectedPosition: itemPosition })}>
                                    {
                                        this.state.banklist.length > 0 ? this.state.banklist.map((item, key) => {
                                            return <Picker.Item key={key} label={item.card_tip} value={item.id} />
                                        }) : null
                                    }
                                </Picker>
                            </View>*/}
                        </View>

                        <View style={styles.inputWrapper}>

                            <Text style={styles.labelinput}>金额</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholder="请输入提现金额"
                                //是否自动将特定字符切换为大写
                                autoCapitalize={'none'}
                                //关闭拼写自动修正
                                autoCorrect={false}
                                //去除android下的底部边框问题
                                underlineColorAndroid="transparent"
                                keyboardType='numeric' //弹出软键盘类型
                                onChangeText={(text) => {
                                    if (text-0>0) {
                                        this.setState({
                                            money: text,
                                            clicked:true
                                        })
                                    }else{
                                        this.setState({
                                            money: text,
                                            clicked:false
                                        })
                                    }

                                }}
                            />

                        </View>
                        <View style={{ width: width, flexDirection: 'row', justifyContent: 'center' }}>
                            <Button
                                style={[styles.btn, this.state.clicked ? { backgroundColor: '#2ac945', } : null]}
                                onPress={this._submit.bind(this)}
                            >
                                下一步
                    </Button>
                        </View>

                    </View>
                    <LbsModal
                        total={this.state.money}
                        modalVisible={this.state.modalVisible}
                        closeModal={this.closeModal.bind(this)}
                    />
                </View>

            )
        } else {
            return (
                <View style={{ backgroundColor: '#fff', justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                    <ActivityIndicator color="#aa00aa" />
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding:10,
        backgroundColor: '#eaeaea',
        // alignItems:'center'
        // justifyContent:'center'
    },
    logo: {
        height: px2dp(100)
    },
    inputWrapper: {
        backgroundColor: '#fff',
        height: px2dp(50),
        // borderBottomWidth: 1,
        // borderBottomColor: "#eaeaea",
        marginTop: 10,
        paddingLeft: 10,
        // width:width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    labelinput: {
        fontSize: 16,
        flex: 1,
        paddingLeft: 10,
        height: px2dp(50),
        color: '#3a3a3a',
        alignItems: 'center',
        paddingTop: px2dp(16),
        alignSelf: 'center',
        backgroundColor: '#fff'
    },
    inputField: {
        padding: 0,
        fontSize: 14,
        flex: 3,
        paddingLeft: 10,
        height: px2dp(50),
        color: '#999',
        alignItems: 'center',
        backgroundColor: '#fff'
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
        backgroundColor: '#d8d8d8',
        // borderColor:'#ee735c',
        // borderWidth:1,
        borderRadius: 4,
        color: '#fff'
    },
    countBtn: {
        width: 110,
        height: 40,
        padding: 10,
        marginLeft: 8,
        backgroundColor: '#ee735c',
        borderColor: '#ee735c',
        color: '#fff',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: 15,
        borderRadius: 2
    },
})