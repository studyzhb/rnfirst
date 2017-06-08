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
import Icon from 'react-native-vector-icons/Ionicons';

import NavBar from '../component/NavBar';
import px2dp from '../util/px2dp';
import OrderDetail from './orderDetail';


let {width,height} = Dimensions.get('window');
let isIOS=Platform.OS==='ios';

export default class OrderList extends Component{

    constructor(props){
        super(props);
    }

    gotoDetail(){
        this.props.navigator.push({
            name:'orderdetail',
            component:OrderDetail
        })
    }

    renderGoodsList(){
        return (
            <View>
                <View style={styles.items}>
                    <Image source={require('../images/goods.png')} style={{width:50,height:50}} />
                    <View style={{marginLeft:20,justifyContent:'space-between',flex:1}}>
                        <View style={[{flexDirection:'row',height:18,justifyContent:'space-between'}]}> 
                            <Text style={{fontSize:12,width:158,color:'#3a3a3a'}}>订单号：134664664662</Text>
                            <Text style={{fontSize:12,width:158,marginLeft:9, textAlign: "center",color:'#3a3a3a'}}>交易完成</Text>
                        </View>
                        <View style={[{flexDirection:'row',height:26,marginTop:17,justifyContent:'space-between'}]}> 
                            <Text style={{fontSize:12,width:158,color:'#3a3a3a'}}>2017-5-25 05:03:01</Text>
                            <View style={[{flexDirection:'row',height:18,alignItems:'center'}]}>
                                <Icon name='logo-yen' size={12} />
                                <Text style={{ color: "#999", fontSize: 12, textAlign: "center",marginLeft:9, fontWeight: "bold" }}>3000</Text>
                            </View>
                        </View>
                    </View>
                </View> 
                <View style={[{flexDirection:'row',height:40,justifyContent:'space-between',paddingHorizontal:20,alignItems:'center',backgroundColor:'#fff'}]}>
                    <Text style={{fontSize:12,color:'#999'}}>该订单拆分队列订单（个）：2</Text>
                    <Button
                        onPress={this.gotoDetail.bind(this)}
                        containerStyle={{backgroundColor:'white',width:56,height:20,overflow:'hidden'}}
                        style={{color:'#f6a623',fontSize:14}}
                    >
                        点击查看
                    </Button>
                </View>
            </View>
            
        )
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title="我的订单"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <View style={styles.tabTitle}>
                        <Button
                            containerStyle={[styles.backBuyWrapper,styles.backActive]}
                            style={styles.backBuy}
                        >
                            已付款
                        </Button>
                        <Button
                            containerStyle={[styles.backBuyWrapper]}
                            style={styles.backBuy}
                        >
                            已处理
                        </Button>
                        <Button
                            containerStyle={[styles.backBuyWrapper]}
                            style={styles.backBuy}
                        >
                            已完成
                        </Button>
                    </View>
                    <View style={{height:30,flexDirection:'row',alignItems:'center',paddingLeft:12}}>
                        <Icon name='ios-information-circle-outline' size={16} color='#0058be' />
                        <Text style={{fontSize:12,color:'#0058be',marginLeft:6}}>此处仅展示不可回购订单，查看返利订单消费记录请返回上一页</Text>
                    </View>
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
    tabTitle:{
        flexDirection:'row',
        backgroundColor:'#fff',
        paddingHorizontal:px2dp(32),
        justifyContent:'center'
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
        height:76,
        flexDirection:'row',
        backgroundColor:'#fff',
        borderBottomColor:'#eaeaea',
        borderBottomWidth:1,
        padding:15,
        // marginBottom:12
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
         width:70,
         height:45
    }
})