'use strict';

import React,{Component} from 'react';
import {Navigator,View,StatusBar,Platform,AsyncStorage,BackAndroid} from 'react-native';
import Wrapper from './component/Wrapper';

// import Storage from './util/storage';
/** 
const storage=new Storage({
	// 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,
    
  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: 1000 * 3600 * 24,
    
  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,
    
  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync方法，无缝返回最新数据。
  // sync方法的具体说明会在后文提到
  // 你可以在构造函数这里就写好sync的方法
  // 或是写到另一个文件里，这里require引入
  // 或是在任何时候，直接对storage.sync进行赋值修改
  //sync: require('./sync')  // 这个sync文件是要你自己写的
})*/

// 对于web
// window.storage = storage;
  
// 对于react native
// global.storage = storage;


export default class Navigation extends Component{
	constructor(props){
		super(props)
	}

	componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  onBackAndroid = () => {
    const nav = this.navigator;
    const routers = nav.getCurrentRoutes();
    if (routers.length > 1) {
      nav.pop();
      return true;
    }
    return false;
  };

	render(){
		return Platform.OS=='ios'?(
				<Navigator
					initialRoute={{name:'list',component:Wrapper}}
					configureScene={
						()=>Navigator.SceneConfigs.FloatFromRight
					}
					renderScene={
						(route,navigator)=>{
							return <route.component navigator={navigator} {...route.params} />
						}
					}/>
			):(
				<View style={{flex:1}}>
					<StatusBar
						backgroundColor="#0398ff"
						barStyle="light-content"
					/>
					<Navigator
						initialRoute={{component:Wrapper}}
						configureScene={
							()=>Navigator.SceneConfigs.FloatFromRight
						}
						renderScene={
							(route,navigator)=>{
								return <route.component navigator={navigator} {...route.params} />
							}
						}
					/>
				</View>
			)
	}
}