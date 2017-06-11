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

import request from '../util/request';
import config from '../util/config';

let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';


let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

// 消费返利页面

export default class MyExpenseList extends Component {

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            isRefreshing: false,
            dataSource: ds.cloneWithRows([])
        }
    }

    componentDidMount() {
        this._onRefresh();
    }

    _onRefresh() {
        let self = this;
        console.log('refresh');
        this._getCurrentInfo(1);
        // .then(data => {
        //     console.log(data);
        //     if (!!data) {
        //         self.setState({
        //             isRefreshing: false
        //         })
        //     } else {
        //         return isIOS ? AlertIOS.alert('获取数据失败，请稍后再试') : Alert.alert('获取数据失败，请稍后再试');
        //     }
        // })

    }

    _fetchMoreData() {
        console.log('gengduo')
        if (!this._hasMore() || this.state.isLoadingTail) {

            this.setState({
                isLoadingTail: false
            })

            return
        }

        let page = cachedResults.nextPage

        this._getCurrentInfo(page)
    }

    _hasMore() {
        return cachedResults.items.length !== cachedResults.total
    }

    async  _getCurrentInfo(page) {

        let getAuthorUrl = config.baseUrl + config.api.rebate.lookupHis;

        if (page !== 0) {
            this.setState({
                isLoadingTail: true
            })
        } else {
            this.setState({
                isRefreshing: true
            })
        }

        await request.get(getAuthorUrl)
            .then(data => {
                console.log(data);
                let self=this;
                if (data.code == 1 && data.data) {
                    if (data.data.data.length > 0) {
                        let items = cachedResults.items.slice();

                        if (page !== 0) {
                            items = items.concat(data.data.data);
                            cachedResults.nextPage += 1;
                        } else {
                            items = data.data.concat(data.data.data);
                        }
                        cachedResults.items = items;
                        cachedResults.total = data.data.total;
                        console.log(cachedResults)
                        if (page !== 0) {
                            self.setState({
                                isLoadingTail: false,
                                dataSource: self.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        } else {
                            self.setState({
                                isRefreshing: false,
                                dataSource: self.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }

                    }
                    return data.data.data;
                } else {
                    return [];
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

    _renderRow(row) {
        console.log(row);
        return (
            <View style={styles.items}>
                <View style={[styles.flexRow, { marginBottom: 10 }]}>
                    <Icon name="ios-clock-outline" size={15} color='#999' style={{ marginLeft: -7 }} />
                    <Text style={[styles.baseText, { marginLeft: 5 }]}>{row.updated_at}</Text>
                </View>
                <View style={styles.sitem}>
                    <View style={{ width: 330, height: 78, backgroundColor: '#fff', justifyContent: 'space-between', borderRadius: 4, paddingLeft: 15, paddingTop: 12, paddingBottom: 12 }}>
                        <Text style={styles.subText}>债权金审核提交(编号：{row.coding})</Text>
                        <Text style={styles.baseText}>您{row.created_at}提交的申请正在审核，敬请期待.</Text>
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
                        title="我的消费返利"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea", borderBottomWidth: 6 }}
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
                                tintColor="#fff"
                                colors={['#ddd', '#0398ff']}
                                progressBackgroundColor='#ffffff'
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
    items: {
        paddingTop: 12,
        paddingLeft: 18,

    },
    flexRow: {
        flexDirection: 'row'
    },
    baseText: {
        fontSize: 12,
        color: '#999'
    },
    subText: {
        fontSize: 14,
        color: '#666'
    },
    itemWrapper: {
        marginTop: 12
    },
    sitem: {
        borderLeftColor: "#e3e3e3",
        borderLeftWidth: 1,
        paddingLeft: 12,
    },
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
    }

})