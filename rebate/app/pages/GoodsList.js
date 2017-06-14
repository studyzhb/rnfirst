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
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
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

export default class GoodsList extends Component {

    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })

        this.state={
            total:0,
            isRefreshing: false,
            isLoadingTail: false,
            dataSource: ds.cloneWithRows([]),
            selected:[],
            totalArr:[],
            isSelected:1
        }
    }

    confirmPay() {
        let self=this;
       
        let info = this.state.total<1400?'您的订单不足1400元，将无法生成队列订单，您可以继续购物凑够金额。':'您的购物金额为：'+this.state.total+' ,将拆分为'+Math.floor(this.state.total/1400);
        isIOS
            ? AlertIOS.alert(
                '提示',
                info,
                [
                    this.state.total<1400?{ text: '去凑单', onPress: () => console.log('Ask me later pressed') }:null,
                    { text: '去支付', onPress: this.gotoPay.bind(this), style: 'cancel' }
                ],
                { cancelable: false }
            )
            : Alert.alert(
                '提示',
                info,
                [
                    this.state.total<1400?{ text: '去凑单', onPress: () => console.log('Ask me later pressed') }:null,
                    { text: '去支付', onPress: this.gotoPay.bind(this), style: 'cancel' }
                ],
                { cancelable: false }
            )
    }

    gotoPay() {
        let totalArr=this.state.totalArr.map((item,i)=>{
            return {id:item.id,num:1}
        })
        console.log(this.props)
        this.props.navigator.push({
            name: 'pay',
            component: Pay,
            params:{
                total:this.state.total,
                totalArr:totalArr,
                queueid:this.props.obid,
                idback:this.state.isSelected
            }
        })
    }

    //计算价格
    _reduceItem(row){
        if(!row.selected){
            row.selected=false;
        }
        let {selected,total}=this.state;

        row.selected=!row.selected;

        for(let i=0;i<selected.length;i++){
            if(selected[i].id==row.id){
                selected[i].selected=row.selected;
            }
        }

        total=0;

        for(let i=0;i<selected.length;i++){
            if(selected[i].selected){
                this.state.totalArr.push(selected[i]);
                total+=selected[i].price-0;
            }
        }



        this.setState({selected,total});
        
    }

      componentWillMount() {
        this._getIndexInfo();
    }

    _fetchData(page,obj) {
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


        let getIndexUrl = config.baseUrl + config.api.rebate.getGoodsList;

        let newObj={
            page:page,
            isback:obj?obj.isback:1
        }

        request.get(getIndexUrl,newObj)
            .then((data) => {
                console.log(data)

                if (data.code == 1 && data.data) {
                    data=data.data;
                    if (data.data.length > 0) {

                        let items = cachedResults.items.slice()

                        if (page !== 0) {
                            items = items.concat(data.data)
                            cachedResults.nextPage += 1
                        }
                        else {
                            items = data.data.concat(items)
                        }

                        this.setState({
                            selected:items
                        })
                        cachedResults.items = items
                        cachedResults.total = data.total

                        if (page !== 0) {
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

        self._fetchData(1);
       

    }



    leftPress() {

    }
    rightPress() {

    }


    _renderRow(row) {
        return (
            <TouchableOpacity onPress={this._reduceItem.bind(this,row)}>
                <View style={styles.items}>
                    <Image source={require('../images/goods.png')} style={{ width: 100, height: 100 }} />
                    <View style={{ marginLeft: 20, justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 14, width: 158, lineHeight: 20, color: '#666' }}>{row.goodsname}</Text>
                        <View style={[{ flexDirection: 'row', marginTop: -10, height: 18 }]}>
                            <Icon name='logo-yen' size={12} />
                            <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 9, fontWeight: "bold" }}>{row.price}</Text>
                        </View>
                    </View>
                    {
                        row.selected
                        ?<Image source={require('../images/slected.png')} style={{ position: 'absolute', right: 0 }} />
                        :null
                    }
                </View>
            </TouchableOpacity>

        )
    }

    tabType(obj){
        this.setState({
            isSelected:obj.isback,
            dataSource: this.state.dataSource.cloneWithRows([]),
            total:0
        })

        cachedResults = {
            nextPage: 1,
            items: [],
            total: 0
        }
        this._fetchData(1,obj);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title="购物"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <View style={styles.tabTitle}>
                        <Button
                            onPress={this.tabType.bind(this,{isback:1})}
                            containerStyle={[styles.backBuyWrapper, this.state.isSelected==1?styles.backActive:null]}
                            style={styles.backBuy}
                        >
                            可回购
                        </Button>
                        <Button
                            onPress={this.tabType.bind(this,{isback:2})}
                            containerStyle={[styles.backBuyWrapper, this.state.isSelected==2?styles.backActive:null]}
                            style={styles.backBuy}
                        >
                            不可回购
                        </Button>
                    </View>
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
                <View style={styles.footerCon}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#626262' }}>总计：</Text>
                        <Text style={{ fontSize: 14, color: '#ff0000' }}>￥{this.state.total}</Text>
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
        height: 45
    }
})