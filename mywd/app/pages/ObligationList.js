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
import Button from 'react-native-button';
import px2dp from '../util/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';

import GoodsList from './GoodsList';
import OrderList from './orderList';
import RecordList from './RecordList';
import OrderInfo from './OrderInfo';

import request from '../util/request';
import config from '../util/config';

let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';


export default class ObligationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queueInfo: {},
            isRefreshing:false
        }
    }

    componentDidMount() {
        this.getQueueList();
    }
    shouldComponentUpdate(){

        // this.getQueueList()
        return true;
    }

    //获取队列列表信息
    getQueueList() {
        console.log(this.props);
        let self = this;
        let getQueueUrl = config.baseUrl + config.api.rebate.getQueueInfoByQueueId;
        request.get(getQueueUrl, { id: this.props.id })
            .then(data => {
                console.log(data)
                if (data.code == 1 && data.data) {
                    self.setState({
                        queueInfo: data.data
                    })
                } else {
                    isIOS ? AlertIOS.alert(data.message) : Alert.alert(data.message);
                }
            })
    }

    goConverce(id) {
        this.setState({
            isRefreshing:true
        })
        let getQueueUrl = config.baseUrl + config.api.rebate.converse;
        request.post(getQueueUrl, { id: id })
            .then(data => {
                console.log(data)
                if (data.code == 1 && data.data) {
                    self.setState({
                        isRefreshing:false
                    })
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
                obid: this.props.id
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
            params:{
                id:id
            }
        })
    }

    renderRecordList() {
        /**
         * `queque_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '队列状态; 0队列中 ，1出队列可提现 ，2申请提现 ，3已提现 4踢出队列',
  `pick_up_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '提货状态;0已备货，可提货可回购;1申请提货;2申请回购;3回购成功;4回购失败;5提货完成',
         */


        //`isback` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可以回购 1 是 2 否',
        let items = this.state.queueInfo.list_queque
            ? this.state.queueInfo.list_queque.queque ? this.state.queueInfo.list_queque.queque.map((item, key) => {
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

                return (
                    <TouchableWithoutFeedback onPress={this.gotoRecordList.bind(this,item.id)} key={key}>
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
                                        <Button style={styles.convercebtn} containerStyle={[styles.convercebtnWrapper,styles.disabled]} disabled={true} disabledText={{color:'#666'}}>
                                                    提货
                                            </Button>
                                        {
                                            item.queque_status != 1
                                                ? <Button onPress={this.goConverce.bind(this,item.id)} style={[styles.convercebtn]} containerStyle={[styles.convercebtnWrapper, { marginLeft: 15 }]}>
                                                    兑换
                                        </Button>
                                                : null
                                        }

                                    </View>
                                </View>

                                

                            </View>

                            <View style={[styles.numbers, { paddingVertical: 20, height: 58 }]}>

                                    <View style={[styles.numItem, { flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10, marginTop: -10, height: 18 }]}>
                                        <Icon name='logo-yen' size={12} />
                                        <Text style={{ color: "#999", fontSize: 12, marginLeft: 9, fontWeight: "bold" }}>返还状态：{item.queque_status == 0 ? '等待中' : '已完成'}</Text>
                                    </View>
                                    {/*<View style={[styles.numItem, { flexDirection: 'row', marginTop: -10, borderLeftWidth: 1, height: 18, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>
                            <Icon name='ios-people-outline' size={12} />
                            <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 9, fontWeight: "bold" }}>队列编号</Text>
                        </View>*/}

                                </View>

                        </View>
                    </TouchableWithoutFeedback>

                )
            }) : null
            : null;

        return items;
    }

    render() {
        console.log(this.state)
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title={this.state.queueInfo.list_info ? this.state.queueInfo.list_info.title : ''}
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: px2dp(106), backgroundColor: '#fff', borderBottomColor: '#eaeaea', borderBottomWidth: 1 }}>
                            <View style={{ flexDirection: 'column', height: px2dp(106), justifyContent: 'center', marginLeft: px2dp(18) }}>
                                <View style={{ flexDirection: 'row', marginBottom: px2dp(16) }}>
                                    <Text style={styles.normalText}>待兑换积分：</Text>
                                    <Text style={{ color: '#21bb58', fontSize: 16, marginTop: -5 }}>{this.state.queueInfo.refund_pending}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.normalText}>已兑换积分：</Text>
                                    <Text style={{ color: '#333', fontSize: 12 }}>{this.state.queueInfo.refund}</Text>
                                </View>
                            </View>
                            <TouchableWithoutFeedback  >
                                <Button
                                    style={styles.btn}
                                >
                                    兑换
                            </Button>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={[styles.numbers, { height: 68 }]}>
                            <TouchableWithoutFeedback>
                                <View style={[styles.numItem, { flexDirection: 'row' }]}>
                                    <View style={{ marginLeft: 36 }}>
                                        <Image source={require('../images/base01.png')} resizeMode='contain' style={{width:34,height:34,}} />
                                        {/*<Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />*/}
                                    </View>

                                    <View style={{ marginLeft: 20 }}>
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"已返积分"}</Text>
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{this.state.queueInfo.refund + this.state.queueInfo.refund_pending + this.state.queueInfo.refund_ing}</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                                <View style={[styles.numItem, { flexDirection: 'row', borderLeftWidth: 1, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>

                                    <View style={{ marginLeft: 36 }}>
                                        <Image source={require('../images/base02.png')} resizeMode='contain'  style={{width:34,height:34,}} />
                                        {/*<Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />*/}
                                    </View>
                                    <View style={{ marginLeft: 20 }}>
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"未返积分"}</Text>
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{this.state.queueInfo.refund_no}</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{ minHeight: height - 64 - px2dp(46), marginTop: 12, paddingBottom: 100, backgroundColor: '#f3f3f3' }}>
                            <View style={styles.numbers}>
                                <TouchableWithoutFeedback onPress={this.gotoOrderPage.bind(this)}>
                                    <View style={styles.numItem}>
                                        {/*<Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />*/}
                                        <Image source={require('../images/base03.png')} resizeMode='contain'  style={{width:34,height:40,}} />
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"消费订单"}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={this.gotoConvercePage.bind(this)}>
                                    <View style={[styles.numItem, { borderLeftWidth: 1, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>
                                        {/*<Icon name="ios-list-box-outline" size={px2dp(40)} color="#558dce" />*/}
                                        <Image source={require('../images/base04.png')} resizeMode='contain'  style={{width:44,height:40,}} />
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"兑换明细"}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{ flexDirection:'row',height: 26, alignItems: 'center' }}>
                                <Image source={require('../images/title_1.png')} resizeMode='contain'  style={{width:20,height:20,}} />
                                <Text style={{ fontSize: 14, color: '#3a3a3a' }}>信息</Text>
                            </View>
                            <View style={styles.numbers}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.numItem}>
                                        <Text style={{ color: "#f90", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>{this.state.queueInfo.list_info ? this.state.queueInfo.list_info.money : ''}</Text>
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"购物金额"}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback>
                                    <View style={[styles.numItem, { borderLeftWidth: 1, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>
                                        <Text style={{ color: "#ff5f3e", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>{this.state.queueInfo.list_info ? this.state.queueInfo.list_info.money : ''}</Text>
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"返还积分"}</Text>
                                    </View>
                                </TouchableWithoutFeedback>

                            </View>
                            <View style={styles.numbers}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.numItem}>
                                        <Text style={{ color: "#f90", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>{this.state.queueInfo.buy_num}</Text>
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"已购（笔）"}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback>
                                    <View style={[styles.numItem, { borderLeftWidth: 1, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>
                                        <Text style={{ color: "#ff5f3e", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>{this.state.queueInfo.finsh_num}</Text>
                                        <Text style={{ color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5 }}>{"返还（笔）"}</Text>
                                    </View>
                                </TouchableWithoutFeedback>

                            </View>

                            <View style={{ flexDirection:'row',height: 26, alignItems: 'center' }}>
                                <Image source={require('../images/title_2.png')} resizeMode='contain'  style={{width:20,height:20,}} />
                                <Text style={{ fontSize: 14, color: '#3a3a3a' }}>返利记录</Text>
                            </View>

                            {
                                this.renderRecordList()
                            }

                            {/*<View style={styles.recordWrapper}>
                                <View style={{ borderBottomColor: '#eaeaea', borderBottomWidth: 1 }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16 }}>
                                        <Text style={styles.normalText}>订单号：136541515611</Text>
                                        <Text>已提货</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16 }}>
                                        <Text style={styles.boldText}>生活综合包</Text>
                                        <Text>￥1000.00</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 }}>
                                        <Text style={[styles.normalText, { marginTop: 10 }]}>2017-04-15 11:20</Text>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Button style={styles.convercebtn} containerStyle={[styles.convercebtnWrapper, { backgroundColor: '#c8c8c8' }]} disabled={true}  >
                                                提货
                                            </Button>
                                            <Button style={[styles.convercebtn]} containerStyle={[styles.convercebtnWrapper, { marginLeft: 15 }]} styleDisabled={{ color: '#c8c8c8' }} >
                                                兑换
                                            </Button>
                                        </View>
                                    </View>

                                </View>

                                <View style={[styles.numbers, { paddingVertical: 20, height: 18 }]}>

                                    <View style={[styles.numItem, { flexDirection: 'row', marginTop: -10, height: 18 }]}>
                                        <Icon name='logo-yen' size={12} />
                                        <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 9, fontWeight: "bold" }}>返还状态：等待中</Text>

                                    </View>


                                    <View style={[styles.numItem, { flexDirection: 'row', marginTop: -10, borderLeftWidth: 1, height: 18, borderLeftColor: "#f5f5f5", borderRightWidth: 1, borderRightColor: "#f5f5f5" }]}>
                                        <Icon name='ios-people-outline' size={12} />
                                        <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 9, fontWeight: "bold" }}>队列编号</Text>
                                    </View>


                                </View>
                            </View>*/}

                        </View>
                    </ScrollView>
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
        paddingLeft:16
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
        marginBottom:10,
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
    disabled:{
        backgroundColor:'#f3f3f3'
    }

})