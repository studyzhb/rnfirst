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

// 消费返利页面

export default class MyExpenseList extends Component {

    constructor(props) {
        super(props);
    }

    renderGoodsList() {
        return (
            <View style={styles.items}>
                <View style={[styles.flexRow,{marginBottom:10}]}>
                    <Icon name="ios-clock-outline" size={15} color='#999' style={{marginLeft:-7}}/>
                    <Text style={[styles.baseText,{marginLeft:5}]}>昨天</Text>
                </View>
                <View style={styles.sitem}>
                    <View style={{width:330,height:78,backgroundColor:'#fff',justifyContent:'space-between',borderRadius:4,paddingLeft:15,paddingTop:12,paddingBottom:12}}>
                        <Text style={styles.subText}>债权金审核提交</Text>
                        <Text style={styles.baseText}>您2017-04-20提交的申请正在审核，敬请期待.</Text>
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
        paddingTop: 12,
        paddingLeft: 18,
        
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
        color:'#666'
    },
    itemWrapper:{
        marginTop:12
    },
    sitem:{
        borderLeftColor:"#e3e3e3",
        borderLeftWidth:1,
        paddingLeft:12,
    }

})