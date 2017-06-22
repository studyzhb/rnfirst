'use strict';
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    ListView,
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

import NavBar from '../component/NavBar';
import Button from 'react-native-button';
import px2dp from '../util/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';

import GoodsList from './GoodsList';
import OrderList from './orderList';
import RecordList from './RecordList';
import OrderInfo from './OrderInfo';

import request from '../util/request';
import config from '../util/config';

import FINAL from '../util/FinalNum'

let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

export default class ObligationList11 extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            queueInfo: {},
            update: false,
            isRefreshing: false,
            isLoadingTail: false,
            dataSource: ds.cloneWithRows([])
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this._fetchData(1);
        }, 1000);
    }
    shouldComponentUpdate() {
        // this._fetchData()
        return true;
    }

    converseOrPickup(item) {

        if (item.isback == 1) {
            let info = '选择回购时，平台将回购您的商品，需要收取2%的手续费。 选择提货时，你将需要亲自去提货点（订单详情界面查看提货地址）提取货物';
            isIOS
                ? AlertIOS.alert(
                    '提示',
                    info,
                    [
                        { text: '回购', onPress: this.pickupGoods.bind(this, item.id, FINAL.BACKGOODS) },
                        { text: '提货', onPress: this.pickupGoods.bind(this, item.id, FINAL.PICKUPGOODS), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
                : Alert.alert(
                    '提示',
                    info,
                    [
                        { text: '回购', onPress: this.pickupGoods.bind(this, item.id, FINAL.BACKGOODS) },
                        { text: '提货', onPress: this.pickupGoods.bind(this, item.id, FINAL.PICKUPGOODS), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
        } else {
            let info = '选择提货时，你将需要亲自去提货点（订单详情界面查看提货地址）提取货物';
            isIOS
                ? AlertIOS.alert(
                    '提示',
                    info,
                    [
                        { text: '取消', onPress: () => { } },
                        { text: '提货', onPress: this.pickupGoods.bind(this, item.id, FINAL.PICKUPGOODS), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
                : Alert.alert(
                    '提示',
                    info,
                    [
                        { text: '取消', onPress: () => { } },
                        { text: '提货', onPress: this.pickupGoods.bind(this, item.id, FINAL.PICKUPGOODS), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
        }
    }

    _onRefresh() {
        if (!this._hasMore() || this.state.isRefreshing) {
            return
        }
        this._fetchData(0);
    }

    //获取队列列表信息
    async  _fetchData(page) {

        let that = this;
        let self = this;

        let obj = {
            id: this.props.id
        }
        if (page == 1) {
            obj.page = page;
            cachedResults = {
                nextPage: 1,
                items: [],
                total: 0
            }
            this.setState({
                isRefreshing: true
            })
        }
        else if (page !== 0) {
            obj.page = page;
            this.setState({
                isLoadingTail: true
            })
        }
        else {
            obj.page = 1;
            cachedResults = {
                nextPage: 1,
                items: [],
                total: 0
            }
            this.setState({
                isRefreshing: true
            })
        }
        let getQueueUrl = config.baseUrl + config.api.rebate.getQueueInfoByQueueId;


        await request.get(getQueueUrl, obj)
            .then(data => {

                if (data.code == 1 && data.data) {

                    let list = data.data.list_queque.queque || [];

                    if (list.length > 0) {

                        let items = cachedResults.items.slice()

                        if (page !== 0) {
                            items = items.concat(list)
                            cachedResults.nextPage += 1
                        }
                        else {
                            items = list.concat(items)
                        }

                        cachedResults.items = items
                        cachedResults.total = data.data.list_queque.total
                        if (page == 1) {
                            self.setState({
                                isRefreshing: false,
                                queueInfo: data.data,
                                update: true,
                                dataSource: self.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                        else if (page !== 0) {
                            that.setState({
                                isLoadingTail: false,
                                queueInfo: data.data,
                                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                        else {
                            that.setState({
                                isRefreshing: false,
                                queueInfo: data.data,
                                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                    } else {
                        cachedResults = {
                            nextPage: 1,
                            items: [],
                            total: 0
                        }

                        this.setState({
                            update: true,
                            queueInfo: data.data,
                            isRefreshing: false
                        })
                        cachedResults.total = data.data.total

                        if (page > 1) {
                            this._fetchData(1);
                        }

                    }
                } else {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                }
            })
            .catch(err => {
                if (page !== 0) {
                    this.setState({
                        isLoadingTail: false
                    })
                }
                else {
                    this.setState({
                        isRefreshing: false
                    })
                }
            })
    }

    goConverce(id) {
        this.setState({
            isRefreshing: true
        })
        let getQueueUrl = config.baseUrl + config.api.rebate.converse;
        request.post(getQueueUrl, { id: id })
            .then(data => {

                if (data.code == 1 && data.data) {
                    this._fetchData(1)
                    self.setState({
                        isRefreshing: false
                    })
                } else {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                }
            })
    }

    pickupGoods(id, type) {

        let url = config.baseUrl + config.api.rebate.applyBackOrPick;
        let body = {
            id: id,
            type: type
        }
        request.post(url, body)
            .then(data => {

                if (data.code == 1) {
                    this._fetchData(1)
                } else {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                }
            })
    }

    gotoshopping() {
        this.props.navigator.push({
            name: '',
            component: GoodsList,
            params: {
                obid: this.props.id,
                money: this.state.queueInfo.list_info ? this.state.queueInfo.list_info.money : 1400
            }
        })
    }

    // 查看订单
    gotoOrderPage() {

        this.props.navigator.push({
            name: 'orderlist',
            component: OrderList,
            params: {
                obid: this.props.id
            }
        })
    }

    gotoConvercePage() {
        this.props.navigator.push({
            name: 'RecordList',
            component: RecordList,
            params: {
                obid: this.props.id
            }
        })
    }
    // 订单信息
    gotoRecordList(id) {

        this.props.navigator.push({
            name: 'OrderInfo',
            component: OrderInfo,
            params: {
                id: id
            }
        })
    }

    _hasMore() {
        return cachedResults.items.length !== cachedResults.total;
    }

    _fetchMoreData() {
        if (!this._hasMore() || this.state.isLoadingTail) {

            this.setState({
                isLoadingTail: false
            })

            return
        }

        let page = cachedResults.nextPage

        this._fetchData(page)
    }

    _renderFooter() {
        if (!this._hasMore() && cachedResults.total !== 0) {
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多了</Text>
                </View>
            )
        }

        if (!this.state.isLoadingTail) {
            return <View style={styles.loadingMore} />
        }

        return <ActivityIndicator style={styles.loadingMore} />
    }


    _renderRow(item) {
        /**
         * `queque_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '队列状态; 0队列中 ，1出队列可提现 ，2申请提现 ，3已提现 4踢出队列',
  `pick_up_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '提货状态;0已备货，可提货可回购;1申请提货;2申请回购;3回购成功;4回购失败;5提货完成',
         */


        //`isback` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可以回购 1 是 2 否',

        let pickupinfo = '提货';
        if (item.queque_status == '0') {
            item.queueStatusText = '队列中';
        } else if (item.queque_status == '1') {
            item.queueStatusText = '可提现';
        } else if (item.queque_status == '2') {
            item.queueStatusText = '提现中';
        } else if (item.queque_status == '3') {
            item.queueStatusText = '已提现';
        } else if (item.queque_status == '4') {
            item.queueStatusText = '被踢出';
        }

        switch (item.pick_up_status) {
            case 0:
                pickupinfo = '提货';
                break;
            case 1:
                pickupinfo = '提货中';
                break;
            case 2:
                pickupinfo = '回购中';
                break;
            case 3:
                pickupinfo = '回购成功';
                break;
            case 4:
                pickupinfo = '回购失败';
                break;
            case 5:
                pickupinfo = '提货完成';
                break;
        }

        return (
            <TouchableWithoutFeedback onPress={this.gotoRecordList.bind(this, item.id)} key={item.id}>
                <View style={styles.recordWrapper}>
                    <View style={{ borderBottomColor: '#eaeaea', borderBottomWidth: 1 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16 }}>
                            <Text style={styles.normalText}>订单号：{item.order_sn}</Text>
                            <Text>{
                                item.queueStatusText
                            }
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16 }}>
                            <Text style={styles.boldText}>{this.state.queueInfo.list_info.title}</Text>
                            <Text>￥{item.money}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 }}>
                            <Text style={[styles.normalText, { marginTop: 10 }]}>{item.created_at}</Text>
                            <View style={{ flexDirection: 'row', }}>
                                <Button onPress={this.converseOrPickup.bind(this, item)} style={styles.convercebtn} containerStyle={[styles.convercebtnWrapper, item.pick_up_status !== 0 ? styles.disabled : null]} disabled={item.pick_up_status !== 0 ? true : false} disabledText={{ color: '#666' }}>
                                    {pickupinfo}
                                </Button>
                                {
                                    item.queque_status == 2
                                        ? <Button onPress={this.goConverce.bind(this, item.id)} style={[styles.convercebtn]} containerStyle={[styles.convercebtnWrapper, { marginLeft: 15 }]}>
                                            兑换
                                        </Button>
                                        : null
                                }

                            </View>
                        </View>



                    </View>
                    <View style={[{ flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10, flex: 1, alignItems: 'center' }]}>
                        {/*<Icon name='logo-yen' size={12} />*/}
                        <Image source={require('../images/statusmoney.png')} resizeMode='contain' style={{ width: 14, height: 14, alignSelf: 'center' }} />
                        <Text style={{ color: "#999", fontSize: 12, marginLeft: 9 }}>返还状态：{item.queque_status == 0 ? '等待中' : '已完成'}</Text>
                    </View>
                    {/*<View style={[{ height: 58, flexDirection: "column" }]}>

                        <View style={[{ flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10, flex: 1, alignItems: 'center' }]}>
                            <Icon name='logo-yen' size={12} />
                            <Image source={require('../images/statusmoney.png')} resizeMode='contain' style={{ width: 14, height: 14, alignSelf: 'center' }} />
                            <Text style={{ color: "#999", fontSize: 12, marginLeft: 9 }}>返还状态：{item.queque_status == 0 ? '等待中' : '已完成'}</Text>
                        </View>
                        <View style={[styles.numItem, { flexDirection: 'row', marginTop: -10, borderLeftWidth: 1, height: 18, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>
                            <Icon name='ios-people-outline' size={12} />
                            <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 9, fontWeight: "bold" }}>队列编号</Text>
                        </View>

                    </View>*/}

                </View>
            </TouchableWithoutFeedback>

        )

        // let items = this.state.queueInfo.list_queque
        //     ? this.state.queueInfo.list_queque.queque ? this.state.queueInfo.list_queque.queque.map((item, key) => {

        //     }) : null
        //     : null;


    }

    _renderHeader() {
        return (
            <View >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: px2dp(110), backgroundColor: '#fff', borderBottomColor: '#eaeaea', borderBottomWidth: 1 }}>
                    <View style={{ flexDirection: 'column', height: px2dp(110), justifyContent: 'center', marginLeft: px2dp(18) }}>
                        <View style={{ marginBottom: px2dp(10), alignItems: 'center', width: width }}>
                            <Text style={{ color: '#21bb58', fontSize: 36, marginTop: 0, textAlign: 'center' }}>{this.state.queueInfo.refund_no.toString()}</Text>
                            <Text style={[styles.normalText, { textAlign: 'center', color: '#ccc' }]}>待返积分</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: width }}>
                            <Text style={[styles.normalText, { textAlign: 'center' }]}>已返积分：<Text style={{ color: '#333', fontSize: 12 }}>{((this.state.queueInfo.refund-0) + (this.state.queueInfo.refund_pending-0) + this.state.queueInfo.refund_ing-0).toString()}</Text></Text>
                        </View>
                    </View>
                </View>
                {/*<View style={[styles.numbers, { height: 68 }]}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.numItem, { flexDirection: 'row' }]}>
                            <View style={{ marginLeft: 0 }}>
                                <Image source={require('../images/base01.png')} resizeMode='contain' style={{ width: 34, height: 34, }} />
                                <Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />
                            </View>

                            <View style={{ marginLeft: 20 }}>
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"已返积分"}</Text>
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{(this.state.queueInfo.refund + this.state.queueInfo.refund_pending + this.state.queueInfo.refund_ing).toString()}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={[styles.numItem, { flexDirection: 'row', borderLeftWidth: 1, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>

                            <View style={{ marginLeft: 0 }}>
                                <Image source={require('../images/base02.png')} resizeMode='contain' style={{ width: 34, height: 34, }} />
                                <Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />
                            </View>
                            <View style={{ marginLeft: 20 }}>
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"未返积分"}</Text>
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{this.state.queueInfo.refund_no.toString()}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>*/}
                <View style={{ marginTop: 12, paddingBottom: 0, backgroundColor: '#f3f3f3' }}>
                    <View style={styles.numbers}>
                        <TouchableWithoutFeedback onPress={this.gotoOrderPage.bind(this)}>
                            <View style={styles.numItem}>
                                {/*<Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />*/}
                                <Image source={require('../images/base03.png')} resizeMode='contain' style={{ width: 34, height: 40, }} />
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"消费订单"}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.gotoConvercePage.bind(this)}>
                            <View style={[styles.numItem, { borderLeftWidth: 1, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>
                                {/*<Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />*/}
                                <Image source={require('../images/base04.png')} resizeMode='contain' style={{ width: 44, height: 40, }} />
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"兑换明细"}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {/*<View style={{ flexDirection: 'row', height: 26, alignItems: 'center' }}>
                        <Image source={require('../images/title_1.png')} resizeMode='contain' style={{ width: 20, height: 20, marginLeft: 10, marginRight: 10 }} />
                        <Text style={{ fontSize: 14, color: '#3a3a3a' }}>信息</Text>
                    </View>
                    <View style={styles.numbers}>
                        <TouchableWithoutFeedback>
                            <View style={styles.numItem}>
                                <Text style={{ color: "#f90", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>{this.state.queueInfo.list_info ? this.state.queueInfo.list_info.money.toString() : ''}</Text>
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"购物金额"}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <View style={[styles.numItem, { borderLeftWidth: 1, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>
                                <Text style={{ color: "#ff5f3e", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>{this.state.queueInfo.list_info ? this.state.queueInfo.list_info.money.toString() : ''}</Text>
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"返还积分"}</Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                    <View style={styles.numbers}>
                        <TouchableWithoutFeedback style={{ zIndex: 10 }}>
                            <View style={styles.numItem}>

                                <Text style={{ color: "#f90", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>{this.state.queueInfo.buy_num ? this.state.queueInfo.buy_num.toString() : '0'}</Text>
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", marginTop: 5 }}>{"已购（笔）"}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <View style={[styles.numItem, { borderLeftWidth: 1, borderLeftColor: "#f5f5f5" }]}>
                                <Text style={{ color: "#ff5f3e", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>{this.state.queueInfo.finsh_num ? this.state.queueInfo.finsh_num.toString() : '0'}</Text>
                                <Text style={{ color: "#333", fontSize: 12, textAlign: "center", marginTop: 5 }}>{"返还（笔）"}</Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>*/}

                    <View style={{ flexDirection: 'row', height: 36, alignItems: 'center', justifyContent: 'space-between',backgroundColor:'#fff',marginTop:10,marginBottom:5 }}>
                        <View style={{ flexDirection: 'row', height: 36, alignItems: 'center' }}>
                            <Image source={require('../images/title_2.png')} resizeMode='contain' style={{ width: 20, height: 20, marginLeft: 10, marginRight: 10 }} />
                            <Text style={{ fontSize: 14, color: '#3a3a3a' }}>返利记录</Text>
                        </View>
                        <View style={{ flexDirection: 'row', height: 36, alignItems: 'center', paddingRight: 10 }}>
                            <Text style={{ color: "#888", fontSize: 12, textAlign: "center", fontWeight: "normal" }}>返还：{this.state.queueInfo.finsh_num ? this.state.queueInfo.finsh_num.toString() : '0'} </Text>
                            <Text style={{ color: "#888", fontSize: 12, textAlign: "center", fontWeight: "normal" }}> 已购：{this.state.queueInfo.buy_num ? this.state.queueInfo.buy_num.toString() : '0'}</Text>
                        </View>
                    </View>

                </View>
            </View>
        )

    }

    _changeCon(w, h) {

    }

    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    render() {

        if (!this.state.update) {
            return (
                <View style={{ backgroundColor: '#fff', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator color="#aa00aa" />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        title={this.state.queueInfo.list_info ? this.state.queueInfo.list_info.title : ''}
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />

                    <ListView
                        style={{ paddingBottom: 100 }}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow.bind(this)}
                        renderHeader={this._renderHeader.bind(this)}
                        renderFooter={this._renderFooter.bind(this)}
                        onEndReached={this._fetchMoreData.bind(this)}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor='#ff6600'
                                title='拼命加载中'
                            />
                        }
                        pageSize={2}
                        onEndReachedThreshold={20}
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                        removeClippedSubviews={false}
                    />
                </View>
                <Button
                    onPress={this.gotoshopping.bind(this)}
                    containerStyle={{ padding: 10, height: 45, overflow: 'hidden', backgroundColor: '#21bb58' }}
                    style={styles.nowbuybtn}>
                    立即参加
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        // position:'relative'
    },
    numbers: {
        flexDirection: "row",
        backgroundColor: "#fff",
        height: 74,
        paddingLeft: 16
        // borderBottomColor: '#f3f3f3',
        // borderBottomWidth: 1
    },
    numItem: {
        flex: 1,
        height: 74,
        justifyContent: "center",
        alignItems: "center"
    },
    btn: {
        width: px2dp(100),
        height: px2dp(36),
        marginTop: 40,
        // padding:10,
        paddingTop: 5,
        marginRight: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2ac945',
        // borderColor:'#ee735c',
        // borderWidth:1,
        borderRadius: 4,
        color: '#fff'
    },
    normalText: {
        color: '#999',
        fontSize: 12
    },
    recordWrapper: {
        height: px2dp(166),
        backgroundColor: '#fff',
        marginBottom: 5,
        // paddingHorizontal:20
    },
    nowbuybtn: {
        fontSize: 14, color: '#fff',
    },
    boldText: {
        fontSize: 14,
        color: '#3a3a3a'
    },
    convercebtn: {
        fontSize: 14,
        color: '#fff',
    },
    convercebtnWrapper: {
        width: px2dp(56),
        padding: 5,
        height: px2dp(30),
        backgroundColor: "#21bb58",
        overflow: 'hidden',
        borderRadius: 20,
        // marginTop:-16
        // marginBottom:16
    },
    disabled: {
        backgroundColor: '#f3f3f3'
    },
    loadingMore: {
        marginVertical: 20
    },

    loadingText: {
        color: '#777',
        textAlign: 'center'
    }

})