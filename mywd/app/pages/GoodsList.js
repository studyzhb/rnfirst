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
export default class GoodsList extends Component{

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
                <Image source={require('../images/goods.png')} style={{width:100,height:100}} />
                <View style={{marginLeft:20,justifyContent:'space-between'}}>
                    <Text style={{fontSize:14,width:158,lineHeight:20,color:'#666'}}>冰箱一台空调一台冰箱一台空调一台冰箱一台空调一台</Text>
                    <View style={[{flexDirection:'row',marginTop:-10,height:18}]}>
                        <Icon name='logo-yen' size={12} />
                        <Text style={{ color: "#999", fontSize: 12, textAlign: "center",marginLeft:9, fontWeight: "bold" }}>3000</Text>
                    </View>
                    
                </View>
                <Image source={require('../images/slected.png')} style={{position:'absolute',right:0}} />
            </View> 
        )
    }

    render(){
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
                            containerStyle={[styles.backBuyWrapper,styles.backActive]}
                            style={styles.backBuy}
                        >
                            可回购
                        </Button>
                        <Button
                            containerStyle={[styles.backBuyWrapper]}
                            style={styles.backBuy}
                        >
                            不可回购
                        </Button>
                    </View>
                    {
                        this.renderGoodsList()
                    }
                </View>
                <View style={styles.footerCon}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontSize:14,color:'#626262'}}>总计：</Text>
                        <Text style={{fontSize:14,color:'#ff0000'}}>￥4000</Text>
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

const styles=StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    tabTitle:{
        flexDirection:'row',
        backgroundColor:'#fff',
        paddingHorizontal:px2dp(32),
        justifyContent:'space-between'
    },
    backBuy:{
        // flex:1,
        // textAlign:'center',
        fontSize:12,
        color:'#666'
    },
    backBuyWrapper:{
        padding:12,
        width:100,
        backgroundColor:'#fff'
    },
    backActive:{
        borderBottomColor:'#2ac945',
        borderBottomWidth:3
    },
    items:{
        height:130,
        flexDirection:'row',
        backgroundColor:'#fff',
        padding:15,
        marginTop:12
    },
    footerCon:{
        height:46,
        paddingLeft:17,
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    paybtn:{
       
        fontSize:14,
        color:'#fff'
    },
    paybtncontainer:{
         backgroundColor:'#21bb58',
         padding:10,
         width:80,
         height:45
    }
})