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

import config from '../util/config';
import request from '../util/request';
import Author from './authorize';
import FINAL from '../util/FinalNum'

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
            dataSource: ds.cloneWithRows([]),
            isAuthor: 0
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
                if (data.code == 1 && data.data) {

                    let list = data.data.data || [];

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
                    }

                    else {
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

    gotoAuthor() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'author',
                component: Author
            })
        }
    }

    _renderRow(item) {

        let info = '';
        if (item.status == 0) {
            info = '未使用';
        } else if (item.status == 1) {
            info = '申请中';
        } else if (item.status == 2) {
            info = '队列中';
        } else if (item.status == 3) {
            info = '返利完成';
        } else if (item.status == 4) {
            info = "申请拒绝"
        }
        return (
            <TouchableWithoutFeedback key={item.id} style={{ marginBottom: 10 }}>
                <View>
                    <View style={{ paddingLeft: 20, paddingVertical: 12, paddingRight: 20, backgroundColor: '#fff', marginTop: 12 }}>
                        <View style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#333', fontSize: 14 }}>{item.rebate_name}</Text>
                                <Text style={styles.baseText}></Text>
                            </View>
                            <Text style={{ color: "#21bb58", fontSize: 14 }}>{info}</Text>
                        </View>

                        <View style={styles.flexRow}>
                            <Text style={styles.baseText}>消费笔数：</Text>
                            <Text style={{ color: '#333', fontSize: 14 }}>100笔</Text>
                            <Text style={styles.baseText}>（共20人）</Text>
                        </View>
                        <View style={styles.flexRow}>
                            <Text style={styles.baseText}>债权金额：</Text>
                            <Text style={{ color: "#21bb58", fontSize: 14 }}>￥{item.money}</Text>
                        </View>
                        <View style={{ marginTop: 7 }}>
                            <Text style={styles.baseText}>添加时间：{item.created_at}</Text>
                            {
                                item.status == 3
                                    ? <Text style={[styles.baseText, { marginTop: 7 }]}>结清时间：{item.updated_at}</Text>
                                    : null
                            }

                        </View>

                        {/*<View style={{ position: 'absolute', right: 15, top: 76 }}>
                            <Icon name="ios-arrow-forward-outline" color="#666" size={14} />
                        </View>*/}
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
    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title='我的债权'
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
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
                    onPress={this.gotoAuthor.bind(this)}
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
    },
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
    }
})