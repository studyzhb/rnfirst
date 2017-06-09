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
    Alert,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';

import Button from 'react-native-button';

import NavBar from '../component/NavBar';
import px2dp from '../util/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';
let { width, height } = Dimensions.get('window');
let isIOS = Platform.OS === 'ios';

// 消费返利页面

export default class MyExpenseList extends Component {

    constructor(props) {
        super(props);
    }

    renderGoodsList() {
        return (
            <View>
                <View style={{}}>

                </View>
            </View>


        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title="我的消费返利"
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea",borderBottomWidth:6 }}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            this.renderGoodsList()
                        }
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
    },
    items: {
        height: 112,
        backgroundColor: '#fff',
        borderBottomColor: '#eaeaea',
        borderBottomWidth: 1,
        paddingTop: 12,
        paddingLeft: 20
    },
    flexRow: {
        flexDirection: 'row'
    },
    baseText: {
        fontSize:12,
        color:'#999'
    },
    subText:{
        fontSize:14,
        color:'#666'
    },
    itemWrapper:{
        marginTop:12
    },
    sitem:{
        borderBottomColor:'#eaeaea',
        borderBottomWidth:1,
        backgroundColor:'#fff',
        height:45,
        paddingLeft:20,
        alignItems:'center'
    }

})