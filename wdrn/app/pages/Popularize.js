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
    ListView,
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

import config from '../util/config'
import request from '../util/request'

let { width, height } = Dimensions.get('window');

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

export default class Popularize extends Component {
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

    componentDidMount() {

        this._getIndexInfo();
    }

    async _fetchData(page, to) {

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

        let url = config.baseUrl + config.api.user.popular;



        await request.get(url, obj)
            .then((data) => {


                if (data.code == 1 && data.data) {

                    let list = data.data.data || [];

                    if (list.length > 0) {

                        let items = cachedResults.items.slice()

                        if (page !== 0) {
                            items = items.concat(data.data.data)
                            cachedResults.nextPage += 1
                        }
                        else {
                            items = data.data.data.concat(items)
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
        return (
            <View style={{ paddingLeft: 20, flexDirection: 'row', paddingVertical: 14, paddingRight: 20, backgroundColor: '#fff', borderBottomColor: '#eaeaea', borderBottomWidth: 1 }}>

                <Image source={{ uri: item.user_avatar }} style={{ width: px2dp(60), height: px2dp(60), flex: 1, borderRadius: px2dp(30) }} />

                <View style={{ justifyContent: 'flex-start', flex: 2 }}>
                    <Text style={styles.baseText}>{item.user_nickname}</Text>
                </View>
                <View style={{ justifyContent: 'flex-end', flex: 3 }}>
                    <Text style={[styles.baseText, { textAlign: 'right' }]}>{item.created_at}</Text>
                </View>
            </View>
        )

    }
    leftPress() {
        let {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title='我的推广'
                        
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />

                    {/*<ScrollView
                        style={styles.scrollView}

                    >
                        <View style={{ paddingLeft: 20, flexDirection: 'row', paddingVertical: 14, paddingRight: 20, backgroundColor: '#fff', borderBottomColor: '#eaeaea', borderBottomWidth: 1 }}>

                            <Image source={require('../images/avatar.jpg')} style={{ width: px2dp(60), height: px2dp(60), flex: 1, borderRadius: px2dp(30) }} />

                            <View style={{ justifyContent: 'flex-start', flex: 2 }}>
                                <Text style={styles.baseText}>152*******2152</Text>
                            </View>
                            <View style={{ justifyContent: 'flex-end', flex: 3 }}>
                                <Text style={[styles.baseText, { textAlign: 'right' }]}>2014-04-10</Text>
                            </View>

                        </View>

                    </ScrollView>*/}
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
        // position:'relative'
    },
    flexRow: {
        flexDirection: 'row',
        marginBottom: 9
    },
    scrollView: {
        flex: 1,
        paddingTop: 12,
        marginBottom: px2dp(46),
        backgroundColor: "#f0f0f0"
    },
    baseText: {
        color: '#999',
        marginLeft: 20,
        fontSize: 12
    }
})