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

import SingleInfo from './SingleInfo'


let { width, height } = Dimensions.get('window');

let isIOS = Platform.OS === 'ios';

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

export default class AllobList extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })

        this.state = {
            isRefreshing: false,
            isLoadingTail: false,
            dataSource: ds.cloneWithRows([])
        }
    }


    gotoLookupPage() {
        this.props.navigator.push({
            name: 'singleInfo',
            component: SingleInfo
        })
    }



    componentDidMount() {
        this._getIndexInfo();
    }

    async _fetchData(page) {

        let that = this;
        let self = this;
        let obj = {
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

        let getIndexUrl = config.baseUrl + config.api.rebate.his;


        await request.get(getIndexUrl, obj)
            .then((data) => {

                console.log(data);
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

                        // cachedResults.items = []
                        // cachedResults.total = data.data.total
                        // that.setState({
                        //     isRefreshing: false,
                        //     dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                        // })
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
        console.log('执行刷新');
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
        console.log(item)
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
            <TouchableWithoutFeedback key={item.id} style={{ marginBottom: 10 }}>
                <View>
                    <View style={{ paddingLeft: 20, paddingVertical: 12, paddingRight: 20, backgroundColor: '#fff', marginTop: 12 }}>
                        <View style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#333', fontSize: 14 }}>阿达西债权</Text>
                                <Text style={styles.baseText}>（万店联盟电子商务有限公司）</Text>
                            </View>
                            <Text style={{ color: "#21bb58", fontSize: 14 }}>进行中</Text>
                        </View>

                        <View style={styles.flexRow}>
                            <Text style={styles.baseText}>消费笔数：</Text>
                            <Text style={{ color: '#333', fontSize: 14 }}>100笔</Text>
                            <Text style={styles.baseText}>（共20人）</Text>
                        </View>
                        <View style={styles.flexRow}>
                            <Text style={styles.baseText}>债权金额：</Text>
                            <Text style={{ color: "#21bb58", fontSize: 14 }}>￥100000.00</Text>
                        </View>
                        <View style={{ marginTop: 7 }}>
                            <Text style={styles.baseText}>添加时间：2017-03-24</Text>
                            <Text style={[styles.baseText, { marginTop: 7 }]}>结清时间：2017-03-31</Text>
                        </View>

                        <View style={{ position: 'absolute', right: 15, top: 76 }}>
                            <Icon name="ios-arrow-forward-outline" color="#666" size={14} />
                        </View>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        )

    }


    _renderInfo() {
        return (
            <View>
                {/*<View style={{ paddingLeft: 20 ,paddingVertical:12,paddingRight:40,backgroundColor:'#fff',marginTop:12}}>
                    <Text style={{ fontSize: 14, color: '#3a3a3a',lineHeight:20 }}>您2017-04-12提交的债权金申请<Text style={{ fontSize: 14, color: '#21bb58' }}>未通过</Text>,请修改资料重新申请</Text>
                    <Button
                        onPress={this.gotoLookupPage.bind(this)}
                        containerStyle={styles.lookupbtnWrapper}
                        style={styles.lookupbtn}
                    >
                        点击查看
                    </Button>
                    <View style={{ position: 'absolute', right: 15, top: 17 }}>
                        <Icon name="ios-arrow-forward-outline" color="#666" size={14} />
                    </View>
                </View>*/}
                <View style={{ paddingLeft: 20, paddingVertical: 12, paddingRight: 20, backgroundColor: '#fff', marginTop: 12 }}>
                    <View style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#333', fontSize: 14 }}>阿达西债权</Text>
                            <Text style={styles.baseText}>（万店联盟电子商务有限公司）</Text>
                        </View>
                        <Text style={{ color: "#21bb58", fontSize: 14 }}>进行中</Text>
                    </View>

                    <View style={styles.flexRow}>
                        <Text style={styles.baseText}>消费笔数：</Text>
                        <Text style={{ color: '#333', fontSize: 14 }}>100笔</Text>
                        <Text style={styles.baseText}>（共20人）</Text>
                    </View>
                    <View style={styles.flexRow}>
                        <Text style={styles.baseText}>债权金额：</Text>
                        <Text style={{ color: "#21bb58", fontSize: 14 }}>￥100000.00</Text>
                    </View>
                    <View style={{ marginTop: 7 }}>
                        <Text style={styles.baseText}>添加时间：2017-03-24</Text>
                        <Text style={[styles.baseText, { marginTop: 7 }]}>结清时间：2017-03-31</Text>
                    </View>

                    <View style={{ position: 'absolute', right: 15, top: 76 }}>
                        <Icon name="ios-arrow-forward-outline" color="#666" size={14} />
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title='我的债权'
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <ListView
                        style={{ paddingBottom: 100 }}
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
                <Button
                    containerStyle={{ padding: 10, height: 45, overflow: 'hidden', backgroundColor: '#21bb58' }}
                    style={styles.nowbuybtn}>
                    添加新的债权
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
    nowbuybtn: {
        fontSize: 14, color: '#fff',
    },
    flexRow: {
        flexDirection: 'row',
        marginTop: 7
    },
    lookupbtnWrapper: {
        width: 56,
        height: 20
    },
    lookupbtn: {
        fontSize: 14,
        color: '#999'
    },
    baseText: {
        color: '#999',
        fontSize: 12
    }
})