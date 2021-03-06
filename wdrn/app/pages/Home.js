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

import * as Progress from 'react-native-progress';
import PercentageCircle from 'react-native-percentage-circle';
import NavBar from '../component/NavBar';
import px2dp from '../util/px2dp';

import Item from '../component/indexItem';
import ObligationList from './ObligationList';
import AllObligationList from './AllobList';
import SingleInfo from './SingleInfo';
import Popularize from './Popularize';
import MyExpense from './myExpenseList';
import ShareCode from './sharecode';
import Notice from './notice';
import Circle from './pickertest'

import request from '../util/request';
import config from '../util/config';

let { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

let user = {
    status: 10
}

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.tabArr = [
            { img: require('../images/index01.png'), text: '我的推广', onPress: this.goPage.bind(this, 'popularize') },
            { img: require('../images/index02.png'), text: '我的二维码', onPress: this.goPage.bind(this, 'share') },
            { img: require('../images/index03.png'), text: '历史返利', onPress: this.goPage.bind(this, 'oblist') },
            { img: require('../images/index04.png'), text: '债权资料', onPress: this.goPage.bind(this, 'SingleInfo') }
        ]
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            isRefreshing: false,
            isLoadingTail: false,
            isAuthor: 10,
            rebateInfo: null,
            rebatelist: [],
            dataSource: ds.cloneWithRows([]),
        }
    }

    componentDidMount() {
        console.log('componentDidMount')
        this._getIndexInfo();
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate')
        let url = config.baseUrl + config.api.user.userStatus;
        let oldvalue = user.status;
        if (user.status != 2) {
            request.get(url)
                .then(data => {
                    if (data.code == 1) {
                        user.status = data.data.creditor_status;
                        if (user.status == oldvalue) {
                            return false;
                        } else {
                            this.setState({
                                isAuthor: user.status
                            })
                            return true;
                        }
                    } else if (data.code == 2 || data.code == 3) {
                        let { navigator } = this.props;
                        console.log(navigator)
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
                })
                .catch(err => {
                    console.warn(err);
                })
        }
        return true;
    }

    _fetchData(page) {
        let that = this;
        let self = this;
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
               
                if (data.code == 1 && data.data) {
                    self.setState({
                        isAuthor: 2,
                        isRefreshing: false,
                        rebateInfo: data.data.rebate || {},
                        dataSource: self.state.dataSource.cloneWithRows(data.data.creditor_list || [])
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

                } else if (data.code == 2 || data.code == 3) {
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
        // if (!this._hasMore() || this.state.isRefreshing) {
        //     return
        // }

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
            user.status = 0
            self.setState({
                isAuthor: 0
            })
        } else if (user.creditor_status == 1) {

            user.status = 1
            self.setState({
                isAuthor: 1
            })
        } else if (user.creditor_status == 2) {

            user.status = 2
            self._fetchData(1);
        }
    }

    leftPress() {

    }
    rightPress() {
        
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'test',
                component: Circle
            })
        }
    }

    goPage(key, data = {}) {

        let pages = {
            "oblist": AllObligationList,
            "popularize": Popularize,
            'share': ShareCode,
            'myExpense': MyExpense,
            'SingleInfo': SingleInfo
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
    _enterChangeAuthor(){
        this.setState({
            isAuthor: 2
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

    _renderHeader() {
        return (
            <View>
                <View style={styles.baseInfo}>

                    {/*<View style={styles.leftShow}>
                        <Text style={{ fontSize: 10, color: '#999' }}>我的债权金</Text>
                        <Text >{this.state.rebateInfo ? this.state.rebateInfo.money.toString() : ''}</Text>
                    </View>*/}
                    {/*<Progress.Circle size={100} color={'#ee735c'} progress={this.state.rebateInfo ? 1 - this.state.rebateInfo.per / 100 : 0} showsText={false} children={
                        (
                            <View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text>{this.state.rebateInfo ? this.state.rebateInfo.repayment_money.toString() : ''}</Text>
                                    <Text style={{ flex: 1, fontSize: 13 }}>已还债权（元）</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 23, color: '#34495e' }}>全部债权{this.state.rebateInfo ? this.state.rebateInfo.money.toString() : ''}</Text>
                                </View>
                            </View>
                        )

                    }>

                    </Progress.Circle>*/}
                    <PercentageCircle radius={60} percent={this.state.rebateInfo ? 100 - this.state.rebateInfo.per : 0} color={"#21BB58"} bgcolor={'#f0f0f0'}>
                        <View style={{justifyContent:'center',flex:2,alignItems:'center',marginTop:30}}>
                            <Text style={{fontSize:20,color:'#21BB58'}}>{this.state.rebateInfo ? this.state.rebateInfo.repayment_money.toString() : ''}</Text>
                            <Text style={{fontSize:8,color:'#999'}}>已返</Text>
                        </View>
                        <View style={{flex:1,alignItems:'center'}}>
                            <Text style={{fontSize:8,color:'#999'}}>全部{this.state.rebateInfo ? this.state.rebateInfo.money.toString() : ''}</Text>
                        </View>
                    </PercentageCircle>
                    {/*<View style={{position:'absolute',left:0,top:0,width:width,height:px2dp(114)}}>
                        <Progress.Bar height={114} width={width} color={'rgba(33,187,88,0.5)'} borderRadius={0} borderWidth={0} progress={this.state.rebateInfo ? 1 - this.state.rebateInfo.per / 100 : 0} showsText={true} />
                    </View>*/}
                    {/*<TouchableOpacity>
                            <View style={styles.residueNum}>
                                <Text onStartShouldSetResponder={() => false} style={{ textAlign: 'center' }}>剩余</Text>
                                <TouchableOpacity>
                                    <Text onStartShouldSetResponder={() => false} style={{ textAlign: 'center' }}>{this.state.rebateInfo ? this.state.rebateInfo.per : ''}%</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>*/}
                    {/*<View style={styles.rightShow}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 10, color: '#999' }}>已用债权：</Text>
                            <Text style={{ fontSize: 10, color: '#999' }}>{this.state.rebateInfo ? this.state.rebateInfo.repayment_money.toString() : ''}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 10, color: '#999' }}>待用债权：</Text>
                            <Text style={{ fontSize: 10, color: '#999' }}>{this.state.rebateInfo ? this.state.rebateInfo.stay_money.toString() : ''}</Text>
                        </View>
                    </View>*/}
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
            </View>
        )
    }

    _renderRow(row) {

        return <Item
            key={row.id}
            onPress={this._enterObligationGoods.bind(this, row.id)}
            row={row}
        />
    }


    render() {

        if (this.state.isAuthor === 0) {
            return <Notice navigator={this.props.navigator} enterAuthor={this._enterLookInfo.bind(this)} />
        }

        if (this.state.isAuthor === 1) {
            return <MyExpense navigator={this.props.navigator} enterAuthor={this._enterChangeAuthor.bind(this)}/>;
        } else if (this.state.isAuthor === 2) {
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

                    {/*listview 渲染*/}
                    <ListView
                        style={{ paddingBottom: 100 }}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow.bind(this)}
                        renderHeader={this._renderHeader.bind(this)}
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
        } else {
            return (
                <View style={{ backgroundColor: '#fff', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator color="#aa00aa" />
                </View>
            )
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
    baseInfo: {
        // paddingTop:px2dp(28),
        height: px2dp(160),
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftShow: {

    },
    residueNum: {
        width: px2dp(90),
        height: px2dp(90),
        borderWidth: 1,
        borderColor: "#f00",
        borderRadius: 45,
        justifyContent: 'center'
    },
    rightShow: {

    },
    tabWrapper: {
        marginTop: px2dp(12),
        height: px2dp(90),
        width: width,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemcon: {
        flex: 1,
        width: px2dp(70)
    }
})