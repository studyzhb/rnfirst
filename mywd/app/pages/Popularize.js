'use strict';
import React, { Component } from 'react';
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
import Button from 'react-native-button';
import px2dp from '../util/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';

let { width, height } = Dimensions.get('window');

export default class Popularize extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title='我的推广'
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />

                    <ScrollView
                        style={styles.scrollView}

                    >
                        <View style={{ paddingLeft: 20,flexDirection:'row', paddingVertical: 14, paddingRight: 20, backgroundColor: '#fff', borderBottomColor:'#eaeaea',borderBottomWidth:1}}>

                            <Image source={require('../images/avatar.jpg')} style={{width: px2dp(60), height: px2dp(60),flex:1, borderRadius: px2dp(30)}}/>

                            <View style={{justifyContent:'flex-start',flex:2}}>
                                <Text style={styles.baseText}>152*******2152</Text>
                            </View>
                            <View style={{justifyContent:'flex-end',flex:3}}>
                                <Text style={[styles.baseText,{texAlign:'right'}]}>2014-04-10</Text>
                            </View>

                        </View>
                        <View style={{ paddingLeft: 20,flexDirection:'row', paddingVertical: 14, paddingRight: 20, backgroundColor: '#fff', borderBottomColor:'#eaeaea',borderBottomWidth:1}}>

                            <Image source={require('../images/avatar.jpg')} style={{width: px2dp(60), height: px2dp(60),flex:1, borderRadius: px2dp(30)}}/>

                            <View style={{justifyContent:'flex-start',flex:2}}>
                                <Text style={styles.baseText}>152*******2152</Text>
                            </View>
                            <View style={{justifyContent:'flex-end',flex:3}}>
                                <Text style={[styles.baseText,{texAlign:'right'}]}>2014-04-10</Text>
                            </View>
                        </View>
                    </ScrollView>


                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        // position:'relative'
    },
    flexRow: {
        flexDirection: 'row',
        marginBottom: 9
    },
    scrollView: {
        flex: 1,
        paddingTop:12,
        marginBottom: px2dp(46),
        backgroundColor: "#f0f0f0"
    },
    baseText: {
        color: '#999',
        marginLeft:20,
        fontSize: 12
    }
})