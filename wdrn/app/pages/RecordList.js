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

import NavBar from '../component/NavBar';
import px2dp from '../util/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';

import config from '../util/config';
import request from '../util/request';

let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

export default class RecordList extends Component {

    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })

        this.state = {
            orderArr: [],
            tabStatus: 1,
            isRefreshing: false,
            isLoadingTail: false,
            dataSource: ds.cloneWithRows([])
        }
    }

    componentDidMount() {

        // this.getOrderList();
        this._getIndexInfo();
    }

    changeTabStatus(value) {
        
        let cachedResults = {
            nextPage: 1,
            items: [],
            total: 0
        }
        this.setState({
            tabStatus: value,
            isRefreshing: true,
            dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
        })

        this._fetchData(0, { status: value });
    }

    _fetchData(page, to) {

        let that = this;
        let self = this;
        let obj = {
            id: this.props.obid,
            type: to ? to.status : this.state.tabStatus
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

        let getIndexUrl = config.baseUrl + config.api.rebate.getBackOrConverce;
        
        request.get(getIndexUrl, obj)
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

                        that.setState({
                            isRefreshing: false,
                            isLoadingTail: false
                        })
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

            // this.setState({
            //     isLoadingTail: false
            // })

            return
        }

        let page = cachedResults.nextPage

        this._fetchData(page)
    }


    _onRefresh() {
        
        if (this.state.isRefreshing) {
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
        if (item.status == 0) {
            info = '未付款';
        } else if (item.status == 1) {
            info = '付款中';
        } else if (item.status == 2) {
            info = '交易完成';
        } else if (item.status == 3) {
            info = '付款失败';
        }
        return (
            <View style={{ paddingLeft: 20, paddingVertical: 12, paddingRight: 20, backgroundColor: '#fff', marginTop: 12 }}>
                <View style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#333', fontSize: 14 }}>兑换积分</Text>
                        <Text style={styles.baseText}>{item.money}</Text>
                    </View>
                    <Text style={{ color: "#666", fontSize: 14 }}>{info}</Text>
                </View>

                <View style={styles.flexRow}>
                    <Text style={styles.baseText}>兑换比例：</Text>
                    <Text style={styles.baseText}>{item.proportion}</Text>

                </View>
                <View style={styles.flexRow}>
                    <Text style={styles.baseText}>实际到账：</Text>
                    <Text style={{ color: "#21bb58", fontSize: 14 }}>￥{item.real_money}</Text>
                </View>
                <View style={styles.flexRow}>
                    <Text style={styles.baseText}>维护费用：</Text>
                    <Text style={{ color: "#21bb58", fontSize: 14 }}>￥{item.ping_money}（{item.ping_fee}%）</Text>
                </View>
                <View style={{ marginTop: 7 }}>
                    <Text style={styles.baseText}>兑换时间：{item.draw_date}</Text>

                </View>
            </View>
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
                        title="资金记录"
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <View style={styles.tabTitle}>
                        <Button
                            onPress={this.changeTabStatus.bind(this, 1)}
                            containerStyle={[styles.backBuyWrapper, this.state.tabStatus == 1 ? styles.backActive : null]}
                            style={styles.backBuy}
                        >
                            兑换记录
                        </Button>
                        <Button
                            onPress={this.changeTabStatus.bind(this, 2)}
                            containerStyle={[styles.backBuyWrapper, this.state.tabStatus == 2 ? styles.backActive : null]}
                            style={styles.backBuy}
                        >
                            回购记录
                        </Button>
                    </View>
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
    nowbuybtn: {
        fontSize: 14, color: '#fff',
    },
    flexRow: {
        flexDirection: 'row',
        marginTop: 7
    },
    baseText: {
        color: '#999',
        fontSize: 12
    },
    loadingMore: {
        marginVertical: 20
    },

    loadingText: {
        color: '#777',
        textAlign: 'center'
    }

})