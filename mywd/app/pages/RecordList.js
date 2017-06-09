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
export default class RecordList extends Component {

    constructor(props) {
        super(props);
    }



    renderGoodsList() {
        return (
            <View style={{ paddingLeft: 20, paddingVertical: 12, paddingRight: 20, backgroundColor: '#fff', marginTop: 12 }}>
                <View style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#333', fontSize: 14 }}>兑换积分</Text>
                        <Text style={styles.baseText}>1400</Text>
                    </View>
                    <Text style={{ color: "#666", fontSize: 14 }}>申请中</Text>
                </View>

                <View style={styles.flexRow}>
                    <Text style={styles.baseText}>兑换比例：</Text>
                    <Text style={styles.baseText}>1：1</Text>
                   
                </View>
                <View style={styles.flexRow}>
                    <Text style={styles.baseText}>实际到账：</Text>
                    <Text style={{ color: "#21bb58", fontSize: 14 }}>￥1372.00</Text>
                </View>
                <View style={styles.flexRow}>
                    <Text style={styles.baseText}>维护费用：</Text>
                    <Text style={{ color: "#21bb58", fontSize: 14 }}>￥28（2%）</Text>
                </View>
                <View style={{ marginTop: 7 }}>
                    <Text style={styles.baseText}>兑换时间：2017-03-24</Text>
                    
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title="资金记录"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <View style={styles.tabTitle}>
                        <Button
                            containerStyle={[styles.backBuyWrapper, styles.backActive]}
                            style={styles.backBuy}
                        >
                            兑换记录
                        </Button>
                        <Button
                            containerStyle={[styles.backBuyWrapper]}
                            style={styles.backBuy}
                        >
                            回购记录
                        </Button>
                    </View>
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
    flexRow:{
        flexDirection:'row',
        marginTop:7
    },
    baseText: {
        color: '#999',
        fontSize: 12
    }

})