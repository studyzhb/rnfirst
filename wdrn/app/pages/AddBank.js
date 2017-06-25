'use strict';

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    AlertIOS,
    Alert,
    Picker,
    PickerIOS,
    Platform,
    Dimensions,
    Image
} from 'react-native';

import Button from 'react-native-button';
import request from '../util/request';
import config from '../util/config';
import px2dp from '../util/px2dp';
import NavBar from '../component/NavBar';

import { FormLabel, FormInput } from 'react-native-elements';

let PickerItemIOS = PickerIOS.Item;

const isIOS = Platform.OS === 'ios';
let { width, height } = Dimensions.get('window');
export default class AddBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            card_num: '',
            card_tip: 'ceshi',
            banklist: []
        }
    }

    componentDidMount() {
        let url = config.baseUrl + config.api.user.showBanklist;
        request.get(url)
            .then(data => {
                console.log(data)
                if (data.code == 1) {
                    this.setState({
                        banklist: data.data
                    })
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
                else {
                    isIOS ? AlertIOS.alert(data.message) : Alert(data.message);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    _submit() {
        let { navigator, updateBank } = this.props;
        let self = this;

        let card_num = this.state.card_num;
        let card_tip = this.state.card_tip;

        if (!card_num) {
            return isIOS ? AlertIOS.alert('银行卡号不能为空！') : Alert.alert('银行卡号不能为空！');
        }

        if (!card_tip) {
            return isIOS ? AlertIOS.alert('开户行不能为空！') : Alert.alert('开户行不能为空！');
        }

        let body = {
            card_num: card_num,
            card_tip: card_tip
        }

        let loginUrl = config.baseUrl + config.api.user.addBank;



        request.post(loginUrl, body)
            .then((data) => {

                if (data.code == 1) {
                    if (updateBank) {
                        updateBank()
                    }
                    if (navigator) {
                        navigator.pop();
                    }
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
                else {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                }
            })
            .catch((err) => {
                console.log(JSON.stringify(err));
            })

    }

    leftPress() {
        this.props.navigator.pop();
    }
    rightPress() {

        this.props.navigator.push({
            component: Register,
            args: {}
        });
    }

    render() {

        return (
            <View style={styles.container} >
                <NavBar
                    title='银行卡'
                    style={{ 'backgroundColor': '#fff' }}
                    titleStyle={{ 'color': '#666' }}
                    leftIcon='ios-close-outline'
                    leftPress={this.leftPress.bind(this)}
                    rightPress={this.rightPress.bind(this)}
                />
                {/*<View style={styles.inputWrapper}>
                    <Text style={styles.labelinput}>持卡人</Text>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入姓名"
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='number-pad' //弹出软键盘类型
                        onChangeText={(text)=>{
                            this.setState({
                                card_num:text
                            })
                        }}
                    />

                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.labelinput}>身份证号</Text>
                    <TextInput 
                        style={styles.inputField}
                        placeholder="请输入"
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

                </View>*/}
                <View style={styles.inputWrapper}>
                    <FormLabel containerStyle={{ marginTop: -10 }} labelStyle={{ fontSize: 14 }}>卡号</FormLabel>
                    <FormInput
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        placeholder="请输入银行卡号"
                        //关闭拼写自动修正
                        autoCorrect={false}
                        containerStyle={{ marginLeft: 0 }}
                        inputStyle={{ width: width - 80, paddingLeft: 10 }}
                        //去除android下的底部边框问题
                        //underlineColorAndroid="transparent"
                        keyboardType='numeric' //弹出软键盘类型
                        onChangeText={(text) => this.setState({ card_num: text })} />
                </View>
                <View style={styles.inputWrapper}>
                    <FormLabel containerStyle={{ marginTop: -10 }} labelStyle={{ fontSize: 14 }}>银行</FormLabel>
                    {/*<Text style={styles.labelinput}>银行</Text>*/}
                    {
                        isIOS
                            ? <PickerIOS
                                style={styles.iospicker}
                                itemStyle={{fontSize: 25, color: 'red', textAlign: 'center', fontWeight: 'bold'}}
                                selectedValue={this.state.card_tip}
                                onValueChange={(lang) => this.setState({ card_tip: lang })}>
                                <PickerItemIOS 
                                    value={'ceshi'}
                                    label={'ceshi'}
                                />
                                <PickerItemIOS 
                                    value={'ceshi1'}
                                    label={'ceshi1'}
                                />
                                <PickerItemIOS 
                                    value={'ceshi2'}
                                    label={'ceshi2'}
                                />
                                {
                                  /*  this.state.banklist.length > 0
                                        ? this.state.banklist.map((item, key) => {
                                            return (
                                                <PickerIOS.Item
                                                    key={key}
                                                    value={item.tip}
                                                    label={item.tip}
                                                />
                                            )
                                        })
                                        :<PickerIOS.Item
                                                    key={1}
                                                    value={'ceshi'}
                                                    label={'ceshi'}
                                                />
                                    */
                                }
                            </PickerIOS>
                            : <Picker
                                style={styles.inputField}
                                selectedValue={this.state.card_tip}
                                onValueChange={(lang) => this.setState({ card_tip: lang })}>
                                {
                                    this.state.banklist.length > 0
                                        ? this.state.banklist.map((item, key) => {
                                            return (
                                                <Picker.Item label={item.tip} value={item.tip} key={key} />
                                            )
                                        })
                                        : null
                                }
                            </Picker>
                    }

                    {/*<TextInput 
                        style={styles.inputField}
                        placeholder="请输入"
                        //是否自动将特定字符切换为大写
                        autoCapitalize={'none'}
                        //关闭拼写自动修正
                        autoCorrect={false}
                        //去除android下的底部边框问题
                        underlineColorAndroid="transparent"
                        keyboardType='number-pad' //弹出软键盘类型
                        onChangeText={(text)=>{
                            this.setState({
                                card_tip:text
                            })
                        }}
                    />*/}

                </View>
                <View style={{ width: width, flexDirection: 'row', justifyContent: 'center' }}>
                    <Button
                        style={styles.btn}
                        onPress={this._submit.bind(this)}
                    >
                        提交
                    </Button>
                </View>
                <View style={{ paddingLeft: px2dp(50), marginTop: 8 }}>
                    <Text style={{ color: '#999', fontSize: 12 }}>为了资金安全，只能绑定当前实名认证人的银行卡</Text>

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
        backgroundColor: '#fff',
        height: px2dp(50),
        // width:width,
        // borderBottomWidth: 1,
        // borderBottomColor: "#eaeaea",
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelinput: {
        fontSize: 16,
        flex: 2,
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
        // fontSize: 14,
        flex: 6,
        height: px2dp(50),
        color: '#999',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#3a3a3a',
        borderBottomWidth: 1
    },
    iospicker: {
     
        paddingRight: 10,
        // fontSize: 14,
        width:100,
        height: px2dp(50),
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#3a3a3a',
        borderBottomWidth: 1
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


