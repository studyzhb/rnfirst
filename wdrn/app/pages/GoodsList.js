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
    ListView,
    AlertIOS,
    Alert,
    PixelRatio,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    ActivityIndicator,
    RefreshControl
} from 'react-native';

import Button from 'react-native-button';

import NavBar from '../component/NavBar';
import px2dp from '../util/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';


import request from '../util/request';
import config from '../util/config';

import Pay from "./Pay";

let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

let Goods = {
    total: 0,
    totalArr: []
}

export default class GoodsList extends Component {

    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                console.log(r1, r2)
                return r1 !== r2
            }
        })

        this.state = {
            total: 0,
            isRefreshing: false,
            isLoadingTail: false,
            dataSource: ds.cloneWithRows([]),
            selected: [],
            totalArr: [],
            isSelected: 1
        }
    }

    confirmPay() {
        let self = this;
        if (this.state.total <= 0) {
            isIOS
                ? AlertIOS.alert('请先选中商品')
                : Alert.alert('请先选中商品')
            return;
        }
        let info = this.state.total < this.props.money ? '您的订单不足' + this.props.money + '元，将无法生成队列订单，您可以继续购物凑够金额。' : '您的购物金额为：' + this.state.total + ' ,将拆分为' + Math.floor(this.state.total / this.props.money) + '单进入返利。';
        isIOS
            ? AlertIOS.alert(
                '提示',
                info,
                [
                    this.state.total < this.props.money ? { text: '去凑单', onPress: () => console.log('Ask me later pressed') } : { text: '取消', onPress: () => console.log('Ask me later pressed') },
                    { text: '去支付', onPress: this.gotoPay.bind(this), style: 'cancel' }
                ],
                { cancelable: false }
            )
            : Alert.alert(
                '提示',
                info,
                [
                    this.state.total < this.props.money ? { text: '去凑单', onPress: () => console.log('Ask me later pressed') } : { text: '取消', onPress: () => console.log('Ask me later pressed') },
                    { text: '去支付', onPress: this.gotoPay.bind(this), style: 'cancel' }
                ],
                { cancelable: false }
            )
    }

    gotoPay() {
        let totalArr = Goods.totalArr.map((item, i) => {
            return { id: item.id, num: 1 }
        })

        this.props.navigator.push({
            name: 'pay',
            component: Pay,
            params: {
                total: this.state.total,
                totalArr: totalArr,
                queueid: this.props.obid,
                isback: this.state.isSelected
            }
        })
    }

    //计算价格
    _reduceItem(row) {
       
        if (row.selected === undefined) {
            row.selected = false;
        }
        let { selected, total } = this.state;

        row.selected = !row.selected;

        let arrData=JSON.parse(JSON.stringify(selected));
        //
        for (let i = 0; i < arrData.length; i++) {
            if (arrData[i].id == row.id) {
                arrData[i].selected = row.selected;
            }
        }

        total = 0;
        Goods.totalArr = [];
        for (let i = 0; i < arrData.length; i++) {
            if (arrData[i].selected) {
                Goods.totalArr.push(arrData[i]);
                total += arrData[i].price - 0;
            }
        }

        //dataSource: this.state.dataSource.cloneWithRows(selected)
        
        cachedResults.items=arrData;
        this.setState({ selected:arrData, total ,dataSource: this.state.dataSource.cloneWithRows(arrData)});
        // console.log(this.state.selected)
    }

    componentWillMount() {
        this._getIndexInfo();
    }

    _fetchData(page, isobj) {
        let that = this;
        let self = this;
        let obj = {
            isback: isobj ? isobj.isback : this.state.isSelected
        }

        if (page == 1) {
            obj.page = page;
            cachedResults = {
                nextPage: 1,
                items: [],
                total: 0
            }
            this.setState({
                isRefreshing: true,
                total: 0
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
                isRefreshing: true,
                total: 0
            })
        }


        let getIndexUrl = config.baseUrl + config.api.rebate.getGoodsList;

        request.get(getIndexUrl, obj)
            .then((data) => {

                if (data.code == 1 && data.data) {
                    data = data.data;
                    if (data.data && data.data.length > 0) {

                        let items = cachedResults.items.slice()

                        if (page !== 0) {
                            items = items.concat(data.data)
                            cachedResults.nextPage += 1
                        }
                        else {
                            items = data.data.concat(items)
                        }

                        this.setState({
                            selected: items
                        })
                        cachedResults.items = items
                        cachedResults.total = data.total

                        if (page == 1) {
                            self.setState({
                                isRefreshing: false,
                                dataSource: self.state.dataSource.cloneWithRows(this.state.selected)
                            })
                        }
                        else if (page !== 0) {
                            that.setState({
                                isLoadingTail: false,
                                dataSource: that.state.dataSource.cloneWithRows(this.state.selected)
                            })
                        }
                        else {
                            that.setState({
                                isRefreshing: false,
                                dataSource: that.state.dataSource.cloneWithRows(this.state.selected)
                            })
                        }
                    } else {
                        if (page == 1) {
                            this.setState({
                                isRefreshing: false
                            })
                        }
                        else if (page !== 0) {
                            this.setState({
                                isLoadingTail: false
                            })
                        }
                        else {
                            this.setState({
                                isRefreshing: false
                            })
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
                    
                    this.setState({
                        isRefreshing: false,
                        isLoadingTail: false,
                        dataSource: this.state.dataSource.cloneWithRows([])
                    })
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
        let self = this;

        self._fetchData(1);


    }



    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop()
        }
    }
    rightPress() {

    }

    _renderRow(row) {
        
        return (
            <TouchableOpacity onPress={this._reduceItem.bind(this, row)}>
                <View style={styles.items}>
                    <Image source={{ uri: row.goods_pic }} style={{ width: px2dp(100), height: px2dp(100) }} />
                    <View style={{ marginLeft: 20, justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 14, width: 158, lineHeight: 20, color: '#666' }}>{row.goodsname}</Text>
                        <View style={[{ flexDirection: 'row', marginTop: -10, height: 18 }]}>
                            <Icon name='logo-yen' size={12} />
                            <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 9, fontWeight: "bold" }}>{row.price}</Text>
                        </View>
                    </View>
                    {
                        row.selected
                            ? <Image source={require('../images/slected.png')} style={{ position: 'absolute', right: 0, width: px2dp(47), height: px2dp(33) }} />
                            : null
                    }
                </View>
            </TouchableOpacity>

        )
    }

    tabType(obj) {
        this.setState({
            isSelected: obj.isback,
            total: 0,
            dataSource: this.state.dataSource.cloneWithRows([])
        })

        this._fetchData(1, obj);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        title="购物"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <View style={styles.tabTitle}>
                        <Button
                            onPress={this.tabType.bind(this, { isback: 1 })}
                            containerStyle={[styles.backBuyWrapper, this.state.isSelected == 1 ? styles.backActive : null]}
                            style={styles.backBuy}
                        >
                            可回购
                        </Button>
                        <Button
                            onPress={this.tabType.bind(this, { isback: 2 })}
                            containerStyle={[styles.backBuyWrapper, this.state.isSelected == 2 ? styles.backActive : null]}
                            style={styles.backBuy}
                        >
                            不可回购
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
                <View style={styles.footerCon}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#626262' }}>总计：</Text>
                        <Text style={{ fontSize: 14, color: '#ff0000' }}>￥{this.state.total.toString()}</Text>
                    </View>
                    <Button
                        style={styles.paybtn}
                        containerStyle={styles.paybtncontainer}
                        onPress={this.confirmPay.bind(this)}
                    >
                        结算
                    </Button>
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
        width: 80,
        height: 46
    },
    loadingMore: {
        marginVertical: 20
    },

    loadingText: {
        color: '#777',
        textAlign: 'center'
    }
})