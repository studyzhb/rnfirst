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
export default class OrderDetail extends Component {

    constructor(props) {
        super(props);
    }

    confirmPay() {
        let info = '您的订单不足1400元，将无法生成队列订单，您可以继续购物凑够金额。';
        isIOS
            ? AlertIOS.alert(
                '提示',
                info,
                [
                    { text: '去凑单', onPress: () => console.log('Ask me later pressed') },
                    { text: '去支付', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
                ],
                { cancelable: false }
            )
            : Alert.alert(
                '提示',
                info,
                [
                    { text: '去凑单', onPress: () => console.log('Ask me later pressed') },
                    { text: '去支付', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
                ],
                { cancelable: false }
            )
    }

    componentDidMount(){
        
    }

    renderGoodsList() {
        let { queuelist } = this.props;
       
        let items = queuelist ?queuelist.length>0? queuelist.map((item, key) => {
            return (
                <View style={styles.items} key={key}>
                    <View style={{ flex: 1 }}>
                        <View style={[{ flexDirection: 'row', height: 18, marginBottom: 12, justifyContent: 'space-between' }]}>
                            <Text style={{ fontSize: 12, color: '#3a3a3a' }}>订单号：{item.queque_sn}</Text>
                            <View style={[{ flexDirection: 'row', height: 18}]}>
                                <Text style={{ fontSize: 12, color: '#3a3a3a' }}>拆分金额：</Text>
                                <Text style={{ color: "#21bb58", fontSize: 12 }}>￥{item.money}</Text>
                            </View>
                        </View>
                        <View style={[{ flexDirection: 'row', height: 18 }]}>
                            <Text style={{ fontSize: 12, color: '#3a3a3a' }}>拆分时间：{item.created_at}</Text>
                            <Text style={{ fontSize: 12, textAlign: "left", color: '#3a3a3a' }}></Text>
                        </View>
                    </View>
                </View>
            )
        }) : null:null;


        return items;

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
                        leftIcon='ios-arrow-back-outline'
                        leftPress={this.leftPress.bind(this)}
                        title="订单详情"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    {
                        this.renderGoodsList()
                    }
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
        height: 76,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomColor: '#eaeaea',
        borderBottomWidth: 1,
        paddingTop: 12,
        paddingLeft: 32,
        marginTop: 12
    },
})