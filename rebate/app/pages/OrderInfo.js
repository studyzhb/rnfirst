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
let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';
export default class OrderInfo extends Component {

    constructor(props) {
        super(props);
    }

    renderGoodsList() {
        return (
            <View>
                {/*订单内容*/}
                <View >
                    <View style={[styles.flexRow, {borderBottomColor:'#eaeaea',borderBottomWidth:1,height:44,alignItems:'center',paddingLeft:20,backgroundColor:'#fff'}]}>
                        <Text style={styles.baseText}>订单号：</Text>
                        <Text style={{ color: "#666", fontSize: 14 }}>134624185416551</Text>
                    </View>
                    <View style={styles.items}>
                        <Image source={require('../images/goods.png')} style={{ width: 60, height: 60 }} />
                        <View style={{ marginLeft: 20, justifyContent: 'space-between',paddingBottom:20 }}>
                            <View style={styles.flexRow}>
                                <Text style={{ fontSize: 14, lineHeight: 20, color: '#666',marginRight:30 }}>我是商品名字</Text>
                                <Text style={{ fontSize: 14, width: 158, lineHeight: 20, color: '#666' }}>550ml*24瓶</Text>
                            </View>
                            
                            <View style={[{ flexDirection: 'row', height: 20 ,alignItems:'center'}]}>
                                {/*<Icon name='logo-yen' size={12} />*/}
                                <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 5, fontWeight: "bold" }}>数量：x1</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.items}>
                        <Image source={require('../images/goods.png')} style={{ width: 60, height: 60 }} />
                        <View style={{ marginLeft: 20, justifyContent: 'space-between',paddingBottom:20 }}>
                            <View style={styles.flexRow}>
                                <Text style={{ fontSize: 14, lineHeight: 20, color: '#666',marginRight:30 }}>我是商品名字</Text>
                                <Text style={{ fontSize: 14, width: 158, lineHeight: 20, color: '#666' }}>550ml*24瓶</Text>
                            </View>
                            
                            <View style={[{ flexDirection: 'row', height: 20 ,alignItems:'center'}]}>
                                {/*<Icon name='logo-yen' size={12} />*/}
                                <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 5, fontWeight: "bold" }}>数量：x1</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.flexRow, {justifyContent:'flex-end',paddingRight:8,height:42,backgroundColor:'#fff',alignItems:'center'}]}>
                        <Text style={styles.baseText}>共三件商品 </Text>
                        <Text style={styles.baseText}> 实付款：</Text>
                        <Text style={{ color: "#999", fontSize: 14 }}>￥1000.00</Text>
                    </View>
                </View>
                {/*订单状态*/}
                <View style={[styles.itemWrapper]}>
                    <View style={[styles.flexRow,styles.sitem]}>
                        <Text style={styles.baseText}>订单状态：</Text>
                        <Text style={styles.subText}>已取货</Text>
                    </View>
                    <View style={[styles.flexRow,styles.sitem]}>
                        <Text style={styles.baseText}>支付方式：</Text>
                        <Text style={styles.subText}>微信支付</Text>
                    </View>
                    <View style={[styles.flexRow,{justifyContent:'space-between'}]}>
                        <View style={[styles.flexRow,styles.sitem,{flex:1}]}>
                            <Text style={styles.baseText}>提货地点：</Text>
                            <Text style={styles.subText}>已取货</Text>
                        </View>
                    </View>
                    <View style={[styles.flexRow,styles.sitem]}>
                        <Text style={styles.baseText}>下单时间：</Text>
                        <Text style={styles.subText}>2017-04-15 15:50</Text>
                    </View>
                    <View style={[styles.flexRow,styles.sitem]}>
                        <Text style={styles.baseText}>取货时间：</Text>
                        <Text style={styles.subText}>2017-04-15 15:50</Text>
                    </View>
                </View>
                {/*返还状态*/}
                <View style={[styles.itemWrapper]}>
                    <View style={[styles.flexRow,styles.sitem]}>
                        <Text style={styles.baseText}>返还状态：</Text>
                        <Text style={styles.subText}>可兑换</Text>
                    </View>
                    <View style={[styles.flexRow,styles.sitem]}>
                        <Text style={styles.baseText}>队列编号：</Text>
                        <Text style={styles.subText}>6</Text>
                    </View>
                    <View style={[styles.flexRow,styles.sitem]}>
                        <Text style={styles.baseText}>返现时间：</Text>
                        <Text style={styles.subText}>2017-04-15 15:50</Text>
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
                        title="订单详情"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea",borderBottomWidth:6 }}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            this.renderGoodsList()
                        }
                    </ScrollView>
                    
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
        height: 93,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomColor: '#eaeaea',
        borderBottomWidth: 1,
        paddingTop: 12,
        paddingLeft: 20
    },
    flexRow: {
        flexDirection: 'row'
    },
    baseText: {
        fontSize:12,
        color:'#999'
    },
    subText:{
        fontSize:14,
        color:'#333'
    },
    itemWrapper:{
        marginTop:12
    },
    sitem:{
        borderBottomColor:'#eaeaea',
        borderBottomWidth:1,
        backgroundColor:'#fff',
        height:45,
        paddingLeft:20,
        alignItems:'center'
    }

})