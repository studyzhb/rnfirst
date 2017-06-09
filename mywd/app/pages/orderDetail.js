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
let {width,height} = Dimensions.get('window');
let isIOS=Platform.OS==='ios';
export default class OrderDetail extends Component{

    constructor(props){
        super(props);
    }

    confirmPay(){
        let info='您的订单不足1400元，将无法生成队列订单，您可以继续购物凑够金额。';
        isIOS
        ?AlertIOS.alert(
            '提示',
            info,
            [
                {text: '去凑单', onPress: () => console.log('Ask me later pressed')},
                {text: '去支付', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
            ],
            { cancelable: false }
        )
        :Alert.alert(
            '提示',
            info,
            [
                {text: '去凑单', onPress: () => console.log('Ask me later pressed')},
                {text: '去支付', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
            ],
            { cancelable: false }
        )
    }

    renderGoodsList(){
        return (

                <View style={styles.items}>
                    <View style={{flex:1}}>
                        <View style={[{flexDirection:'row',height:18,marginBottom:12,justifyContent:'space-between'}]}> 
                            <Text style={{fontSize:12,width:158,color:'#3a3a3a'}}>订单号：134664664662</Text>
                            <View style={[{flexDirection:'row',height:18,flex:1}]}>
                                <Text style={{fontSize:12,color:'#3a3a3a'}}>拆分金额：</Text>
                                <Text style={{ color: "#21bb58", fontSize: 12 }}>￥1400</Text>
                            </View>
                        </View>
                        <View style={[{flexDirection:'row',height:18}]}> 
                            <Text style={{fontSize:12,color:'#3a3a3a'}}>拆分时间：2017-05-23 05:03:01</Text>
                            <Text style={{fontSize:12,width:158,textAlign: "left",color:'#3a3a3a'}}></Text>
                        </View>
                    </View>
                </View> 
            
        )
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
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

const styles=StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    items:{
        height:76,
        flexDirection:'row',
        backgroundColor:'#fff',
        borderBottomColor:'#eaeaea',
        borderBottomWidth:1,
        paddingTop:12,
        paddingLeft:32,
        marginTop:12
    },
})