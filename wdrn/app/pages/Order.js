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
    RefreshControl
} from 'react-native';

import NavBar from '../component/NavBar';
import Item from '../component/Item';
import Setting from './Setting';

import Deal from './Deal';
import BankList from './Banklist';
import px2dp from '../util/px2dp';

import OutputMoney from './OutputMoney'

import Icon from 'react-native-vector-icons/Ionicons';

import Login from './validateLogin';
import request from '../util/request';
import config from '../util/config';

let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';


export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isLogin: false,
            userData: {},
            ispay: '',
            isrealname: ''
        }
        this.config = [

            { icon: "ios-albums-outline", name: "交易记录", subName: "", onPress: this.goPage.bind(this, 'record') },
            { icon: "ios-card-outline", name: "银行卡管理", subName: "", onPress: this.goPage.bind(this, 'banklist') },
        ]
    }

    static topbarHeight = (Platform.OS === 'ios' ? 64 : 42)

    goPage(key, data = {}) {
        let pages = {
            "record": Deal,
            'banklist': BankList
        }
        if (pages[key]) {
            this.props.navigator.push({
                component: pages[key],
                args: { data },
                params: {
                    is_pay: this.state.ispay,
                    isrealname: this.state.isrealname
                }
            })
        }
    }
    leftPress() {

    }
    rightPress() {
        this.props.navigator.push({
            component: Setting,
            args: {}
        });
    }
    goProfile() {
        // this.props.navigator.push({
        //     component: UserProfile,
        //     args: {}
        // });
    }

    outputBalance() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: "outputmoney",
                component: OutputMoney
            })
        }
    }

    alltoBalance(type) {
        
        switch (type) {
            case 1:
                if(this.state.userData && !(this.state.userData.creditor-0)){
                    isIOS
                    ?AlertIOS.alert('对不起，没有需要操作的金额')
                    :Alert.alert('对不起，没有需要操作的金额')
                    return
                }
                break;
            case 2:
                if(this.state.userData && !(this.state.userData.share_gold-0)){
                    isIOS
                    ?AlertIOS.alert('对不起，没有需要操作的金额')
                    :Alert.alert('对不起，没有需要操作的金额')
                    return
                }
                break;
        }
        let info = '点击确定您的分润金或消费返利金额将被转入余额';
        isIOS
            ? AlertIOS.alert(
                '提示',
                info,
                [
                    { text: '取消', onPress: () => { } },
                    { text: '确定', onPress: this.pickupGoods.bind(this, type), style: 'cancel' }
                ],
                { cancelable: false }
            )
            : Alert.alert(
                '提示',
                info,
                [
                    { text: '取消', onPress: () => { } },
                    { text: '确定', onPress: this.pickupGoods.bind(this, type), style: 'cancel' }
                ],
                { cancelable: false }
            )
    }

    pickupGoods(type) {
        let url = config.baseUrl + config.api.user.tabMoney;
        let money = 0;
        switch (type) {
            case 1:
                money = this.state.userData.creditor || 0;
                break;
            case 2:
                money = this.state.userData.share_gold || 0;
                break;
        }
        request.post(url, { type: type, money: money })
            .then(data => {
                if (data.code == 1) {
                    this._onRefresh()
                } else {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                }
            })
            .catch(err => {
                console.warn(err)
            })
    }

    componentDidMount() {

        this._onRefresh()
    }

    shouldComponentUpdate() {

        return true;
    }
    componentWillUpdate() {


    }
    componentDidUpdate() {


    }

    _onRefresh() {
        this.setState({ isRefreshing: true });
        let getIndexUrl = config.baseUrl + config.api.user.showBalance;
        request.get(getIndexUrl)
            .then((data) => {

                if (data.code == 1) {
                    this.setState({
                        userData: data.data.user_data,
                        ispay: data.data.is_pay,
                        isrealname: data.data.is_real_name
                    })

                } else {
                    isIOS
                        ? AlertIOS.alert(data.message)
                        : Alert.alert(data.message)
                }
            })
            .catch(err => {
                console.log(err);

            })
        setTimeout(() => {
            this.setState({ isRefreshing: false });
        }, 1500)
    }
    _renderListItem() {
        return this.config.map((item, i) => {
            if (i % 3 == 0) {
                item.first = true
            }
            return (<Item key={i} {...item} />)
        })
    }

    renderBtn(pos) {
        let render = (obj) => {
            const { name, onPress } = obj;
            if (Platform.OS === 'android') {
                return (
                    <TouchableNativeFeedback onPress={onPress} style={styles.btn}>
                        <Icon name={'ios-arrow-back-outline'} size={px2dp(26)} color="#fff" />
                    </TouchableNativeFeedback>
                )
            } else {
                return (
                    <TouchableOpacity onPress={onPress} style={styles.btn}>
                        <Icon name={name} size={px2dp(26)} color="#fff" />
                    </TouchableOpacity>
                )
            }
        }
        if (pos == "left") {
            if (this.props.leftIcon) {
                return render({
                    name: 'ios-arrow-back-outline',
                    onPress: this.props.leftPress
                })
            } else {
                return (<View style={styles.btn}></View>)
            }
        } else if (pos == "right") {
            if (this.props.rightIcon) {
                return render({
                    name: this.props.rightIcon,
                    onPress: this.props.rightPress
                })
            } else {
                return (<View style={styles.btn}>
                    <Text onPress={this.props.rightPress}>{this.props.rightText}</Text>
                </View>)
            }
        }
    }

    render() {
        if (this.state.isLogin) {
            return (
                <Login navigator={this.props.navigator} />
            )
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>

                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#fff"
                            colors={['#ddd', '#0398ff']}
                            progressBackgroundColor='#ffffff'
                        />
                    }
                >
                    <TouchableOpacity>
                        <Image source={require('../images/moneybg.png')} style={{ width: width, height: px2dp(150) + this.topbarHeight }} onStartShouldSetResponder={() => false}>
                            <View style={styles.topbar} onStartShouldSetResponder={() => false}>

                            </View>
                            <View style={{ height: px2dp(150), justifyContent: 'space-between' }} onStartShouldSetResponder={() => false}>
                                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                                    <TouchableWithoutFeedback>
                                        <View style={{ paddingVertical: 0, height: 90 }}>
                                            <Text style={{ color: "#fff", fontSize: 14, flexWrap: 'nowrap', textAlign: 'center' }}>我的钱包（元）</Text>
                                            <Text style={{ color: "#fff", textAlign: 'center', fontSize: 36, paddingLeft: 5, flexWrap: 'nowrap', overflow: 'hidden' }}>{this.state.userData ? this.state.userData.balance : 0}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginTop: 10 }}>
                                    <TouchableOpacity style={{ paddingVertical: 0 }} onPress={this.alltoBalance.bind(this, 1)}>
                                        <Text style={{ color: "#fff", fontSize: px2dp(12) }}>我的债权金（元）：{this.state.userData ? this.state.userData.creditor : 0}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ paddingVertical: 0 }} onPress={this.alltoBalance.bind(this, 2)}>
                                        <Text style={{ color: "#fff", fontSize: px2dp(12) }}>我的分润金（元）：{this.state.userData ? this.state.userData.share_gold : 0}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Image>
                    </TouchableOpacity>
                    <View style={[styles.numbers, { height: 68 }]}>
                        <TouchableOpacity onPress={this.outputBalance.bind(this)} style={[styles.numItem]}>
                            <View style={[styles.numItem, { flexDirection: 'row' }]}>
                                <View style={{ marginLeft: 36 }}>
                                    <Image source={require('../images/m1.png')} resizeMode='contain' style={{ width: 34, height: 34 }} />
                                    {/*<Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />*/}
                                </View>
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"提现"}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableWithoutFeedback style={[styles.numItem]}>
                            <View style={[styles.numItem, { flexDirection: 'row', borderLeftWidth: 1, borderLeftColor: "#f5f5f5" }]}>

                                <View style={{ marginLeft: 36 }}>
                                    <Image source={require('../images/m2.png')} resizeMode='contain' style={{ width: 34, height: 34 }} />
                                    {/*<Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />*/}
                                </View>
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"充值"}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View>
                        {this._renderListItem()}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        marginBottom: px2dp(46),
        backgroundColor: "#f0f0f0"
    },
    userHead: {
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#79e089"
    },
    numbers: {
        flexDirection: "row",
        backgroundColor: "#fff",
        height: 74
    },
    numItem: {
        flex: 1,
        height: 74,
        justifyContent: "center",
        alignItems: "center"
    },
    topbar: {
        height: NavBar.topbarHeight,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        paddingHorizontal: px2dp(10)
    },
    btn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
})


