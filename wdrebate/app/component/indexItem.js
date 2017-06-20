'use strict';
import React,{Component} from 'react';
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

import px2dp from '../util/px2dp';

let {width,height} = Dimensions.get('window');

export default class IndexItem extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let row=this.props.row;
        console.log(row);
        return (
            <TouchableHighlight style={styles.container} onPress={this.props.onPress}>
                <View  >
                    <View style={[styles.item,styles.itemtop]}>
                        <Text style={{color:'#21bb58',fontSize:16}}>{row.title}</Text>
                        <Text style={{color:'#3a3a3a',fontSize:14}}>当前已购买数：{row.num}</Text>
                    </View>
                    <View style={[styles.item,styles.itembottom]}>
                        <Text style={{color:'#3a3a3a',fontSize:14,marginTop:-10}}>购买后应返积分：{row.back_point}</Text>
                        <Text style={{color:'#999',fontSize:12,marginTop:-11}}>{row.num-0>0?'已参加':'未参加'}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:px2dp(76),
        marginTop:px2dp(12),
        paddingLeft:px2dp(20),
        paddingTop:px2dp(10),
        paddingRight:px2dp(14),
        backgroundColor:'#fff'
    },
    item:{
        
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        
    },
    itembottom:{
        height:px2dp(44),
        alignItems:'center'
    },
    itemtop:{
        height:px2dp(22)
    }
})