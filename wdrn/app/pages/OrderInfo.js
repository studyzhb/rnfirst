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

import config from '../util/config'
import request from '../util/request'


import dateFormat from 'dateformat'

let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';
export default class OrderInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderInfo: {}
        }
    }

    componentDidMount() {
        let url = config.baseUrl + config.api.rebate.getDetailByQueueId;

        request.get(url, { id: this.props.id })
            .then(data => {

                if (data.code == 1) {
                    this.setState({
                        orderInfo: data.data
                    })
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
                console.log(err)
            })

    }

    renderGoodsList() {

        let { back_date, draw_date, finsh_date, isback, order, pick_date, pick_up_status, queque_status, retail_id, return_date, product, created_at } = this.state.orderInfo;


        let backstatus = '';
        let pickstatus = '';

        switch (pick_up_status) {
            case 0:
                pickstatus = '已备货，未操作'
                break;
            case 1:
                pickstatus = '提货中'
                break;
            case 2:
                pickstatus = '回购中'
                break;
            case 3:
                pickstatus = '回购成功'
                break;
            case 4:
                pickstatus = '回购失败'
                break;
            case 5:
                pickstatus = '提货完成'
                break;

        }

        switch (queque_status) {
            case 0:
                backstatus = '返利中'
                break;
            case 1:
                backstatus = '可兑换'
                break;
            case 2:
                backstatus = '兑换中'
                break;
            case 3:
                backstatus = '兑换完成'
                break;
            case 4:
                backstatus = '违规踢出'
                break;
        }

        return (
            <View>
                {/*订单内容*/}
                <View >
                    <View style={[styles.flexRow, { borderBottomColor: '#eaeaea', borderBottomWidth: 1, height: 44, alignItems: 'center', paddingLeft: 20, backgroundColor: '#fff' }]}>
                        <Text style={styles.baseText}>订单号：</Text>
                        <Text style={{ color: "#666", fontSize: 14 }}>{order ? order.order_sn : 0}</Text>
                    </View>
                    {
                        product ? product.map((item, key) => {
                            return (
                                <View style={styles.items} key={key}>
                                    <Image source={{ uri: item.img }} style={{ width: 60, height: 60 }} />
                                    <View style={{ marginLeft: 20, justifyContent: 'space-between', paddingBottom: 20 }}>
                                        <View style={styles.flexRow}>
                                            <Text style={{ fontSize: 14, lineHeight: 20, color: '#666', marginRight: 30 }}>{item.title}</Text>
                                            {/*<Text style={{ fontSize: 14, width: 158, lineHeight: 20, color: '#666' }}>550ml*24瓶</Text>*/}
                                        </View>

                                        <View style={[{ flexDirection: 'row', height: 20, alignItems: 'center' }]}>
                                            {/*<Icon name='logo-yen' size={12} />*/}
                                            <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginLeft: 5, fontWeight: "bold" }}>数量：x{item.num}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                            : null
                    }


                    <View style={[styles.flexRow, { justifyContent: 'flex-end', paddingRight: 8, height: 42, backgroundColor: '#fff', alignItems: 'center' }]}>
                        <Text style={styles.baseText}>共{product ? product.length : 0}件商品 </Text>
                        <Text style={styles.baseText}> 实付款：</Text>
                        <Text style={{ color: "#999", fontSize: 14 }}>￥{order ? order.order_amount : 0}</Text>
                    </View>
                </View>
                {/*订单状态*/}
                <View style={[styles.itemWrapper]}>
                    <View style={[styles.flexRow, styles.sitem]}>
                        <Text style={styles.baseText}>订单状态：</Text>
                        <Text style={styles.subText}>{pickstatus}</Text>
                    </View>
                    <View style={[styles.flexRow, styles.sitem]}>
                        <Text style={styles.baseText}>支付方式：</Text>
                        <Text style={styles.subText}></Text>
                    </View>
                    {/*<View style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                        <View style={[styles.flexRow, styles.sitem, { flex: 1 }]}>
                            <Text style={styles.baseText}>提货地点：</Text>
                            <Text style={styles.subText}>已取货</Text>
                        </View>
                    </View>*/}
                    <View style={[styles.flexRow, styles.sitem]}>
                        <Text style={styles.baseText}>下单时间：</Text>
                        <Text style={styles.subText}>{new Date(order ? order.pay_date * 1000 : 0).toLocaleString()}</Text>
                    </View>
                    {
                        pick_date - 0 > 0
                            ? <View style={[styles.flexRow, styles.sitem]}>
                                <Text style={styles.baseText}>取货时间：</Text>
                                <Text style={styles.subText}>{new Date(pick_date * 1000).toLocaleString()}</Text>
                            </View>
                            : null
                    }

                </View>
                {/*返还状态*/}
                <View style={[styles.itemWrapper]}>
                    <View style={[styles.flexRow, styles.sitem]}>
                        <Text style={styles.baseText}>返还状态：</Text>
                        <Text style={styles.subText}>{backstatus}</Text>
                    </View>
                    {/*<View style={[styles.flexRow, styles.sitem]}>
                        <Text style={styles.baseText}>队列编号：</Text>
                        <Text style={styles.subText}>6</Text>
                    </View>*/}
                    {
                        return_date - 0 > 0
                            ? <View style={[styles.flexRow, styles.sitem]}>
                                <Text style={styles.baseText}>返现时间：</Text>
                                <Text style={styles.subText}>{new Date(return_date * 1000).toLocaleString()}</Text>
                            </View>
                            : null
                    }

                </View>
            </View>


        )
    }

    leftPress() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        title="订单详情"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea", borderBottomWidth: 6 }}
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
        fontSize: 12,
        color: '#999'
    },
    subText: {
        fontSize: 14,
        color: '#333'
    },
    itemWrapper: {
        marginTop: 12
    },
    sitem: {
        borderBottomColor: '#eaeaea',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        height: 45,
        paddingLeft: 20,
        alignItems: 'center'
    }

})