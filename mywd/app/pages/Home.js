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
    RefreshControl
} from 'react-native';

import NavBar from '../component/NavBar';
import px2dp from '../util/px2dp';

import Item from '../component/indexItem';
import ObligationList from './ObligationList';
import AllObligationList from './AllobList';
import Popularize from './Popularize';
import MyExpense from './myExpenseList';
import Notice from './notice';

import request from '../util/request';
import config from '../util/config';

let { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.tabArr = [
            { img: require('../images/index01.png'), text: '我的推广', onPress: this.goPage.bind(this, 'popularize') },
            { img: require('../images/index02.png'), text: '我的二维码', onPress: this.goPage.bind(this, 'popularize') },
            { img: require('../images/index03.png'), text: '历史返利', onPress: this.goPage.bind(this, 'myExpense') },
            { img: require('../images/index04.png'), text: '债权资料', onPress: this.goPage.bind(this, 'oblist') }
        ]
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            isRefreshing: false,
            isLoadingTail: false,
            isAuthor: 0,
            rebateInfo: null,
            rebatelist: [],
            dataSource: ds.cloneWithRows([]),
        }
    }

    componentWillMount() {
        this._getIndexInfo();
    }

    _fetchData(page) {
        let that = this;
        let self=this;
        if (page !== 0) {
            this.setState({
                isLoadingTail: true
            })
        }
        else {
            this.setState({
                isRefreshing: true
            })
        }

        let getIndexUrl = config.baseUrl + config.api.rebate.index;

        request.get(getIndexUrl)
            .then((data) => {
                console.log(data)

                if (data.code == 1 && data.data) {
                    self.setState({
                        isAuthor: 2,
                        rebateInfo: data.data.rebate || {},
                        dataSource:self.state.dataSource.cloneWithRows(data.data.creditor_list)
                    })

                    // if (data.data.length > 0) {


                    //     let items = cachedResults.items.slice()

                    //     if (page !== 0) {
                    //         items = items.concat(data.data.creditor_list)
                    //         cachedResults.nextPage += 1
                    //     }
                    //     else {
                    //         items = data.data.creditor_list.concat(items)
                    //     }

                    //     cachedResults.items = items
                    //     cachedResults.total = data.total

                    //     if (page !== 0) {
                    //         that.setState({
                    //             isLoadingTail: false,
                    //             dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                    //         })
                    //     }
                    //     else {
                    //         that.setState({
                    //             isRefreshing: false,
                    //             dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                    //         })
                    //     }
                    // }

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

        return <ActivityIndicatorIOS style={styles.loadingMore} />
    }

    async _getIndexInfo() {
        let self = this;
        let user = await storage.load({
            key: 'loginUser'
        })
        console.log(user);
        //'0未申请1第一次申请中2申请过'
        if (user.creditor_status == 0) {
            self.setState({
                isAuthor: 0
            })
        } else if (user.creditor_status == 1) {
            console.log('1111')
            self.setState({
                isAuthor: 1
            })
        } else if (user.creditor_status == 2) {
            console.log('s2222')

            self._fetchData(1);
        }

    }



    leftPress() {

    }
    rightPress() {

    }

    goPage(key, data = {}) {

        let pages = {
            "oblist": AllObligationList,
            "popularize": Popularize,
            'myExpense': MyExpense
        }
        if (pages[key]) {
            this.props.navigator.push({
                component: pages[key],
                args: { data }
            })
        }
    }

    _enterLookInfo() {
        this.setState({
            isAuthor: 1
        });
    }

    _enterObligationGoods(id) {

        if (this.props.navigator) {
            this.props.navigator.push({
                name: "obligaionCenter",
                component: ObligationList,
                params: {
                    id: id
                }
            })
        }
    }

    _renderRow(row) {

        return <Item
            onPress={this._enterObligationGoods.bind(this,row.id)}
            row={row}
        />
    }


    render() {

        if (this.state.isAuthor === 0) {
            return <Notice navigator={this.props.navigator} enterAuthor={this._enterLookInfo.bind(this)} />
        }

        if (this.state.isAuthor === 1) {
            return <MyExpense />;
        }

        return (

            <View style={styles.container}>
                <NavBar
                    title='我的债权金'
                    style={{ 'backgroundColor': '#fff' }}
                    titleStyle={{ 'color': '#666' }}
                    leftPress={this.leftPress.bind(this)}
                    rightIcon='ios-help-circle-outline'
                    rightPress={this.rightPress.bind(this)}
                />
                <View style={styles.baseInfo}>

                    <View style={styles.leftShow}>
                        <Text style={{ fontSize: 10, color: '#999' }}>我的债权金</Text>
                        <Text >{this.state.rebateInfo.money}</Text>
                    </View>
                    <View style={styles.residueNum}>
                        <Text>剩余</Text>
                        <Text style={{ textAlign: 'center' }}>{this.state.rebateInfo.per}%</Text>
                    </View>
                    <View style={styles.rightShow}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 10, color: '#999' }}>已用债权：</Text>
                            <Text style={{ fontSize: 10, color: '#999' }}>{this.state.rebateInfo.repayment_money}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 10, color: '#999' }}>待用债权：</Text>
                            <Text style={{ fontSize: 10, color: '#999' }}>{this.state.rebateInfo.stay_money}</Text>
                        </View>
                    </View>

                </View>
                {/*return*/}

                <View style={styles.tabWrapper}>
                    {
                        this.tabArr.map((item, i) => {

                            return (
                                <TouchableWithoutFeedback key={i} onPress={item.onPress}>
                                    <View style={styles.itemcon}>
                                        <Image source={item.img} style={{ width: px2dp(42), height: px2dp(42), marginLeft: 24 }} />
                                        <Text style={{ textAlign: 'center' }}>{item.text}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </View>
                {/*listview 渲染*/}
                <ListView
                    style={{ paddingBottom: 100 }}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
    baseInfo: {
        // paddingTop:px2dp(28),
        height: px2dp(114),
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftShow: {

    },
    residueNum: {
        width: px2dp(90),
        borderRadius:45,
    },
    rightShow: {

    },
    tabWrapper: {
        marginTop: px2dp(12),
        height: px2dp(119),
        width: width,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemcon: {
        flex: 1,
        width: px2dp(70),
    }
})