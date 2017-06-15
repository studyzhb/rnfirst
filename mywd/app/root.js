'use strict';

import React, { Component } from 'react';
import Navigation from './app';
import { View, Platform, BackAndroid } from 'react-native';

export default class rootApp extends Component {
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
	// onBackAndroid = () => {
	// 	const nav = this.navigator;
	// 	const routers = nav.getCurrentRoutes();
	// 	if (routers.length > 1) {
	// 		nav.pop();
	// 		return true;
	// 	}
	// 	return false;
	// 	// BackAndroid.exitApp(0);
	// 	// return true;
	// }
	onBackAndroid = () => {
		const nav = this.navigator;
		const routers = nav.getCurrentRoutes();
		if (routers.length > 1) {
			const top = routers[routers.length - 1];
			if (top.ignoreBack || top.component.ignoreBack) {
				// 路由或组件上决定这个界面忽略back键
				return true;
			}
			const handleBack = top.handleBack || top.component.handleBack;
			if (handleBack) {
				// 路由或组件上决定这个界面自行处理back键
				return handleBack();
			}
			// 默认行为： 退出当前界面。
			nav.pop();
			return true;
		}
		return false;
	};
	render() {
		return (
			<View style={{ backgroundColor: Platform.OS == 'ios' ? '#000' : '#0398ff', flex: 1 }}>
				<Navigation />
			</View>
		)
	}
}