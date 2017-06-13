'use strict';

import React, { Component } from 'react'
import {
  View,
  Text,
  Modal,
  AlertIOS,
  Dimensions,
  StyleSheet,
  ScrollView,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
// import TabNavigator from 'react-native-tab-navigator'
import px2dp from '../util/px2dp'
import NavBar from './NavBar'
import Button from 'react-native-button'
let { width, height } = Dimensions.get('window')
const isAndroid = Platform.OS == "android"

export default class LbsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      transparent:true,
      address: [
        {
          name: "Lei",
          phone: "13581970418",
          tag: "公司",
          color: "#0096ff",
          address: "微软亚太研发集团"
        },
        {
          name: "Lei",
          phone: "13581970418",
          tag: "家",
          color: "#ff6000",
          address: "北京朝阳区三里屯SOHO"
        }
      ],
      near: ["颐和雅苑烤鸭坊", "中国电子大厦", "立方-庭"]
    }
  }
  closeModal() {
    this.props.closeModal()
  }
  getLocation() {
    if (this.state.loading) {
      return
    }
    this.setState({
      loading: true
    })
    setTimeout(() => {
      this.setState({
        loading: false
      })
      this.props.setLocation("中关村")
    }, 1200)
    /*
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        console.log("title",initialPosition)
        this.setState({initialPosition});
      },
      (error) => AlertIOS.alert("title",JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )*/
  }

  focusNextField=(nextField)=>{
    console.log(nextField+'131313141');
    this.refs[nextField].focus();
  }

  render() {
    let modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
    };
    let innerContainerTransparentStyle = this.state.transparent
      ? { backgroundColor: '#fff', padding: 20 }
      : null;
    return (
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Modal
          
          animationType={'slide'}
          onRequestClose={() => { }}
          transparent={true}
          visible={this.props.modalVisible}
        >
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <NavBar
                title="请输入支付密码"
                leftIcon="ios-close"
                titleStyle={{ color: '#666', fontSize: 18 }}
                style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea",alignSelf:'stretch' }}
                leftPress={this.closeModal.bind(this)}
              />
              {/*<View style={styles.searchView}>
          <TextInput ref="search" style={styles.textInput} underlineColorAndroid="transparent" placeholder="请输入地址" placeholderTextColor="#666"/>
        </View>*/}
              <View style={{flex:1,justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{color:'#353535',fontSize:18,marginTop:20}}>提现</Text>
                <Text style={{color:'#c72d1b',fontSize:36}}>￥100</Text>
              </View>
              <View style={{ width: 288,overflow:'hidden', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', borderColor: '#666', borderWidth: 1,}}>
                <TextInput
                  placeholder=""
                  //是否自动将特定字符切换为大写
                  autoCapitalize={'none'}
                  //关闭拼写自动修正
                  autoCorrect={false}
                  //去除android下的底部边框问题
                  underlineColorAndroid="transparent"
                  keyboardType='numeric' //弹出软键盘类型
                  style={styles.numInput} ref="1"
                  onChangeText={
                    (text)=>{
                      this.setState({
                        
                      })
                      console.log(text+'111');
                      console.log()
                      this.focusNextField('2')
                    }
                  }
                  maxLength = {1}
                  autoFocus={true}
                />
                <TextInput
                  placeholder=""
                  //是否自动将特定字符切换为大写
                  autoCapitalize={'none'}
                  //关闭拼写自动修正
                  autoCorrect={false}
                  //去除android下的底部边框问题
                  underlineColorAndroid="transparent"
                  keyboardType='numeric' //弹出软键盘类型
                  style={styles.numInput} ref="2"
                  onChangeText={
                    (text)=>{
                      this.setState({
                        
                      })
                      this.focusNextField('3')
                    }
                  }
                  maxLength = {1}
                />
                <TextInput
                  placeholder=""
                  //是否自动将特定字符切换为大写
                  autoCapitalize={'none'}
                  //关闭拼写自动修正
                  autoCorrect={false}
                  //去除android下的底部边框问题
                  underlineColorAndroid="transparent"
                  keyboardType='numeric' //弹出软键盘类型
                  style={styles.numInput} ref="3"
                  onChangeText={
                    (text)=>{
                      this.setState({
                        
                      })
                      this.focusNextField('4')
                    }
                  }
                  maxLength = {1}
                />
                <TextInput
                  placeholder=""
                  //是否自动将特定字符切换为大写
                  autoCapitalize={'none'}
                  //关闭拼写自动修正
                  autoCorrect={false}
                  //去除android下的底部边框问题
                  underlineColorAndroid="transparent"
                  keyboardType='numeric' //弹出软键盘类型
                  style={styles.numInput} ref="4"
                  onChangeText={
                    (text)=>{
                      this.setState({
                        
                      })
                      this.focusNextField('5')
                    }
                  }
                  maxLength = {1}
                />
                <TextInput
                  placeholder=""
                  //是否自动将特定字符切换为大写
                  autoCapitalize={'none'}
                  //关闭拼写自动修正
                  autoCorrect={false}
                  //去除android下的底部边框问题
                  underlineColorAndroid="transparent"
                  keyboardType='numeric' //弹出软键盘类型
                  style={styles.numInput} ref="5"
                  onChangeText={
                    (text)=>{
                      this.setState({
                        
                      })
                      this.focusNextField('6')
                    }
                  }
                  maxLength = {1}
                />
                <TextInput
                  placeholder=""
                  //是否自动将特定字符切换为大写
                  autoCapitalize={'none'}
                  //关闭拼写自动修正
                  autoCorrect={false}
                  //去除android下的底部边框问题
                  underlineColorAndroid="transparent"
                  keyboardType='numeric' //弹出软键盘类型
                  style={styles.numInput} ref="6"
                  onChangeText={
                    (text)=>{
                      this.setState({
                        
                      })
                    }
                  }
                  maxLength = {1}
                />

              </View>
            </View>
          </View>


        </Modal>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    width: 314,
    height: 218,
    alignSelf: 'center',
    backgroundColor: "#fff"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  innerContainer: {
    borderRadius: 10,
    width:314,
    height:218,
    justifyContent:'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 10,
    color: "#666"
  },
  scrollView: {
    backgroundColor: "#f3f3f3"
  },
  tag: {
    color: "#fff",
    fontSize: px2dp(12),
    minWidth: px2dp(30),
    textAlign: "center",
    paddingVertical: 1,
    paddingHorizontal: 2,
    borderRadius: 5,
    marginRight: 5
  },
  ads1List: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5
  },
  searchView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#0398ff"
  },
  textInput: {
    fontSize: 13,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 0,
    height: px2dp(28),
    borderRadius: px2dp(6),
    backgroundColor: "#fff"
  },
  numInput: {
    width: 48,
    height: 48,
    padding: 0,
    borderRightColor: '#666',
    borderRightWidth: 1,

  },
  address: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    height: px2dp(45),
    backgroundColor: "#fff"
  },
  address1: {
    borderBottomWidth: 1,
    borderBottomColor: "#fbfbfb",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    paddingVertical: 8
  }
})
