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

export default class AllobList extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <NavBar
                        title='债权资料'
                        titleStyle={{ color: '#666', fontSize: 18 }}
                        style={{ backgroundColor: '#fff', borderBottomColor: "#eaeaea" }}
                    />
                    <View style={{ paddingLeft: 20, paddingVertical: 12, paddingRight: 20, backgroundColor: '#fff', marginTop: 12 }}>


                        <View style={styles.flexRow}>
                            <Text style={styles.baseText}>债权人姓名：</Text>
                            <Text style={{ color: '#333', fontSize: 14 }}>张三</Text>
                            
                        </View>
                        <View style={styles.flexRow}>
                            <Text style={styles.baseText}>联系方式：</Text>
                            <Text style={{ color: "#333", fontSize: 14 }}>1324551561</Text>
                        </View>

                    </View>
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
    flexRow:{
        flexDirection:'row',
        marginBottom:9
    },
    baseText: {
        color: '#999',
        fontSize: 12
    }
})