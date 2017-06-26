'use strict';

import React, { Component } from 'react';
import Navigation from './app';
import { View, Platform, Navigator, BackAndroid } from 'react-native';

export default class rootApp extends Component {

	constructor(props) {
		super(props);

	}

	componentWillMount() {
		// 判断横竖屏幕
		// let initial = Orientation.getInitialOrientation();
		// if (initial === 'PORTRAIT') {
		// 	//do stuff
		// } else {
		// 	//do other stuff
		// }

		// 只允许竖屏
		// Orientation.lockToPortrait();
		//只允许横屏
		// Orientation.lockToLandscape();
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

	render() {
		return (
			<View style={{ backgroundColor: Platform.OS == 'ios' ? '#000' : '#000', flex: 1 }}>
				<Navigation />
			</View>
		)
	}
}