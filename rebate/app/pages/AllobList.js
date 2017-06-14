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

import SingleInfo from './SingleInfo'


let { width, height } = Dimensions.get('window');

export default class AllobList extends Component {
    constructor(props) {
        super(props);
    }


    gotoLookupPage(){
        this.props.navigator.push({
            name:'singleInfo',
            component:SingleInfo
        })
    }

    _renderInfo() {
        return (
            <View>
                <View style={{ paddingLeft: 20 ,paddingVertical:12,paddingRight:40,backgroundColor:'#fff',marginTop:12}}>
                    <Text style={{ fontSize: 14, color: '#3a3a3a',lineHeight:20 }}>您2017-04-12提交的债权金申请<Text style={{ fontSize: 14, color: '#21bb58' }}>未通过</Text>,请修改资料重新申请</Text>
                    <Button
                        onPress={this.gotoLookupPage.bind(this)}
                        containerStyle={styles.lookupbtnWrapper}
                        style={styles.lookupbtn}
                    >
                        点击查看
                    </Button>
                    <View style={{ position: 'absolute', right: 15, top: 17 }}>
                        <Icon name="ios-arrow-forward-outline" color="#666" size={14} />
                    </View>
                </View>
                <View style={{ paddingLeft: 20 ,paddingVertical:12,paddingRight:20,backgroundColor:'#fff',marginTop:12}}>
                    <View style={[styles.flexRow,{justifyContent:'space-between'}]}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color:'#333',fontSize:14}}>阿达西债权</Text>
                            <Text style={styles.baseText}>（万店联盟电子商务有限公司）</Text>
                        </View>
                        <Text style={{color:"#21bb58",fontSize:14}}>进行中</Text>
                    </View>
                    
                        <View style={styles.flexRow}>
                            <Text style={styles.baseText}>消费笔数：</Text>
                            <Text style={{color:'#333',fontSize:14}}>100笔</Text>
                            <Text style={styles.baseText}>（共20人）</Text>
                        </View>
                        <View style={styles.flexRow}>
                            <Text style={styles.baseText}>债权金额：</Text>
                            <Text style={{color:"#21bb58",fontSize:14}}>￥100000.00</Text>
                        </View>
                        <View style={{marginTop:7}}>
                            <Text style={styles.baseText}>添加时间：2017-03-24</Text>
                            <Text style={[styles.baseText,{marginTop:7}]}>结清时间：2017-03-31</Text>
                        </View>
                   
                    <View style={{ position: 'absolute', right: 15, top: 76 }}>
                        <Icon name="ios-arrow-forward-outline" color="#666" size={14} />
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
                        title='我的债权'
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            this._renderInfo()
                        }




                    </ScrollView>
                </View>
                <Button
                    containerStyle={{ padding: 10, height: 45, overflow: 'hidden', backgroundColor: '#21bb58' }}
                    style={styles.nowbuybtn}>
                    添加新的债权
                </Button>
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
    nowbuybtn: {
        fontSize: 14, color: '#fff',
    },
    flexRow:{
        flexDirection:'row',
        marginTop:7
    },
    lookupbtnWrapper: {
        width: 56,
        height: 20
    },
    lookupbtn: {
        fontSize: 14,
        color: '#999'
    },
    baseText: {
        color: '#999',
        fontSize: 12
    }
})