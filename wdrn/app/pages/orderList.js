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

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';

import NavBar from '../component/NavBar';
import px2dp from '../util/px2dp';
import OrderDetail from './orderDetail';
import OrderInfo from './OrderInfo';

import config from '../util/config';
import request from '../util/request';

import FINALNUM from '../util/FinalNum'

let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

export default class OrderList extends Component {

    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })

        this.state = {
            orderArr: [],
            tabStatus: FINALNUM.ORDERLISTNOFINISHED,
            isRefreshing: false,
            isLoadingTail: false,
            dataSource: ds.cloneWithRows([])
        }

    }

    componentDidMount() {

        // this.getOrderList();
        this._getIndexInfo();
    }

    componentShouldWillMount() {

    }

    changeTabStatus(value) {


        this.setState({
            tabStatus: value,
            isRefreshing: true
        })

        this._fetchData(0, { status: value });
    }

    getOrderList() {
        let orUrl = config.baseUrl + config.api.rebate.getHisOrder;

        let obj = {
            creditor_id: this.props.obid,
            status: this.state.tabStatus
        }

        request.get(orUrl, obj)
            .then(data => {

                if (data.code == 1) {
                    this.setState({
                        orderArr: data.data.list
                    });
                }

            })
    }

    gotoDetail(queuelist) {
        this.props.navigator.push({
            name: 'orderdetail',
            component: OrderDetail,
            params: {
                queuelist: queuelist
            }
        })
    }

    async _fetchData(page, to) {

        let that = this;
        let self = this;
        let obj = {
            creditor_id: this.props.obid,
            status: to ? to.status : this.state.tabStatus
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

        let getIndexUrl = config.baseUrl + config.api.rebate.getHisOrder;


        await request.get(getIndexUrl, obj)
            .then((data) => {


                if (data.code == 1 && data.data) {

                    let list = data.data.list || [];

                    if (list.length > 0) {

                        let items = cachedResults.items.slice()

                        if (page !== 0) {
                            items = items.concat(data.data.list)
                            cachedResults.nextPage += 1
                        }
                        else {
                            items = data.data.list.concat(items)
                        }

                        cachedResults.items = items
                        cachedResults.total = data.data.total
                        if (page == 1) {
                            self.setState({
                                isRefreshing: false,
                                dataSource: self.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                        else if (page !== 0) {
                            that.setState({
                                isLoadingTail: false,
                                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                        else {
                            that.setState({
                                isRefreshing: false,
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
                            dataSource: that.state.dataSource.cloneWithRows([]),
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

    _onRefresh() {

        if (!this._hasMore() || this.state.isRefreshing) {
            return
        }
        this._fetchData(0)
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

    async _getIndexInfo() {
        this._fetchData(1);
    }

    _renderRow(item) {

        let info = '';
        if (item.pay_status == 0) {
            info = '未付款';
        } else if (item.pay_status == 1) {
            info = '付款中';
        } else if (item.pay_status == 2) {
            info = '交易完成';
        } else if (item.pay_status == 3) {
            info = '付款失败';
        }
        return (
            <TouchableWithoutFeedback key={item.id} >
                <View style={{borderBottomColor:'#f3f3f3',borderBottomWidth:10 }}>
                    <View style={styles.items}>
                        <Image source={{ uri: 'item.img' }} style={{ width: 50, height: 50 }} />
                        <View style={{ marginLeft: 20, justifyContent: 'space-between', flex: 1 }}>
                            <View style={[{ flexDirection: 'row', height: 18, justifyContent: 'space-between' }]}>
                                <Text style={{ fontSize: 12,  color: '#3a3a3a' }}>订单号：{item.order_sn}</Text>
                                <Text style={{ fontSize: 12,  marginLeft: 9, textAlign: "center", color: '#3a3a3a' }}>{info}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', height: 26, marginTop:0, justifyContent: 'space-between' }]}>
                                <Text style={{ fontSize: 12, width: 158, color: '#3a3a3a' }}>{item.created_at}</Text>
                                <View style={[{ flexDirection: 'row', height: 18, alignItems: 'center' }]}>
                                    <Icon name='logo-yen' size={12} />
                                    <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 9, fontWeight: "bold" }}>{item.order_amount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {
                        item.is_split&&item.queque_num-0>0
                            ? <View style={[{ flexDirection: 'row', height: 40, justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', backgroundColor: '#fff' }]}>
                                <Text style={{ fontSize: 12, color: '#999' }}>该订单拆分队列订单（个）：{item.queque_num}</Text>
                                <Button
                                    onPress={this.gotoDetail.bind(this, item.queque_list)}
                                    containerStyle={{ backgroundColor: 'white', width: 60, height: 20, overflow: 'hidden' }}
                                    style={{ color: '#f6a623', fontSize: 14 }}
                                >
                                    点击查看
                            </Button>
                            </View>
                            : null
                    }

                </View>
            </TouchableWithoutFeedback>
        )

    }

    leftPress() {
        let {navigator}=this.props;
        if(navigator){
            navigator.pop()
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title="我的订单"
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <View style={styles.tabTitle}>
                        <Button
                            onPress={this.changeTabStatus.bind(this, FINALNUM.ORDERLISTNOFINISHED)}
                            containerStyle={[styles.backBuyWrapper, this.state.tabStatus == FINALNUM.ORDERLISTNOFINISHED ? styles.backActive : null]}
                            style={styles.backBuy}
                        >
                            未付款
                        </Button>
                        {/*<Button
                            containerStyle={[styles.backBuyWrapper]}
                            style={styles.backBuy}
                        >
                            已处理
                        </Button>*/}
                        <Button
                            onPress={this.changeTabStatus.bind(this, FINALNUM.ORDERLISTFINISHED)}
                            containerStyle={[styles.backBuyWrapper, this.state.tabStatus == FINALNUM.ORDERLISTFINISHED ? styles.backActive : null]}
                            style={styles.backBuy}
                        >
                            已完成
                        </Button>
                    </View>
                    <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', paddingLeft: 12 }}>
                        {/*<Icon name='ios-information-circle-outline' size={16} color='#0058be' />
                        <Text style={{ fontSize: 12, color: '#0058be', marginLeft: 6 }}>此处仅展示不可回购订单，查看返利订单消费记录请返回上一页</Text>*/}
                    </View>
                    <View style={{flex: 1,backgroundColor: '#f00'}}>
                        <ListView
                            style={{ flex: 1, paddingBottom: 100, backgroundColor: '#f3f3f3' }}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow.bind(this)}
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
        height: 76,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomColor: '#eaeaea',
        borderBottomWidth: 1,
        padding: 15,
        // marginBottom:12
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
        width: 70,
        height: 45
    },
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
    }
})