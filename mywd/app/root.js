'use strict';

import React,{Component} from 'react';
import Navigation from './app';
import {View,Platform,BackAndroid} from 'react-native';

export default class rootApp extends Component{
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
		BackAndroid.exitApp(0);
		return true;
	};
	render(){
		return (
				<View style={{backgroundColor:Platform.OS=='ios'?'#000':'#0398ff',flex:1}}>
					<Navigation />
				</View>
			)
	}
}