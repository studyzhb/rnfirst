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

import NavBar from '../component/NavBar';
import Item from '../component/recordItem';
import Setting from './Setting';
// import UserProfile from './UserProfile';
import Address from './Address';
import px2dp from '../util/px2dp';

import Icon from 'react-native-vector-icons/Ionicons';



let {width,height} = Dimensions.get('window');

export default class Deal extends Component{
    constructor(props){
        super(props);
        this.state={
            isRefreshing:false,
            isLogin:false
        }

        this.config=[
            {icon:"ios-pin", name:"钱包充值",time:'1月10日 19:20',money:'+500'},
            {icon:"ios-bulb-outline", name:"支付宝充值", color:"#fc7b53"},
            {icon:"ios-information-circle-outline", name:"分享佣金充值", subName:"分润奖励金", color:"#fc7b53"},
            // {icon:"md-flower", name:"服务中心"},
        ]
    }

  leftPress(){

  }
  rightPress(){

  }
  goProfile(){
    // this.props.navigator.push({
    //     component: UserProfile,
    //     args: {}
    // });
  }
  componentDidMount(){
    this._onRefresh()
  }
  _onRefresh(){
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 1500)
  }
  _renderListItem(){
    return this.config.map((item, i) => {
    //   if(i%3==0){
    //     item.first = true
    //   }
      return (<Item key={i} {...item} />)
    })
  }

    render(){
        
        return (
            <View style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <NavBar 
                    title='交易记录'
                    leftIcon='ios-arrow-back-outline'
                    leftPress={this.leftPress.bind(this)}
                    style={{backgroundColor:'#fff'}}
                    rightPress={this.rightPress.bind(this)}
                />
                
                    
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl 
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#fff"
                            colors={['#ddd','#0398ff']}
                            progressBackgroundColor='#ffffff'
                        />
                    }
                >

                    <View style={{minHeight:height-64-px2dp(46),paddingBottom:100,backgroundColor:'#fff' }}>
                        <View>
                            {this._renderListItem()}
                        </View>   
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  scrollView: {
    flex:1,
    marginBottom: px2dp(46),
    backgroundColor: "#f0f0f0"
  },
  userHead: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom:12,
  },
  numbers: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 74
  },
  numItem: {
    flex: 1,
    height: 74,
    justifyContent: "center",
    alignItems: "center"
  }
})


