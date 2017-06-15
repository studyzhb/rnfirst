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

import NavBar from '../component/NavBar';
import Item from '../component/Item';
import Setting from './Setting';
// import UserProfile from './UserProfile';
import Deal from './Deal';
import BankList from './Banklist';
import px2dp from '../util/px2dp';

import Icon from 'react-native-vector-icons/Ionicons';

import Login from './validateLogin';
import request from '../util/request';
import config from '../util/config';

let {width,height} = Dimensions.get('window');
let isIOS=Platform.OS==='ios';


export default class Order extends Component{
    constructor(props){
        super(props);
        this.state={
            isRefreshing:false,
            isLogin:false,
            userData:{},
            ispay:'',
            isrealname:''
        }
        // onPress:this.goPage.bind(this, "address")
        this.config=[
           
            {icon:"ios-albums-outline", name:"交易记录",subName:"",onPress:this.goPage.bind(this,'record')},
            {icon:"ios-card-outline", name:"银行卡管理", subName:"",onPress:this.goPage.bind(this,'banklist')},
        ]
    }
    static topbarHeight=(Platform.OS==='ios'?64:42)

    goPage(key, data = {}){
    let pages = {
      "record": Deal,
      'banklist':BankList
    }
    if(pages[key]){
      this.props.navigator.push({
          component: pages[key],
          args: { data },
          params:{
              is_pay:this.state.ispay,
              isrealname:this.state.isrealname
          }
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
    // this.props.navigator.push({
    //     component: UserProfile,
    //     args: {}
    // });
  }
  componentDidMount(){
      console.log('componentDidMount')
        this._onRefresh()
  }

  shouldComponentUpdate(){
      console.log('shouldComponentUpdate')
      return true;
  }
  componentWillUpdate(){
      console.log('componentWillUpdate')
      
  }
  componentDidUpdate(){
      console.log('componentDidUpdate')
      
  }

  _onRefresh(){
    this.setState({isRefreshing: true});
    let getIndexUrl = config.baseUrl + config.api.user.showBalance;
    request.get(getIndexUrl)
        .then((data)=>{
            console.log(data)
            if(data.code==1){
                this.setState({
                    userData:data.data.user_data,
                    ispay:data.data.is_pay,
                    isrealname:data.data.is_real_name
                })
            }else{
                isIOS
                ?AlertIOS.alert(data.message)
                :Alert.alert(data.message)
            }
        })
        .catch(err=>{
            console.log(err);
            console.log(JSON.stringify(err));
        })
    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 1500)
  }
  _renderListItem(){
    return this.config.map((item, i) => {
      if(i%3==0){
        item.first = true
      }
      return (<Item key={i} {...item}/>)
    })
  }

  renderBtn(pos){
      let render=(obj)=>{
            const {name,onPress}=obj;
            if(Platform.OS==='android'){
                return (
                    <TouchableNativeFeedback onPress={onPress} style={styles.btn}>
                        <Icon name={'ios-arrow-back-outline'} size={px2dp(26)} color="#fff" />
                    </TouchableNativeFeedback>
                )
            }else{
                return (
                    <TouchableOpacity onPress={onPress} style={styles.btn}>
                    <Icon name={name} size={px2dp(26)} color="#fff" />
                    </TouchableOpacity>
                )
            }
        }
        if(pos == "left"){
            if(this.props.leftIcon){
            return render({
                name: 'ios-arrow-back-outline',
                onPress: this.props.leftPress
            })
            }else{
            return (<View style={styles.btn}></View>)
            }
        }else if(pos == "right"){
            if(this.props.rightIcon){
            return render({
                name: this.props.rightIcon,
                onPress: this.props.rightPress
            })
            }else{
            return (<View style={styles.btn}>
                    <Text onPress={this.props.rightPress}>{this.props.rightText}</Text>
            </View>)
            }
        }
  }

    render(){
        if(this.state.isLogin){
            return (
                <Login navigator={this.props.navigator} />
            )
        }
        return (
            <View style={{flex:1,backgroundColor:'#f0f0f0'}}>
                {/*<NavBar 
                    title=''
                    style={{backgroundColor:'#79e089',borderBottomColor:"#79e089"}}
                    leftIcon='ios-arrow-back-outline'
                    leftPress={this.leftPress.bind(this)}
                    rightPress={this.rightPress.bind(this)}
                />*/}
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
                    <Image source={require('../images/moneybg.png')} style={{width:width,height:px2dp(150)+this.topbarHeight}}>
                        <View style={styles.topbar}>
                            {
                                Platform.OS==='android'
                                ?<TouchableNativeFeedback  style={styles.btn}>
                                    <Icon name={'ios-arrow-back-outline'} size={px2dp(26)} color="#fff" />
                                </TouchableNativeFeedback>
                                :<TouchableOpacity  style={styles.btn}>
                                    <Icon name={'ios-arrow-back-outline'} size={px2dp(26)} color="#fff" />
                                </TouchableOpacity>
                            }
                            
                        </View>
                         <View style={{height:px2dp(150) }}>
                            <View style={{flex: 1,flexDirection: "row",justifyContent:'space-between'}}>
                                <View style={{marginLeft: px2dp(35), paddingVertical: 0}}>
                                    <Text style={{color: "#fff", fontSize:14}}>当前总资产（元）</Text>
                                    <View style={{marginTop: px2dp(-10), flexDirection: "row"}}>
                                    {/*<Icon name="ios-phone-portrait-outline" size={px2dp(14)} color="#fff" />*/}
                                    <Text style={{color: "#fff", fontSize: 48, paddingLeft: 5}}>{this.state.userData?(this.state.userData.balance-0+this.state.userData.creditor-0+this.state.userData.share_gold-0):0}</Text>
                                    </View>
                                </View>
                                <View style={{marginRight: px2dp(20), paddingVertical: 0}}>
                                    <Text style={{color: "#fff", fontSize: px2dp(12)}}>我的钱包（元）</Text>
                                    <View style={{marginTop: px2dp(10), flexDirection: "row"}}>

                                    <Text style={{color: "#fff", fontSize: 18, paddingLeft: 5}}>{this.state.userData?this.state.userData.balance:0}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex: 1,flexDirection: "row",justifyContent:'space-between',marginLeft:px2dp(28)}}>
                                <View style={{flexDirection: "row",marginTop:30}}>
                                    <View style={{marginLeft: 0, paddingVertical: 5}}>
                                        <View style={{marginTop: px2dp(10), flexDirection: "row"}}>
                                            <Icon name="ios-ribbon-outline" size={px2dp(14)} color="#fff" />
                                            <Text style={{color: "#fff", fontSize: 12, paddingLeft: 5}}>提现</Text>
                                        </View>
                                    </View>
                                    <View style={{marginLeft: 38, paddingVertical: 5}}>
                                        
                                        <View style={{marginTop: px2dp(10), flexDirection: "row"}}>
                                            <Icon name="ios-ribbon-outline" size={px2dp(14)} color="#fff" />
                                            <Text style={{color: "#fff", fontSize: 12, paddingLeft: 5}}>充值</Text>
                                        </View>
                                    </View>
                                </View>
                                
                                <View style={{marginRight: px2dp(5), paddingVertical: 5}}>
                                    <Text style={{color: "#fff", fontSize: px2dp(12)}}>我的债权金（元）</Text>
                                    <View style={{marginTop: px2dp(10), flexDirection: "row"}}>

                                        <Text style={{color: "#fff", fontSize: 18, paddingLeft: 5}}>{this.state.userData?this.state.userData.creditor:0}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Image>
                   
                    <View>
                        {this._renderListItem()}
                    </View> 
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: px2dp(46),
    backgroundColor: "#f0f0f0"
  },
  userHead: {
    justifyContent: "space-between",
    alignItems: "center",
    flex:1,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#79e089"
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
  },
  topbar: {
        height: NavBar.topbarHeight,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        paddingHorizontal: px2dp(10)
    },
    btn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center'
    },
})


