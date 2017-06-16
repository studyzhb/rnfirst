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
import Item from '../component/Item';
import Setting from './Setting';
// import UserProfile from './UserProfile';
import Person from './person';
import Address from './Address';
import SafeCenter from './safeCenter';
import px2dp from '../util/px2dp';

import Icon from 'react-native-vector-icons/Ionicons';



let {width,height} = Dimensions.get('window');

export default class My extends Component{
    constructor(props){
        super(props);
        this.state={
            isRefreshing:false,
            isLogin:false
        }

        this.config=[
            {icon:"ios-pin", name:"安全中心", onPress:this.goPage.bind(this, "safeCenter")},
            {icon:"ios-bulb-outline", name:"意见反馈", color:"#fc7b53"},
            {icon:"ios-information-circle-outline", name:"关于我们", subName:"分润奖励金", color:"#fc7b53"},
            // {icon:"md-flower", name:"服务中心"},
        ]
    }

    goPage(key, data = {}){
    let pages = {
      "safeCenter": SafeCenter
    }
    if(pages[key]){
      this.props.navigator.push({
          component: pages[key],
          args: { data }
      })
    }
  }
  leftPress(){

  }
  rightPress(){
    this.props.navigator.push({
        component: Setting,
        args: {}
    });
  }
  goProfile(){
    
    this.props.navigator.push({
        component: Person,
        args: {}
    });
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
      if(i%3==0){
        item.first = true
      }
      return (<Item key={i} {...item} />)
    })
  }

    render(){
        
        return (
            <View style={{flex:1,backgroundColor:'#f0f0f0'}}>
                <NavBar 
                    title='我的'
                    leftIcon='ios-arrow-back-outline'
                    leftPress={this.leftPress.bind(this)}
                    style={{backgroundColor:'#fff'}}
                    rightPress={this.rightPress.bind(this)}
                />
                
                    
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
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
                    <TouchableWithoutFeedback style={{backgroundColor:'#f0f0f0'}} onPress={this.goProfile.bind(this)}>
                        <View style={styles.userHead}>
                            <View style={{flex: 1,flexDirection: "row"}}>
                            <Image source={require('../images/avatar.jpg')} style={{width: px2dp(60), height: px2dp(60), borderRadius: px2dp(30)}}/>
                            <View style={{flex: 1, marginLeft: 10,justifyContent:'center', paddingVertical: 5}}>
                                <Text style={{color: "#3a3a3a", fontSize: px2dp(14)}}>web前端开发zhb</Text>
                                {/*<View style={{marginTop: px2dp(10), flexDirection: "row"}}>
                                <Icon name="ios-phone-portrait-outline" size={px2dp(14)} color="#fff" />
                                <Text style={{color: "#fff", fontSize: 13, paddingLeft: 5}}>18188888888</Text>
                                </View>*/}
                            </View>
                            </View>
                            <Icon name="ios-arrow-forward-outline" size={px2dp(22)} color="#666" />
                        </View>
                    </TouchableWithoutFeedback> 
                    <View style={{minHeight:height-64-px2dp(46),paddingBottom:100,backgroundColor:'#fff' }}>
                        {/*<View style={styles.numbers}>
                            <TouchableWithoutFeedback>
                                <View style={styles.numItem}>
                                    <Text style={{color: "#f90", fontSize: 18, textAlign: "center", fontWeight: "bold"}}>{"999999.0元"}</Text>
                                    <Text style={{color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5}}>{"余额"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                            <View style={[styles.numItem,{borderLeftWidth: 1, borderLeftColor: "#f5f5f5",borderRightWidth: 1, borderRightColor: "#f5f5f5"}]}>
                                <Text style={{color: "#ff5f3e", fontSize: 18, textAlign: "center", fontWeight: "bold"}}>{"1940个"}</Text>
                                <Text style={{color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5}}>{"优惠"}</Text>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                            <View style={styles.numItem}>
                                <Text style={{color: "#6ac20b", fontSize: 18, textAlign: "center", fontWeight: "bold"}}>{"999999分"}</Text>
                                <Text style={{color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5}}>{"积分"}</Text>
                            </View>
                            </TouchableWithoutFeedback>
                        </View>*/}
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


