'use strict';
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform,
    AlertIOS,
    Alert,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

import Button from 'react-native-button';
import Item from '../component/Item';
import NavBar from '../component/NavBar';
import px2dp from '../util/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import config from '../util/config'
import request from '../util/request'

import LbsModal from '../component/LbsModal'

import alipay from '../util/alipay'

import FINALNUM from '../util/FinalNum'

let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';

let orderData = {};

export default class Pay extends Component {

    constructor(props) {
        super(props);
        this.payinfo = [
            { icon: "ios-pin", name: "安全中心" },
            { icon: "ios-bulb-outline", name: "意见反馈", color: "#fc7b53" },
            { icon: "ios-information-circle-outline", name: "关于我们", subName: "分润奖励金", color: "#fc7b53" }
        ]
        this.state = {
            checked: FINALNUM.BALANCETYPE,
            modalVisible: false,
            ispaypwd:null
        }
    }

    componentDidMount(){
        storage.load({
            key:'loginUser'
        })
        .then(data=>{
            this.setState({
                ispaypwd:data.is_pay_pwd
            })
        })
    }

    openLbs() {

        this.setState({ modalVisible: true })
    }

    createOrder() {
        let createOrderUrl = config.baseUrl + config.api.rebate.createOrder;
        let body = {
            goods_arr: JSON.stringify(this.props.totalArr),
            is_back: this.props.isback - 0 - 1,
            creditor_id: this.props.queueid
        };

        request.post(createOrderUrl, body)
            .then(data => {

                if (data.code == 1) {
                    orderData = data.data;
                    switch (this.state.checked) {
                        case FINALNUM.BALANCETYPE:
                            // this._goPay(data.data);
                            if(this.state.ispaypwd){
                                this.openLbs.bind(this)();
                            }else if(this.state.ispaypwd!==null&&!this.state.ispaypwd){
                                this._goPay.bind(this,orderData,'');
                            }
                            
                            break;
                        case FINALNUM.ALIPAYTYPE:
                            alipay({
                                type: "alipay",
                                ordernum: data.data.order_sn,
                                money: this.props.total,
                                remark: '支付宝支付'
                            })()
                            break;
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
                    isIOS
                        ? AlertIOS.alert(data.message)
                        : Alert.alert(data.message)
                }

            })
    }


    _goPay(data, pass) {

        let createOrderUrl = config.baseUrl + config.api.pay.balance;
        let body = {
            order_sn: data.order_sn,
            pay_pwd: pass
        };

        request.post(createOrderUrl, body)
            .then(data => {
                if (data.code == 1) {
                    isIOS
                        ? AlertIOS.alert(data.message)
                        : Alert.alert(data.message)
                    //支付成功
                    this.props.navigator.popToTop();
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
                    isIOS
                        ? AlertIOS.alert(data.message)
                        : Alert.alert(data.message)
                }

            })
    }

    closeModal(pass) {


        this.setState({
            modalVisible: false,
        })
        if (pass !== undefined) {
            this._goPay.bind(this, orderData, pass)();
        }

    }

    changeCheckedType(type) {
        this.setState(
            {
                checked: type
            }
        )
    }

    renderGoodsList() {
        return (
            <View style={{ backgroundColor: '#f3f3f3' }}>
                <TouchableWithoutFeedback style={{ marginBottom: 10 }} onPress={this.changeCheckedType.bind(this, FINALNUM.BALANCETYPE)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                        <Text style={{ marginLeft: 10, marginTop: 10 }}>余额支付</Text>
                        <CheckBox
                            center
                            onPress={this.changeCheckedType.bind(this, FINALNUM.BALANCETYPE)}
                            containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checkedColor='red'
                            checked={this.state.checked == FINALNUM.BALANCETYPE}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={{ marginBottom: 10 }} onPress={this.changeCheckedType.bind(this, FINALNUM.ALIPAYTYPE)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                        <Text style={{ marginLeft: 10, marginTop: 10 }}>支付宝支付</Text>
                        <CheckBox
                            center
                            onPress={this.changeCheckedType.bind(this, FINALNUM.ALIPAYTYPE)}
                            containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checkedColor='red'
                            checked={this.state.checked == FINALNUM.ALIPAYTYPE}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={[{ flexDirection: 'row', height: 40, alignItems: 'center', paddingLeft: 20 }]}>
                    <Text>自提点：</Text>
                    <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 9, fontWeight: "bold" }}>e+便利凤台路店</Text>
                </View>
                <View >
                    {/*<Image source={require('../images/goods.png')} style={{width:100,height:100}} />*/}
                    <View style={{ marginLeft: 20, justifyContent: 'space-between' }}>
                        {/*<Text style={{fontSize:14,width:158,lineHeight:20,color:'#666'}}>备注：</Text>*/}

                    </View>
                </View>
            </View>
        )
    }

    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    render() {
        if(this.state.ispaypwd===null){
            return (
                <View style={styles.container}>
                    <ActivityIndicator></ActivityIndicator>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        title="确认支付"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    {
                        this.renderGoodsList()
                    }
                </View>
                <LbsModal
                    total={this.props.total}
                    modalVisible={this.state.modalVisible}
                    closeModal={this.closeModal.bind(this)}
                />
                <View style={styles.footerCon}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#626262' }}>总计：</Text>
                        <Text style={{ fontSize: 14, color: '#ff0000' }}>￥{this.props.total.toString()}</Text>
                    </View>
                    <Button
                        style={styles.paybtn}
                        containerStyle={styles.paybtncontainer}
                        onPress={this.createOrder.bind(this)}
                    >
                        提交
                    </Button>
                </View>

            </View>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    tabTitle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: px2dp(32),
        justifyContent: 'space-between'
    },
    backBuy: {
        // flex:1,
        // textAlign:'center',
        fontSize: 12,
        color: '#666'
    },
    backBuyWrapper: {
        padding: 12,
        width: 100,
        backgroundColor: '#fff'
    },
    backActive: {
        borderBottomColor: '#2ac945',
        borderBottomWidth: 3
    },
    items: {
        height: 130,
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        marginTop: 12
    },
    footerCon: {
        height: 46,
        paddingLeft: 17,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    paybtn: {

        fontSize: 14,
        color: '#fff'
    },
    paybtncontainer: {
        backgroundColor: '#21bb58',
        padding: 10,
        width: 80,
        height: 46
    }
})